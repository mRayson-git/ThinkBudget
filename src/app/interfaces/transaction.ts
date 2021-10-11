import { Timestamp } from "firebase/firestore";

export interface Transaction {
    id?: string,
    bankAccountName: string,
    bankAccountType: string,
    transDate: Timestamp,
    transAmount: number,
    transPayee: string,
    transType: string,
    transNote?: string,
    transCategory?: string,
}
