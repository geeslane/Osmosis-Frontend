'use client';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EmailIcon,
  LoadingIcon,
  PhoneIcon,
  CalendarIcon,
} from '@/assets/icons';
import Image from 'next/image';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputForm from '../form/InputForm';
import { RegisterMentorFormSchema } from '@/validation/schema';
import { useRegisterMentorMutation } from '@/store/auth/auth.api';
import useToastify from '@/hooks/useToastify';
import Link from 'next/link';
import SelectForm from '../form/SelectForm';
import FileUpload from '../form/FileUpload';
import { Modal } from '../ui/modal';
import { useDropdowns } from '@/hooks/useDropDownApi';
import { RegisterFormData } from '../types';
import {
  formatDateToYmd,
  getMentorMaxDateOfBirth,
  isMentorTooYoung,
  MENTOR_MIN_AGE_MESSAGE,
} from '@/utils/signupDateLimits';

const MARITAL_STATUS_OPTIONS = [
  { label: 'Single', value: 'Single' },
  { label: 'Married', value: 'Married' },
];

const MEANS_OF_VERIFICATION_OPTIONS = [
  { label: 'NIN', value: 'NIN' },
  { label: 'Passport', value: 'Passport' },
  { label: "Driver's License", value: "Driver's License" },
  { label: 'Other', value: 'Other' },
];

const VERIFICATION_DOCUMENT_ACCEPT =
  'image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf';

