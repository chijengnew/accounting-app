import { useState, type SubmitEvent } from "react";
import type { RecordType, Currency, AccountRecord } from "@/types";

type FormProps = {
    onAdd: (record: Omit<AccountRecord, "id">) => Promise<void>;
};

export default function Form({ onAdd }: FormProps) {
    const [type, setType] = useState<RecordType>("income");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [currency, setCurrency] = useState<Currency>("TWD");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const value = Number(amount);
        if (!value || value <= 0 || !description.trim()) {
            alert("Please enter a valid amount and a description.");
            return;
        }
        setSubmitting(true);
        try {
            await onAdd({ type, currency, amount: value, description: description.trim() });
            setAmount("");
            setDescription("");
        } catch {
            alert("Failed to add the transaction. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="record-form" onSubmit={handleSubmit}>
            <div className="field field-type">
                <label htmlFor="record-type">Type</label>
                <select id="record-type" value={type} onChange={(e) => setType(e.target.value as RecordType)}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>

            <div className="field field-currency">
                <label htmlFor="record-currency">Currency</label>
                <select id="record-currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
                    <option value="TWD">TWD</option>
                    <option value="USD">USD</option>
                </select>
            </div>

            <div className="field field-amount">
                <label htmlFor="record-amount">Amount</label>
                <input
                    id="record-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            <div className="field field-description">
                <label htmlFor="record-description">Description</label>
                <input
                    id="record-description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <button type="submit" className="btn btn-primary record-submit" disabled={submitting}>
                Add transaction
            </button>
        </form>
    );
}