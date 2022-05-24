export interface OhlcData {
    date: number;
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
}

export interface OrderBookData{
    price:number;
    count:number;
    amount:number;
}