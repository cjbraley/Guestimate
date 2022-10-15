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
                <EmailIcon class="icon email" />
            </a>
        </div>
        <p>
            &copy; {{ new Date().getFullYear() }} Guestimate<span class="all-rights"
                >. All rights reserved.</span
            >
        </p>
    </footer>
</template>

<script setup>
// IMPORTS

import LinkedInIcon from "../../assets/icons/linkedin-outline.svg";
import GithubIcon from "../../assets/icons/github-outline.svg";
import EmailIcon from "../../assets/icons/email.svg";
</script>

<style lang="scss" scoped>
footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacingXS;

    border-top: 2px solid rgba($colorFontDark, 12%);
    background-color: rgba($colorPrimary, 20%);
    padding-top: $spacingL;
    padding-bottom: $spacingM;

    p {
        color: $colorFontSubtle;
    }

    .all-rights {
        display: none;
    }

    .media-container {
        display: flex;
        justify-content: center;
        gap: $spacingM;

        .icon {
            height: 2rem;
            stroke: $colorPrimary;
            fill: none;

            &:hover {
                stroke: $colorPrimaryHover;
            }
        }

        .email {
            stroke: none;
            fill: $colorPrimary;

            &:hover {
                fill: $colorPrimaryHover;
            }
        }
    }
}

@media (min-width: $breakpointTablet) {
    footer {
        .all-rights {
            display: initial;
        }
    }
}
</style>
