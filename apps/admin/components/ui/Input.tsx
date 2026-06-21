"use client";

import React from "react";

type InputProps = {
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  textarea?: boolean;
  rows?: number;
  name?: string;
};

export default function Input({
  label,
  error,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  required,
  disabled,
  textarea,
  rows = 3,
  name,
}: InputProps) {
  const inputClasses = `input-field ${error ? "border-admin-danger focus:ring-admin-danger" : ""} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-admin-danger ml-1">*</span>}
        </label>
      )}
      {textarea ? (
        <textarea
          name={name}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          rows={rows}
        />
      ) : (
        <input
          name={name}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      )}
      {error && <p className="text-xs text-admin-danger mt-1">{error}</p>}
    </div>
  );
}
