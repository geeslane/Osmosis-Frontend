'use client';
import {
  useForm,
  Controller,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
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
  /** When editing: true = user chose to remove the existing workbook */
  removeWorkbook?: boolean;
};

type AddModuleProps = {
  module?: Module | null;
};

export default function AddModule({ module = null }: AddModuleProps) {
  const router = useRouter();
  const { showToast } = useToastify();
  const [createModule, { isLoading: isCreating }] = useCreateModuleMutation();
  const [updateModule, { isLoading: isUpdating }] = useUpdateModuleMutation();
  const isEdit = !!module;
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
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
      removeWorkbook: false,
    },
  });

  const removeWorkbook = watch('removeWorkbook');
  const watchedWorkbookFile = watch('workbookFile');

  useEffect(() => {
    const files = watchedWorkbookFile as FileList | File[] | undefined;
    if (files?.length && files[0] instanceof File && removeWorkbook) {
      setValue('removeWorkbook', false);
    }
  }, [watchedWorkbookFile, removeWorkbook, setValue]);

  useEffect(() => {
    if (module) {
      reset({
        title: module.title,
        ModuleNumber: module.moduleNumber,
        notes: module.notes,
        additionalResources: module.additionalResources,
        deliverables: module.deliverables,
        workbookFile: [],
        removeWorkbook: false,
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
      const workbookFiles = data.workbookFile as FileList | File[] | undefined;
      const firstFile = workbookFiles?.length ? workbookFiles[0] : null;
      const hasNewFile = firstFile instanceof File;
      if (hasNewFile) {
        formData.append('workbookFile', firstFile);
      } else if (isEdit && data.removeWorkbook) {
        // PATCH /module/:id – backend removes workbook when removeWorkbook=true (no workbookFile)
        formData.append('removeWorkbook', 'true');
      }

      if (isEdit && module) {
        await updateModule({ id: module.id, formData }).unwrap();
        showToast('Module updated successfully', 'success');
        router.push('/dashboard/modules');
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
        router.push('/dashboard/modules');
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
      <div className="space-y-3">
        {isEdit && module?.workbookFile && (
          <div className="flex flex-col gap-2 font-montserrat">
            <span className="text-base font-medium text-[#282F2E]">
              Current workbook
            </span>
            {removeWorkbook ? (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-800">
                <span>Workbook will be removed when you save.</span>
                <button
                  type="button"
                  onClick={() => setValue('removeWorkbook', false)}
                  className="font-medium text-green-200 underline hover:no-underline"
                >
                  Undo
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3">
                <span className="text-sm text-gray-700">
                  A workbook file is attached.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setValue('removeWorkbook', true);
                    setValue('workbookFile', []);
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-700 underline"
                >
                  Remove workbook
                </button>
              </div>
            )}
          </div>
        )}
        <Controller
          key={removeWorkbook ? 'workbook-removed' : 'workbook-active'}
          name="workbookFile"
          control={control}
          defaultValue={[]}
          render={() => (
            <FileUpload
              label={
                isEdit
                  ? 'Workbook (optional – leave empty to keep current, or choose to replace)'
                  : 'Add Workbook'
              }
              name="workbookFile"
              register={register}
              error={errors.workbookFile as any}
              accept=".pdf,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              maxSize={10}
              variant="document"
            />
          )}
        />
      </div>

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
