export type RecordType = "income" | "expense";
export type Currency = "TWD" | "USD";

export interface AccountRecord {
    id: string;
    type: RecordType;
    currency: Currency;
    amount: number;
    description: string;
}