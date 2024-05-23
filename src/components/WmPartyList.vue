<script setup>
import { reactive, watch, onMounted } from "vue";
import WmPartyItem from "./WmPartyItem.vue";
import { Party } from "../diagram";
import ToggleBtn from "./ToggleBtn.vue";

const props = defineProps({
    list: Array,
    options: Object,
});

function newParty() {
  props.list.push({
    party: new Party(shortid()),
    seatCount: 1,
  });
}

// Adds seats to to the given party (identified by ID)
function handleSeats(event) {
  let rep = props.list.find((e) => e.party.id == event.id);
  rep.seatCount = event.seatCount;
}

// Re-arrange parties in the list order
function moveParty(event) {
  let i = props.list.findIndex((e) => e.party.id == event.id);
  let temp;
  if (event.direction == "up") {
    if (i != 0) {
      temp = props.list[i - 1];
      props.list[i - 1] = props.list[i];
      props.list[i] = temp;
    }
  } else if (event.direction == "down") {
    if (i != props.list.length - 1) {
      temp = props.list[i];
      props.list[i] = props.list[i + 1];
      props.list[i + 1] = temp;
    }
  }
}

// Remove a party from the list and forget it
function removeParty(event) {
  let i = props.list.findIndex((el) => el.party.id == event.id);
  props.list.splice(i, 1);
}

// Generate a small, relatively unique id
// https://stackoverflow.com/a/6248722
function shortid () {
  let firstPart = (Math.random() * 46656) | 0;
  let secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

function toggleOptionsDraw() {
    alert("I need to implement toggling the options drawer.");
}
</script>
<template>
    <ul class="divide-y divide-gray-300 shadow-md rounded-b-lg">
      <div
        class="
          p-4
          flex flex-wrap
          sticky
          top-0
          bg-gray-50
          rounded-t-lg
          justify-between
        "
      >
        <button
          class="
            flex-shrink
            block
            px-4
            py-2
            rounded-md
            bg-cyan-700
            text-white
            hover:bg-cyan-900
            transition-all
            focus:ring-4
            ring-cyan-700 ring-opacity-40
          "
          @click="newParty"
        >
          Add New Party
        </button>
  
        <ToggleBtn label="Cozy Parties" :checkedValue="options.cozy" @update:checkedValue="$event => (options.cozy = $event)" />

        <ToggleBtn label="Full Width" :checkedValue="options.fullwidth" @update:checkedValue="$event => (options.fullwidth = $event)" />
  
        <div class="flex-shrink">
            <button class="rounded-lg text-cyan-700 focus:ring-4 ring-cyan-700 ring-opacity-40 hover:bg-cyan-700 hover:text-white font-light transition-all text-lg px-4 py-3 cursor-not-allowed"
                @click="toggleOptionsDraw();"
            >
                Less Options
            </button>
        </div>
      </div>

    <div class="bg-gray-300 flex flex-row flex-wrap gap-2 content-between align-middle items-baseline py-4 px-2">
    
        <div class="flex align-middle bg-white rounded-lg">
            <label class="bg-white py-2 px-4 rounded-l-lg">
                Spacing:
            </label>
            <input
                class="mx-auto my-auto"
                type="range"
                min="0"
                max="1"
                step="0.01" value="0.8" 
                v-model="options.spacing"
            />
            <input
                class="rounded-r-lg py-2 px-4 w-20 text-md"
            type="number"
            min="0.0"
            max="1.0"
            step="0.01"
            value="0.8"
            v-model="options.spacing"
            > 
        </div>

        <div class="flex align-middle bg-white rounded-lg">
            <label class="bg-white py-2 px-4 rounded-l-lg">
                Radius:
            </label>
            <input
                class="mx-auto my-auto"
                type="range"
                min="0"
                max="1"
                step="0.01" 
                v-model="options.radius"
            />
            <input
                class="rounded-r-lg py-2 px-4 w-20 text-md"
            type="number"
            min="0.0"
            max="1.0"
            step="0.01"
            v-model="options.radius"
            > 
        </div>

        <div class="flex align-middle bg-white rounded-lg">
            <label class="bg-white py-2 px-4 rounded-l-lg">
                Override Bench Rows:
            </label>
            <input
                class="rounded-r-lg py-2 px-4 w-20 text-md"
            type="number"
            min="0"
            step="1"
            v-model="options.wingrows"> 
        </div>

        <div class="flex align-middle bg-white rounded-lg">
            <label class="bg-white py-2 px-4 rounded-l-lg">
                Override Crossbench Columns:
            </label>
            <input
                class="rounded-r-lg py-2 px-4 w-20 text-md"
            type="number"
            min="0"
            step="1"
            v-model="options.centercols"> 
        </div>

      
    </div>
  
      <div v-if="list.length == 0" class="w-full h-32">
        <span class="block m-auto text-center text-gray-400 text-md pt-12">
          Create a New Party to get started
        </span>
      </div>

      <WmPartyItem
         v-for="rep in list"
        :key="rep.party.id"
        v-bind="rep"
        @seats="handleSeats"
        @move="moveParty"
        @delete="removeParty"
        ></WmPartyItem>
  
    </ul>
</template>

