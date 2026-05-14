<template>
    <div v-show="showSpinner" class="text-center h-24">
        <div role="status">
            <svg
                aria-hidden="true"
                class="inline animate-spin w-10 h-10 text-[#2e1a47] fill-[#d6c899]"
                viewBox="0 0 100 101"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    d="M100 50.6C100 78.2 77.6 100.6 50 100.6S0 78.2 0 50.6S22.4 0.6 50 0.6S100 22.9 100 50.6ZM9.1 50.6C9.1 73.2 27.4 91.5 50 91.5S90.9 73.2 90.9 50.6S72.6 9.7 50 9.7S9.1 27.9 9.1 50.6Z"
                    fill="currentColor"
                />
                <path
                    d="M93.97 39.04c2.43-.64 3.9-3.13 3.05-5.49a47.9 47.9 0 0 0-8.19-13.21c-3.97-5.23-8.93-9.63-14.6-12.94A48.2 48.2 0 0 0 41.73 1.28c-2.47.41-3.93 2.92-3.27 5.35.64 2.43 3.12 3.86 5.59 3.44 3.8-.56 7.67-.58 11.48-.05a37.5 37.5 0 0 1 25.34 13.84c2.33 3.07 4.22 6.45 5.6 10.03.9 2.34 3.36 3.8 5.79 3.13Z"
                    fill="currentFill"
                />
            </svg>

            <span class="sr-only">Loading...</span>
        </div>

    </div>
</template>

<script setup lang="ts">

    // defineProps({
    //     showSpinner: {
    //         type: Boolean,
    //         default: false
    //     }
    // })

    // const props = defineProps<{
    //     showSpinner?: boolean
    // }>()

    const props = withDefaults(defineProps<{
        showSpinner?: boolean
    }>(), {
        showSpinner: false
    })

</script>