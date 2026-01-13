<script setup lang="ts">
import type { DateValue } from "@internationalized/date";

import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { CalendarDate } from "@internationalized/date";
import { computed, ref, watch } from "vue";

interface Props {
  modelValue?: string;
  id?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "blur"): void;
}>();

const selectedDate = ref<DateValue | undefined>();
const selectedHour = ref<string | undefined>();
const isDatePopoverOpen = ref(false);

// Generate hours array: ['00:00', '01:00', ..., '23:00']
const hours = Array.from({ length: 24 }, (_, i) => {
  return `${i.toString().padStart(2, "0")}:00`;
});

// Convert DateValue to JavaScript Date
function dateValueToJsDate(date: DateValue): Date {
  return new Date(date.year, date.month - 1, date.day);
}

// Parse datetime-local string to DateValue and hour
function parseDateTime(value: string | undefined) {
  if (!value) return { date: undefined, hour: undefined };
  try {
    const jsDate = new Date(value);
    if (isNaN(jsDate.getTime())) return { date: undefined, hour: undefined };
    const date = new CalendarDate(
      jsDate.getFullYear(),
      jsDate.getMonth() + 1,
      jsDate.getDate(),
    );
    const hour = `${jsDate.getHours().toString().padStart(2, "0")}:00`;
    return { date, hour };
  } catch {
    return { date: undefined, hour: undefined };
  }
}

// Combine DateValue and hour string to datetime-local format
function combineDateTime(date: DateValue, hour: string): string {
  const [hours] = hour.split(":");
  const jsDate = dateValueToJsDate(date);
  jsDate.setHours(parseInt(hours), 0, 0, 0);
  const year = jsDate.getFullYear();
  const month = String(jsDate.getMonth() + 1).padStart(2, "0");
  const day = String(jsDate.getDate()).padStart(2, "0");
  const hoursStr = String(jsDate.getHours()).padStart(2, "0");
  return `${year}-${month}-${day}T${hoursStr}:00`;
}

// Format date for display
const formattedDate = computed(() => {
  if (!selectedDate.value) return null;
  const jsDate = dateValueToJsDate(selectedDate.value);
  const day = jsDate.getDate().toString().padStart(2, "0");
  const month = (jsDate.getMonth() + 1).toString().padStart(2, "0");
  const year = jsDate.getFullYear();
  return `${day}/${month}/${year}`;
});

// Watch for changes to modelValue prop (for initial value and external updates)
watch(
  () => props.modelValue,
  (newValue) => {
    const { date, hour } = parseDateTime(newValue);
    selectedDate.value = date;
    selectedHour.value = hour;
  },
  { immediate: true },
);

// Handle date selection
function handleDateChange(value: DateValue | undefined) {
  selectedDate.value = value;
  if (selectedDate.value && selectedHour.value) {
    emit(
      "update:modelValue",
      combineDateTime(selectedDate.value, selectedHour.value),
    );
  }
  isDatePopoverOpen.value = false;
}

// Handle hour selection
function handleHourChange() {
  if (selectedDate.value && selectedHour.value) {
    emit(
      "update:modelValue",
      combineDateTime(selectedDate.value, selectedHour.value),
    );
  }
}

// Handle blur event
function handleBlur() {
  emit("blur");
}
</script>

<template>
  <div class="flex gap-2" @focusout="handleBlur">
    <!-- Date Picker with Popover -->
    <Popover v-model:open="isDatePopoverOpen">
      <PopoverTrigger as-child>
        <Button
          :id="id"
          variant="outline"
          class="flex-1 justify-start text-left font-normal"
        >
          <Icon name="lucide:calendar" class="mr-2 h-4 w-4" />
          {{ formattedDate || "Sélectionner la date" }}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" class="w-auto p-0">
        <Calendar
          v-model="selectedDate"
          @update:model-value="handleDateChange"
        />
      </PopoverContent>
    </Popover>

    <!-- Hour Select -->
    <Select v-model="selectedHour" @update:model-value="handleHourChange">
      <SelectTrigger class="w-[120px]">
        <SelectValue placeholder="Heure" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="hour in hours" :key="hour" :value="hour">
          {{ hour }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
