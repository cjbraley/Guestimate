import { defineStore } from "pinia";

const MAX_YEARS = 80;

export const useCalculatorStore = defineStore({
    id: "calculator",
    state: () => ({
        currency: "USD",
        target: {
            amount: 1000000,
            years: 30,
        },
        yearZero: {},
        inputs: {
            income: 90000, // final income may see some shift from repayments if debt paid off
            expenses: 40000,
            repayments_base: 40000, // final repayments may see shift to income if debt paid off
            growthRateStocks: 5,
            growthRateBonds: 2,
            growthRateCash: 1,
            interestRateLiabilities: 8,
            allocationStocks: 80,
            allocationBonds: 15,
            allocationCash: 5,

            assets: 10000,
            liabilities: 300000,
        },
        hasErrors: false,
        results: {
            target: {
                amount: 1000000,
                years: 30,
            },
            years: [],
        },
    }),
    getters: {
        targetReached: (state) => {
            return (
                state.results.years
                    .slice(0, state.results.target.years + 1)
                    .findIndex((year) => year.netWorth >= state.target.amount) >= 0
            );
        },
        targetReachedYears: (state) => {
            if (!state.targetReached) return;
            const yearIndex = state.results.years.findIndex(
                (year) => year.netWorth >= state.target.amount
            );
            const year = state.results.years[yearIndex];
            const previousYear = state.results.years[yearIndex - 1];

            return (
                Math.round(
                    (previousYear.year +
                        (state.target.amount - previousYear.netWorth) /
                            (year.netWorth - previousYear.netWorth)) *
                        10
                ) / 10
            );
        },
        displayResults: (state) => state.results.years.slice(0, state.target.years + 1),
        totalIncome: (state) => state.results.years[state.target.years].totalIncome,
        totalIncomeFromAssets: (state) =>
            state.results.years[state.target.years].totalIncomeFromAssets,
        totalRepayments: (state) => state.results.years[state.target.years].totalRepayments,
        totalExpenses: (state) => state.results.years[state.target.years].totalExpenses,
        totalSavings: (state) => state.results.years[state.target.years].totalSavings,
        assets: (state) => state.results.years[state.target.years].assets,
        liabilities: (state) => state.results.years[state.target.years].liabilities,
        netWorth: (state) => state.results.years[state.target.years].netWorth,
    },
    actions: {
        setHasErrors(val) {
            this.hasErrors = val;
        },
        update(domain, name, val) {
            if (typeof val === "number") {
                this[domain][name] = val;
            } else {
                const number = Number(val.replace(/[^0-9.-]+/g, ""));
                this[domain][name] = number;
            }
            if (!this.hasErrors) {
                this.calculateFromInputs();
            }
        },
        calculateFromInputs() {
            // console.log("CALCULATE FROM INPUTS");
            // create base inputs
            const data = Array.apply(null, { length: MAX_YEARS }).map((val, i) => ({
                year: i + 1,
                ...this.inputs,
            }));

            // Add year zero
            data.unshift({
                year: 0,
                income: 0, // final income may see some shift from repayments if debt paid off
                expenses: 0,
                repayments_base: 0, // final repayments may see shift to income if debt paid off
                growthRateStocks: 0,
                growthRateBonds: 0,
                growthRateCash: 0,
                interestRateLiabilities: 0,
                allocationStocks: 80,
                allocationBonds: 15,
                allocationCash: 5,
                repayments: 0,
                savings: 0,
                interestOnLiabilities: 0,
                incomeFromStocks: 0,
                incomeFromBonds: 0,
                incomeFromCash: 0,
                incomeFromAssets: 0,
                totalIncome: 0,
                totalExpenses: 0,
                totalSavings: 0,
                totalIncomeFromAssets: 0,
                totalInterestOnLiabilities: 0,
                totalRepayments: 0,
                assets: this.inputs.assets,
                liabilities: this.inputs.liabilities,
                netWorth: this.inputs.assets - this.inputs.liabilities,
            });

            data.forEach((year, i) => {
                if (i === 0) return year;

                const previousYear = data[i - 1];

                const repayments =
                    year.repayments_base > previousYear.liabilities
                        ? previousYear.liabilities
                        : year.repayments_base;

                const interestOnLiabilites =
                    year.repayments_base > previousYear.liabilities
                        ? 0
                        : Math.round(
                              ((previousYear.liabilities - repayments / 2) *
                                  year.interestRateLiabilities) /
                                  100
                          );

                const liabilities = Math.max(
                    0,
                    previousYear.liabilities - repayments + interestOnLiabilites
                );

                // const income = year.income + year.repayments_base - repayments;

                const savings = year.income - year.expenses - repayments;

                const incomeFromStocks = Math.round(
                    ((((previousYear.assets + savings / 2) * year.allocationStocks) / 100) *
                        year.growthRateStocks) /
                        100
                );

                const incomeFromBonds = Math.round(
                    ((((previousYear.assets + savings / 2) * year.allocationBonds) / 100) *
                        year.growthRateBonds) /
                        100
                );

                const incomeFromCash = Math.round(
                    ((((previousYear.assets + savings / 2) * year.allocationCash) / 100) *
                        year.growthRateCash) /
                        100
                );

                const incomeFromAssets = incomeFromStocks + incomeFromBonds + incomeFromCash;
                const netIncome = year.income + incomeFromAssets - interestOnLiabilites;
                const assets = previousYear.assets + savings + incomeFromAssets;

                const netWorth = assets - liabilities;

                const totalIncome = previousYear.totalIncome + year.income;
                const totalExpenses = previousYear.totalExpenses + year.expenses;
                const totalSavings = previousYear.totalSavings + savings;
                const totalIncomeFromAssets =
                    previousYear.totalIncomeFromAssets + incomeFromAssets;
                const totalInterestOnLiabilities =
                    previousYear.totalInterestOnLiabilities + interestOnLiabilites;
                const totalRepayments = previousYear.totalRepayments + repayments;

                data[i] = {
                    ...year,
                    repayments,
                    interestOnLiabilites,
                    liabilities,
                    savings,
                    incomeFromStocks,
                    incomeFromBonds,
                    incomeFromCash,
                    incomeFromAssets,
                    netIncome,
                    assets,
                    netWorth,
                    totalIncome,
                    totalExpenses,
                    totalSavings,
                    totalIncomeFromAssets,
                    totalInterestOnLiabilities,
                    totalRepayments,
                };
            });

            this.results = {
                target: this.target,
                years: data,
            };
        },
    },
});
