<template>
    <Loader v-if="showLoader" :isLoading="isLoading" />
    <header>
        <Nav />
    </header>

    <div class="page">
        <RouterView />
    </div>

    <Footer />
</template>

<script setup>
// IMPORT
import { onBeforeMount, onMounted, provide, ref, watch } from "vue";
import { RouterView } from "vue-router";
import { useBreakpoints } from "@vueuse/core";

import { useCalculatorStore } from "./stores/calculator";

import Nav from "./components/layout/Nav.vue";
import Footer from "./components/layout/Footer.vue";
import Loader from "./components/layout/Loader.vue";

// INIT STORE
const { calculateFromInputs } = useCalculatorStore();
onBeforeMount(() => {
    calculateFromInputs();
});

const isLoading = ref(true);
const showLoader = ref(true);
onMounted(() => {
    setTimeout(() => {
        isLoading.value = false;
    }, 1000);

    setTimeout(() => {
        showLoader.value = false;
    }, 1250);
});

// disable scroll while loader is active
watch(() => {
    document.getElementsByTagName("body")[0].style.overflow = isLoading.value ? "hidden" : null;
}, isLoading);

// BREAKPOINTS
const defineBreakpoints = useBreakpoints({
    tablet: 650,
    desktop: 1144,
});

const breakpoints = {
    mobile: defineBreakpoints.smaller("tablet"),
    tablet: defineBreakpoints.between("tablet", "desktop"),
    desktop: defineBreakpoints.greater("desktop"),
};

provide("breakpoints", breakpoints);
</script>

<style lang="scss">
body {
    background-color: $colorBackgroundLight;

    #app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        height: 100%;

        .page {
            flex: 1;
        }
    }
}
</style>
