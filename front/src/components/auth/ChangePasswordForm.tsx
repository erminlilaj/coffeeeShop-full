import React, { useState } from 'react';
import axios from 'axios';
import { authService } from '../../lib/auth';

const ChangePasswordForm = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/auth/updatePassword',
                { newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${authService.getToken()}`
                    }
                }
            );
            setSuccess('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update password. Please try again.');
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                        minLength={6}
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                        minLength={6}
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm mt-2">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-green-500 text-sm mt-2">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordForm;