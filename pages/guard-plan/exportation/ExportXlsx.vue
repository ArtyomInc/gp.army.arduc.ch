<template>
  <div class="flex items-center gap-1.5">
    <Button
      class="hidden sm:flex"
      :disabled="exportingState"
      @click="tryExport"
    >
      Exporter en Excel
      <Icon v-show="!exportingState" name="lucide:download" size="20" />
      <Icon
        v-show="exportingState"
        name="lucide:loader-circle"
        size="20"
        class="animate-spin"
      />
    </Button>
    <p class="block sm:hidden">
      Vous semblez être sur un mobile, pour une meilleures expérience, veuillez
      exporter depuis un desktop ou un laptop
    </p>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/ui/button";
import { toast } from "vue-sonner";

import type { GuardPerDay } from "~/interfaces";

const props = defineProps<{
  day: GuardPerDay[];
  periodDuration: number;
  periodCount: number;
  officer: string;
  commander: string;
}>();

const exportingState = ref<boolean>(false);

const { exportToXlsx } = useExportXlsx();

async function tryExport() {
  exportingState.value = true;

  try {
    await exportToXlsx({
      commander: props.commander,
      guardDays: props.day,
      logoPath: new URL(
        "@/assets/pictures/logo_swiss_army.png",
        import.meta.url,
      ).href,
      officer: props.officer,
      periodCount: props.periodCount,
      periodDuration: props.periodDuration,
    });

    toast.success("Export réussi", {
      description: "Le fichier Excel a été téléchargé",
    });
  } catch (err: any) {
    toast.error("Erreur lors de l'exportation", {
      description: err.message,
    });
  } finally {
    exportingState.value = false;
  }
}
</script>
