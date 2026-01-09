'use client';
import React, { useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputForm from '@/components/form/InputForm';
import Button from '@/components/ui/button/Button';
import { EmailIcon, PhoneIcon, LocationIcon, CameraIcon } from '@/assets/icons';
import useToastify from '@/hooks/useToastify';
import Image from 'next/image';
import { AddAdminSchema } from '@/validation/schema';

interface AddAdminFormInputs {
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  address?: string | null;
}
export default function AddAdmin() {
  const { showToast } = useToastify();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddAdminFormInputs>({
    resolver: yupResolver(AddAdminSchema) as any,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = (f: File | null) => {
    if (!f) {
      setPreview(null);
      setFile(null);
      return;
    }
    setPreview(URL.createObjectURL(f));
    setFile(f);
  };

  const onSubmit: SubmitHandler<AddAdminFormInputs> = (data) => {
    console.log('Add Admin payload', { ...data, file });
    showToast('Admin added successfully', 'success');
    reset();
    setPreview(null);
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col  gap-2">
        <div
          onClick={() => fileRef.current?.click()}
          className="flex h-[84px] w-[84px] items-center justify-center rounded-full border border-green-200 cursor-pointer"
        >
          {preview ? (
            <Image
              src={preview}
              alt="preview"
              width={80}
              height={80}
              className="h-[80px] w-[80px] rounded-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <CameraIcon />
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm  text-start text-green-100 font-medium mt-1"
        >
          Upload Photo
        </button>

        {file && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
        <InputForm
          label={
            <>
              Full Name <span className="text-red-500">*</span>
            </>
          }
          name="fullName"
          placeholder="Type Full Name"
          register={register}
          error={errors.fullName}
        />

        <InputForm
          label={
            <>
              Email <span className="text-red-500">*</span>
            </>
          }
          name="email"
          placeholder="example@gmail.com"
          register={register}
          error={errors.email}
          type="email"
          icon={<EmailIcon />}
        />

        <InputForm
          label="Phone Number"
          name="phoneNumber"
          placeholder="0000-000-0000"
          register={register}
          error={errors.phoneNumber}
          type="text"
          icon={<PhoneIcon />}
        />

        <InputForm
          label="Address/Location"
          name="address"
          placeholder="Type your Location"
          register={register}
          error={errors.address}
          type="text"
          icon={<LocationIcon />}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="py-4 font-medium"
          >
            Add Admin
          </Button>
        </div>
      </div>
    </form>
  );
}
