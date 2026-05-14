<script setup lang="ts">
    import BaseButton from '../components/atoms/BaseButton.vue';
    import BaseInput from '../components/atoms/BaseInput.vue';
    import BaseTextarea from '../components/atoms/BaseTextarea.vue';
    import BaseIcon from '../components/atoms/BaseIcon.vue';
    import BaseModal from '../components/molecules/BaseModal.vue';
    import BaseDivider from '@/components/atoms/BaseDivider.vue';
    import Spinner from '@/components/atoms/Spinner.vue';

    import JourneyCard from '../components/molecules/JourneyCard.vue';
    import CategoryLabelChip from '@/components/atoms/CategoryLabelChip.vue';
    import CategoryActionChip from '@/components/atoms/CategoryActionChip.vue';
    import CategoryMultiSelect from '@/components/molecules/CategoryMultiSelect.vue';
    import type { Category } from '@/stores/category';

    import { ref, reactive } from 'vue'


    const show = ref(false)
    const showFormModal = ref(false)

    const form = reactive({
      name: '',
      email: '',
      message: '',
    })


// Örnek sabit kategori listesi
const testCategories = ref<Category[]>([
  {
    id: '1',
    title: 'Shadow',
    user_id: 'test-user',
    created_at: '2025-06-17',
    color: '#6b21a8' // pastel mor gibi
  },
  {
    id: '2',
    title: 'Spirit',
    user_id: 'test-user',
    created_at: '2025-06-17',
    color: '#60a5fa' // pastel mavi
  },
  {
    id: '3',
    title: 'Wisdom',
    user_id: 'test-user',
    created_at: '2025-06-17',
    color: '#facc15' // pastel sarı
  },
  {
    id: '4',
    title: 'Love',
    user_id: 'test-user',
    created_at: '2025-06-17',
    color: '#f472b6' // pastel pembe
  },
])

const filteredJourneys = [
  {
    id: 1,
    title: "İçsel Yolculuk",
    description: "Sezgilerini takip ederek karanlıktan geçiyorsun. Kalbini açık tut.",
    icon: "moon",
    isFavorite: true,
    created_at: "08/11/2025",
    updated_at: "25/11/2025",
    categories: [
      { id: "c1", title: "Spiritüel", color: "bg-cat-spiritual", user_id: "demo", created_at: "2025-11-01" },
      { id: "c2", title: "Şifa", color: "bg-cat-priority", user_id: "demo", created_at: "2025-11-01" },
    ],
  },
  {
    id: 2,
    title: "Kolektif Bilinç",
    description: "Toplulukla bağlantı kurarak daha yüksek bir farkındalığa ulaş.",
    icon: "sparkles",
    isFavorite: false,
    created_at: "10/11/2025",
    updated_at: "15/11/2025",
    categories: [
      { id: "c3", title: "Topluluk", color: "bg-cat-nature", user_id: "demo", created_at: "2025-11-01" },
    ],
  },
  {
    id: 3,
    title: "Zaman Kapısı",
    description: "Geçmiş ve geleceğin kesişiminde, şimdiki anın gücünü keşfet.",
    icon: "clock",
    isFavorite: false,
    created_at: "12/11/2025",
    updated_at: "20/11/2025",
    categories: [
      { id: "c4", title: "Karma", color: "bg-cat-energy", user_id: "demo", created_at: "2025-11-01" },
      { id: "c5", title: "Zihin", color: "bg-cat-love", user_id: "demo", created_at: "2025-11-01" },
    ],
  },
]

const showModal = ref(false);

const selectedCategories = ref<Category[]>([])

const handleSubmitStep = () => {
  showModal.value = false
}

