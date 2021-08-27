<template>

<div id="diagram" class="rounded-3xl bg-gray-100 shadow-xl p-4" 
    v-html="diagram.svg">
</div>

</template>

<script setup>
import { defineProps, computed } from "vue";
import { ArchDiagram } from "./../archDiagram";

let props = defineProps({
    "partyList": Object,
    "compactRows": Boolean,
    "title": String
});

let diagram = computed(() => {
    return new ArchDiagram(props.partyList, props.title, props.compactRows);
});
</script>