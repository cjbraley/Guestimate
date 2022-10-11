<template>
    <div class="container">
        <div class="font--subtitle title" :class="`${color}`">{{ title }}</div>
        <h2 v-if="breakpoints.desktop.value" class="subtitle">{{ value }}</h2>
        <h1 v-else class="subtitle">{{ value }}</h1>
    </div>
</template>

<script setup>
import { inject } from "vue";

// PROPS
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: "primary",
    },
});

// BREAKPOINTS
const breakpoints = inject("breakpoints");
</script>

<style lang="scss" scoped>
.container {
    margin-bottom: $spacingL;

    .title {
        margin-bottom: $spacingXS;
        font-weight: 500;
        color: $colorPrimary;

        &.secondary {
            color: $colorSecondary;
        }
        &.tertiary {
            color: $colorTertiary;
        }
    }
    .subtitle {
        font-weight: medium;
    }
}

@media (min-width: $breakpointTablet) {
    .container {
        &.grow {
            flex-grow: 1;
        }
    }
}

/* @media (min-width: $breakpointDesktop) {
    .container {

    }
} */
</style>
