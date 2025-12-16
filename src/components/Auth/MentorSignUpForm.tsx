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
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputForm from '../form/InputForm';
import {
  RegisterFormSchema,
  RegisterMentorFormSchema,
} from '@/validation/schema';
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
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  address: string;
  occupation: string;
  topic: string;
  inspires: string;
};

export const MentorSignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const { showToast } = useToastify();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(RegisterMentorFormSchema),
    mode: 'onTouched',
  });

  const totalSteps = 4;

  const nextStep = async () => {
    const stepFields: Record<number, (keyof RegisterFormData)[]> = {
      1: ['fullName', 'email', 'phoneNumber'],
      2: ['dateOfBirth', 'gender'],
      3: ['address', 'occupation'],
      4: ['topic', 'inspires'],
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
    try {
      const payload: any = {
        full_name: data.fullName,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        address: data.address,
        occupation: data.occupation,
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
    <div className="w-full overflow-scroll max-h-[70vh] no-scrollbar font-montserrat montserrat">
      <Image src="/image/logo.png" alt="Logo" width={151} height={32} />

      <div className="flex flex-col mt-6 gap-7">
        <div>
          <h3 className="text-[40px] text-green-200 font-bold">
            Welcome Here!
          </h3>
          <p className="text-[#37445D] font-medium text-xl">Sign up to start</p>
        </div>

        {/* Progress */}
        <div className="mb-2">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-5 h-5 text-sm rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                    step < currentStep
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
                    className={`h-1 w-20 mx-3 rounded-full ${
                      step < currentStep ? 'bg-green-100' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl">
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
                  placeholder="Enter your full name"
                  register={register}
                  error={errors.fullName}
                />

                <InputForm
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  register={register}
                  error={errors.email}
                  icon={<EmailIcon />}
                />
                <InputForm
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="+234..."
                  register={register}
                  error={errors.phoneNumber}
                  icon={<PhoneIcon />}
                />
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-6">
                <InputForm
                  type="date"
                  label="Date Of Birth"
                  name="dateOfBirth"
                  placeholder="Enter your address (optional)"
                  register={register}
                  error={errors.dateOfBirth}
                />
                <SelectForm
                  label="Gender"
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
                  label="Picture"
                  accept="image/png,image/jpeg"
                  widthHint="800×400px"
                  maxSizeMB={2}
                  onFileSelect={(file) => console.log(file)}
                />
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6">
                <InputForm
                  label="Address/Location"
                  name="address"
                  placeholder="Type Your Location"
                  register={register}
                  error={errors.address}
                />

                <InputForm
                  label="Occupation"
                  name="occupation"
                  placeholder="Type Your Location"
                  register={register}
                  error={errors.occupation}
                />
              </div>
            )}
            {currentStep === 4 && (
              <div className="space-y-6">
                <InputForm
                  label="What inspire you to be a teens mentort?"
                  name="inspires"
                  placeholder="Type it Here"
                  register={register}
                  error={errors.inspires}
                  as="textarea"
                  rows={4}
                />

                <SelectForm
                  label="Mentorship Topics of Interest"
                  name="topic"
                  placeholder="Select Topic"
                  register={register}
                  error={errors.topic}
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                    { label: 'Prefer not to say', value: 'prefer-not-to-say' },
                  ]}
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

            <div className="flex dm-sans text-[#0F1C24] text-[15px] font-medium items-center justify-center mt-4">
              <span>Already have an account?</span>
              <Link href="/signin" className="text-green-100 ml-1">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Modal isOpen={showSuccess} onClose={handleCloseModal}>
        <div className="flex justify-center items-center flex-col">
          <h3 className="text-center text-green-200 text-[32px] font-bold">
            Congrats!
          </h3>
          <Image
            src={'/image/cong.jpg'}
            alt=""
            width={300}
            height={100}
            className="object-cover"
          />
          <h3 className="text-green-200 font-medium text-center">
            We’ve got your details, our team will reach out soon. Get ready,
            your dashboard is coming!
          </h3>
          <Link href={'/'} className="mt-7 underline text-green-100">
            View Our Pricing{' '}
          </Link>
        </div>
      </Modal>
    </div>
  );
};
