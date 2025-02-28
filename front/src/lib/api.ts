import axios from 'axios';
import { authService } from './auth';
import type { Product, PurchaseRecord, SaleRecord, PageResponse, Transaction,
    MonthlyStatisticsDto, YearlyStatisticsDTO } from './types';

const API_URL = 'http://localhost:8080/api';
//const API_URL = 'https://ms-coffeeshop.onrender.com/api';

// Configure axios with auth header
axios.interceptors.request.use(config => {
    const token = authService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors globally, including token expiration
axios.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;
        if (status === 401 || status === 403 ||
            (status === 500 && error.response?.data?.message?.includes('expired'))) {
            localStorage.removeItem('coffee_shop_token');
            document.cookie = 'coffee_shop_token=; max-age=0; path=/;';
            window.location.replace('/login');
        }

        const message = error.response?.data?.message || error.message || 'An error occurred';
        return Promise.reject(new Error(message));
    }
);

// Products API
export const getProducts = async (): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
};

export const sellMultipleProducts = async (products: Product[]): Promise<Product[]> => {
    try {
        const response = await axios.post(`${API_URL}/products/sell-multiple`, products);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data || 'An error occurred during the sale';
        throw new Error(errorMessage);
    }
};

// Transactions API
export const createPurchase = async (purchaseData: Transaction): Promise<PurchaseRecord> => {
    const response = await axios.post(`${API_URL}/transactions/purchase`, purchaseData);
    return response.data;
};

export const createSale = async (saleData: Transaction): Promise<SaleRecord> => {
    const response = await axios.post(`${API_URL}/transactions/sell`, saleData);
    return response.data;
};


export const getPurchases = async (
    page = 0,
    size = 10,
    day1?: string,  // Optional start date (e.g., "2025-01-01")
    day2?: string   // Optional end date (e.g., "2025-01-31")
): Promise<PageResponse<PurchaseRecord>> => {
    // Create query parameters, adding start_date and end_date only if they are provided

    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(day1 ? { start_date: day1 } : {}), // Renamed to match backend
        ...(day2 ? { end_date: day2 } : {})    // Renamed to match backend
    });

    try {
        // Log the full URL with query parameters
        const fullUrl = `${API_URL}/transactions/purchases?${params.toString()}`;
        console.log("Request URL:", fullUrl);

        console.log("Query Params:", params.toString());

        // Send GET request with query parameters
        const response = await axios.get(fullUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching purchases:', error);
        throw error;
    }
};



export const getSales = async (
    page = 0,
    size = 10,
    day1?: string,
    day2?: string
): Promise<PageResponse<SaleRecord>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(day1 ? { start_date: day1 } : {}), // Renamed to match backend
        ...(day2 ? { end_date: day2 } : {})
    });

    try {
        const response = await axios.get(`${API_URL}/transactions/sellings`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching sales:', error);
        throw error;
    }
};

export const getMonthlyStatistics = async (
    startDate: string,
    endDate: string,
    type?: string
): Promise<MonthlyStatisticsDto[]> => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format");
    }

    // Format dates to include day in 'yyyy-MM-dd'
    const formattedStartDate = start.toISOString().split('T')[0];  // "yyyy-MM-dd"
    const formattedEndDate = end.toISOString().split('T')[0];      // "yyyy-MM-dd"

    console.log("Now first date",formattedStartDate);
    console.log("Now second date",formattedEndDate);
    // Prepare URL parameters with full date range
    const params = new URLSearchParams({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        ...(type ? { type } : {})
    });

    // Make the GET request to the backend
    const response = await axios.get(`${API_URL}/transactions/monthlyStatistics?${params}`);
    return response.data;
};

export const getYearlyStatistics = async (year: number, type?: string): Promise<YearlyStatisticsDTO[]> => {
    const params = new URLSearchParams({
        year: year.toString(),
        ...(type ? { type } : {})
    });

    const response = await axios.get(`${API_URL}/transactions/yearlyStatistics?${params}`);
    return response.data;
};
