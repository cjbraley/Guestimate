<template>
    <button :class="`${props.color}`">
        <span class="font--button">
            <slot />
        </span>
    </button>
</template>

<script setup>
const props = defineProps({
    color: {
        type: String,
        default: "primary",
    },
});
</script>

<style lang="scss" scoped>
button {
    cursor: pointer;
    padding: $spacingXS $spacingM;
    border-radius: 0.25rem;
    width: fit-content;

    background-color: $colorPrimary;
    color: #fff;

    &:hover {
        background-color: $colorPrimaryHover;
    }
}

.secondary {
    background-color: $colorSecondary;
    &:hover {
        background-color: $colorSecondaryHover;
    }
}

.tertiary {
    background-color: $colorTertiary;
    &:hover {
        background-color: $colorTertiaryHover;
    }
}
</style>
