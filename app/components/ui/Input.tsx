import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = "", id, ...props }) => {
  return (
    <div className="w-full space-y-1">
      <label htmlFor={id} className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white transition ${
          error ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};