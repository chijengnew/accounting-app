"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Form from "@/components/Form";
import List from "@/components/List";
import type { AccountRecord } from "@/types";
import { formatMoney } from "@/utils/formatMoney";
import { useAuth } from "@/hooks/useAuth";
import { fetchRecords, addRecord, deleteRecord } from "@/lib/records";

interface RateResponse {
    result: "success" | "error";
    time_last_update_utc: string;
    rates: Record<string, number>;
}

export default function AccountingPage() {
    const user = useAuth();
    const router = useRouter();
    const [records, setRecords] = useState<AccountRecord[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [usdToTwd, setUsdToTwd] = useState<number | null>(null);
    const [rateError, setRateError] = useState(false);

    useEffect(() => {
        if (user === null) router.replace("/");
    }, [user, router]);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        fetchRecords(user.uid)
            .then((data) => {
                if (cancelled) return;
                setRecords(data);
                setIsLoaded(true);
            })
            .catch(() => alert("Failed to load transactions."));
        return () => {
            cancelled = true;
        };
    }, [user]);

    useEffect(() => {
        fetch("https://open.er-api.com/v6/latest/USD")
            .then((res) => res.json() as Promise<RateResponse>)
            .then((data) => {
                if (data.result !== "success") throw new Error("Unable to load the exchange rate.");
                setUsdToTwd(data.rates.TWD);
            })
            .catch(() => setRateError(true));
    }, []);

    async function handleAdd(data: Omit<AccountRecord, "id">) {
        if (!user) return;
        const created = await addRecord(user.uid, data);
        setRecords((prev) => [...prev, created]);
    }

    async function handleDelete(id: string) {
        if (!user) return;
        try {
            await deleteRecord(user.uid, id);
            setRecords((prev) => prev.filter((r) => r.id !== id));
        } catch {
            alert("Failed to delete the transaction. Please try again.");
        }
    }

    if (!user) {
        return (
            <div className="page">
                <p className="page-status">Loading...</p>
            </div>
        );
    }

    const total =
        usdToTwd === null
            ? null
            : records.reduce((sum, r) => {
                const twd = r.currency === "USD" ? r.amount * usdToTwd : r.amount;
                return r.type === "income" ? sum + twd : sum - twd;
            }, 0);

    return (
        <div className="page">
            <header className="site-header">
                <p className="brand">Personal Finance Tracker</p>
                <div className="header-user">
                    <p className="signed-in">
                        Signed in as <strong>{user.email}</strong>
                    </p>
                    <Link href="/" className="btn btn-secondary btn-small">Back to home</Link>
                </div>
            </header>

            <main className="ledger">
                <section className="card">
                    <h2 className="card-title">Subtotal</h2>
                    <div className="card-body subtotal">
                        <div className="subtotal-figures">
                            {total !== null ? (
                                <p className="subtotal-amount">{formatMoney(total, "TWD")}</p>
                            ) : (
                                <p className="subtotal-status">
                                    {rateError ? "Exchange rate unavailable" : "Loading exchange rate..."}
                                </p>
                            )}
                            {usdToTwd !== null && (
                                <p className="rate">1 USD = {usdToTwd.toFixed(2)} TWD</p>
                            )}
                        </div>
                        <div className="subtotal-art">
                            <Image src="/money-chase.svg" alt="" width={600} height={280} className="art-image" />
                        </div>
                    </div>
                </section>

                <section className="card">
                    <h2 className="card-title">New transaction</h2>
                    <Form onAdd={handleAdd} />
                </section>

                <section className="card">
                    <h2 className="card-title">Transactions</h2>
                    {isLoaded ? (
                        <List records={records} onDelete={handleDelete} />
                    ) : (
                        <p className="list-status">Loading transactions...</p>
                    )}
                </section>
            </main>
        </div>
    );
}