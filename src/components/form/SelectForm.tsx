import React, { ReactNode } from 'react';
import {
  FieldError,
  UseFormRegister,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFormProps {
  label?: string;
  name: string;
  options: SelectOption[];
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  disabled?: boolean;
  icon?: ReactNode;
}

const SelectForm: React.FC<SelectFormProps> = ({
  label,
  name,
  options,
  register,
  error,
  placeholder,
  disabled,
  icon,
}) => {
  return (
    <div className="flex font-montserrat montserrat flex-col gap-1">
      {label && <label className="text-green-300 font-medium">{label}</label>}

      <div
        className={`flex items-center h-[56px] border rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-gray-300 ${
          error ? 'border-red-500' : 'border-green-300'
        }`}
      >
        <select
          {...register(name)}
          disabled={disabled}
          className="w-full text-sm h-full bg-transparent focus:outline-none"
        >
          {placeholder && (
            <option value="" >
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {icon}
      </div>

      {typeof error?.message === 'string' && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default SelectForm;
