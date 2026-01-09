/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EmailIcon,
  LoadingIcon,
  PhoneIcon,
} from '@/assets/icons';
import Image from 'next/image';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputForm from '../form/InputForm';
import { RegisterFormSchema } from '@/validation/schema';
import { useRegisterUserMutation } from '@/store/auth/auth.api';
import useToastify from '@/hooks/useToastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SelectForm from '../form/SelectForm';
import FileUpload from '../form/FileUpload';
import { Modal } from '../ui/modal';

type RegisterFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  parentFullName: string;
  parentEmail: string;
  parentPhoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  hobbies: string;
  class: string;
};

export const TeenagerSignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [parentEmail, setParentEmail] = useState("");
  const router = useRouter();
  const { showToast } = useToastify();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(RegisterFormSchema),
    mode: 'onTouched',
  });

  const totalSteps = 4;

  const nextStep = async () => {
    const stepFields: Record<number, (keyof RegisterFormData)[]> = {
      1: ['fullName', 'email', 'phoneNumber'],
      2: ['parentFullName', 'parentEmail', 'parentPhoneNumber'],
      3: ['dateOfBirth', 'gender'],
      4: ['class', 'address', 'hobbies'],
    };

    const isValid = await trigger(stepFields[currentStep]);

    if (isValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setParentEmail(data.parentEmail);

    try {
      const payload: any = {
        full_name: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        parentFullName: data.parentFullName,
        parentEmail: data.parentEmail,
        parentPhoneNumber: data.parentPhoneNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        class: data.class,
        hobbies: data.hobbies,
        address: data.address,
      };

      console.log('Form Data:', data);
      console.log('Payload:', payload);
      //const response = await registerUser(payload).unwrap();
      //showToast(response.message, 'success');
      setShowSuccess(true);
      // router.replace('/signin');
    } catch (error: any) {
      const message = error?.data?.message || error?.error || 'Signup failed';
      showToast(message, 'error');
    }
  };

  return (
    <div className="w-full overflow-scroll max-h-[90vh] no-scrollbar font-montserrat montserrat">
      <Image className='my-[40px] mx-auto md:mx-0' src={'/image/logo.png'} alt="" width={151} height={32} />
      <div className="flex flex-col mt-6 gap-7">
        <div>
          <h3 className="text-[32px] md:text-[40px] text-center md:text-left text-green-200 font-bold">
            Welcome Here!
          </h3>
          <p className="text-[#37445D] font-medium text-xl text-center md:text-left">
            Sign Up to join the Osmosis Teenager&apos;s Lab
          </p>
        </div>

        {/* Progress */}
        <div className="mb-2 flex max-w-[900px] flex-col w-full mt-3">
          <div className="flex items-center w-full justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex w-full items-center">
                <div
                  className={`w-5 h-5 text-sm rounded-full flex items-center justify-center font-medium transition-all duration-300 ${step < currentStep
                    ? 'bg-green-100 text-white'
                    : step === currentStep
                      ? 'bg-green-300 text-white'
                      : 'bg-gray-200 px-2 text-gray-500'
                    }`}
                >
                  {step < currentStep ? <CheckIcon /> : step}
                </div>

                {step < 4 && (
                  <div
                    className={`h-1 flex-1 w-full mx-2 sm:mx-3 rounded-full ${step < currentStep ? 'bg-green-100' : 'bg-gray-200'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-start mt-5">
            <h2 className="text-sm font-bold text-green-200">
              {currentStep === 1 && 'Teenager\'s Information'}
              {currentStep === 2 && 'Parent /Guardian\'s Details'}
              {currentStep === 3 && 'Teenager\'s Personal Details'}
              {currentStep === 4 && 'Teenager\'s Contact & Location'}
            </h2>
          </div>
        </div>
        <div className="bg-white">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="w-full space-y-6"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <InputForm
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter teenager's full name"
                  register={register}
                  error={errors.fullName}
                />

                <InputForm
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter teenager's email address"
                  register={register}
                  error={errors.email}
                  icon={<EmailIcon />}
                />
                <InputForm
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="Teenager's phone number"
                  register={register}
                  error={errors.phoneNumber}
                  icon={<PhoneIcon />}
                />
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-6">
                <InputForm
                  label="Parent/Guardian's Full Name"
                  name="parentFullName"
                  placeholder="Enter full name"
                  register={register}
                  error={errors.parentFullName}
                />

                <InputForm
                  label="Parent/Guardian's Email"
                  name="parentEmail"
                  type="email"
                  placeholder="Enter email address"
                  register={register}
                  error={errors.parentEmail}
                  icon={<EmailIcon />}
                />
                <InputForm
                  label="Parent/Guardian's Phone Number"
                  name="parentPhoneNumber"
                  placeholder="Enter phone nunber"
                  register={register}
                  error={errors.parentPhoneNumber}
                  icon={<PhoneIcon />}
                />
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex font-montserrat montserrat flex-col gap-1">
                  <label className="text-green-300 font-medium">Teenager&apos;s Date Of Birth</label>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date: Date | null) => {
                          if (date) {
                            const formattedDate = date.toISOString().split('T')[0];
                            field.onChange(formattedDate);
                            setValue('dateOfBirth', formattedDate, {
                              shouldValidate: true,
                            });
                          }
                        }}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()}
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        placeholderText="Select date of birth"
                        className={`w-full h-[56px] text-sm focus:outline-none bg-transparent border rounded-md focus-within:ring-1 focus-within:ring-gray-300 px-3 ${errors.dateOfBirth ? 'border-red-500' : 'border-green-300'
                          }`}
                      />
                    )}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">
                      {typeof errors.dateOfBirth.message === 'string'
                        ? errors.dateOfBirth.message
                        : 'Date of birth is required'}
                    </p>
                  )}
                </div>
                <SelectForm
                  label="Teenager's Gender"
                  name="gender"
                  placeholder="Select gender"
                  register={register}
                  error={errors.gender}
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                    { label: 'Prefer not to say', value: 'prefer-not-to-say' },
                  ]}
                />
                <FileUpload
                  label="Teenager's Picture"
                  accept="image/png,image/jpeg"
                  widthHint="800×400px"
                  maxSizeMB={2}
                  onFileSelect={(file) => console.log(file)}
                />
              </div>
            )}
            {currentStep === 4 && (
              <div className="space-y-6">
                <InputForm
                  label="Teenager's Address"
                  name="address"
                  placeholder="Enter address"
                  register={register}
                  error={errors.address}
                />

                <InputForm
                  label="Teenager's Hobbies"
                  name="hobbies"
                  placeholder="Enter hobbies"
                  register={register}
                  error={errors.hobbies}
                />

                <InputForm
                  label="Teenager's Class"
                  name="class"
                  placeholder="Enter current class at school"
                  register={register}
                  error={errors.class}
                />
              </div>
            )}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center px-4 py-3 text-sm font-medium text-green-300 border border-green-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon /> Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-4 py-3 text-sm font-medium text-white bg-green-100 rounded-xl"
                >
                  Next
                  <ChevronRightIcon />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center max-w-[250px] px-4 py-3 text-sm font-medium text-white bg-green-100 rounded-xl shadow-theme-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <LoadingIcon width="20" height="20" />
                  ) : (
                    <>
                      <CheckIcon /> Create Account
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="flex dm-sans text-[#0F1C24] text-[15px] font-semibold items-center justify-center mt-6 pb-4">
          <span>Already have an account?</span>
          <Link href="/signin" className="text-green-100 ml-1 hover:text-green-200 transition-colors">
            Sign in
          </Link>
        </div>
      </div>

      <Modal isOpen={showSuccess} onClose={handleCloseModal} className="w-[600px]">
        <div className="flex justify-center items-center flex-col">
          <h3 className="text-center text-green-200 text-[32px] font-bold">
            Registration Successful!
          </h3>
          <Image
            src={'/image/cong.jpg'}
            alt=""
            width={300}
            height={100}
            className="object-cover"
          />
          <h3 className="text-green-200 font-medium text-center">
            Kindly check the registered Parent or Guardian&apos;s email ({parentEmail}) for more details regarding the onboarding process.
          </h3>
          <Link href={'/'} className="mt-7 underline text-green-100 text-center">
            View Our Brochure & Pricing Here{' '}
          </Link>
        </div>
      </Modal>
    </div>
  );
};
