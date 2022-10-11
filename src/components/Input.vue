<template>
    <div class="wrapper" :class="`${color} ${small ? 'small' : ''}`">
        <div class="input-container" :class="`${color}`">
            <label class="font--body" for="">{{ label }}</label>
            <Field
                class="font--subtitle"
                :class="`${noBorder ? 'no-border' : ''}`"
                v-model="formattedVal"
                @keydown="handleKeydown"
                @change="(e) => handleInput(e.target.value)"
                @blur="(e) => e.preventDefault()"
                :placeholder="placeholder"
                :disabled="disabled"
                :name="name"
            />

            <QuestionMark
                class="icon"
                @mouseenter="showTooltip = true"
                @mouseleave="showTooltip = false"
            />
            <Tooltip :show="showTooltip" :placement="tooltipPlacement">
                <span>{{ tooltip }}</span>
            </Tooltip>
        </div>
        <div class="error">
            <ErrorMessage :name="name" />
        </div>
    </div>
</template>

<script setup>
// IMPORTS
import { ref, inject } from "vue";
import { Field, ErrorMessage } from "vee-validate";

import Tooltip from "./Tooltip.vue";

import QuestionMark from "../assets/icons/QuestionMark.svg";

// PROPS
const props = defineProps({
    val: {
        default: 0,
    },
    name: {
        type: String,
        default: "",
    },
    handleInput: {
        type: Function,
    },
    formatter: {
        type: Function,
        default: (a) => a,
    },
    color: {
        type: String,
        default: "primary",
    },
    errorMessage: {
        type: String,
        default: "",
    },
    noBorder: {
        type: Boolean,
        defaut: false,
    },
    placeholder: {
        type: Number,
        default: 0,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        required: true,
    },
    validate: {
        type: Function,
        default: () => true,
    },
    pattern: {
        type: String,
        default: ".*",
    },
    small: {
        type: Boolean,
        default: false,
    },
    tooltip: {
        type: String,
        required: true,
    },
    tooltipPlacement: {
        type: String,
    },
});

// TOOLTIP
const showTooltip = ref(false);

// UPDATE

const formattedVal = props.formatter(props.val);

const handleKeydown = (e) => {
    const re = new RegExp(props.pattern);
    if (e.target.value.trim().length > 1 && event.keyCode != 8) {
        if (!re.test(e.target.value + e.key)) {
            e.preventDefault();
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper {
    width: 20rem;

    .input-container {
        height: 5rem;
        position: relative;
        margin-bottom: $spacingXS;

        input {
            height: 100%;
            width: 100%;

            border: 2px solid $colorPrimary;
            border-radius: 0.25rem;

            padding-bottom: $spacingXS;
            padding-top: $spacingL;
            padding-left: $spacingS;
            padding-right: $spacingS;
            transition: all 0.15s ease;

            &:focus {
                outline: 4px solid $colorPrimarySubtle;
            }

            &:disabled {
                background-color: $colorDisabled;
            }

            &.no-border {
                border: none;
                border-bottom: 2px solid $colorPrimary;
                border-radius: 0;
                padding-bottom: 0;

                &:focus {
                    outline: none;
                }
            }
        }

        label {
            position: absolute;
            top: $spacingXS;
            left: $spacingS;
            text-transform: uppercase;
            font-weight: bold;

            color: $colorPrimary;
        }

        .icon {
            cursor: pointer;
            height: 2rem;
            width: 2rem;
            fill: $colorPrimary;
            stroke: none;

            position: absolute;
            right: $spacingM;
            top: 50%;
            transform: translateY(-50%);

            &:hover {
                fill: $colorPrimaryHover;
            }
        }

        // colors
        &.secondary {
            input {
                border-color: $colorSecondary;
                &:focus {
                    outline-color: $colorSecondarySubtle;
                }
            }

            label {
                color: $colorSecondary;
            }

            .icon {
                fill: $colorSecondary;
                &:hover {
                    fill: $colorSecondaryHover;
                }
            }
        }

        &.tertiary {
            input {
                border-color: $colorTertiary;
                &:focus {
                    outline-color: $colorTertiarySubtle;
                }
            }

            label {
                color: $colorTertiary;
            }

            .icon {
                fill: $colorTertiary;

                &:hover {
                    fill: $colorTertiaryHover;
                }
            }
        }
    }

    .error {
        height: 1.125rem;
        /* position: absolute; */
        color: $colorError;
        text-align: left;
    }

    // SMALL
    &.small {
        width: 6.5rem;

        .icon {
            height: 1.5rem;
            width: 1.5rem;

            right: $spacingXS;
            top: initial;
            bottom: 0.125rem;
            transform: translateY(-50%);
        }
    }
}
</style>
