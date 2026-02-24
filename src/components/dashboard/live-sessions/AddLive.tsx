'use client';

import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { InferType } from 'yup';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import InputForm from '@/components/form/InputForm';
import TimePicker from '@/components/form/TimePicker';
import Button from '@/components/ui/button/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useToastify from '@/hooks/useToastify';
import { toDatetimeISO } from '@/lib/liveSessions';
import { liveSessionsApi } from '@/lib/liveSessionsApi';
import { AddLiveSessionSchema } from '@/validation/schema';
import { normalizeImageUrl } from '@/utils/helper';

export type AddLiveSessionFormInputs = InferType<typeof AddLiveSessionSchema>;

type AddLiveProps = {
  initialData?: AddLiveSessionFormInputs;
  sessionId?: string;
  onSuccess?: () => void;
  onSaved?: () => void;
};

export default function AddLive({
  initialData,
  sessionId,
  onSuccess,
  onSaved,
}: AddLiveProps) {
  const { showToast } = useToastify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const pictureInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = Boolean(sessionId && initialData);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AddLiveSessionFormInputs>({
    resolver: yupResolver(AddLiveSessionSchema) as any,
    defaultValues: initialData ?? { time: '12:00 AM' },
  });

  const onSubmit: SubmitHandler<AddLiveSessionFormInputs> = async (values) => {
    const datetime = toDatetimeISO(values.date, values.time);
    setIsSubmitting(true);
    try {
      if (isEditMode && sessionId) {
        await liveSessionsApi.update(
          sessionId,
          {
            topic: values.topic,
            datetime,
            url: values.url,
            speakerName: values.speakerName,
            bio: values.bio,
            linkedinUrl: values.linkedinUrl || undefined,
          },
          pictureFile || undefined
        );
        showToast('Live session updated successfully', 'success');
        setPictureFile(null);
        onSaved?.();
      } else {
        await liveSessionsApi.create(
          {
            topic: values.topic,
            datetime,
            url: values.url,
            speakerName: values.speakerName,
            bio: values.bio,
            linkedinUrl: values.linkedinUrl || undefined,
          },
          pictureFile || undefined
        );
        showToast('Live session added successfully', 'success');
        reset();
        setPictureFile(null);
        onSuccess?.();
      }
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
          ? (err as { response: { data: { message: string } } }).response.data.message
          : isEditMode
            ? 'Failed to update session'
            : 'Failed to create session';
      showToast(String(message), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPictureUrl = initialData?.pictureUrl;
  const hasCurrentPicture =
    currentPictureUrl &&
    typeof currentPictureUrl === 'string' &&
    currentPictureUrl.trim() !== '';
  const normalizedCurrentPicture = hasCurrentPicture
    ? normalizeImageUrl(currentPictureUrl as string)
    : null;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pictureFile) {
      const url = URL.createObjectURL(pictureFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [pictureFile]);

  const imageToShow = pictureFile
    ? previewUrl
    : hasCurrentPicture && normalizedCurrentPicture
      ? (normalizedCurrentPicture as string)
      : null;

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > 2 * 1024 * 1024) {
      showToast('File must be less than 2MB', 'error');
      return;
    }
    setPictureFile(file);
    e.target.value = '';
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
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                placeholderText="Select date"
                className={`w-full h-[56px] text-sm focus:outline-none bg-transparent border rounded-md focus-within:border-green-300 focus-within:outline-none px-3 ${
                  errors.date ? 'border-red-500' : 'border-green-300'
                }`}
              />
            )}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">
              {typeof errors.date.message === 'string'
                ? errors.date.message
                : 'Date is required'}
            </p>
          )}
        </div>

        <Controller
          name="time"
          control={control}
          render={({ field }) => (
            <TimePicker
              label="Time"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                setValue('time', value, { shouldValidate: true });
              }}
              onBlur={field.onBlur}
              error={errors.time}
            />
          )}
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

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-green-300">
          Guest Speaker&apos;s Picture
        </label>
        <div className="rounded-lg border border-[#D0D5DD] overflow-hidden bg-[#F9FAFB] max-w-[280px]">
          {imageToShow ? (
            <div className="relative">
              <Image
                src={imageToShow}
                alt="Guest speaker"
                width={280}
                height={160}
                className="w-full h-auto object-cover"
              />
              <button
                type="button"
                onClick={() => pictureInputRef.current?.click()}
                className="absolute bottom-2 left-2 right-2 py-1.5 text-xs font-medium text-white bg-black/60 hover:bg-black/75 rounded-md transition-colors"
              >
                Change picture
              </button>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => pictureInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && pictureInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 py-10 px-6 cursor-pointer border-0 border-none hover:bg-[#F1F5F9] transition-colors"
            >
              <p className="text-sm font-medium text-[#667085]">
                Click to upload image
              </p>
              <p className="text-xs text-[#98A2B3]">
                PNG or JPEG · max 2MB
              </p>
            </div>
          )}
        </div>
        <input
          ref={pictureInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={handlePictureChange}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        className="py-4 font-medium"
        isLoading={isSubmitting}
      >
        {isEditMode ? 'Update' : 'Save'}
      </Button>
    </form>
  );
}
