<template>
    <footer>
        <div class="media-container">
            <a
                href="https://www.linkedin.com/in/christopher-b-913439103/"
                target="_blank"
                referrerpolicy="noreferer"
            >
                <LinkedInIcon class="icon" />
            </a>
            <a href="https://github.com/cjbraley" target="_blank" referrerpolicy="noreferer">
                <GithubIcon class="icon" />
            </a>
            <a href="mailto:cbraley@protonmail.com" target="_blank" referrerpolicy="noreferer">
                <EmailIcon class="icon" />
            </a>
        </div>
        <p>&copy; {{ new Date().getFullYear() }} Guestimate</p>
    </footer>
</template>

<script setup>
// IMPORTS

import LinkedInIcon from "../../assets/icons/linkedin.svg";
import GithubIcon from "../../assets/icons/github.svg";
import EmailIcon from "../../assets/icons/email.svg";
</script>

<style lang="scss" scoped>
footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacingM;

    border-top: 2px solid rgba($colorFontDark, 12%);
    background-color: rgba($colorPrimary, 12%);
    padding-top: $spacingM;
    padding-bottom: $spacingM;

    .media-container {
        display: flex;
        justify-content: center;
        gap: $spacingXS;

        .icon {
            height: 2rem;
            fill: $colorPrimary;

            &:hover {
                fill: $colorPrimaryHover;
            }
        }
    }
}
</style>