export const MentorSignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [verificationDocument, setVerificationDocument] = useState<File | null>(
    null
  );
  const [pictureError, setPictureError] = useState('');
  const [verificationDocumentError, setVerificationDocumentError] =
    useState('');
  const { showToast } = useToastify();
  const [registerMentor, { isLoading }] = useRegisterMentorMutation();
  const { dropdowns, isLoading: isDropdownsLoading } = useDropdowns([
    'gender',
    'mentorship-topics',
  ]);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(RegisterMentorFormSchema),
    mode: 'onTouched',
    defaultValues: {
      mentorshipTopics: [],
      maritalStatus: '',
      meansOfVerification: '',
      linkedin: '',
    },
  });

  const selectedTopics = watch('mentorshipTopics') ?? [];

  const toggleMentorshipTopic = (value: string) => {
    const current = selectedTopics;
    if (current.includes(value)) {
      setValue(
        'mentorshipTopics',
        current.filter((v) => v !== value),
        { shouldValidate: true }
      );
      return;
    }
    if (current.length >= 5) {
      showToast('You can select at most 5 topics.', 'error');
      return;
    }
    setValue('mentorshipTopics', [...current, value], { shouldValidate: true });
  };

  const totalSteps = 4;

  const nextStep = async () => {
    const stepFields: Record<number, (keyof RegisterFormData)[]> = {
      1: ['fullName', 'email', 'phoneNumber'],
      2: ['dateOfBirth', 'gender', 'maritalStatus'],
      3: ['address', 'occupation', 'meansOfVerification', 'linkedin'],
      4: ['mentorshipTopics', 'inspires', 'bio'],
    };

    const isValid = await trigger(stepFields[currentStep]);
    if (currentStep === 2 && !pictureFile) {
      setPictureError('Profile picture is required');
      showToast('Profile picture is required', 'error');
      return;
    }
    if (currentStep === 3 && !verificationDocument) {
      setVerificationDocumentError('Verification document is required');
      showToast('Verification document is required', 'error');
      return;
    }

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
    if (!pictureFile) {
      setPictureError('Profile picture is required');
      showToast('Profile picture is required', 'error');
      setCurrentStep(2);
      return;
    }
    if (!verificationDocument) {
      setVerificationDocumentError('Verification document is required');
      showToast('Verification document is required', 'error');
      setCurrentStep(3);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('dateOfBirth', data.dateOfBirth);
      formData.append('gender', data.gender);
      formData.append('maritalStatus', data.maritalStatus);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('address', data.address);
      formData.append('occupation', data.occupation);
      formData.append('meansOfVerification', data.meansOfVerification);
      if (data.linkedin) {
        formData.append('linkedinUrl', data.linkedin);
      }
      formData.append('mentorshipTopics', JSON.stringify(data.mentorshipTopics));
      formData.append('inspiration', data.inspires);
      formData.append('bio', data.bio);
      formData.append('verificationDocument', verificationDocument);
      formData.append('picturee', pictureFile);
      const response = await registerMentor(formData).unwrap();
      showToast(
        response.data?.message || 'Registration successful!',
        'success'
      );
      reset();
      setPictureFile(null);
      setVerificationDocument(null);
      setPictureError('');
      setVerificationDocumentError('');
      setCurrentStep(1);
      setShowSuccess(true);
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.error ||
        error?.data?.errors?.[0]?.msg ||
        'Signup failed';
      showToast(message, 'error');
    }
  };

  return (
    <div className="w-full px-2 overflow-scroll max-h-[90vh] no-scrollbar font-montserrat montserrat">
      <Image src="/image/logo.png" alt="Logo" width={151} height={32} />

      <div className="flex flex-col mt-6 gap-7">
        <div>
          <h3 className="text-[40px] text-green-200 font-bold">
            Welcome Here!
          </h3>
          <p className="text-[#37445D] font-medium text-xl">
            Sign up to Join Osmosis as a Mentor
          </p>
        </div>
        <div className="mb-2 flex max-w-[900px] flex-col w-full mt-3">
          <div className="flex items-center w-full justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex w-full items-center">
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
                    className={`h-1 flex-1 w-full mx-2 sm:mx-3 rounded-full ${
                      step < currentStep ? 'bg-green-100' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
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
                <div className="flex font-montserrat montserrat flex-col gap-1">
                  <label className="text-green-300 font-medium">
                    Date Of Birth
                  </label>
                  <div className="relative">
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date: Date | null) => {
                            if (!date) {
                              field.onChange('');
                              return;
                            }
                            if (isMentorTooYoung(date)) {
                              showToast(MENTOR_MIN_AGE_MESSAGE, 'error');
                              return;
                            }
                            const formattedDate = formatDateToYmd(date);
                            field.onChange(formattedDate);
                            setValue('dateOfBirth', formattedDate, {
                              shouldValidate: true,
                            });
                          }}
                          dateFormat="MMMM dd, yyyy"
                          maxDate={getMentorMaxDateOfBirth()}
                          minDate={new Date(1940, 0, 1)}
                          showYearDropdown
                          showMonthDropdown
                          dropdownMode="select"
                          placeholderText="Select date of birth"
                          className={`w-full h-[56px] text-sm focus:outline-none bg-transparent border rounded-md focus-within:border-green-300 focus-within:outline-none px-3 pr-10 ${
                            errors.dateOfBirth
                              ? 'border-red-500'
                              : 'border-green-300'
                          }`}
                          popperClassName="react-datepicker-popper-modern"
                        />
                      )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-green-300">
                      <CalendarIcon />
                    </div>
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">
                      {typeof errors.dateOfBirth.message === 'string'
                        ? errors.dateOfBirth.message
                        : 'Date of birth is required'}
                    </p>
                  )}
                </div>
                <SelectForm
                  label="Gender"
                  name="gender"
                  placeholder={
                    isDropdownsLoading ? 'Loading...' : 'Select gender'
                  }
                  options={dropdowns['gender']}
                  register={register}
                  error={errors.gender}
                />
                <SelectForm
                  label="Marital Status"
                  name="maritalStatus"
                  placeholder="Select marital status"
                  options={MARITAL_STATUS_OPTIONS}
                  register={register}
                  error={errors.maritalStatus}
                />
                <FileUpload
                  label="Profile Picture"
                  accept="image/png,image/jpeg"
                  widthHint="800×400px"
                  maxSizeMB={2}
                  onFileSelect={(file) => {
                    setPictureFile(file);
                    setPictureError(file ? '' : 'Profile picture is required');
                  }}
                />
                {pictureError && (
                  <p className="text-red-500 text-xs mt-1">{pictureError}</p>
                )}
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6">
                <InputForm
                  label="Address"
                  name="address"
                  placeholder="Type Your Location"
                  register={register}
                  error={errors.address}
                />

                <InputForm
                  label="Occupation"
                  name="occupation"
                  placeholder="Enter your occupation"
                  register={register}
                  error={errors.occupation}
                />

                <SelectForm
                  label="Means of Verification"
                  name="meansOfVerification"
                  placeholder="Select document type"
                  options={MEANS_OF_VERIFICATION_OPTIONS}
                  register={register}
                  error={errors.meansOfVerification}
                />

                <FileUpload
                  label="Verification Document"
                  accept={VERIFICATION_DOCUMENT_ACCEPT}
                  widthHint="JPG, PNG, GIF, WEBP or PDF"
                  maxSizeMB={5}
                  onFileSelect={(file) => {
                    setVerificationDocument(file);
                    setVerificationDocumentError(
                      file ? '' : 'Verification document is required'
                    );
                  }}
                />
                {verificationDocumentError && (
                  <p className="text-red-500 text-xs mt-1">
                    {verificationDocumentError}
                  </p>
                )}

                <InputForm
                  label="LinkedIn Profile"
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  register={register}
                  error={errors.linkedin}
                />
              </div>
            )}
            {currentStep === 4 && (
              <div className="space-y-6">
                <InputForm
                  label="What inspire you to be a teens mentor?"
                  name="inspires"
                  placeholder="Type it Here"
                  register={register}
                  error={errors.inspires}
                  as="textarea"
                  rows={4}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-green-300 font-medium">
                    Mentorship Topics of Interest
                  </label>
                  <p className="text-sm text-gray-500">
                    Choose up to 5 topics ({selectedTopics.length}/5 selected)
                  </p>
                  {isDropdownsLoading ? (
                    <p className="text-sm text-gray-500">Loading topics…</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(dropdowns['mentorship-topics'] ?? []).map((option) => {
                        const checked = selectedTopics.includes(option.value);
                        const disabled =
                          !checked && selectedTopics.length >= 5;
                        return (
                          <label
                            key={option.value}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                              checked
                                ? 'border-green-200 bg-green-50/80'
                                : disabled
                                  ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
                                  : 'border-green-200/60 bg-white hover:border-green-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disabled}
                              onChange={() => toggleMentorshipTopic(option.value)}
                              className="mt-1 h-4 w-4 shrink-0 accent-green-100"
                            />
                            <span className="text-sm font-medium text-[#37445D]">
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {errors.mentorshipTopics && (
                    <p className="text-red-500 text-xs mt-1">
                      {typeof errors.mentorshipTopics.message === 'string'
                        ? errors.mentorshipTopics.message
                        : 'Select at least one mentorship topic'}
                    </p>
                  )}
                </div>

                <InputForm
                  label="Bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  register={register}
                  error={errors.bio}
                  as="textarea"
                  rows={4}
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
        <div className="flex font-montserrat montserrat text-[#0F1C24] text-[15px] font-bold items-center justify-center mt-6 pb-4">
          <span>Already have an account?</span>
          <Link
            href="/signin"
            className="text-green-100 ml-1 hover:text-green-200 transition-colors font-bold"
          >
            Sign in
          </Link>
        </div>
      </div>

      <Modal isOpen={showSuccess} onClose={handleCloseModal}>
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
            Thank you for applying to join Osmosis as a Mentor. Kindly check
            your email inbox for more details regarding the onboarding process.
          </h3>
        </div>
      </Modal>
    </div>
  );
};
