<template>
    <div v-if="show" class="tooltip font--body" :class="`${placement}`">
        <slot></slot>
    </div>
</template>

<script setup>
// PROPS
const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    placement: {
        type: String,
        default: "middle",
    },
});
</script>

<style lang="scss" scoped>
.tooltip {
    z-index: 6;
    width: 100%;
    min-width: 18rem;
    bottom: 0;

    padding: $spacingS $spacingS;
    border-radius: 0.25rem;
    position: absolute;
    background: rgba(67, 67, 67, 0.92);
    color: #fff;
    pointer-events: none;

    &.middle {
        left: 50%;
        transform: translate(-50%, calc(100% + 2px));
    }

    &.left {
        right: 0;
        transform: translate(0%, calc(100% + 2px));
    }

    &.right {
        left: 0;
        transform: translate(0%, calc(100% + 2px));
    }
}
</style>
