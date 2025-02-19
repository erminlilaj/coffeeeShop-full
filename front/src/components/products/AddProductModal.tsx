// src/components/products/AddProductModal.tsx
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { createProduct } from "../../lib/api";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdded,
}) => {
  const [productName, setProductName] = useState("");
  const [initialStock, setInitialStock] = useState("0");
  const [initialPrice, setInitialPrice] = useState("0");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createProduct({
        name: productName,
        currentStock: parseInt(initialStock),
        lastBoughtPrice: parseFloat(initialPrice),
        lastSoldPrice: parseFloat(initialPrice),
      });

      onProductAdded();
      handleClose();
    } catch (error: any) {
      // Extract error message from the backend response
      setError(error.message || "Failed to create product. Please try again.");
    }
  };

  const handleClose = () => {
    setProductName("");
    setInitialStock("0");
    setInitialPrice("0");
    setError("");
    onClose();
  };

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
                    Shto Produkt
                  </Dialog.Title>

                  <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Product Name */}
                      <div>
                        <label
                          htmlFor="productName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Emri i produktit
                        </label>
                        <input
                          type="text"
                          id="productName"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                          autoFocus
                        />
                      </div>

                      {/* Initial Stock */}
                      <div>
                        <label
                          htmlFor="initialStock"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Sasia fillestare
                        </label>
                        <input
                          type="number"
                          id="initialStock"
                          value={initialStock}
                          onChange={(e) => setInitialStock(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          min="0"
                          required
                        />
                      </div>

                      {/* Initial Price */}
                      <div>
                        <label
                          htmlFor="initialPrice"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Çmimi fillestar (lek)
                        </label>
                        <input
                          type="number"
                          id="initialPrice"
                          value={initialPrice}
                          onChange={(e) => setInitialPrice(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          min="0"
                          step="1"
                          required
                        />
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
                          Shto produktin
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

export default AddProductModal;