</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-10 bg-surface">

    <h1 class="text-3xl font-bold text-slate-900">Styleguide</h1>

    <!-- Colors -->
    <section>

    <!-- Backgrounds -->
    <h3 class="text-lg font-medium mb-3">Backgrounds</h3>
    <div class="mb-8 grid grid-cols-3 md:grid-cols-6 gap-6">
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-app"></div>
        <p class="text-sm mt-1">--color-app: #1f1a2e; (night-sky)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-surface"></div>
        <p class="text-sm mt-1">--color-surface: #f8f5ec; (moonlight-cream)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-input"></div>
        <p class="text-sm mt-1">--color-input: #fffdf7; (lunar-ivory)</p>
      </div>
    </div>


    <!-- Text -->
    <h3 class="text-lg font-medium mb-3">Text</h3>
    <div class="mb-8 grid grid-cols-3 md:grid-cols-6 gap-6">
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-heading"></div>
        <p class="text-sm mt-1">--color-heading: #dcc48e; (cosmic-gold)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-secondary"></div>
        <p class="text-sm mt-1">--color-secondary: #a59fa4; (star-ash)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-on-dark"></div>
        <p class="text-sm mt-1">--color-on-dark: #f8f5ec; (button-text)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-footer-heading"></div>
        <p class="text-sm mt-1">--color-footer-heading: #b38e5d; (soft-gold)</p>
      </div>
    </div>


    <!-- Primary Button -->
    <h3 class="text-lg font-medium mb-3">Primary Button</h3>
    <div class="mb-8 grid grid-cols-3 md:grid-cols-6 gap-6">
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-btn-primary"></div>
        <p class="text-sm mt-1">--color-btn-primary: #6b4fa3; (mystic-violet)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-btn-primary-hover"></div>
        <p class="text-sm mt-1">--color-btn-primary-hover: #8365b7; (mystic-violet-light)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-btn-primary-pressed"></div>
        <p class="text-sm mt-1">--color-btn-primary-pressed: #5f4793; (mystic-violet-pressed)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-btn-primary-disabled"></div>
        <p class="text-sm mt-1">--color-btn-primary-disabled: #6b4fa366; (mystic-violet-disabled)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-btn-primary-text"></div>
        <p class="text-sm mt-1">--color-btn-primary-text: #f8f5ec; (button-text)</p>
      </div>
    </div>

    <!-- Secondary Button -->
    <h3 class="text-lg font-medium mb-3">Secondary Button</h3>
    <div class="mb-8 grid grid-cols-3 md:grid-cols-6 gap-6">
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-btn-secondary"></div>
        <p class="text-sm mt-1">--color-btn-secondary: #b88b4a; (earth-ochre)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-btn-secondary-hover"></div>
        <p class="text-sm mt-1">--color-btn-secondary-hover: #d09d59; (earth-ochre-light)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-btn-secondary-pressed"></div>
        <p class="text-sm mt-1">--color-btn-secondary-pressed: #b88b4a; (earth-ochre-pressed)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-btn-secondary-disabled"></div>
        <p class="text-sm mt-1">--color-btn-secondary-disabled: #b88b4a66; (earth-ochre-disabled)</p>
      </div>
    </div>

    <!-- Status -->
    <h3 class="text-lg font-medium mb-3">Status</h3>
    <div class="mb-8 grid grid-cols-3 md:grid-cols-6 gap-6">
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-success"></div>
        <p class="text-sm mt-1">--color-success: #94a89a; (sage-green)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-warning"></div>
        <p class="text-sm mt-1">--color-warning: #d4a72c; (solar-amber)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-error"></div>
        <p class="text-sm mt-1">--color-error: #b04f4f; (mars-red)</p>
      </div>
    </div>

    <!-- Border -->
    <h3 class="text-lg font-medium mb-3">Border</h3>
    <div class="mb-8 grid grid-cols-3 md:grid-cols-6 gap-6">
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-border"></div>
        <p class="text-sm mt-1">--color-border: #3e3648; (shadow-veil)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-border-neutral"></div>
        <p class="text-sm mt-1">--color-border-neutral: #e2ded8; (mist-grey)</p>
      </div>
    </div>

    <!-- Categories -->
    <h3 class="text-lg font-medium mb-3">Categories</h3>
    <div class="mb-8 grid grid-cols-3 md:grid-cols-6 gap-6">
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-cat-energy"></div>
        <p class="text-sm mt-1">--color-cat-energy: #d4a72c; (sun-amber)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-cat-love"></div>
        <p class="text-sm mt-1">--color-cat-love: #d98ba0; (rose-quartz)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-cat-nature"></div>
        <p class="text-sm mt-1">--color-cat-nature: #5c9a8a; (ocean-teal)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-cat-spiritual"></div>
        <p class="text-sm mt-1">--color-cat-spiritual: #7b5fa4; (plum-violet)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-cat-priority"></div>
        <p class="text-sm mt-1">--color-cat-priority: #c96e5e; (coral-red)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-cat-knowledge"></div>
        <p class="text-sm mt-1">--color-cat-knowledge: #7fa8d8; (sky-blue)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-cat-work"></div>
        <p class="text-sm mt-1">--color-cat-work: #9c9a5a; (olive-green)</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-20 h-12 rounded-md border bg-cat-neutral"></div>
        <p class="text-sm mt-1">--color-cat-neutral: #5a5a5a; (charcoal-grey)</p>
      </div>
    </div>

    </section>

    <!-- Divider -->
    <section class="mt-8">
      <BaseDivider size="md" ></BaseDivider>
    </section>

    <!-- Spinner -->
    <section class="mt-8">
      <Spinner :show-spinner="true" ></Spinner>
    </section>

    <!-- Typography -->
    <section class="mt-8">
      <h1 class="heading-display-1">Forum Display 1 (Primary)</h1>
      <h1 class="heading-display-1 heading-secondary">Forum Display 1 (Secondary)</h1>

      <h2 class="heading-display-2">Forum Display 2 (Primary)</h2>
      <h2 class="heading-display-2 heading-secondary">Forum Display 2 (Secondary)</h2>

      <h1 class="heading-1">Roboto H1 (Primary)</h1>
      <h1 class="heading-1 heading-secondary">Roboto H1 (Secondary)</h1>

      <h2 class="heading-2">Roboto H2 (Primary)</h2>
      <h2 class="heading-2 heading-secondary">Roboto H2 (Secondary)</h2>

      <h3 class="heading-3">Roboto H3 (Primary)</h3>
      <h3 class="heading-3 heading-secondary">Roboto H3 (Secondary)</h3>

      <h4 class="heading-4">Roboto H4 (Primary)</h4>
      <h4 class="heading-4 heading-secondary">Roboto H4 (Secondary)</h4>

      <p>Normal paragraph text (Primary).</p>
      <p class="heading-secondary">Normal paragraph text (Secondary).</p>

      <p class="sm">Small paragraph text (Primary).</p>
      <p class="sm heading-secondary">Small paragraph text (Secondary).</p>

      <p class="lead">Lead paragraph text (Primary).</p>
      <p class="lead heading-secondary">Lead paragraph text (Secondary).</p>

    </section>


