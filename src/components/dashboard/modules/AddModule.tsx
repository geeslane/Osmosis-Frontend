'use client';
import {
  useForm,
  Controller,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputForm from '@/components/form/InputForm';
import Button from '@/components/ui/button/Button';
import 'react-datepicker/dist/react-datepicker.css';
import useToastify from '@/hooks/useToastify';
import { AddModuleSchema } from '@/validation/schema';
import TextEditor from '@/components/Editors/TextEditors';
import FileUpload from '@/components/Editors/FileUpload';
import { useCreateModuleMutation } from '@/store/dashboard/dashboard.api';

export type AddModuleFormInputs = {
  title: string;
  ModuleNumber: number;
  notes: string;
  additionalResources: string;
  deliverables: string;
  workbookFile: File[];
};

export default function AddModule() {
  const { showToast } = useToastify();
  const [createModule, { isLoading }] = useCreateModuleMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddModuleFormInputs>({
    resolver: yupResolver(
      AddModuleSchema
    ) as unknown as Resolver<AddModuleFormInputs>,
  });

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
      await createModule(formData).unwrap();
      showToast('Module added successfully', 'success');
      reset({
        title: '',
        ModuleNumber: undefined,
        notes: '',
        additionalResources: '',
        deliverables: '',
        workbookFile: [], // ✅ clears file
      });
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to create module', 'error');
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
            label="Add Workbook"
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
        Save
      </Button>
    </form>
  );
}
