<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { cn } from "@/lib/utils";

import { type LinkVariants, linkVariants } from ".";

interface Props {
  variant?: LinkVariants["variant"];
  size?: LinkVariants["size"];
  class?: HTMLAttributes["class"];
  href?: string;
  target?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <NuxtLink
    :class="cn(linkVariants({ variant, size }), props.class)"
    :href
    :target
  >
    <slot />
  </NuxtLink>
</template>
