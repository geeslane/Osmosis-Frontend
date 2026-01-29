'use client';
import {
  useForm,
  Controller,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import InputForm from '@/components/form/InputForm';
import Button from '@/components/ui/button/Button';
import 'react-datepicker/dist/react-datepicker.css';
import useToastify from '@/hooks/useToastify';
import { AddModuleSchema, EditModuleSchema } from '@/validation/schema';
import TextEditor from '@/components/Editors/TextEditors';
import FileUpload from '@/components/Editors/FileUpload';
import {
  useCreateModuleMutation,
  useUpdateModuleMutation,
} from '@/store/dashboard/dashboard.api';
import type { Module } from '@/components/types';

export type AddModuleFormInputs = {
  title: string;
  ModuleNumber: number;
  notes: string;
  additionalResources: string;
  deliverables: string;
  workbookFile: File[];
};

type AddModuleProps = {
  module?: Module | null;
};

export default function AddModule({ module = null }: AddModuleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToastify();
  const returnTab = searchParams.get('content') || 'Note';
  const [createModule, { isLoading: isCreating }] = useCreateModuleMutation();
  const [updateModule, { isLoading: isUpdating }] = useUpdateModuleMutation();
  const isEdit = !!module;
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddModuleFormInputs>({
    resolver: yupResolver(
      (isEdit ? EditModuleSchema : AddModuleSchema) as any
    ) as unknown as Resolver<AddModuleFormInputs>,
    defaultValues: {
      title: '',
      ModuleNumber: undefined as any,
      notes: '',
      additionalResources: '',
      deliverables: '',
      workbookFile: [],
    },
  });

  useEffect(() => {
    if (module) {
      reset({
        title: module.title,
        ModuleNumber: module.moduleNumber,
        notes: module.notes,
        additionalResources: module.additionalResources,
        deliverables: module.deliverables,
        workbookFile: [],
      });
    }
  }, [module, reset]);

  const onSubmit: SubmitHandler<AddModuleFormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('moduleNumber', String(data.ModuleNumber));
      formData.append('notes', data.notes);
      formData.append('additionalResources', data.additionalResources);
      formData.append('deliverables', data.deliverables);
      if (data.workbookFile?.length) {
        formData.append('workbookFile', data.workbookFile[0]);
      }

      if (isEdit && module) {
        await updateModule({ id: module.id, formData }).unwrap();
        showToast('Module updated successfully', 'success');
        router.push(`/dashboard/modules/${module.id}?content=${returnTab}`);
      } else {
        await createModule(formData).unwrap();
        showToast('Module added successfully', 'success');
        reset({
          title: '',
          ModuleNumber: undefined as any,
          notes: '',
          additionalResources: '',
          deliverables: '',
          workbookFile: [],
        });
      }
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to save module', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <InputForm
        label="Module Title"
        name="title"
        placeholder="Enter Module title"
        register={register}
        error={errors.title}
      />
      <InputForm
        label="Module Number"
        name="ModuleNumber"
        placeholder="Select a Number"
        register={register}
        error={errors.ModuleNumber}
        type="number"
      />
      <Controller
        name="notes"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextEditor
            label="Add Notes"
            value={field.value}
            onChange={field.onChange}
            error={errors.notes?.message}
          />
        )}
      />
      <Controller
        name="additionalResources"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextEditor
            label="Additional Resources (links to external articles, videos, etc)"
            value={field.value}
            onChange={field.onChange}
            error={errors.additionalResources?.message}
          />
        )}
      />
      <Controller
        name="deliverables"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextEditor
            label="Add Deliverable"
            value={field.value}
            onChange={field.onChange}
            error={errors.deliverables?.message}
          />
        )}
      />
      <Controller
        name="workbookFile"
        control={control}
        defaultValue={[]}
        render={() => (
          <FileUpload
            label={
              isEdit
                ? 'Workbook (optional – leave empty to keep current)'
                : 'Add Workbook'
            }
            name="workbookFile"
            register={register}
            error={errors.workbookFile as any}
            accept=".pdf,application/pdf"
            maxSize={10}
          />
        )}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={isLoading}
        isLoading={isLoading}
        className="py-4 font-medium"
      >
        {isEdit ? 'Save changes' : 'Save'}
      </Button>
    </form>
  );
}
