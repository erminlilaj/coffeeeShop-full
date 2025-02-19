import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon as X } from "@heroicons/react/24/outline";
import type { Product } from "../../lib/types";
import { createSale } from "../../lib/api";

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSellComplete: () => void;
}

const SellModal: React.FC<SellModalProps> = ({
  isOpen,
  onClose,
  product,
  onSellComplete,
}) => {
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState(product?.lastSoldPrice?.toString() || "0");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setError("");
    try {
      await createSale({
        productId: product.id,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        transactionDate: new Date().toISOString().split("T")[0],
      });

      onSellComplete();
      handleClose();
    } catch (error) {
      setError("Sale failed. Please try again.");
      console.error("Error in sale:", error);
    }
  };

  const handleClose = () => {
    setQuantity("1");
    setPrice(product?.lastSoldPrice?.toString() || "0");
    setError("");
    onClose();
  };

  if (!product) return null;

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
          {/* Overlay without blur */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

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
              {/* Close Button */}
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

              {/* Modal Content */}
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Shit {product.name}
                  </Dialog.Title>

                  <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Quantity Input */}
                      <div>
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Sasia
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          min="1"
                          required
                        />
                      </div>

                      {/* Price Input */}
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Çmimi për njësi (lek)
                        </label>
                        <input
                          type="number"
                          id="price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
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
                          parseFloat(price) * parseInt(quantity || "0")
                        ).toFixed(2)}{" "}
                        lek
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="text-sm text-red-500">{error}</div>
                      )}

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

export default SellModal;
