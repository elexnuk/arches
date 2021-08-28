<template>
  <div class="divide-y divide-gray-300 rounded-3xl bg-gray-100 shadow-xl pb-4">
    <div class="p-4 flex flex-wrap sticky top-0 bg-gray-50 rounded-t-lg justify-end w-full items-baseline space-x-3">
        
        <button class="flex-shrink
          block
          px-4
          py-3
          rounded-md
          bg-blue-100
          text-blue-700
          
          transition-all
          
          ring-blue-700
          ring-opacity-40
          cursor-not-allowed"
          @click="enterJSON"
          >
            Enter JSON
        </button>

        <a
            v-if="partyList.length != 0 && false"
            :href="downloadURL"
            :download="filename"
            class="flex-shrink
            px-4
            py-3
            rounded-md
            bg-blue-100
            text-blue-700
            hover:bg-blue-300
            transition-all
            focus:ring-4
            ring-blue-700
            ring-opacity-40"
        >Download PNG</a>

        <a
            v-if="partyList.length != 0 && totalSeats > 0"
            :href="downloadURL"
            :download="filename"
            class="flex-shrink
            px-4
            py-3
            rounded-md
            bg-blue-100
            text-blue-700
            hover:bg-blue-300
            transition-all
            focus:ring-4
            ring-blue-700
            ring-opacity-40"
        >Download SVG</a>

        
    </div>
    
    <div v-if="partyList.length != 0" v-html="diagram.svg"></div>

    <div v-if="partyList.length == 0 || totalSeats <= 0" class="w-full h-32 ">
      <span v-if="partyList.length == 0" class="block m-auto text-center text-gray-400 text-md pt-16">Create a New Party to get started</span>
      <span v-if="totalSeats <= 0 && partyList.length != 0" class="block m-auto text-center text-gray-400 text-md pt-16">Add some seats to create your diagram</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, watch, computed } from "vue";
import { ArchDiagram } from "./../archDiagram";

let props = defineProps({
  partyList: Object,
  compactRows: Boolean,
  title: String,
});

let totalSeats = computed(() => {
    console.log(props.partyList);
    if (props.partyList.length == 0) return 0;
    return props.partyList.reduce((total, partyRepresentation) => {
        return { seatCount: total.seatCount + partyRepresentation.seatCount };
    }).seatCount;
});

let diagram = computed(() => {
  return new ArchDiagram(props.partyList, props.title, props.compactRows);
});

let downloadURL = computed(() => {
  return URL.createObjectURL(new Blob([diagram.value.svg], {type: "image/svg+xml"}));
});

let filename = computed(() => {
  return encodeURIComponent(props.title) + "_" + Date.now() + ".svg";
});

watch(downloadURL, (newv, oldv) => {
  URL.revokeObjectURL(oldv);
});

function enterJSON (event) {
    console.log("Not Supported yet");
    alert("Sorry this feature is not implemented yet. But it is coming soon.");
}

</script>