import * as React from "react";
import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon as X } from "@heroicons/react/24/outline";
import { SellMultipleModalProps } from "../../lib/generated/models/SellMultipleModalProps";
import { createSale } from "../../lib/api";

const SellMultipleModal: React.FC<SellMultipleModalProps> = ({
  isOpen,
  onClose,
  selectedProducts,
  onSellComplete,
}) => {
  const getCurrentDate = () => new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const [saleDate, setSaleDate] = useState(getCurrentDate()); // Store sale date
  const [updatedProducts, setUpdatedProducts] = useState(
    selectedProducts.map((product) => ({
      ...product,
      quantity: "1",
      price: product.lastSoldPrice?.toString() || "0",
      error: "",
    }))
  );

  // Effect to reset updatedProducts and saleDate when selectedProducts change
  useEffect(() => {
    setUpdatedProducts(
      selectedProducts.map((product) => ({
        ...product,
        quantity: "1",
        price: product.lastSoldPrice?.toString() || "0",
        error: "",
      }))
    );
    setSaleDate(getCurrentDate()); // Reset sale date
  }, [selectedProducts]);

  const handleQuantityChange = (id: number, value: string) => {
    setUpdatedProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: value } : item))
    );
  };

  const handlePriceChange = (id: number, value: string) => {
    setUpdatedProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatedProducts(
      (prev) => prev.map((item) => ({ ...item, error: "" })) // Reset errors
    );

    try {
      for (const product of updatedProducts) {
        if (!product || parseInt(product.quantity) <= 0) {
          throw new Error("Invalid quantity");
        }
        await createSale({
          productId: product.id,
          quantity: parseInt(product.quantity),
          price: parseFloat(product.price),
          transactionDate: saleDate, // Use saleDate
        });
      }

      onSellComplete();
      handleClose();
    } catch (error) {
      setUpdatedProducts((prev) =>
        prev.map((item) => ({
          ...item,
          error: "Sale failed. Please try again.",
        }))
      );
      console.error("Error in sale:", error);
    }
  };

  const handleClose = () => {
    setUpdatedProducts(
      selectedProducts.map((product) => ({
        ...product,
        quantity: "1",
        price: product.lastSoldPrice?.toString() || "0",
        error: "",
      }))
    );
    setSaleDate(getCurrentDate()); // Reset sale date
    onClose();
  };

  if (!selectedProducts.length) return null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transition-all relative">
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
                  onClick={handleClose}
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Shit produktet
                  </Dialog.Title>

                  <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {updatedProducts.map((product) => (
                        <div key={product.id}>
                          <div className="font-medium text-gray-700">
                            {product.name}
                          </div>

                          {/* Quantity Input */}
                          <div>
                            <label
                              htmlFor={`quantity-${product.id}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Sasia
                            </label>
                            <input
                              type="number"
                              id={`quantity-${product.id}`}
                              value={product.quantity}
                              onChange={(e) =>
                                handleQuantityChange(product.id, e.target.value)
                              }
                              className="mt-1 w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              min="1"
                              required
                            />
                          </div>

                          {/* Price Input */}
                          <div>
                            <label
                              htmlFor={`price-${product.id}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Çmimi për njësi (lek)
                            </label>
                            <input
                              type="number"
                              id={`price-${product.id}`}
                              value={product.price}
                              onChange={(e) =>
                                handlePriceChange(product.id, e.target.value)
                              }
                              className="mt-1 w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              min="0"
                              step="1"
                              required
                            />
                          </div>

                          {/* Total Price Calculation */}
                          <div className="mt-2 text-sm text-gray-600">
                            Totali i shitjes:{" "}
                            {(
                              parseFloat(product.price) *
                              parseInt(product.quantity)
                            ).toFixed(2)}{" "}
                            lek
                          </div>

                          {/* Error Message */}
                          {product.error && (
                            <div className="text-sm text-red-500">
                              {product.error}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Date Field */}
                      <div>
                        <label
                          htmlFor="saleDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Data e shitjes
                        </label>
                        <input
                          type="date"
                          id="saleDate"
                          value={saleDate}
                          onChange={(e) => setSaleDate(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>

                      {/* Buttons */}
                      <div className="mt-5 flex justify-end gap-3">
                        <button
                          type="button"
                          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                          onClick={handleClose}
                        >
                          Anullo
                        </button>
                        <button
                          type="submit"
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500"
                        >
                          Konfirmo shitjen
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SellMultipleModal;
