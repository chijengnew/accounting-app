"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Form from "@/components/Form";
import List from "@/components/List";
import type { AccountRecord } from "@/types";
import { formatMoney } from "@/utils/formatMoney";

interface RateResponse {
  result: "success" | "error";
  time_last_update_utc: string;
  rates: Record<string, number>;
}

export default function AccountingPage() {
    const [records, setRecords] = useState<AccountRecord[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [usdToTwd, setUsdToTwd] = useState<number | null>(null);
    const [rateError, setRateError] = useState(false);

    useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json() as Promise<RateResponse>)
      .then((data) => {
        if (data.result !== "success") throw new Error("匯率取得失敗");
        setUsdToTwd(data.rates.TWD);
      })
      .catch(() => setRateError(true));
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("records");
        if (saved) {
            const parsed: AccountRecord[] = JSON.parse(saved);
            setRecords(parsed.map((r) => ({ ...r, currency: r.currency ?? "TWD" })));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem("records", JSON.stringify(records));
    }, [records, isLoaded]);

    function handleAdd(data: Omit<AccountRecord, "id">) {
        setRecords((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
    }

    function handleDelete(id: string) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
    }

    const total =
        usdToTwd === null
            ? null
            : records.reduce((sum, r) => {
                const twd = r.currency === "USD" ? r.amount * usdToTwd : r.amount;
                return r.type === "income" ? sum + twd : sum - twd;
            }, 0);

    return (
        <main className="container">
            <Form onAdd={handleAdd} />
            <List records={records} onDelete={handleDelete} />

            <p className="total">
                <strong>小計：</strong>
                {total !== null
                    ? formatMoney(total, "TWD")
                    : rateError
                        ? "無法取得匯率"
                        : "匯率載入中…"}
            </p>
            {usdToTwd !== null && (
                <p className="rate">
                    1 USD = {usdToTwd.toFixed(2)} TWD
                </p>
            )}

            <div className="center">
                <Link href="/" className="btn">返回首頁</Link>
            </div>
        </main>
    );
}