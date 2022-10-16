<template>
    <div class="wrapper" :class="`${color} ${small ? 'small' : ''}`">
        <div class="input-container" :class="`${color}`">
            <label class="font--small" for="">{{ label }}</label>
            <Field
                class="font--body"
                :class="`${noBorder ? 'no-border' : ''}`"
                v-model="formattedVal"
                @keydown="handleKeydown"
                @change="(e) => handleInput(e.target.value)"
                @blur="(e) => e.preventDefault()"
                :placeholder="placeholder"
                :disabled="disabled"
                :name="name"
            />

            <div
                class="icon-container"
                @mouseenter="showTooltip = true"
                @mouseleave="showTooltip = false"
            >
                <QuestionMark class="icon" />
            </div>
            <Tooltip :show="showTooltip" :placement="tooltipPlacement">
                <span>{{ tooltip }}</span>
            </Tooltip>
            <div class="disabled" v-if="disabled">Calculated based on your other inputs</div>
        </div>
        <div class="error">
            <ErrorMessage :name="name" />
        </div>
    </div>
</template>

<script setup>
// IMPORTS
import { ref, computed } from "vue";
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

const formattedVal = computed(() => props.formatter(props.val), props.val);

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
        position: relative;
        margin-bottom: $spacingXS;

        input {
            height: 100%;
            width: 100%;

            border: 2px solid $colorPrimary;
            border-radius: 0.25rem;

            padding-bottom: $spacingXS;
            padding-top: calc($fontSizeDesktopL + $spacingXS);
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
                padding-bottom: $spacingXS;

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

        .icon-container {
            position: absolute;
            top: 50%;
            right: $spacingXS;
            height: 3rem;
            width: 3rem;
            border-radius: 50%;
            transform: translateY(-50%);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .icon {
            cursor: pointer;
            height: 1.75rem;
            width: 1.75rem;
            fill: $colorPrimary;
            stroke: none;
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

        &:hover {
            .disabled {
                display: block;
                position: absolute;
                bottom: 0;
                height: 1.125rem;
                transform: translateY(calc(100% + $spacingXS / 2));
                /* position: absolute; */
                color: $colorFontSubtle;
                text-align: left;
            }
        }
    }

    .disabled {
        display: none;
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

        .icon-container {
            height: calc(1.5rem + $spacingXS * 2);
            width: 2.5rem;
            right: 2px;
            top: initial;
            bottom: 0;
            transform: none;
        }

        .icon {
            height: 1.5rem;
            width: 1.5rem;
        }
    }
}
@media (min-width: $breakpointDesktop) {
    .wrapper {
        .input-container {
            input {
                padding-top: calc($fontSizeDesktopM + $spacingS);
            }
        }
    }
}
</style>
