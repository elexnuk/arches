// import { createApp } from "vue";
// import App from "./App.vue";
// import "./index.css";

// createApp(App).mount("#app");

import { createApp } from "vue";
import "./index.css";

import App from "./App.vue";

import Arches from "./pages/Arches.vue";
import Westminster from "./pages/Westminster.vue";

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { 
        path: "/", 
        name: "arch", 
        component: Arches,
        meta: {
            base: "/"
        }
    },
    { 
        path: "/westminster/", 
        name: "westminster", 
        component: Westminster,
        meta: {
            base: "/westminster/"
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const app = createApp(App);
app.use(router);
app.mount("#app");