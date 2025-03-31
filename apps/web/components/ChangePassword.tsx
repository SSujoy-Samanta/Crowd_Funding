"use client";
import React, { SetStateAction, useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon, CheckCircleIcon, XCircleIcon} from 'lucide-react';
import axios from 'axios';
import { RxCrossCircled } from "react-icons/rx";
interface PasswordRequirement {
  regex: RegExp;
  text: string;
}

const ChangePasswordForm= ({
    setEdit,
    userId
}:{
    setEdit:React.Dispatch<SetStateAction<boolean>>
    userId:number
}) => {
 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password requirements
  const passwordRequirements: PasswordRequirement[] = [
    { regex: /.{8,}/, text: 'At least 8 characters long' },
    { regex: /[A-Z]/, text: 'At least one uppercase letter' },
    { regex: /[a-z]/, text: 'At least one lowercase letter' },
    { regex: /[0-9]/, text: 'At least one number' },
    { regex: /[^A-Za-z0-9]/, text: 'At least one special character' }
  ];

  const checkPasswordStrength = (password: string) => {
    return passwordRequirements.map(requirement => ({
      met: requirement.regex.test(password),
      text: requirement.text
    }));
  };

     const passwordStrength = checkPasswordStrength(newPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!newPassword) {
            setError('New password is required');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        
        const allRequirementsMet = passwordStrength.every(req => req.met);
        if (!allRequirementsMet) {
            setError('Password does not meet all requirements');
            return;
        }
    
        // Simulate API call
        try {
            setIsLoading(true);
            
            // Simulating API call with timeout
            const res =await axios.put('/api/password/change',{
                userId,
                password:newPassword
            })

            if(res.status!=200) return;
            
            setIsSuccess(true);
            
            // Reset form after success
            setTimeout(() => {
                setEdit(x=>!x)
                setNewPassword('');
                setConfirmPassword('');
                setIsSuccess(false);
            }, 2000);
        
        } catch (e:any) {
            if (e.response?.data?.errors) {
                setError( e.response?.data?.errors[0]?.message);
            } else {
                setError( e.response?.data?.msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-black relative">
        <motion.h2 
            className="text-2xl font-bold mb-6 text-center text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            Change Password
        </motion.h2>

        <div className='absolute top-2 right-2 cursor-pointer'>
            <RxCrossCircled onClick={()=>{setEdit(x=>!x)}}/>
        </div>
      
      
        {isSuccess && (
            <motion.div 
            className="mb-6 p-4 bg-green-100 text-green-700 rounded-md flex items-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Password changed successfully!
            </motion.div>
        )}
      
        {error && (
            <motion.div 
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-md flex items-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            >
                <XCircleIcon className="w-5 h-5 mr-2" />
                {error}
            </motion.div>
        )}
      
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="newPassword">
                New Password
            </label>
            <div className="relative">
                <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                />
                <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
                >
                {showNewPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
                </button>
            </div>
            </div>
            
            {newPassword && (
            <motion.div 
                className="mb-4 p-3 bg-gray-50 rounded-md"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
            >
                <p className="text-sm font-medium text-gray-700 mb-2">Password must have:</p>
                <ul className="space-y-1">
                {passwordStrength.map((requirement, index) => (
                    <motion.li
                    key={index}
                    className={`text-sm flex items-center ${requirement.met ? 'text-green-600' : 'text-gray-500'}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                    {requirement.met ? (
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                    ) : (
                        <XCircleIcon className="h-4 w-4 mr-2" />
                    )}
                    {requirement.text}
                    </motion.li>
                ))}
                </ul>
            </motion.div>
            )}
            
            <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                Confirm New Password
            </label>
            <div className="relative">
                <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : ''
                }`}
                disabled={isLoading}
                />
                <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                {showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
                </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
                <motion.p 
                className="mt-1 text-sm text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                >
                Passwords do not match
                </motion.p>
            )}
            </div>
            
            <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            >
            {isLoading ? (
                <div className="flex justify-center items-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Processing...
                </div>
            ) : (
                'Change Password'
            )}
            </motion.button>
        </form>
    </div>
  );
};

export default ChangePasswordForm;