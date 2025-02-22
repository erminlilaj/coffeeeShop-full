export interface Product {
    id: number;
    name: string;
    currentStock: number;
    lastBoughtPrice: number | null;
    lastSoldPrice: number | null;
}

export interface Transaction {
    productId: number;
    quantity: number;
    price: number;
    transactionDate: string;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}

export interface PurchaseRecord {
    id: number;
    product: Product;
    quantity: number;
    price: number;
    totalPrice: number;
    buyingDate: string;
}

export interface SaleRecord {
    id: number;
    product: Product;
    quantity: number;
    price: number;
    totalPrice: number;
    sellingDate: string;
}

export interface MonthlyStatisticsDto {
    productName: string;
    totalBought: number;
    totalSpent: number;
    totalSold: number;
    totalRevenue: number;
    totalProfit: number;
}

export interface YearlyStatisticsDTO {
    productName: string;
    yearlyPurchases: number;
    totalPurchaseCost: number;
    yearlySales: number;
    totalSalesRevenue: number;
    yearlyProfit: number;
}