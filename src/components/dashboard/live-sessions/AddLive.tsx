'use client';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { InferType } from 'yup';
import InputForm from '@/components/form/InputForm';
import Button from '@/components/ui/button/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useToastify from '@/hooks/useToastify';
import { AddLiveSessionSchema } from '@/validation/schema';

export type AddLiveSessionFormInputs = InferType<typeof AddLiveSessionSchema>;

export default function AddLive() {
  const { showToast } = useToastify();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AddLiveSessionFormInputs>({
    resolver: yupResolver(AddLiveSessionSchema) as any,
  });

  const onSubmit: SubmitHandler<AddLiveSessionFormInputs> = (data) => {
    console.log('Live Session Payload:', data);
    showToast('Live session added successfully', 'success');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <InputForm
        label="Live Session Topic"
        name="topic"
        placeholder="Enter session topic"
        register={register}
        error={errors.topic}
      />

      <div className="flex gap-3 w-full">
        <div className="flex font-montserrat w-full montserrat flex-col gap-1">
          <label className="text-green-300 font-medium">Date </label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={
                  field.value &&
                  typeof field.value === 'string' &&
                  field.value.trim() !== ''
                    ? new Date(field.value)
                    : null
                }
                onChange={(date: Date | null) => {
                  if (date) {
                    const formattedDate = date.toISOString().split('T')[0];
                    field.onChange(formattedDate);
                    setValue('date', formattedDate, {
                      shouldValidate: true,
                    });
                  } else {
                    field.onChange('');
                  }
                }}
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                placeholderText="Select date of birth"
                className={`w-full h-[56px] text-sm focus:outline-none bg-transparent border rounded-md focus-within:ring-1 focus-within:ring-gray-300 px-3 ${
                  errors.date ? 'border-red-500' : 'border-green-300'
                }`}
              />
            )}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">
              {typeof errors.date.message === 'string'
                ? errors.date.message
                : 'Date of birth is required'}
            </p>
          )}
        </div>

        <InputForm
          label="Time"
          name="time"
          register={register}
          error={errors.time}
          type="time"
        />
      </div>

      <InputForm
        label="Live Session URL"
        name="url"
        placeholder="https://"
        register={register}
        error={errors.url}
      />

      <InputForm
        label="Guest Speaker Name"
        name="speakerName"
        placeholder="Enter guest speaker name"
        register={register}
        error={errors.speakerName}
      />

      <InputForm
        label="Bio"
        name="bio"
        placeholder="Tell us about the guest speaker..."
        register={register}
        error={errors.bio}
        as="textarea"
        rows={4}
      />

      <InputForm
        label="LinkedIn URL (optional)"
        name="linkedinUrl"
        placeholder="https://linkedin.com/in/..."
        register={register}
        error={errors.linkedinUrl}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        className="py-4 font-medium"
      >
        Save
      </Button>
    </form>
  );
}
