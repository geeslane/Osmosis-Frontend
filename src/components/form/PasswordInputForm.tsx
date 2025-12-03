'use client';
import { useState } from 'react';
import InputForm from './InputForm';
import { EyeCloseIcon, EyeIcon } from '@/assets/icons';

interface PasswordInputFormProps {
  name: string;
  placeholder: string;
  register: any;
  error?: any;
  label?: string;
}

export default function PasswordInputForm({
  name,
  placeholder,
  register,
  error,
  label,
}: PasswordInputFormProps) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((prev) => !prev);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 font-medium text-gray-500">{label}</label>
      )}
      <div className="relative">
        <InputForm
          name={name}
          placeholder={placeholder}
          register={register}
          error={error}
          type={visible ? 'text' : 'password'}
        />
        <span
          onClick={toggleVisibility}
          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-8"
        >
          {visible ? (
            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
          ) : (
            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
          )}
        </span>
      </div>
    </div>
  );
}
