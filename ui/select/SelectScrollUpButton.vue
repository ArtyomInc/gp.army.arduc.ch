<script setup lang="ts">
import type { SelectScrollUpButtonProps } from "reka-ui";
import type { HTMLAttributes } from "vue";

import { cn } from "@/lib/utils";
import { ChevronUpIcon } from "@radix-icons/vue";
import { reactiveOmit } from "@vueuse/core";
import { SelectScrollUpButton, useForwardProps } from "reka-ui";

const props = defineProps<
  SelectScrollUpButtonProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = reactiveOmit(props, "class");

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectScrollUpButton
    v-bind="forwardedProps"
    :class="
      cn('flex cursor-default items-center justify-center py-1', props.class)
    "
  >
    <slot>
      <ChevronUpIcon />
    </slot>
  </SelectScrollUpButton>
</template>
