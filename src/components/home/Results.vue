<template>
    <div class="results content">
        <div class="header">
            <h2 class="title">Your Results</h2>
            <p class="subtitle">
                <span v-if="targetReached">
                    Awesome! According ot your Guestimate, you will reach your target of
                    {{ currencyFormatter(results.target.amount) }} after
                    {{ targetReachedYears }} years.
                </span>
                <span v-else
                    >Oh no... After {{ results.target.years }} years your target still wasn't
                    reached. You ended with a net worth of {{ currencyFormatter(netWorth) }}.
                </span>
            </p>
        </div>
        <div class="kpi-container">
            <KPI
                class="kpi"
                title="Assets"
                :value="currencyFormatter(assets)"
                color="secondary"
            />
            <KPI
                class="kpi"
                title="Debt"
                :value="currencyFormatter(liabilities)"
                color="tertiary"
            />
            <KPI class="kpi" title="Net Worth" :value="currencyFormatter(netWorth)" />
        </div>

        <StackedArea
            class="chart"
            :data="displayResults"
            :yReferenceLine="{ label: 'Target', value: results.target.amount }"
            :showYReferenceLine="activeConfig.showYReferenceLine"
            :measures="activeConfig.measures"
            :excludeYearZero="activeConfig.excludeYearZero"
            :tooltipAddTotal="activeConfig.tooltipAddTotal"
        />
        <div class="toggle-container">
            <button
                @click="
                    activeConfigIndex =
                        (activeConfigIndex - 1 + chartConfig.length) % chartConfig.length
                "
            >
                <Chevron class="chevron chevron--left" />
            </button>
            <div
                class="font--body"
                @click="activeConfigIndex = (activeConfigIndex + 1) % chartConfig.length"
            >
                {{ chartConfig[activeConfigIndex].title }}
            </div>
            <button @click="activeConfigIndex = (activeConfigIndex + 1) % chartConfig.length">
                <Chevron class="chevron chevron--right" />
            </button>
        </div>
    </div>
</template>

<script setup>
// IMPORT
import { ref, inject, computed } from "vue";
import { storeToRefs } from "pinia";

import { useCalculatorStore } from "../../stores/calculator";
import { useFormatter } from "../../use/useFormatter";
import Chevron from "../../assets/icons/chevron.svg";

import KPI from "../KPI.vue";
import StackedArea from "./charts/AreaChart.vue";

import { chartConfig } from "../../data/config";

// BREAKPOINTS
const breakpoints = inject("breakpoints");

// CALCUALTOR
const store = useCalculatorStore();
const {
    results,
    totalIncome,
    totalIncomeFromAssets,
    totalExpenses,
    assets,
    liabilities,
    netWorth,
    targetReached,
    targetReachedYears,
    totalRepayments,
    totalSavings,
} = storeToRefs(store);

// FORMATTER
const { currencyFormatter } = useFormatter();

// // CHART
const { displayResults } = storeToRefs(store);
const activeConfigIndex = ref(0);
const activeConfig = computed(() => chartConfig[activeConfigIndex.value]);
</script>

<style lang="scss" scoped>
.results {
    padding: 0 $mobileSidePadding;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .header {
        margin-bottom: $spacingL;

        .title {
            margin-bottom: $spacingXS;
        }

        .subtitle {
            max-width: 90%;
        }
    }

    .kpi-container {
        margin-bottom: $spacingXL;

        .kpi {
            margin-bottom: $spacingL;
        }

        .kpi:last-of-type {
            margin-bottom: 0;
        }
    }

    .chart {
        height: 20rem;
    }

    .toggle-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: $spacingL;
        width: 12rem;

        h3 {
            cursor: pointer;
        }

        .chevron {
            cursor: pointer;
            position: absolute;
            width: 1rem;
            top: 50%;
            fill: $colorFontDark;
            transition: all 0.125s ease;

            &--left {
                transform: rotate(90deg) translate(-40%);
                left: 0;
            }

            &--right {
                transform: rotate(270deg) translate(40%);
                right: 0;
            }
        }
    }
}

@media (min-width: $breakpointTablet) {
    .results {
        .kpi-container {
            width: 100%;
            /* max-width: 60rem; */
            display: flex;
            justify-content: center;
            gap: 8rem;
            margin-bottom: $spacingL;

            .kpi {
                margin-bottom: $spacingL;
            }
        }
        .chart {
            height: 32rem;
        }
    }
}

@media (min-width: $breakpointDesktop) {
    .results {
        .header {
            margin-bottom: $spacingXL;

            .subtitle {
                max-width: none;
            }
        }

        .chart {
            margin-bottom: $spacingL;
            height: 40rem;
        }

        .toggle-container {
            margin-bottom: $spacingXL;
            width: 14rem;

            .chevron {
                &:hover {
                    width: 1.375rem;
                }
            }
        }
    }
}
</style>
