'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowSubmit, EmailIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';

import useToastify from '@/hooks/useToastify';
import { useCreateContactMutation } from '@/store/users/users.api';
import InputForm from '@/components/form/InputForm';
import { contactFormValidation } from '@/validation/schema';

type ContactFormValues = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  message: string;
};

export default function GetInTouch() {
  const { showToast } = useToastify();
  const contactRules = contactFormValidation as any;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>();

  const [createContact, { isLoading }] = useCreateContactMutation();
  const onSubmit = async (data: ContactFormValues) => {
    try {
      await createContact(data).unwrap();
      showToast('Message sent successfully', 'success');
      reset();
    } catch (error: any) {
      showToast(error?.data?.message || 'Failed to send message', 'error');
    }
  };

  return (
    <div className="flex flex-col font-montserrat items-center justify-center py-14 px-8">
      <div className="max-w-[700px] w-full flex flex-col items-center md:py-16">
        <h3 className="text-green-200 text-[26px] md:text-5xl font-bold">
          Get in Touch
        </h3>

        <p className="text-green-100 px-4 text-center md:text-2xl">
          Having questions? We’d love to hear from you. Fill out the form below
          and we’ll get back to you as soon as possible
        </p>

        <div className="mt-10 w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-6"
          >
            <div className="w-full flex flex-col md:flex-row gap-6">
              <InputForm
                label="First Name"
                name="firstName"
                placeholder="Type First Name"
                register={register}
                error={errors.firstName}
                validationRules={contactRules.firstName}
              />

              <InputForm
                label="Last Name"
                name="lastName"
                placeholder="Type Last Name"
                register={register}
                error={errors.lastName}
                validationRules={contactRules.lastName}
              />
            </div>

            <InputForm
              label={
                <>
                  Email <span className="text-red-500">*</span>
                </>
              }
              name="emailAddress"
              placeholder="example@gmail.com"
              register={register}
              error={errors.emailAddress}
              type="email"
              icon={<EmailIcon />}
            />

            <InputForm
              label="Message"
              name="message"
              placeholder="Type Message"
              register={register}
              error={errors.message}
              as="textarea"
              rows={4}
              validationRules={contactRules.message}
            />

            <div className="flex items-center justify-center">
              <Button
                variant="primary"
                type="submit"
                isLoading={isLoading}
                rightIcon={<ArrowSubmit />}
                className="px-8 py-4"
              >
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
