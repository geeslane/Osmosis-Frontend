import React, { ReactNode } from 'react';
import {
  FieldError,
  UseFormRegister,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form';

interface InputFormProps {
  label?: ReactNode;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  disabled?: boolean;
  icon?: ReactNode;
  as?: 'input' | 'textarea';
  rows?: number;
}

const InputForm: React.FC<InputFormProps> = ({
  label,
  name,
  type = 'text',
  register,
  error,
  icon,
  placeholder,
  as = 'input',
  rows = 3,
}) => {
  const baseClasses = 'w-full text-sm focus:outline-none bg-transparent';

  return (
    <div className="flex font-montserrat montserrat flex-col gap-1">
      {label && <label className="text-green-300 font-medium">{label}</label>}

      <div
        className={`flex items-center border rounded-md focus-within:ring-1 focus-within:ring-gray-300 px-3 ${
          as === 'textarea' ? 'py-2' : 'h-[56px]'
        } ${error ? 'border-red-500' : 'border-green-300'}`}
      >
        {as === 'textarea' ? (
          <textarea
            {...register(name)}
            placeholder={placeholder}
            rows={rows}
            className={`${baseClasses} resize-none`}
          />
        ) : (
          <input
            type={type}
            {...register(name)}
            placeholder={placeholder}
            className={`${baseClasses} h-full`}
          />
        )}

        {icon}
      </div>

      {typeof error?.message === 'string' && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default InputForm;
