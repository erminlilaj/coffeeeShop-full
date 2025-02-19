
import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, DollarSign } from 'lucide-react';
import type { Product } from '../../lib/types';
import AddProductModal from './AddProductModal';
import PurchaseModal from './PurchaseModal';
import SellModal from './SellModal';
import { getProducts } from '../../lib/api';

interface Props {
    
}

const ProductTable: React.FC<Props> = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
            setError('');
        } catch (error: any) {
            setError(error.message || 'Failed to load products');
            console.error('Failed to load products:', error);
        }
    };

    const handlePurchase = (product: Product) => {
        setSelectedProduct(product);
        setIsPurchaseModalOpen(true);
    };

    const handleSell = (product: Product) => {
        setSelectedProduct(product);
        setIsSellModalOpen(true);
    };

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Produktet</h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Shto Produkt
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-500 text-sm">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Emri
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sasia
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cmimi i fundit i blerjes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cmimi i fundit i shitjes
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.currentStock}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.lastBoughtPrice?.toFixed(2) || '0.00'} lek
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.lastSoldPrice?.toFixed(2) || '0.00'} lek
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handlePurchase(product)}
                                        className="text-indigo-600 hover:text-indigo-900 mx-2"
                                        title="Bli"
                                    >
                                      
                                        <span className="ml-1">Bli</span>
                                    </button>
                                    <button
                                        onClick={() => handleSell(product)}
                                        className="text-green-600 hover:text-green-900 mx-2"
                                        title="Shit"
                                    >
                                     
                                        <span className="ml-1">Shit</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddProductModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onProductAdded={loadProducts}
            />

            <PurchaseModal
                isOpen={isPurchaseModalOpen}
                onClose={() => setIsPurchaseModalOpen(false)}
                product={selectedProduct}
                onPurchaseComplete={loadProducts}
            />

            <SellModal
                isOpen={isSellModalOpen}
                onClose={() => setIsSellModalOpen(false)}
                product={selectedProduct}
                onSellComplete={loadProducts}
            />
        </div>
    );
};

export default ProductTable;