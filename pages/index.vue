<template>
  <div class="flex justify-center items-center">
    <div class="flex flex-col gap-10 justify-center max-w-screen-md mt-[10vh]">
      <div class="relative flex justify-center items-center">
        <div
          class="absolute from-violet-400 to-green-400 bg-gradient-to-br w-full h-[30vh] blur-3xl opacity-50"
        />
        <h1 class="text-5xl z-10 text-center">
          Le générateur open-source de plan de garde pour militaire
        </h1>
      </div>
      <div class="flex justify-center items-center">
        <p class="text-center text-xl">
          Bienvenue sur l'outil personnalisable et open source de
          <strong>génération de plans de garde</strong> pour les militaires
          suisses.
        </p>
      </div>
      <div class="flex justify-center items-center">
        <p class="text-center text-foreground/70">
          Cet outil vous permet de planifier des binômes de soldats par tranche
          horaire, avec plusieurs types d'affectation tels que Externo, Zuko,
          garde, etc. Très flexible, il offre la possibilité d'ajouter des
          tranches horaires et des binômes selon vos besoins.
        </p>
      </div>
      <div class="flex justify-center items-center flex-col md:flex-row gap-3">
        <Link
          class="flex items-center hover:opacity-90 gap-2 bg-gradient-to-r from-violet-500 to-green-400 px-4 justify-center text-white rounded-lg py-2"
          href="/guard-plan"
          >Utiliser le générateur
          <Icon name="lucide:bar-chart-horizontal-big" size="20" />
        </Link>
        <Link
          class="flex items-center gap-2 px-4 justify-center rounded-lg py-2"
          href="/about"
          >En savoir plus
          <Icon name="lucide:arrow-right" size="20" />
        </Link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Link } from "@/ui/link";
</script>
