import { useState, type FormEvent } from "react";
import type {RecordType, AccountRecord} from "@/types";

type FormProps = {
    onAdd: (record: Omit<AccountRecord, "id">) => void;
};

export default function Form({ onAdd }: FormProps) {
    const [type, setType] = useState<RecordType>("income");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const value = Number(amount);
        if (!value || value <=0 || !description.trim()) {
            alert("請輸入正確的金額與說明");
            return;
        }
        onAdd({ type, amount: value, description: description.trim() });
        setAmount("");
        setDescription("");
    }

    return (
        <form className="record-form" onSubmit={handleSubmit}>
            <select value={type} onChange={(e) => setType(e.target.value as RecordType)}>
                <option value="income">收入</option>
                <option value="expense">支出</option>
            </select>
            <input
                type="number"
                min="1"
                placeholder="金額"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <input
                type="text"
                placeholder="描述"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">新增紀錄</button>   
        </form>
    );
}