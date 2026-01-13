<template>
  <Card class="mt-[5vh] mx-1 md:mx-5">
    <CardHeader>
      <CardTitle>Créer les plans</CardTitle>
      <CardDescription
        >Renseignez les champs pour ensuite générer les plans par
        jours</CardDescription
      >
    </CardHeader>
    <CardContent>
      <UserForm v-model="userField" />
      <GuardPlan v-model="userField" />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";

import type { userForm } from "~/interfaces";

import GuardPlan from "./guard-plan/GuardPlan.vue";
import UserForm from "./guard-plan/UserForm.vue";

const userField = ref<userForm>();
</script>
