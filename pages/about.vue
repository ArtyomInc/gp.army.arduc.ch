<template>
  <div class="flex flex-col gap-4 mt-[5vh] mx-1 md:mx-5">
    <h1>À propos</h1>
    <div class="flex flex-col gap-2">
      <h2>Auteur</h2>
      <p>
        Cet outil a été créé par ArtyomInc (<Link
          class="text-violet-700 hover:underline bg-transparent py-0 px-0 shadow-none hover:bg-transparent"
          href="https://arduc.ch"
          target="_blank"
          >https://arduc.ch</Link
        >) et librement accéssible en open-source sur
        <Link
          class="text-violet-700 hover:underline bg-transparent py-0 px-0 shadow-none hover:bg-transparent"
          href="https://github.com/ArtyomInc/swiss-army-guard-plan"
          target="_blank"
          >github</Link
        >
      </p>
    </div>
    <div class="flex flex-col gap-2">
      <h2>Informations de sécurités</h2>
      <p>
        Aucunes informations ou données saisies ne sont collectées ! Elles
        restent localement sur votre navigateur jusqu'à la fin de la session.
        Seul un compteur de visites est actif et envoie des données anonymes.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Link } from "@/ui/link";
</script>
