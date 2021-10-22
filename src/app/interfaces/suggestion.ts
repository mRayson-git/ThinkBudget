import { Timestamp } from "firebase/firestore";

export interface Suggestion {
    id?: string,
    type: string,
    date: Timestamp,
    content: string,
    complete?: boolean
}
