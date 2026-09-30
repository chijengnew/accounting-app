export type RecordType = "income" | "expense";

export interface AccountRecord {
    id: string;
    type: RecordType;
    amount: number;
    description: string;
}