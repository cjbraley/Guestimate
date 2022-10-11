<template>
    <div class="results content">
        <h2 class="title">Your Results</h2>
        <p class="subtitle" :class="`${breakpoints.desktop.value ? 'font--subtitle' : ''}`">
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
        <div class="kpi-container">
            <KPI
                class="grow"
                title="Assets"
                :value="currencyFormatter(assets)"
                color="secondary"
            />
            <KPI title="Debt" :value="currencyFormatter(liabilities)" color="tertiary" />
            <KPI class="grow" title="Net Worth" :value="currencyFormatter(netWorth)" />
        </div>

        <StackedArea
            class="chart"
            :data="displayResults"
            :yReferenceLine="{ label: 'Target', value: results.target.amount }"
            :showYReferenceLine="config[activeConfig].showYReferenceLine"
            :measures="config[activeConfig].measures"
            :excludeYearZero="config[activeConfig].excludeYearZero"
        />
        <div class="toggle-container">
            <button @click="activeConfig = (activeConfig - 1 + config.length) % config.length">
                <Chevron class="chevron chevron--left" />
            </button>
            <h3 @click="activeConfig = (activeConfig - 1 + config.length) % config.length">
                {{ config[activeConfig].title }}
            </h3>
            <button @click="activeConfig = (activeConfig + 1) % config.length">
                <Chevron class="chevron chevron--right" />
            </button>
        </div>
    </div>
</template>

<script setup>
// IMPORT
import { ref, inject } from "vue";
import { storeToRefs } from "pinia";

import { useCalculatorStore } from "../../stores/calculator";
import { useFormatter } from "../../use/useFormatter";
import Chevron from "../../assets/icons/chevron.svg";

import KPI from "../KPI.vue";
import StackedArea from "./charts/AreaChart.vue";

// BREAKPOINTS
const breakpoints = inject("breakpoints");

// CALCUALTOR
const store = useCalculatorStore();
const {} = store;
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

console.log(results.values);

// FORMATTER
const { currencyFormatter } = useFormatter();

// // CHART
const { displayResults } = storeToRefs(store);

const activeConfig = ref(1);
const config = [
    {
        title: "Net Worth",
        measures: [
            {
                accessor: "netWorth",
                sign: 1,
                stack: 1,
                label: "Net Worth",
                color: "#1B9C73",
            },
        ],
        showYReferenceLine: true,
        excludeYearZero: false,
        tooltipAddTotal: false,
    },
    {
        title: "Assets & Liabilites",
        measures: [
            {
                accessor: "assets",
                sign: 1,
                stack: 1,
                label: "Assets",
                color: "#476BE8",
            },
            {
                accessor: "liabilities",
                sign: -1,
                stack: 2,
                label: "Debt",
                color: "#EC677B",
            },
        ],
        showYReferenceLine: true,
        excludeYearZero: false,
        tooltipAddTotal: true,
    },
    {
        title: "Income Breakdown",
        measures: [
            {
                accessor: "income",
                sign: 1,
                stack: 1,
                label: "Income",
                color: "#476BE8",
            },
            {
                accessor: "incomeFromAssets",
                sign: 1,
                stack: 1,
                label: "Income from Assets",
                color: "#1B9C73",
            },
        ],
        showYReferenceLine: false,
        excludeYearZero: true,
        tooltipAddTotal: true,
    },
];
</script>

<style lang="scss" scoped>
.results {
    padding: 0 $mobileSidePadding;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .title {
        margin-bottom: $spacingXS;
    }

    .subtitle {
        max-width: 90%;
        margin-bottom: $spacingL;
    }

    .chart {
        margin-bottom: $spacingL;
    }

    .toggle-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: $spacingL;
        width: 16rem;

        h3 {
            cursor: pointer;
        }

        .chevron {
            cursor: pointer;
            position: absolute;
            width: 1.225rem;
            top: 50%;
            transform: translateY(-50%);
            fill: $colorFontDark;
            transition: all 0.125s ease;

            &--left {
                transform: rotate(90deg) translateX(-50%);
                left: 0;
            }

            &--right {
                transform: rotate(270deg) translateX(50%);
                right: 0;
            }

            &:hover {
                width: 1.375rem;
            }
        }
    }
}

@media (min-width: $breakpointTablet) {
    .results {
        .subtitle {
            margin-bottom: $spacingL;
        }

        .kpi-container {
            width: 100%;
            /* max-width: 60rem; */
            display: flex;
            justify-content: space-around;
            margin-bottom: $spacingM;
        }
    }
}

@media (min-width: $breakpointDesktop) {
    .results {
        .subtitle {
            margin-bottom: $spacingXL;
        }
        .toggle-container {
            position: relaenter;
            margin-bottom: $spacingXL;
            width: 18rem;
        }
    }
}
</style>
