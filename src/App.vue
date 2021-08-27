<template>
  <div class="flex justify-between items-center">
    <div
      class="
        m-4
        mb-0
        p-2
        text-gradient text-transparent
        bg-clip-text
        w-min
        pointer-events-none
        select-none
      "
    >
      <h3 class="font-mono font-bold text-3xl">jamesm2w/</h3>
      <h1 class="font-mono font-semibold text-5xl">
        Parliament <br />
        Diagram
      </h1>
    </div>

    <div class="text-gray-400 mr-4 text-right">
      Written by
      <a target="_blank" href="https://jamesm2w.me/dev/">jamesm2w</a> <br />
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
        href="https://github.com/jamesm2w/parliamentdiagram"
        >Github</a
      >. Code licensed under
      <a
        class="underline text-blue-700"
        href="https://raw.githubusercontent.com/jamesm2w/parliamentdiagram/main/LICENSE.md"
        >GPL v2</a
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
      :list="list"
      @changeStatus="statusChange"
    ></PartyList>

    <ArchDiagram
      v-if="list.length != 0"
      class="sm:w-full flex-1 ml-4 md:sticky md:top-0"
      :partyList="list"
      v-bind="opt"
    ></ArchDiagram>
  </div>
</template>

<script setup>
import { defineProps, reactive } from "vue";

import PartyList from "./components/PartyList.vue";
import ArchDiagram from "./components/ArchDiagram.vue";

import { Party } from "./party";

var list = reactive([]);
var opt = reactive({ compactRows: false, title: "New Diagram" });

function statusChange(newv) {
  opt.compactRows = newv.compact;
  opt.title = newv.name;
}

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
</script>