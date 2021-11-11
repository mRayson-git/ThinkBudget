import { Timestamp } from "firebase/firestore";
import { Category } from "./category";

export interface MonthlyBudget {
    id?: string,
    income: number,
    budgetStats?: {
        totalSaved: number,
        totalSpendingBudget: number,
        totalSpent: number,
        totalDifference: number
    },
    flex?: number,
    date: Timestamp,
    categories: Category[]
}
