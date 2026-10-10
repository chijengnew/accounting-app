import {
    collection, doc, addDoc, deleteDoc, getDocs,
    query, orderBy, serverTimestamp,
}   from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AccountRecord } from "@/types";

type NewRecord = Omit<AccountRecord, "id">;

const recordsCol = (uid: string) => collection(db, "users", uid, "records");

export async function fetchRecords(uid: string): Promise<AccountRecord[]> {
    const snap = await getDocs(query(recordsCol(uid), orderBy("createdAt", "asc")));
    return snap.docs.map((d) => {
        const data = d.data();
        return {
            id: d.id,
            type: data.type,
            currency: data.currency,
            amount: data.amount,
            description: data.description,
        };
    });
}

export async function addRecord(uid: string, data: NewRecord): Promise<AccountRecord> {
    const ref = await addDoc(recordsCol(uid), { ...data, createdAt: serverTimestamp() });
    return { id: ref.id, ...data };
}

export async function deleteRecord(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(db, "users", uid, "records", id));
}