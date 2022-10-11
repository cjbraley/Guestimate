<template>
    <div class="hero">
        <div class="content">
            <h1 class="title">Are your savings on track?</h1>
            <h3 v-if="breakpoints.desktop.value" class="subtitle">
                A quick and easy way to estimate your future net worth
            </h3>
            <p v-else class="subtitle">
                A quick and easy way to<br />estimate your future net worth
            </p>
            <RouterLink to="/#create">
                <Button color="tertiary">Get Started</Button>
            </RouterLink>
            <WalletIcon class="icon wallet" />
            <PiggyBankIcon class="icon piggy-bank" />
            <CreditCardIcon class="icon credit-card" />
            <PercentageIcon class="icon percentage" />
            <GrowthIcon class="icon growth" />
            <DollarIcon class="icon dollar" />
        </div>
    </div>
</template>

<script setup>
import { inject } from "vue";
import { RouterLink } from "vue-router";
import Button from "../Button.vue";

import PiggyBankIcon from "../../assets/icons/save-money.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import CreditCardIcon from "../../assets/icons/credit-card.svg";
import PercentageIcon from "../../assets/icons/percentage.svg";
import GrowthIcon from "../../assets/icons/growth.svg";
import DollarIcon from "../../assets/icons/dollar.svg";

// BREAKPOINTS
const breakpoints = inject("breakpoints");
</script>

<style lang="scss" scoped>
.hero {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    padding: $spacingL $mobileSidePadding;
    margin-bottom: $spacingL;

    background: linear-gradient(
        180deg,
        rgba($colorPrimary, 15%) 0%,
        rgba($colorBackgroundLight, 0.5) 100%
    );

    .content {
        position: relative;
        width: 100%;

        .title {
            margin-bottom: $spacingXS;
        }

        .subtitle {
            margin-bottom: $spacingM;
        }

        .icon {
            display: none;
            position: absolute;
            fill: rgba($colorPrimary, 0.4);
        }

        .wallet {
            height: 3.5rem;
            width: 3.5rem;
            left: 8rem;
            top: -6rem;
            transform: rotate(8deg);
        }
        .dollar {
            height: 2.75rem;
            right: 8rem;
            top: -6rem;
            transform: rotate(-20deg);
        }
        .credit-card {
            height: 4rem;
            width: 4rem;
            right: 2rem;
            bottom: 50%;
            transform: translateY(50%);
        }
        .growth {
            height: 3.25rem;
            left: 2rem;
            bottom: 50%;
            transform: translateY(50%);
        }
        .piggy-bank {
            height: 4rem;
            width: 4rem;
            left: 10rem;
            bottom: -6rem;
            transform: rotate(12deg);
        }
        .percentage {
            height: 3rem;
            width: 3rem;
            right: 10rem;
            bottom: -6rem;
            transform: rotate(-15deg);
        }
    }
}

@media (min-width: $breakpointTablet) {
    .hero {
        height: 24rem;

        .content {
            .icon {
                display: initial;
            }
            .wallet {
                height: 3.5rem;
                width: 3.5rem;
                left: 8rem;
                top: -6rem;
                transform: rotate(8deg);
            }
            .dollar {
                height: 2.75rem;
                right: 8rem;
                top: -6rem;
                transform: rotate(-20deg);
            }
            .credit-card {
                height: 4rem;
                width: 4rem;
                right: 2rem;
                bottom: 50%;
                transform: translateY(50%);
            }
            .growth {
                bottom: 50%;
                transform: translateY(50%);
            }
            .piggy-bank {
                left: 10rem;
                bottom: -6rem;
                transform: rotate(12deg);
            }
            .percentage {
                right: 10rem;
                bottom: -6rem;
            }
        }
    }
}

@media (min-width: $breakpointDesktop) {
    .hero {
        height: 30rem;
    }
}
</style>
