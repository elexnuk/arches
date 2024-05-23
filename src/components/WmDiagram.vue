<template>
    <div class="divide-y divide-gray-300 rounded-3xl bg-gray-100 shadow-xl pb-4">
      <div
        class="
          p-4
          flex flex-wrap
          sticky
          top-0
          bg-gray-50
          rounded-t-lg
          justify-end
          w-full
          items-baseline
          space-x-3
        "
      >
        <!--
            TODO: Simplify data models and allow easy sharing of diagram parties
            To allow easier editing/updating of diagrams 
            -->
        <button
        v-if="false"
          class="
            flex-shrink
            block
            px-4
            py-3
            rounded-md
            bg-blue-100
            text-blue-700
            transition-all
            ring-blue-700 ring-opacity-40
            cursor-not-allowed
          "
          @click="enterJSON"
        >
          Enter JSON
        </button>
  
        <!-- 
            TODO: Add PNG/bitmap image download option. 
              Probably needs to use a hidden canvas or similar.
           -->
        <a
          v-if="list.length != 0 && false"
          :href="downloadURL"
          :download="filename"
          class="
            flex-shrink
            px-4
            py-3
            rounded-md
            bg-blue-100
            text-blue-700
            hover:bg-blue-300
            transition-all
            focus:ring-4
            ring-blue-700 ring-opacity-40
          "
          >Download PNG</a
        >
  
        <!-- Simple SVG download button. Should be hidden when there are no seats or no parties 
            (i.e. diagram is blank)
           -->
        <a
          v-if="list.length != 0"
          :href="downloadURL"
          :download="filename"
          class="
            flex-shrink
            px-4
            py-3
            rounded-md
            bg-blue-100
            text-blue-700
            hover:bg-blue-300
            transition-all
            focus:ring-4
            ring-blue-700 ring-opacity-40
          "
          >Download SVG</a
        >
      </div>
  
      <!-- Actual diagram container. Hidden when diagram would be empty. Has innerHTML bound to the SVG string. -->  
      <div v-if="list.length != 0" v-html="diagram.svg" class="w-full h-full"></div>
  
      <!-- If the diagram is hidden, show some helpful message to let people know what went wrong. -->
      <div v-if="list.length == 0 || diagram.totalSeats <= 0" class="w-full h-32">
        <span
          v-if="list.length == 0"
          class="block m-auto text-center text-gray-400 text-md pt-16"
          >Create a New Party to get started</span
        >
        <span
          v-if="diagram.totalSeats <= 0 && list.length != 0"
          class="block m-auto text-center text-gray-400 text-md pt-16"
          >Add some seats to create your diagram</span
        >
      </div>
    </div>
</template>
  
<script setup>
  import { defineProps, watch, computed } from "vue";
  import { WestminsterDiagram } from "../diagram";
  
  // Define the props for the component. Expecting two parts of the App status here:
  // the list of parties and the display options
  let props = defineProps({
    list: Array, 
    options: Object,
  });
  
  // Define a computed property to recreate the diagram every time the party list or options change.
  let diagram = computed(() => {
    console.log(props.options, props.options.cozy);
    return new WestminsterDiagram(props.list, props.options);
  });
  
  // Define a second computed property to generate a blob + Object URL of the SVG string for downloading
  // should change every time the diagram changes.
  let downloadURL = computed(() => {
    return URL.createObjectURL(
      new Blob([diagram.value.svg], { type: "image/svg+xml" })
    );
  });
  
  // Another computed property to change the filename of the downloaded image. 
  // This is simply the title + the current unix timestamp to avoid duplicates.
  let filename = computed(() => {
    return encodeURIComponent("ParliamentDiagram") + "_" + Date.now() + ".svg";
  });
  
  // Define a callback on the object URL changing. 
  // When the URL changes remove the old one to save memory.
  watch(downloadURL, (newv, oldv) => {
    URL.revokeObjectURL(oldv);
  });
  
  // Event callback function to input JSON string.
  function enterJSON(event) {
    console.log("Not Supported yet");
    alert("Sorry this feature is not implemented yet. But it is coming soon.");
  }
</script>

<style>
svg {
    width: 100%;
    height: 100%;
}
</style>