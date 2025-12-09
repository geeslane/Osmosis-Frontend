import React from 'react';
import { FieldError, UseFormRegister, FieldErrorsImpl, Merge } from 'react-hook-form';

interface InputFormProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  disabled?: boolean;
}


const InputForm: React.FC<InputFormProps> = ({
  label,
  name,
  type,
  register,
  error,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium">{label}</label>}

      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={`w-full text-sm h-[56px] rounded-md p-3 border focus:outline-none focus:ring-1 focus:ring-gray-300 ${error ? "border-red-500" : "border-gray-200"
          }`}
      />

      {typeof error?.message === 'string' && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}

    </div>
  );
};

export default InputForm;
