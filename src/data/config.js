export const chartConfig = [
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
        title: "Saving",
        measures: [
            {
                accessor: "allIncome",
                sign: 1,
                stack: 1,
                label: "Income (incl. assets)",
                color: "#476BE8",
            },
            {
                accessor: "allExpenses",
                sign: -1,
                stack: 2,
                label: "Expenses (incl. debt)",
                color: "#EC677B",
            },
        ],
        showYReferenceLine: false,
        excludeYearZero: true,
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
            {
                accessor: "interestOnLiabilites",
                sign: -1,
                stack: 2,
                label: "Interest on Debts",
                color: "#EC677B",
            },
        ],
        showYReferenceLine: false,
        excludeYearZero: true,
        tooltipAddTotal: true,
    },
];
