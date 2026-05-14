<template>
    <form @submit.prevent="createJourney" class="bg-input w-94 h-10 relative rounded-md m-auto mt-8">
        <input class="p-2 w-full placeholder:text-primary focus:outline-none focus:ring-1 rounded-md focus:ring-ring-neutral" v-model="title" placeholder="Title of your new journey" required/>
        <button class="absolute right-0 bg-btn-primary text-btn-primary-text h-10 w-22 rounded-r-md cursor-pointer" type="submit">Create</button>
    </form>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabase';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notification';

const title = ref('');
const router = useRouter();
const notify = useNotificationStore();

const createJourney = async () => {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('User not found:', userError?.message);
    notify.error(userError?.message ?? 'User not found');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('journeys')
      .insert({
        title: title.value,
        user_id: user.id // artık giriş yapan kullanıcının id’si
      })
      .select('id')
      .single()

    if (error) {
      throw error
    }

    notify.success('Journey created')
    if (data?.id) {
      router.push(`/journeys/${data.id}`);
    } else {
      router.push('/my-journeys');
    }
  } catch (err: any) {
    console.error('Insert error:', err?.message ?? err);
    notify.error(err?.message ?? 'Failed to create journey');
  }
};

</script>
