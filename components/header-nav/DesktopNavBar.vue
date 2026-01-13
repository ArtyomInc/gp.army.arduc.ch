<template>
  <nav class="flex h-full items-center justify-between">
    <div class="p-2 h-full">
      <NuxtImg
        class="h-full blur-none"
        src="/favicon.svg"
        alt="ArtyomInc logo"
      />
    </div>
    <div class="flex items-center gap-2">
      <template v-for="item in props.links" :key="item.name">
        <Link
          class="shadow-none text-primary"
          :href="item.path"
          :class="navigationMenuTriggerStyle()"
        >
          {{ item.name }}
        </Link>
      </template>
      <Link
        variant="outline"
        size="icon"
        href="https://github.com/ArtyomInc"
        target="_blank"
      >
        <Icon name="mdi:github" size="20" />
      </Link>
      <SwitchTheme />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Link } from "@/ui/link";
import { navigationMenuTriggerStyle } from "@/ui/navigation-menu";

import SwitchTheme from "./theme-switch/SwitchTheme.vue";

const props = defineProps<{
  links: {
    name: string;
    path: string;
  }[];
}>();
</script>
