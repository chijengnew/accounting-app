"use client";

import { useState } from "react";
import Link from "next/link";
import Form from "@/components/Form";
import List from "@/components/List";
import type { AccountRecord } from "@/types";

export default function AccountingPage() {
    const [records, setRecords] = useState<AccountRecord[]>([]);

    function handleAdd(data: Omit<AccountRecord, "id">) {
        setRecords((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
    }

    function handleDelete(id: string) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
    }

    const total = records.reduce(
        (sum, r) => (r.type === "income" ? sum + r.amount : sum - r.amount),
        0
    );

    return (
        <main className="container">
            <Form onAdd={handleAdd} />
            <List records={records} onDelete={handleDelete} />
            <p className="total"><strong>小計：</strong>{total}</p>
            <div className="center">
                <Link href="/" className="btn">返回首頁</Link>
            </div>
        </main>
    );
}