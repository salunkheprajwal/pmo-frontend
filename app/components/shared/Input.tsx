import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-3 py-2 text-sm text-foreground border rounded-lg focus:ring-2 transition-all outline-none ${
          error 
            ? 'border-danger focus:ring-danger/20' 
            : 'border-muted focus:ring-accent/20 focus:border-accent'
        } ${className}`}
      />
      {error && (
        <p className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
