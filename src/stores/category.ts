import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';


export interface Category {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    color: string;
}

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<Category[]>([])
    const selectedCategories = ref<Category[]>([])
    // Journey ID -> categories map to avoid repeated fetches per card
    const journeyCategoriesMap = ref<Record<string, Category[]>>({})


    async function fetchUserCategories(userId: string) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('user_id', userId)

        if (error) throw error
        categories.value = data
    }

    // Bulk fetch categories for multiple journeys to avoid per-card requests
    async function fetchCategoriesByJourneyIds(journeyIds: string[]): Promise<Record<string, Category[]>> {


        try {

            if (!journeyIds.length) return {}

            // 1) journey_categories tablosundan id'leri çek
            const { data: jcData, error: jcError } = await supabase
                .from('journey_categories')
                .select('journey_id, category_id')
                .in('journey_id', journeyIds)

            if (jcError) throw jcError;

            const categoryIds = Array.from(new Set(jcData.map((row) => row.category_id)))
            if (!categoryIds.length) return {}

            // 2) categories tablosundan detayları topla
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('*')
                .in('id', categoryIds)

            if (catError) throw catError;

            const catMap = new Map(catData.map((c) => [c.id, c] as [string, Category]))
            const map: Record<string, Category[]> = {}

            jcData.forEach((row) => {
                const cat = catMap.get(row.category_id)
                if (!cat) return
                if (!map[row.journey_id]) map[row.journey_id] = []
                map[row.journey_id].push(cat)
            })

            journeyCategoriesMap.value = {
                ...journeyCategoriesMap.value,
                ...map
            }

            return journeyCategoriesMap.value
        
        } catch (error) {
            console.error('[CategoryStore] Unexpected error in fetchCategoriesByJourneyIds:', error)    
            throw error
        }
    }

    async function upsertCategory(userId: string, categoryName: string, categoryId?: string, categoryColor?: string) {
        
        const payload = {
            id: categoryId,
            user_id: userId,
            title: categoryName,
            color: categoryColor || null
        }

        const { data, error } = await supabase
            .from('categories')
            .upsert(payload, { onConflict: 'id' })

        if (error) {
            console.error('[CategoryStore] Failed to upsert category:', error.message)
            throw error
        }

        await fetchUserCategories(userId)
    }
      

    const deleteCategory = async (categoryId: string, userId: string) => {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', categoryId)
            .eq('user_id', userId)

        if (error) {
            console.error('[CategoryStore] Delete error:', error.message)
            throw error
        }

        await fetchUserCategories(userId)
    }

    async function addCatToTheJourney(catId: string, journeyId: string) {
        const { error } = await supabase.from('journey_categories').insert({
            category_id: catId,
            journey_id: journeyId,
            created_at: new Date()
        })

        if (error) {
            console.error('[CategoryStore] Add to journey error:', error.message)
            throw error
        }

        // Patch cache
        const cat = categories.value.find((c) => c.id === catId)
        if (cat) {
            const existing = journeyCategoriesMap.value[journeyId] ?? []
            journeyCategoriesMap.value[journeyId] = [...existing, cat]
        }
    }

    async function deleteCatFromJourney(catId: string, journeyId: string) {
        const { error } = await supabase
            .from('journey_categories')
            .delete()
            .match({ category_id: catId, journey_id: journeyId })

        if (error) {
            console.error('[CategoryStore] Delete from journey error:', error.message)
            throw error
        }

        // Patch cache
        if (journeyCategoriesMap.value[journeyId]) {
            journeyCategoriesMap.value[journeyId] = journeyCategoriesMap.value[journeyId].filter((c) => c.id !== catId)
        }
    }

    async function fetchCategoriesForJourney(journeyId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('journey_categories')
            .select('category_id')
            .eq('journey_id', journeyId)

        if (error) {
            console.error('[CategoryStore] Failed to fetch journey categories:', error.message)
            throw error
        }

        return data.map((item) => item.category_id)
    }
      

    async function fetchFullCategoriesForJourney(journeyId: string): Promise<Category[]> {
        // Önce map'te varsa onu dön
        if (journeyCategoriesMap.value[journeyId]) {
            return journeyCategoriesMap.value[journeyId]
        }

        // 1. önce ilişkili category_id'leri al
        const ids = await fetchCategoriesForJourney(journeyId)

        if (!ids.length) return []

        // 2. sonra categories tablosundan tam bilgileri al
        const { data, error } = await supabase
            .from('categories')
            .select('*') // veya 'id, title, color, user_id, created_at'
            .in('id', ids)

        if (error) {
            console.error('[CategoryStore] Failed to fetch full category data:', error.message)
            throw error
        }

        journeyCategoriesMap.value[journeyId] = data as Category[]
        return journeyCategoriesMap.value[journeyId]
    }

    const getCategoriesForJourney = (journeyId: string): Category[] => {
        return journeyCategoriesMap.value[journeyId] ?? []
    }

    function setSelectedCategories(categories: Category[]) {
        selectedCategories.value = categories
    }

    const refetchTrigger = ref(0)

    function triggerCategoryRefetch() {
        refetchTrigger.value++
    }

    
    return { categories, journeyCategoriesMap, refetchTrigger, triggerCategoryRefetch, selectedCategories, setSelectedCategories, fetchFullCategoriesForJourney, fetchUserCategories, fetchCategoriesByJourneyIds, getCategoriesForJourney, upsertCategory, deleteCategory, addCatToTheJourney, deleteCatFromJourney, fetchCategoriesForJourney }
})
  
