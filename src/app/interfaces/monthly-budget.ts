import { Timestamp } from "firebase/firestore";
import { Category } from "./category";

export interface MonthlyBudget {
    id?: string,
    income: number,
    date: Timestamp,
    categories: Category[]
}