<!-- Buttons -->
<section class="mt-8">
  <h2 class="text-xl mb-4 font-extrabold">Buttons</h2>

  <div class="flex flex-wrap gap-3 items-start">
    <!-- Primary -->
    <BaseButton size="lg">Primary LG</BaseButton>
    <BaseButton>Primary MD</BaseButton>
    <BaseButton size="sm">Primary SM</BaseButton>
    <BaseButton :disabled="true">Primary Disabled</BaseButton>

    <!-- Secondary -->
    <BaseButton variant="secondary">Secondary</BaseButton>
    <BaseButton variant="secondary" :disabled="true">Secondary Disabled</BaseButton>

    <!-- Tertiary -->
    <BaseButton variant="tertiary">Tertiary</BaseButton>
    <BaseButton variant="tertiary" size="lg">Tertiary LG</BaseButton>

    <!-- Status -->
    <BaseButton variant="success">Success</BaseButton>
    <BaseButton variant="warning">Warning</BaseButton>
    <BaseButton variant="error">Error</BaseButton>

    <!-- Link -->
    <BaseButton variant="link">Link Button</BaseButton>
    <BaseButton variant="link" :disabled="true">Link Disabled</BaseButton>


    <!-- With Icon -->
    <BaseButton icon="play" size="lg">Primary LG</BaseButton>
    <BaseButton icon="play">Primary MD</BaseButton>
    <BaseButton icon="play" size="sm">Primary SM</BaseButton>
    <BaseButton icon="play" variant="secondary" :disabled="true">Secondary Disabled</BaseButton>
    <BaseButton icon="play" variant="tertiary">Tertiary fgh</BaseButton>
    <BaseButton icon="play" variant="success">Success</BaseButton>
    <BaseButton icon="play" variant="link">Link Button</BaseButton>


  </div>

  <BaseButton size="full">Primary Full Width</BaseButton>
  <BaseButton size="full" variant="secondary">Secondary Full Width</BaseButton>
