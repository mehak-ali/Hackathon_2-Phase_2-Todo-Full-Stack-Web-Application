import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  errorMessage?: string;
}

const Input: React.FC<InputProps> = ({ label, id, errorMessage, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-light mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
          focus:outline-none focus:ring-primary focus:border-primary sm:text-sm
          ${errorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        aria-invalid={errorMessage ? 'true' : 'false'}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
        {...props}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;
