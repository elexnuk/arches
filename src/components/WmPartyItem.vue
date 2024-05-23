<script setup>
import { reactive, onMounted } from "vue";
import "./../jscolor.min";

const props = defineProps({
  party: Object,
  seatCount: Number,
});

const emit = defineEmits(["delete", "seats", "move"]);

const state = reactive({
  seatCount: props.seatCount
});

onMounted(() => {
  jscolor.install();
});

function decrementSeats() {
  state.seatCount--;
  if (state.seatCount < 0) state.seatCount = 0;
  emitSeats();
}

function incrementSeats() {
  state.seatCount++;
  emitSeats();
}

function setSeats(event) {
  state.seatCount = parseInt(event.target.value);
  emitSeats();
}

function emitSeats() {
  emit("seats", { id: props.party.id, seatCount: state.seatCount });
}

function moveDown() {
  emit("move", { id: props.party.id, direction: "down" });
}

function moveUp() {
  emit("move", { id: props.party.id, direction: "up" });
}

function remove() {
  emit("delete", { id: props.party.id });
}

</script>
<template>

<div class="p-4 space-x-4 rounded-sm grid justify-items-start items-center party-item">

    <button @click="remove" class="row-start-1 col-start-4 row-span-1 md:row-span-2 bg-red-100 text-red-500 font-extrabold rounded-full text-xl align-middle text-center p-1 w-10 h-10 cursor-pointer hover:shadow-md hover:bg-red-500 hover:text-white transition-all select-none">
      &times;
    </button>

    <button @click="moveUp" class="row-start-1 col-start-1 bg-blue-100 rounded-full align-middle text-center text-blue-500 h-10 w-10 p-1 font-extrabold cursor-pointer hover:shadow-md hover:bg-blue-500 hover:text-white transition-all select-none">
        <svg
        viewBox="0 0 32 32"
        class="icon icon-arrow-top"
        aria-hidden="true"
        fill="currentColor"
      >
        <path
          d="M17.504 26.025l.001-14.287 6.366 6.367L26 15.979 15.997 5.975 6 15.971 8.129 18.1l6.366-6.368v14.291z"
        />
      </svg>
    </button>

    <button @click="moveDown" class="row-start-1 col-start-2 md:row-start-2 md:col-start-1 bg-blue-100 rounded-full align-middle text-center text-blue-500 h-10 w-10 p-1 font-extrabold cursor-pointer hover:shadow-md hover:bg-blue-500 hover:text-white transition-all select-none">
        <svg
        viewBox="0 0 32 32"
        class="icon icon-arrow-bottom"
        aria-hidden="true"
        fill="currentColor"
      >
        <path
          d="M14.496 5.975l-.001 14.287-6.366-6.367L6 16.021l10.003 10.004L26 16.029 23.871 13.9l-6.366 6.368V5.977z"
        />
      </svg>
    </button>

    <span class="row-start-1 col-start-2 md:col-start-3">
        <label class="rounded-l-lg py-2 px-4 text-md cursor-pointer transition-all bg-white">Position:</label>
        <select :value="party.position" @input="party.position = $event.target.value;" class="rounded-r-lg py-2 px-4 text-md cursor-pointer transition-all bg-white">
            <option value="left">Opposition</option>
            <option value="right">Government</option>
            <option value="head">Speaker</option>
            <option value="center">Crossbench</option>
        </select>
    </span>

    <span class="row-start-1 col-start-1 md:row-start-1 md:col-start-2">
        <input class="rounded-lg w-full py-2 px-4 text-md cursor-pointer transition-all focus:ring-4 ring-cyan-700 ring-opacity-40" placeholder="Party Name" :value="party.name"
      @input="party.name = $event.target.value">
    </span>

    <span class="row-start-2 col-start-2 md:row-start-2 md:col-start-2">
        <label class="rounded-l-lg py-2 px-4 text-md bg-white">Fill:</label>
        <input class="rounded-r-lg py-2 px-4 w-32 text-md cursor-pointer transition-all focus:ring-4 ring-cyan-700 ring-opacity-40" :value="party.fillColour" @change="party.fillColour = $event.target.value" data-jscolor="">
    </span>
    
    <span class="row-start-2 col-start-2 md:row-start-2 md:col-start-3 inline-flex items-center">
        <button class="text-md rounded-l-lg py-2 px-4 bg-white hover:shadow-md hover:bg-red-100 hover:text-red-700 transition-all font-bold focus:ring-4 ring-cyan-700 ring-opacity-40" @click="decrementSeats">&minus;</button>
        <input type="number" min="0" step="1" class="text-md py-2 px-4 w-20 bg-white focus:ring-4 ring-cyan-700 ring-opacity-40" :value="state.seatCount"
        @input="setSeats" />
        <button class="text-md rounded-r-lg py-2 px-4 bg-white hover:shadow-md hover:bg-emerald-100 hover:text-emerald-700 transition-all font-bold focus:ring-4 ring-cyan-700 ring-opacity-40" @click="incrementSeats">&plus;</button> 
    </span>

</div>

</template>
<style scoped>
.party-item {
    grid-template-columns: 25% 25% 25% 25%;
    column-gap: 0.1em;
}

@media (min-width: 768px) {
    .party-item {
        grid-template-columns: 5% 40% 45% 10%;
        grid-template-rows: 50% 50%;
        row-gap: 1em;
        column-gap: 0.5em;
    }
}
</style>