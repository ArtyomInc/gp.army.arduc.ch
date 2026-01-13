<template>
  <div class="w-full">
    <Dialog v-if="model" v-model:open="isOpen">
      <DialogContent class="max-h-[95svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Plan de garde</DialogTitle>
          <DialogDescription>
            Planification des horaires et affectations des soldats
          </DialogDescription>
        </DialogHeader>
        <template v-if="guardPlan">
          <div
            v-for="day in guardPlan.day"
            :key="day.date"
            class="w-full overflow-x-auto"
          >
            <p>
              {{ day.date }}
            </p>
            <table class="w-full">
              <thead>
                <tr>
                  <td class="px-2">Paire de soldat</td>
                  <td
                    v-for="(_, index) in numberOfPeriod"
                    :key="index"
                    class="w-20"
                  >
                    <div class="flex flex-col justify-center items-center">
                      <div>
                        {{ decimalToTime((index * model.periodDuration) / 60) }}
                      </div>
                      <div class="-my-2.5">-</div>
                      <div>
                        {{
                          decimalToTime(
                            Math.min(
                              24,
                              ((index + 1) * model.periodDuration) / 60,
                            ),
                          )
                        }}
                      </div>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pair in day.pair" :key="randomID.toString()">
                  <td class="px-2 whitespace-nowrap">{{ pair.name }}</td>
                  <td
                    v-for="period in pair.period"
                    :key="randomID.toString()"
                    class="min-w-20"
                    :class="{
                      'dark:text-background': period.class,
                      [period.class!]: period.class,
                    }"
                  >
                    <div class="flex justify-center px-2">
                      {{ period.name }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <DialogFooter v-if="guardPlan">
          <ExportXlsx
            :day="guardPlan.day"
            :period-count="numberOfPeriod"
            :period-duration="model.periodDuration"
            :officer="model.officer"
            :commander="model.commander"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";

import type { GuardPerDay, userForm } from "~/interfaces";

import {
  calculateDaysBetweenDates,
  decimalToTime,
  randomID,
} from "~/lib/utils";

import ExportXlsx from "./exportation/ExportXlsx.vue";

const model = defineModel<userForm>();

const numberOfPeriod = ref<number>(0);

const isOpen = ref(false);

const guardPlan = ref<
  | {
      day: GuardPerDay[];
    }
  | undefined
>(undefined);

watch(model, () => {
  if (model.value) {
    generatePlan();
  }
});

watch(isOpen, (value) => {
  if (value == false) {
    model.value = undefined;
  }
});

function generatePlan() {
  if (!model.value) {
    return;
  }
  if (model.value.begin === undefined || model.value.end === undefined) {
    return;
  }

  const beginDateTime = new Date(model.value.begin!);
  const endDateTime = new Date(model.value.end!);

  const numberOfDay = calculateDaysBetweenDates(beginDateTime, endDateTime);
  const numberOfPair = model.value.pair.length;
  numberOfPeriod.value = Math.round(24 / (model.value.periodDuration / 60));

  const periodAffectationTmp = [...model.value.periodTitle];
  for (
    let index = model.value.periodTitle.length;
    index < numberOfPair;
    index++
  ) {
    periodAffectationTmp.push("");
  }
  const colors = [
    "bg-emerald-200", // Vert émeraude vif
    "bg-orange-200", // Orange militaire (gilets)
    "bg-sky-200", // Bleu ciel (ONU)
    "bg-yellow-200", // Jaune vif (signalisation)
    "bg-purple-200", // Violet (distinction)
  ];

  // Extraire les noms uniques (en préservant l'ordre d'apparition)
  const uniqueNames = [
    ...new Set(periodAffectationTmp.filter((name) => name !== "")),
  ];

  // Créer un mapping nom → couleur
  const colorByName: Record<string, string> = {};
  uniqueNames.forEach((name, index) => {
    colorByName[name] = colors[index % colors.length];
  });

  // Appliquer les couleurs par nom
  const periodAffectation: { name: string; class: string }[] =
    periodAffectationTmp.map((name) => ({
      class: name !== "" ? colorByName[name] : "",
      name: name,
    }));

  guardPlan.value = {
    day: [],
  };

  let currentIndex = 0;

  for (let dayIndex = 0; dayIndex < numberOfDay; dayIndex++) {
    const day: GuardPerDay = {
      date: "Jour " + (dayIndex + 1),
      pair: [],
    };
    const lastIndex = currentIndex + 1;
    currentIndex = 0;

    for (let pairIndex = 0; pairIndex < model.value.pair.length; pairIndex++) {
      const periods: { name: string; class: string }[] = [];

      currentIndex = pairIndex + lastIndex;

      for (
        let periodIndex = 0;
        periodIndex < numberOfPeriod.value;
        periodIndex++
      ) {
        const currentHour = (periodIndex * 24) / numberOfPeriod.value;
        // do nothing the first day before begin hour selected by user
        if (dayIndex == 0 && currentHour + 2 < beginDateTime.getHours()) {
          periods.push({ class: "", name: "" });
        }
        // do nothing the last day after end hour selected by user
        else if (
          1 + dayIndex == numberOfDay &&
          currentHour > endDateTime.getHours()
        ) {
          periods.push({ class: "", name: "" });
        }
        // add affectation
        else {
          currentIndex = currentIndex + 1;
          while (currentIndex >= periodAffectation.length) {
            currentIndex -= periodAffectation.length;
          }
          periods.push(periodAffectation[currentIndex]);
        }
      }

      day.pair.push({
        name: model.value.pair[pairIndex],
        period: periods,
      });
    }

    guardPlan.value.day.push(day);
  }
  isOpen.value = true;
}
</script>

<style scoped>
td {
  @apply border;
}
</style>
