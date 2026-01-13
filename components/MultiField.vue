<template>
  <div class="flex flex-col gap-1">
    <div
      v-if="model && model.length != 0"
      class="flex gap-1 rounded-[var(--radius)] p-1 border border-border flex-wrap"
    >
      <div
        v-for="(item, index) in model"
        :key="item"
        class="flex rounded-[var(--radius)] border items-center gap-1.5"
      >
        <p class="pl-2 text-sm">{{ item }}</p>
        <Button
          class="w-7 h-7"
          variant="destructive"
          size="icon"
          @click="remove(index)"
        >
          <Icon name="lucide:trash-2" size="18" />
        </Button>
      </div>
    </div>
    <div class="flex items-center gap-1.5">
      <Input
        :id="props.id"
        v-model="userInput"
        :placeholder="props.placeholder"
        class="w-full"
        @keyup.enter="add(userInput)"
      />
      <Button size="icon" @click="add(userInput)">
        <Icon name="lucide:plus" size="20" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/ui/button";
const props = defineProps<{
  placeholder?: string;
  id?: string;
  blockEmpty?: boolean;
}>();
const model = defineModel<string[]>();
const userInput = ref("");

function add(value: string) {
  if (!model.value) {
    return;
  }
  if (props.blockEmpty === true && userInput.value === "") {
    return;
  }
  model.value.push(value);
  userInput.value = "";
}

function remove(id: number) {
  if (!model.value) {
    return;
  }
  model.value.splice(id, 1);
}
</script>
