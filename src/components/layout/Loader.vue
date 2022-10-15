<template>
    <div :class="`overlay ${isLoading ? '' : 'hide'}`">
        <div class="loader">
            <div class="circle circle-1" />
            <div class="circle circle-2" />
            <div class="circle circle-3" />
            <div class="circle circle-4" />
        </div>
    </div>
</template>

<script setup>
//PROPS
const props = defineProps({
    isLoading: {
        type: Boolean,
        required: true,
    },
});
</script>

<style lang="scss" scoped>
.overlay {
    position: fixed;
    height: 100%;
    width: 100%;
    background: white;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.25s ease;
    transform: translate(0%);

    &::after {
        content: "";
        background: rgba($colorPrimary, 15%);
        position: fixed;
        height: 100%;
        width: 100%;
    }
}

.hide {
    opacity: 0;
}

.loader {
    display: flex;
    gap: $spacingM;
}

.circle {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: $colorPrimary;
    animation-timing-function: elastic(7, 1.9, 0.5);
    animation-duration: 1.25s;
    animation-iteration-count: infinite;
}

.circle-1 {
    animation-name: circle-1;
}

@keyframes circle-1 {
    0% {
        transform: translate(0, 0);
    }

    25% {
        transform: translate(calc(2rem + $spacingM), calc(2rem / 2 + $spacingM/2));
    }

    50% {
        transform: translate(calc(2rem + $spacingM), calc(2rem / 2 + $spacingM/2));
    }

    100% {
        transform: translate(0, 0);
    }
}

.circle-2 {
    animation-name: circle-2;
}

@keyframes circle-2 {
    0% {
        transform: translate(0, 0);
    }

    25% {
        transform: translate(0, calc(-2rem / 2 - $spacingM/2));
    }

    50% {
        transform: translate(0, calc(-2rem / 2 - $spacingM/2));
    }

    100% {
        transform: translate(0, 0);
    }
}

.circle-3 {
    animation-name: circle-3;
}

@keyframes circle-3 {
    0% {
        transform: translate(0, 0);
    }

    25% {
        transform: translate(0, calc(2rem / 2 + $spacingM/2));
    }

    50% {
        transform: translate(0, calc(2rem / 2 + $spacingM/2));
    }

    100% {
        transform: translate(0, 0);
    }
}

.circle-4 {
    animation-name: circle-4;
}

@keyframes circle-4 {
    0% {
        transform: translate(0, 0);
    }

    25% {
        transform: translate(calc(-2rem - $spacingM), calc(-2rem / 2 - $spacingM/2));
    }

    50% {
        transform: translate(calc(-2rem - $spacingM), calc(-2rem / 2 - $spacingM/2));
    }
    100% {
        transform: translate(0, 0);
    }
}
</style>
