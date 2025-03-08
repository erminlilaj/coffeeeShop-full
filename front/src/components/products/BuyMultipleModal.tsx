import * as React from "react";
import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon as X } from "@heroicons/react/24/outline";
import { createPurchase } from "../../lib/api";
import { BuyMultipleModalProps } from "../../lib/generated/models/BuyMultipleModalProps";

const BuyMultipleModal: React.FC<BuyMultipleModalProps> = ({
  isOpen,
  onClose,
  selectedProducts,
  onPurchaseComplete,
}) => {
  const getCurrentDate = () => new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const getCurrentTime = () =>
    new Date().toTimeString().split(":").slice(0, 2).join(":"); // HH:MM
  const [updatedProducts, setUpdatedProducts] = useState(
    selectedProducts.map((product) => ({
      ...product,
      quantity: "1",
      price: product.lastBoughtPrice?.toString() || "0",
      error: "",
    }))
  );

  const [purchaseDate, setPurchaseDate] = useState(getCurrentDate());
  const [purchaseTime, setPurchaseTime] = useState(getCurrentTime());
  useEffect(() => {
    setUpdatedProducts(
      selectedProducts.map((product) => ({
        ...product,
        quantity: "1",
        price: product.lastBoughtPrice?.toString() || "0",
        error: "",
      }))
    );
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
        await createPurchase({
          productId: product.id,
          quantity: parseInt(product.quantity),
          price: parseFloat(product.price),
          transactionDate: new Date().toISOString().split("T")[0],
        });
      }

      onPurchaseComplete();
      handleClose();
    } catch (error) {
      setUpdatedProducts((prev) =>
        prev.map((item) => ({
          ...item,
          error: "Purchase failed. Please try again.",
        }))
      );
      console.error("Error in purchase:", error);
    }
  };

  const handleClose = () => {
    setUpdatedProducts(
      selectedProducts.map((product) => ({
        ...product,
        quantity: "1",
        price: product.lastBoughtPrice?.toString() || "0",
        error: "",
      }))
    );
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

              <div className="text-center sm:text-left w-full">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Bli produktet
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {updatedProducts.map((product) => (
                    <div key={product.id}>
                      <div className="font-medium text-gray-700">
                        {product.name}
                      </div>

                      <label className="block text-sm font-medium text-gray-700">
                        Sasia
                      </label>
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(product.id, e.target.value)
                        }
                        className="mt-1 w-full rounded-lg border p-2"
                        min="1"
                        required
                      />

                      <label className="block text-sm font-medium text-gray-700">
                        Çmimi për njësi (lek)
                      </label>
                      <input
                        type="number"
                        value={product.price}
                        onChange={(e) =>
                          handlePriceChange(product.id, e.target.value)
                        }
                        className="mt-1 w-full rounded-lg border p-2"
                        min="0"
                        step="1"
                        required
                      />

                      <div className="mt-2 text-sm text-gray-600">
                        Totali:{" "}
                        {(
                          parseFloat(product.price) * parseInt(product.quantity)
                        ).toFixed(2)}{" "}
                        lek
                      </div>

                      {product.error && (
                        <div className="text-sm text-red-500">
                          {product.error}
                        </div>
                      )}
                    </div>
                  ))}
                  <div>
                    <label
                      htmlFor="purchaseDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Data e blerjes
                    </label>
                    <input
                      type="date"
                      id="purchaseDate"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Time Field */}
                  <div>
                    <label
                      htmlFor="purchaseTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Koha e blerjes
                    </label>
                    <input
                      type="time"
                      id="purchaseTime"
                      value={purchaseTime}
                      onChange={(e) => setPurchaseTime(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="mt-5 flex justify-end gap-3">
                    <button
                      type="button"
                      className="rounded-lg bg-gray-200 px-4 py-2"
                      onClick={handleClose}
                    >
                      Anullo
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
                    >
                      Konfirmo blerjen
                    </button>
                  </div>
                </form>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BuyMultipleModal;
