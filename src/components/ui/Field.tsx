import { ReactNode, useId } from 'react';

export function DataField({ label, value, className = '' }: { label: string; value: string | number; className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="font-medium text-gray-800 break-words">{value}</p>
    </div>
  );
}

export function InputField({
  label,
  value,
  placeholder,
  disabled = false,
  name,
  type = 'text',
  onChange,
  className = ''
}: {
  label: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  const id = useId();

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-lg text-sm transition-all outline-none ${
          disabled
            ? 'bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed font-medium'
            : 'bg-white border-gray-300 text-gray-800 hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
        }`}
      />
    </div>
  );
}

export function SelectField({
  label,
  options,
  selected,
  placeholder,
  name,
  onChange,
  className = ''
}: {
  label: string;
  options: string[];
  selected?: string;
  placeholder?: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}) {
  const id = useId();

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={selected ?? ''}
          onChange={onChange}
          className="w-full appearance-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  className = ''
}: {
  label: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}) {
  const id = useId();

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
        {label}
      </label>
      <textarea
        id={id}
        value={value ?? ''}
        onChange={onChange}
        rows={4}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
      />
    </div>
  );
}
