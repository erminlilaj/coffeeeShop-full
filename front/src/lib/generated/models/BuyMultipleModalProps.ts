// types.ts or modalTypes.ts
import type { Product } from './Product'; // Adjusted the import path to match the project's structure

export interface BuyMultipleModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedProducts: Product[];
    onSell: () => Promise<void>;
    onPurchaseComplete: () => Promise<void>;
}
