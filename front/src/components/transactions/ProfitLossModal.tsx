import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import React from "react";

// Modal Component for Profit/Loss Calculation
const ProfitLossModal = ({ isOpen, onClose, profit, period }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="text-center">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Fitimi/Humbja për {period}
                </Dialog.Title>

                <div className="mt-4 text-xl font-bold">
                  {profit >= 0 ? (
                    <span className="text-green-600">
                      + Lek {profit.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-red-600">
                      - Lek {Math.abs(profit).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="mt-4 text-gray-600">
                  {profit >= 0
                    ? "Ju keni realizuar fitim në këtë periudhë."
                    : "Keni pësuar një humbje në këtë periudhë."}
                </div>

                <div className="mt-5 flex justify-center">
                  <button
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                    onClick={onClose}
                  >
                    Mbyll
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProfitLossModal;
