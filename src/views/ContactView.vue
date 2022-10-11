<template>
    <div class="contact">
        <div class="content">
            <h2 v-if="breakpoints.desktop.value" class="title">Contact</h2>
            <h1 v-else class="title">Contact</h1>
            <div class="subtitle">
                Leave a message and I will get back to you as soon as possible
            </div>
            <form>
                <div class="row">
                    <FormInput class="input" name="name" label="Name" v-model="name" />
                    <FormInput class="input" name="email" label="Email" v-model="email" />
                </div>
                <div class="form-input-group input">
                    <textarea
                        class="form-input"
                        type="textarea"
                        name="message"
                        label="Message"
                        v-model="message"
                        rows="10"
                    />
                    <label class="form-input-label" :class="{ shrink: message.length > 0 }"
                        >Message</label
                    >
                </div>
                <Button color="tertiary" class="submit" @click="onSubmit">Submit</Button>
                <span v-if="submitted" class="success font--body"
                    >Your message has been sent.</span
                >
            </form>
        </div>
        <div class="spacer">
            <div class="primary" />
            <div class="secondary" />
        </div>
    </div>
</template>

<script setup>
// IMPORTS
import { ref, inject } from "vue";
import FormInput from "../components/FormInput.vue";
import Button from "../components/Button.vue";

// BREAKPOINTS
const breakpoints = inject("breakpoints");

// FORM
const name = ref("");
const email = ref("");
const message = ref("");
const submitted = ref(false);

const onSubmit = (e) => {
    console.log(e);
    e.preventDefault();

    name.value = "";
    email.value = "";
    message.value = "";

    submitted.value = true;
    setTimeout(() => {
        submitted.value = false;
    }, 5000);
};
</script>

<style lang="scss" scoped>
.contact {
    padding: $spacingM 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .content {
        padding: 0 $mobileSidePadding;
        width: 100%;
        max-width: 26rem;
    }

    .header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
    }

    .title {
        margin-bottom: $spacingS;
    }

    .subtitle {
        margin-bottom: $spacingL;
    }

    form {
        position: relative;
        width: 100%;
        margin-bottom: $spacingXL;
        display: flex;
        flex-direction: column;
        align-items: center;

        .row {
            width: 100%;
        }

        .input {
            width: 100%;
            margin-bottom: $spacingM;
        }

        .submit {
            width: 100%;
            align-self: flex-end;
        }

        .success {
            color: $colorPrimary;
            position: absolute;
            bottom: -2.5rem;
        }
    }

    .spacer {
        width: 100%;
        margin-bottom: $spacingM;
        .primary {
            width: 33%;
            height: 16px;
            align-self: flex-start;
            background: rgba($colorPrimary, 0.5);
        }

        .secondary {
            width: 66%;
            height: 16px;
            align-self: flex-start;
            background: rgba($colorSecondary, 0.5);
        }
    }
}

@media (min-width: $breakpointTablet) {
    .contact {
        padding: $spacingM 0;
        display: flex;
        flex-direction: column;
        align-items: center;

        .content {
            max-width: 48rem;
        }

        form {
            width: 100%;

            .row {
                width: 100%;
                display: flex;
                justify-content: space-between;
                gap: 2rem;
            }

            .submit {
                width: auto;
            }

            .success {
                bottom: 0.5rem;
            }
        }
    }
}

@media (min-width: $breakpointDesktop) {
    .spacer {
        display: none;
    }
}
</style>
