import { useCalculatorStore } from "../stores/calculator";
import { storeToRefs } from "pinia";

export const useFormatter = () => {
    const currencyFormatter = (value) => {
        const store = useCalculatorStore();
        const { currency } = storeToRefs(store);

        const formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.value,
            minimumFractionDigits: 0,
            currencyDisplay: "symbol",
        });

        if (typeof value === "number") {
            return formatter.format(value);
        } else {
            return value;
        }
    };

    const percentFormatter = (value, decimals = 0) => {
        const formatter = new Intl.NumberFormat("default", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });

        if (typeof value === "number") {
            return formatter.format(value);
        } else {
            return value;
        }
    };

    return {
        currencyFormatter,
        percentFormatter,
    };
};
