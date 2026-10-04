import type { Currency } from "@/types";

const PREFIX: Record<Currency, string> = { TWD: "NT$", USD: "US$" };

export function formatMoney(amount: number, currency: Currency) {
    const sign = amount < 0 ? "-" : "";
    const digits = currency === "TWD" ? 0 : 2;
    const number = Math.abs(amount).toLocaleString("en-US", {
        maximumFractionDigits: digits,
    });
    return `${sign}${PREFIX[currency]}${number}`;
}