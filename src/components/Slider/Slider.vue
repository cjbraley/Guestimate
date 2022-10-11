<template>
    <div class="container">
        <VueSlider
            class="slider"
            v-model="value"
            :tooltip="'always'"
            :min="0"
            :max="80"
            :interval="1"
            :lazy="true"
            :drag-on-click="true"
            :tooltip-formatter="(v) => `${v} Years`"
            :railStyle="railStyles"
        ></VueSlider>
    </div>
</template>

<script setup>
// IMPORT
import { ref, watch } from "vue";
import VueSlider from "vue-slider-component";
// import "vue-slider-component/theme/antd.css";
import "./Slider.scss";

// PROPS
const props = defineProps({
    val: {
        type: Number,
        default: 0,
    },
    handleInput: {
        type: Function,
    },
});

// HANDLE UPDATE
const value = ref(props.val);
watch(value, (newValue) => {
    props.handleInput(newValue);
});

//STYLES

const railStyles = {
    height: "0.75rem",
    borderRadius: "0.75rem",
};
</script>

<style lang="scss" scoped>
.container {
    padding-top: 2.75rem;
    max-width: 30rem;
    margin-left: auto;
    margin-right: auto;
}
</style>
