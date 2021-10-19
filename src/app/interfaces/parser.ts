export interface Parser {
    id?: string,
    email: string,
    accountName: string,
    accountType: string,
    hasHeader: boolean,
    dateCol: number,
    amountCol: number,
    payeeCol: number,
    typeCol: number,
}
