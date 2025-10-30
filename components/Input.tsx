import React from 'react';

type Props = {
  id: string;
  label?: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  error?: string | null;
};

export default function Input({ id, label, type = 'text', value, placeholder, onChange, error }: Props) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-large text-black mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 block w-full rounded-3xl border-black shadow-md focus:ring-red-500 focus:border-grey-500 sm:text-sm px-3 py-2 ${
          error ? 'border-red-500' : ''
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
