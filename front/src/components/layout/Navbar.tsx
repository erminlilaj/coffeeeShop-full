// src/components/layout/Navbar.tsx
import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { User, LogOut, Key } from 'lucide-react';
import { authService } from '../../lib/auth';

const Navbar = () => {
    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        authService.logout();
        // No need for additional redirection as it's handled in the logout method
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    {/* Left side - Navigation */}
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold">Coffee Shop</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <a href="/" className="inline-flex items-center px-1 pt-1 text-gray-900">
                                Produktet
                            </a>
                            <a href="/purchases" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                                Shitje/Blerjet
                            </a>
                           
                        </div>
                    </div>

                    {/* Right side - User menu */}
                    <div className="flex items-center">
                        <Menu as="div" className="ml-3 relative">
                            <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <User className="h-8 w-8 rounded-full p-1 bg-gray-100" />
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="/change-password"
                                                className={`${
                                                    active ? 'bg-gray-100' : ''
                                                } flex px-4 py-2 text-sm text-gray-700 items-center`}
                                            >
                                                <Key className="mr-2 h-4 w-4" />
                                                Ndroni FjaleKalimin Tuaj
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={`${
                                                    active ? 'bg-gray-100' : ''
                                                } flex px-4 py-2 text-sm text-gray-700 w-full items-center`}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Dilni
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;