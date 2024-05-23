<script setup>
  // Import needed Vue functions
  import { onMounted, reactive, watch } from "vue";
  import { RouterLink } from "vue-router"; 
  
  // Import subcomponents 
  import PartyList from "../components/PartyList.vue";
  import ArchDiagram from "../components/ArchDiagram.vue";
  
  // Define a reactive object with the current diagram inside.
  // Vue will watch this object and update the DOM when it is modified
  var status = reactive({
    list: [], // List of party representations objects (party + seat counts)
    
    // Any diagram options which will be passed to the diagram generator.
    // Currently only supports a title and denseRows boolean toggle.
    options: { denseRows: false, diagramTitle: "New Diagram" }, 
  });
  
  // This defines a callback function to be run when the component is mounted onto the DOM
  // This function checks the window's localStorage for a saved state and loads it.
  onMounted(() => {
    
    if (localStorage.getItem("archDiagram")) {
      console.log("load from storage");
      let storedStatus = JSON.parse(localStorage.getItem("archDiagram"));
      status.list = storedStatus.list;
      status.options = storedStatus.options;
    }
  });
  
  // This defines a callback function to be run whenever the passed reactive variable is
  // updated. This function watches `status` for changes and updates the localStorage model
  // with the new value
  watch(status, (newValue) => {
    console.log("update storage");
    localStorage.setItem(
      "archDiagram",
      JSON.stringify({ list: newValue.list, options: newValue.options })
    );
  });
  
// TODO: introduce further localStorage models? Perhaps a dark mode toggle.
</script>
<template>
    <div class="flex justify-between items-center flex-wrap">
      <h1 class="text-5xl font-mono font-black text-gradient text-transparent bg-clip-text m-4 mb-0 p-2 mt-3">
          Arches<br>
          <span class="text-3xl inline-block relative -top-5 font-semibold font-sans italic"><a href="https://elexn.uk/" target="_blank">elexn.uk</a></span><br>
      </h1>

      <!-- <h2>
        <RouterLink to="/westminster/">Westminster</RouterLink>
      </h2> -->
  
      <div class="text-gray-400 mr-4 text-right">
        Based on the
        <a
          class="text-blue-700 underline"
          target="_blank"
          href="https://parliamentdiagram.toolforge.org/parlitest.php"
          >original Wikipedia Parliament Diagram tool</a
        >
        (<a
          class="underline text-blue-700"
          target="_blank"
          href="https://github.com/slashme/parliamentdiagram"
          >Github</a
        >)
        <br />
        Source Code available on
        <a
          class="underline text-blue-700"
          target="_blank"
          href="https://github.com/elexnuk/arches"
          >Github</a
        >.
      </div>
    </div>
  
    <div class="flex flex-wrap w-full p-4 items-start">
      <PartyList
        class="
          bg-gray-100
          rounded-2xl
          shadow-2xl
          sm:w-full
          md:w-5/12
          mr-4
          divide-y divide-gray-100
        "
        v-bind="status"
      ></PartyList>
  
      <ArchDiagram
        class="sm:w-full flex-1 ml-4 md:sticky md:top-0"
        v-bind="status"
      ></ArchDiagram>
    </div>
</template>

<style scoped>
  .text-gradient {
      background-image: linear-gradient(
          -90deg,
          #8DC63F,
          #E4003B,
          #FAA61A,
          #0087DC
      );
      background-size: 400% 400%;
      animation: bg-gradient 10s ease infinite;
  }
  
  @keyframes bg-gradient {
      0% {
          background-position: 0% 50%;
      }
      50% {
          background-position: 100% 50%;
      }
      100% {
          background-position: 0% 50%;
      }
  }
  
</style>