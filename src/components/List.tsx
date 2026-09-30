import type { AccountRecord } from "@/types";

type ListProps = {
    records: AccountRecord[];
    onDelete: (id: string) => void;
};

export default function List({ records, onDelete }: ListProps) {
    if (records.length === 0) {
        return <p className="empty">目前沒有紀錄</p>;
    }

    return (
        <ul className="record-list">
            {records.map((r) => (
                <li key={r.id} className="record-item">
                    <span className={`amount ${r.type}`}>
                        {r.type === "income" ? r.amount : -r.amount}
                    </span>
                    <span className="description">{r.description}</span>
                    <button onClick={() => onDelete(r.id)}>刪除</button>
                </li>
            ))}
        </ul>
    );
}