import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';


export interface Journey {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    updated_at: string;
    description: string
    isFavorite?: boolean;
    icon?: string;
}

export interface Step {
    id: number;
    user_id: string;
    journey_id: string;
    title: string;
    cards?: string;
    meaning?: string;
    note?: string;
    created_at: string;
    updated_at: string;
}

export const useJourneyStore = defineStore('journeys', () => {

    const journeys = ref<Journey[]>([]);
    const steps = ref<Step[] | null>(null);
    const currentJourney = ref<Journey | null>(null)

    const fetchJourneys = async (userId: string) => {

        try {
              const { data: journeysData, error: journeyError } = await supabase
            .from('journeys')
            .select(`
                *,
                favorites:favorites!left(journey_id, user_id)
            `)
            .eq('user_id', userId)
            .eq('favorites.user_id', userId)
            .order('created_at', { ascending: false });

        if (journeyError) throw journeyError

        journeys.value = (journeysData ?? []).map((j: any) => ({
            ...j,
            isFavorite: Array.isArray(j.favorites) && j.favorites.length > 0,
        }));

    } catch (error) {
            console.error('[JourneyStore] Failed to fetch journeys:', error);
            throw error
        }   
      
    };

    const deleteJourney = async (journeyId: string) => {
        try {
            const { error } = await supabase
                .from('journeys')
                .delete()
                .eq('id', journeyId);

            if (error) throw error;

            journeys.value = journeys.value.filter(journey => journey.id !== journeyId);

        } catch (error) {
            console.error('[JourneyStore] Failed to delete journey:', error);
            throw error;
        }
    };

    const toggleFavorite = async (journeyId: string, userId: string, shouldBeFavorite: boolean) => {
        const prevJourneys = [...journeys.value]
        // Optimistic update for instant UI feedback
        journeys.value = journeys.value.map((j) =>
            j.id === journeyId ? { ...j, isFavorite: shouldBeFavorite } : j
        )

        let errorMsg: string | null = null

        try {
            if (shouldBeFavorite) {
                const { error } = await supabase
                    .from('favorites')
                    .insert({ journey_id: journeyId, user_id: userId });

                if (error) {
                    errorMsg = error.message
                }
            } else {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('journey_id', journeyId)
                    .eq('user_id', userId);

                if (error) {
                    errorMsg = error.message
                }
            }

            if (errorMsg) {
                // revert optimistic update on failure
                journeys.value = prevJourneys
                throw new Error(errorMsg);
            }
        } catch (error) {
            // revert on any unexpected error
            journeys.value = prevJourneys
            console.error('[JourneyStore] Failed to toggle favorite:', error);
            throw error
        }
    };
            
    const fetchCurrentJourney = async (journeyId: string, userId?: string) => {
        try {
            const { data, error } = await supabase
                .from('journeys')
                .select('*')
                .eq('id', journeyId)
                .single();

            if (error) throw error;

            let journey = data;

            if (userId) {
                const { data: favData, error: favError } = await supabase
                    .from('favorites')
                    .select('id')
                    .eq('journey_id', journeyId)
                    .eq('user_id', userId);

                if (favError) throw favError;
                journey.isFavorite = favData && favData.length > 0;
            }

            currentJourney.value = journey;
        } catch (error) {
            console.error('[JourneyStore] Failed to fetch current journey:', error);
            throw error;
        }
    };
      
    async function updateJourneyDescription(description: string, journeyId: number,) {
        try {
            const { error } = await supabase
                .from('journeys')
                .update({ description: description })
                .eq('id', journeyId)
            if (error) throw error
        } catch (error) {
            console.error('[JourneyStore] Failed to update journey description:', error);
            throw error
        }
    }
      
    const upsertStep = async (userId: string, journeyId: string, step: Partial<Step>) => {
        const payload = {
            ...step,
            user_id: userId,
            journey_id: journeyId,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('steps')
            .upsert(payload, { onConflict: 'id' });

        if (error) {
            console.error('[JourneyStore] Failed to create or update step:', error.message);
            throw error;
        }

        // Step created/updated successfully
    };

    const deleteStep = async (stepId: number) => {
        try {
            const { error } = await supabase
                .from('steps')
                .delete()
                .eq('id', stepId);

            if (error) throw error;

            if (steps.value) {
                steps.value = steps.value.filter(step => step.id !== stepId);
            }

            // Step deleted successfully
        } catch (error) {
            console.error('[JourneyStore] Failed to delete step:', error);
            throw error;
        }
    };
      
    const showJourneySteps = async (journeyId: string) => {
        try {
            const { data, error } = await supabase
                .from('steps')
                .select('*')
                .eq('journey_id', journeyId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            steps.value = data;
        } catch (error) {
            console.error('[JourneyStore] Failed to fetch steps:', error);
            throw error;
        }
    };

    const addCategoryToJourney = async (journeyId: string, categoryId: string, userId: string) => {
        try {
            const { error } = await supabase.from('journey_categories').insert({
                journey_id: journeyId,
                category_id: categoryId,
                user_id: userId,
            });
            if (error) throw error;
        } catch (error) {
            console.error('[addCategoryToJourney]', error);
            throw error;
        }
    };

    const removeCategoryFromJourney = async (journeyId: string, categoryId: string, userId: string) => {
        try {
            const { error } = await supabase
                .from('journey_categories')
                .delete()
                .eq('journey_id', journeyId)
                .eq('category_id', categoryId)
                .eq('user_id', userId);

            if (error) throw error;
        } catch (error) {
            console.error('[removeCategoryFromJourney]', error);
            throw error;
        }
    };

    const fetchJourneyCategories = async (journeyId: string, userId: string) => {
        try {
            const { data, error } = await supabase
                .from('journey_categories')
                .select('category_id, categories(title)')
                .eq('journey_id', journeyId)
                .eq('user_id', userId);

            if (error) throw error;

            return data; 
        } catch (error) {
            console.error('[fetchJourneyCategories]', error);
            throw error;
        }
    };
      
    return { journeys, steps, currentJourney, fetchJourneys, deleteJourney, upsertStep, showJourneySteps, fetchCurrentJourney, updateJourneyDescription, toggleFavorite, addCategoryToJourney, removeCategoryFromJourney, fetchJourneyCategories, deleteStep };
});
