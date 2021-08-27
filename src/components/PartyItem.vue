<template>
  <div
    class="
      p-4
      space-x-4
      rounded-sm
      grid
      justify-items-start
      items-center
      party-item
    "
  >
    <span
      class="
        row-start-1
        col-start-4
        row-span-2
        bg-red-100
        text-red-500
        font-extrabold
        rounded-full
        text-xl
        align-middle
        text-center
        p-1
        w-10
        h-10
        cursor-pointer
        hover:shadow
        hover:bg-red-300
        hover:text-red-700
        transition-all
      "
      @click="remove"
    >
      &times;
    </span>

    <button
      class="
        row-start-1
        bg-blue-500
        rounded-full
        text-xl
        align-middle
        text-center text-white
        w-full
        h-10
        font-extrabold
        cursor-pointer
        hover:shadow
        hover:bg-blue-700
        transition-all
      "
      @click="moveUp"
    >
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

    <button
      class="
        row-start-2
        bg-blue-500
        rounded-full
        text-xl
        align-middle
        text-center text-white
        w-full
        h-10
        font-extrabold
        cursor-pointer
        hover:shadow
        hover:bg-blue-700
        transition-all
      "
      @click="moveDown"
    >
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

    <input
      type="text"
      class="
        rounded-lg
        focus:ring-4
        ring-green-700 ring-opacity-40
        py-2
        px-4
        transition-all
      "
      :value="party.name"
      @input="party.name = $event.target.value"
    />

    <div class="">
      <button
        class="
          text-md
          rounded-l-lg
          py-2
          px-4
          bg-white
          hover:shadow
          hover:bg-red-100
          transition-all
          font-extrabold
        "
        @click="decrementSeats"
      >
        -
      </button>

      <input
        type="number"
        min="0"
        step="1"
        class="text-md py-2 px-4 w-20 bg-white"
        :value="state.seatCount"
        @input="setSeats"
      />
      <button
        class="
          text-md
          rounded-r-lg
          py-2
          px-4
          bg-white
          hover:shadow
          hover:bg-green-100
          transition-all
          font-extrabold
        "
        @click="incrementSeats"
      >
        +
      </button>
    </div>

    <div>
      <label class="rounded-l-lg py-2 px-4 bg-white">Fill:</label>
      <input
        class="
          rounded-r-lg
          py-2
          px-4
          w-32
          cursor-pointer
          transition-all
          focus:ring-4
          ring-green-700 ring-opacity-40
        "
        :value="party.fillColour"
        @change="party.fillColour = $event.target.value"
        data-jscolor=""
      />
    </div>

    <div>
      <label class="rounded-tl-lg py-2 px-4 bg-white">Outline:</label>
      <input
        class="
          py-2
          px-4
          w-32
          rounded-tr-lg
          cursor-pointer
          transition-all
          focus:ring-4
          ring-green-700 ring-opacity-40
        "
        :value="party.outlineColour"
        @change="party.outlineColour = $event.target.value"
        data-jscolor=""
      />
      <div
        class="
          bg-white
          w-full
          rounded-b-lg
          border-t border-gray-300
          py-2
          px-2
          focus-within:ring-4
          ring-green-700 ring-opacity-40
        "
      >
        <input
          class="mx-auto"
          type="range"
          min="0"
          max="100"
          step="10"
          :value="party.outlineWidth"
          @change="party.outlineWidth = $event.target.value"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, reactive, onMounted } from "vue";

import "./../jscolor.min";

const props = defineProps({
  party: Object,
  seatCount: Number,
});

const emit = defineEmits(["delete", "seats", "move"]);

var state = reactive({
  seatCount: props.seatCount,
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

<style scoped>
.party-item {
  grid-template-columns: 5% 40% 45% 3%;
  grid-template-rows: 50% 50%;
  row-gap: 1em;
  column-gap: 0.5em;
}
/*
@media (max-width: 640px) {
  .party-item {
    grid-template-columns: 100%;
    grid-template-rows: auto;
  }
}*/
</style>