</section>



    <!-- Modal Example -->
  <section class="mt-12">
    <BaseHeading :tag="'h2'" class="mb-4">Modal Example</BaseHeading>

    <!-- Show Modal Button -->
    <BaseButton variant="primary" @click="show = true">
      Show Modal
    </BaseButton>

    <!-- Modal Component -->
    <BaseModal
      :show="show"
      title="Delete Journey"
      text="Are you sure you want to delete this journey?"
      primaryText="Delete"
      secondaryText="Cancel"
      @close="show = false"
    />
  </section>


  <section class="mt-12">
    <BaseHeading :tag="'h2'" class="mb-4">Modal with Slot</BaseHeading>

    <!-- Show Modal Button -->
    <BaseButton variant="secondary" @click="showFormModal = true">
      Show Form Modal
    </BaseButton>

    <!-- Modal with Slot -->
    <BaseModal
      :show="showFormModal"
      title="Add Step"
      primaryText="Save"
      secondaryText="Cancel"
      @close="showFormModal = false"
    >
      <form class="space-y-4 mt-4">
        <div>
          <label class="block text-sm font-medium mb-1">Step Title</label>
          <BaseInput placeholder="Enter step title" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <BaseTextarea placeholder="Write description..." />
        </div>
      </form>
    </BaseModal>
  </section>

    <!-- Tooltip TODO: tooltip componenti entegre et  -->
    <section class="mt-8">
      <h2 class="text-xl font-semibold mb-2">Tooltip</h2>
      <div class="relative inline-block group">
        <button class="px-4 py-2 rounded-md border transition" style="color: var(--color-earth-ash); border-color: var(--color-earth-ash)" @mouseover="(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--color-astral-smoke)'" @mouseleave="(e) => (e.target as HTMLElement).style.backgroundColor = ''">Hover over</button>
        <div class="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs rounded-md" style="background-color: var(--color-shadow-veil); color: white">
          This is a tooltip
        </div>
      </div>
    </section>

    <!-- Icons (Heroicons 24/outline set) -->
    <section class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Icons – using <code>@heroicons/vue/24/outline</code> set</h2>
      <ul class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-earth-ash">
        <li class="flex items-center gap-2">
          <BaseIcon icon="play" class="w-6 h-6 text-earth-ochre" />
          <span>play — <code>PlayIcon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="bell" class="w-6 h-6 text-venus-rose" />
          <span>bell — <code>BellIcon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="bars" class="w-6 h-6 text-solar-gold" />
          <span>bars — <code>Bars3Icon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="x" class="w-6 h-6 text-mars-red" />
          <span>x — <code>XMarkIcon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="sparkles" class="w-6 h-6 text-cosmic-indigo" />
          <span>sparkles — <code>SparklesIcon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="moon" class="w-6 h-6 text-moon-pearl" />
          <span>moon — <code>MoonIcon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="star" class="w-6 h-6 text-mystic-violet" />
          <span>star — <code>StarIcon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="eye" class="w-6 h-6 text-cosmic-indigo" />
          <span>eye — <code>EyeIcon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="heart" class="w-6 h-6 text-mystic-rose" />
          <span>heart — <code>HeartIcon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="key" class="w-6 h-6 text-shadow-veil" />
          <span>key — <code>KeyIcon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="globe" class="w-6 h-6 text-mercury-grey" />
          <span>globe — <code>GlobeAltIcon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="fire" class="w-6 h-6 text-mystic-pink" />
          <span>fire — <code>FireIcon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="cloud" class="w-6 h-6 text-astral-smoke" />
          <span>cloud — <code>CloudIcon</code></span>
        </li>
        <li class="flex items-center gap-2">
          <BaseIcon icon="up" class="w-6 h-6 text-earth-ash" />
          <span>up — <code>ChevronDoubleUpIcon</code></span>
        </li>
      </ul>
    </section>

  <!-- Chips -->

  <section>
    <h2 class="text-xl font-semibold mb-2">Chips</h2>
    <h4 class="text-xl font-semibold mb-2">Category Label Chips</h4>
    
    <CategoryLabelChip label="test" color="bg-cat-energy"></CategoryLabelChip>
    <CategoryLabelChip label="test" color="bg-cat-love"></CategoryLabelChip>
    <CategoryLabelChip label="test" color="bg-cat-nature"></CategoryLabelChip>
    <CategoryLabelChip label="test" color="bg-cat-spiritual"></CategoryLabelChip>
    <CategoryLabelChip label="test" color="bg-cat-priority"></CategoryLabelChip>
    <CategoryLabelChip label="test" color="bg-cat-knowledge"></CategoryLabelChip>
    <CategoryLabelChip label="test" color="bg-cat-work"></CategoryLabelChip>
    <CategoryLabelChip label="test" color="bg-cat-neutral"></CategoryLabelChip>


    <h4 class="text-xl font-semibold mb-2">Category Action Chips</h4>
    <CategoryActionChip label="test" color="bg-cat-energy"></CategoryActionChip>
    <CategoryActionChip label="test" color="bg-cat-love"></CategoryActionChip>
    <CategoryActionChip label="test" color="bg-cat-nature"></CategoryActionChip>
    <CategoryActionChip label="test" color="bg-cat-spiritual"></CategoryActionChip>
    <CategoryActionChip label="test" color="bg-cat-priority"></CategoryActionChip>
    <CategoryActionChip label="test" color="bg-cat-knowledge"></CategoryActionChip>
    <CategoryActionChip label="test" color="bg-cat-work"></CategoryActionChip>
    <CategoryActionChip label="test" color="bg-cat-neutral"></CategoryActionChip>



  </section>

    <!-- Cards -->
    <section class="mt-8">
      <h2 class="text-xl font-semibold mb-2">Cards</h2>

 <div class="space-y-6">
    <JourneyCard
      v-for="journey in filteredJourneys"
      :key="journey.id + journey.updated_at"
      :id="journey.id"
      :heading="journey.title"
      :description="journey.description"
      :icon="journey.icon"
      :is-favorite="journey.isFavorite"
      :created-at="journey.created_at"
      :updated-at="journey.updated_at"
      :categories="journey.categories"
    />

  </div>
    </section>

    <!-- CategoryMultiSelect -->
    <h2 class="text-xl font-semibold mb-2">Category Multi Select</h2>

    <CategoryMultiSelect
      :categories="testCategories"
      v-model:selected="selectedCategories"
    />

    <div class="mt-6">
      <h3 class="font-semibold mb-2">Selected Categories:</h3>
      <ul class="list-disc pl-5 text-sm text-gray-700">
        <li v-for="cat in selectedCategories" :key="cat.id">{{ cat.title }}</li>
      </ul>
    </div>
    <!-- CategoryMultiSelect ends-->


    <!-- Form Elements -->
    <section class="mt-8">
    <h2 class="text-xl font-semibold mb-2">Form Elements</h2>

    <BaseInput
      id="name"
      label="Name"
      type="text"
      placeholder="Your name"
      v-model="form.name"
    />

    <BaseInput
      id="email"
      label="Email"
      type="email"
      placeholder="example@mail.com"
      v-model="form.email"
    />

    <BaseTextarea
      id="message"
      label="Message"
      placeholder="Write something..."
      v-model="form.message"
    />
  </section>
   

  </div>
</template>
