<template>
    <div class="form-input-group">
        <input
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="form-input"
            :class="{ disabled: false }"
            :name="name"
            :required="required"
            :disabled="disabled"
            style="-webkit-text-fill-color: #383b23; background: transparent !important"
        />
        <label
            v-if="label"
            class="form-input-label"
            :class="{ shrink: modelValue.length > 0 }"
            >{{ label }}</label
        >
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
    label: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    required: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

// emits

const emit = defineEmits(["update:modelValue"]);
</script>

<style lang="scss">
@mixin shrinkLabel {
    top: 0.5rem;
    font-size: 0.75rem;
    color: $colorPrimary;
    opacity: 1;
}

.form-input-group {
    position: relative;
    margin-bottom: 0.125rem;

    .form-input {
        background: none;
        padding: 1.5rem 1rem 0.5rem 1rem;
        display: block;
        width: 100%;
        border: none;
        border-radius: 0.25rem;
        border: 1px solid #999;

        &:disabled {
            color: $colorPrimary;
        }

        &:focus {
            outline: none;
        }

        &:focus ~ .form-input-label {
            @include shrinkLabel();
        }
    }

    .disabled {
        opacity: 0.75;
    }

    .form-input-label {
        color: $colorPrimary;
        opacity: 0.6;
        font-weight: normal;
        position: absolute;
        pointer-events: none;
        top: 1rem;
        left: $spacingS;
        /* top: 50%;
        transform: translateY(-50%); */
        transition: 300ms ease all;

        &.shrink {
            @include shrinkLabel();
        }
    }

    .form-input-error {
        color: $colorError;
        font-weight: bold;
        margin-top: 0.4rem;
    }
}
</style>
