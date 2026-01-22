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

export type AddModuleFormInputs = {
  topic: string;
  ModuleNumber: number;
  notes: string;
  resources: string;
  deliverables: string;
  workbook: File[];
};

export default function AddModule() {
  const { showToast } = useToastify();

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

  const onSubmit: SubmitHandler<AddModuleFormInputs> = (data) => {
    console.log('Module Payload:', data);
    showToast('Module added successfully', 'success');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <InputForm
        label="Module Title"
        name="topic"
        placeholder="Enter Module topic"
        register={register}
        error={errors.topic}
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
        name="resources"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextEditor
            label="Additional Resources (links to external articles, videos, etc)"
            value={field.value}
            onChange={field.onChange}
            error={errors.resources?.message}
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
        name="workbook"
        control={control}
        defaultValue={[]}
        render={() => (
          <FileUpload
            label="Add Workbook"
            name="workbook"
            register={register}
            error={errors.workbook as any}
            accept=".pdf,application/pdf"
            maxSize={10}
          />
        )}
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
