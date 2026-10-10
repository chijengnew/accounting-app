import Image from "next/image";
import type { AccountRecord } from "@/types";
import { formatMoney } from "@/utils/formatMoney";

type ListProps = {
    records: AccountRecord[];
    onDelete: (id: string) => void;
};

export default function List({ records, onDelete }: ListProps) {
    if (records.length === 0) {
        return (
            <div className="empty">
                <div className="empty-art">
                    <Image src="/money-chase.svg" alt="" width={600} height={280} className="art-image" />
                </div>
                <p className="empty-title">No transactions yet</p>
            </div>
        );
    }

    return (
        <ul className="record-list">
            {records.map((r) => (
                <li key={r.id} className="tx">
                    <div className="tx-main">
                        <span className="tx-name">{r.description}</span>
                        <span className={`chip ${r.type}`}>{r.type === "income" ? "Income" : "Expense"}</span>
                    </div>
                    <div className="tx-side">
                        <span className={`tx-amount ${r.type}`}>
                            {r.type === "income"
                                ? `+${formatMoney(r.amount, r.currency)}`
                                : formatMoney(-r.amount, r.currency)}
                        </span>
                        <button type="button" className="btn-ghost" onClick={() => onDelete(r.id)}>
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}