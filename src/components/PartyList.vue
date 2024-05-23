<template>
  <ul class="divide-y divide-gray-300 pb-8">
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
          bg-green-100
          text-green-700
          hover:bg-green-300
          transition-all
          focus:ring-4
          ring-green-700 ring-opacity-40
        "
        @click="newParty"
      >
        New Party
      </button>

      <ToggleBtn :checkedValue="options.denseRows" @update:checkedValue="$event => (options.denseRows = $event)"  label="Dense Rows" />

      <div class="flex-shrink">
        <label class="w-6/12 h-full px-4 py-3 text-green-700">Title:</label>
        <input
          type="text"
          class="
            bg-green-100
            rounded-r-md
            text-green-700
            focus:ring-4
            ring-green-700 ring-opacity-40
            hover:bg-green-300
            transition-all
            px-4
            py-3
            h-full
          "
          :value="options.diagramTitle"
          @input="options.diagramTitle = $event.target.value"
        />
      </div>
    </div>

    <div v-if="list.length == 0" class="w-full h-32">
      <span class="block m-auto text-center text-gray-400 text-md pt-16">
        Create a New Party to get started
      </span>
    </div>

    <PartyItem
      v-for="rep in list"
      :key="rep.party.id"
      v-bind="rep"
      @seats="handleSeats"
      @move="moveParty"
      @delete="removeParty"
    ></PartyItem>
  </ul>
</template>

<script setup>
import { defineProps, reactive, watch } from "vue";
import PartyItem from "./PartyItem.vue";
import { Party } from "../diagram";
import ToggleBtn from "./ToggleBtn.vue";

// Define component event emits.
// Simple emit when the options change to change the master options.
const emit = defineEmits(["changeStatus"]);

// Define props for the component to accept the parts of the diagram list and options.
const props = defineProps({
  list: Array,
  options: Object,
});

// Event handler to create a new party object. 
// Pushes party to list with intial settings and 1 seat.
function newParty() {
  props.list.push({
    party: new Party(shortid(), "New Party", "#DDDDDD", "#000000", 0),
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
</script>

<script>
</script>

