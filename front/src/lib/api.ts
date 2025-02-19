import axios from 'axios';
import { authService } from './auth';
import type { Product, PurchaseRecord, SaleRecord, PageResponse, Transaction, MonthlyStatisticsDto, YearlyStatisticsDTO } from './types';

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
        // Handle 401, 403 (unauthorized) or 500 errors with expired JWT token message
        if (status === 401 || status === 403 || 
            (status === 500 && error.response?.data?.message?.includes('expired'))) {
            // Clear tokens and redirect to login
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
    month?: string
): Promise<PageResponse<PurchaseRecord>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(month ? { month } : {})
    });

    const response = await axios.get(`${API_URL}/transactions/purchases?${params}`);
    return response.data;
};

export const getSales = async (
    page = 0,
    size = 10,
    month?: string
): Promise<PageResponse<SaleRecord>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(month ? { month } : {})
    });

    const response = await axios.get(`${API_URL}/transactions/sellings?${params}`);
    return response.data;
};

export const getMonthlyStatistics = async (month: string, type?: string): Promise<MonthlyStatisticsDto[]> => {
    const params = new URLSearchParams({
        month,
        ...(type ? { type } : {})
    });

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