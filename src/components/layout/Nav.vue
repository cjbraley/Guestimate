<template>
    <nav>
        <div class="content">
            <RouterLink to="/" class="logo-container">
                <div class="logo shake">
                    <Logo class="icon" />
                    <h3>uestimate</h3>
                </div>
            </RouterLink>
            <div class="nav-links">
                <RouterLink to="/">
                    <div class="nav-link font--button">Home</div>
                </RouterLink>
                <a
                    ref="mailto:cbraley@protonmail.com"
                    target="_blank"
                    referrerpolicy="noreferer"
                >
                    <div class="nav-link font--button">Contact</div>
                </a>
            </div>
        </div>
    </nav>
</template>

<script setup>
import Logo from "../../assets/icons/Logo.svg";
</script>

<style lang="scss" scoped>
nav {
    /* background-color: $colorPrimary; */
    position: relative;
    height: 5rem;
    background-color: rgba($colorPrimary, 15%);
    border-bottom: 2px solid rgba($colorFontDark, 12%);

    .content {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        flex-direction: row;
        padding-left: $spacingL;
        padding-right: $spacingL;
    }

    .logo-container {
        .logo {
            display: flex;
            align-items: center;
            color: $colorPrimary;
        }

        .icon {
            height: 2rem;
            width: 2rem;
        }
    }

    .shake:hover {
        animation: shake 200ms infinite;
        animation-timing-function: linear;
        animation-iteration-count: 2;
    }

    @keyframes shake {
        0% {
            transform: rotate(2.5deg);
        }
        50% {
            transform: rotate(-2.5deg);
        }
        100% {
            transform: rotate(2.5deg);
        }
    }

    .nav-links {
        display: flex;
        gap: 2rem;

        .nav-link {
            font-weight: 500;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>
