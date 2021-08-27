<template>

<div id="diagram" class="rounded-3xl bg-gray-100 shadow-xl p-4" v-html="(new ArchDiagram(partyList, title, compactRows)).svg">
</div>

</template>

<script setup>
import { defineProps } from "vue";
import { ArchDiagram } from "./../archDiagram";

defineProps({
    "partyList": Object,
    "compactRows": Boolean,
    "title": String
});
</script>