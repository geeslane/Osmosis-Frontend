import * as yup from 'yup';

export const RegisterMentorFormSchema = yup.object({
  fullName: yup.string().required('Full name is required'),

  email: yup.string().email('Invalid email').required('Email is required'),
  occupation: yup.string().required('Occupation is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  topic: yup.string().required('Topic is required'),
  inspires: yup.string().required('Topic is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  gender: yup.string().required('Gender is required'),
  address: yup.string().required('Address is required'),
  linkedin: yup
    .string()
    .url('Please enter a valid LinkedIn URL')
    .required('LinkedIn profile is required'),
  bio: yup.string().required('Bio is required'),
});

export const RegisterFormSchema = yup.object({
  fullName: yup.string().required('Full name is required'),

  email: yup.string().email('Invalid email').required('Email is required'),

  phoneNumber: yup.string().required('Phone number is required'),

  parentFullName: yup.string().required('Parent full name is required'),

  parentEmail: yup
    .string()
    .email('Invalid email')
    .required('Parent email is required'),

  parentPhoneNumber: yup.string().required('Parent phone number is required'),

  dateOfBirth: yup.string().required('Date of birth is required'),

  gender: yup.string().required('Gender is required'),

  address: yup.string().required('Address is required'),

  hobbies: yup.string().optional().default(''),

  class: yup.string().required('Class is required'),
});

export const ForgetPassordFormSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});
export const SignInFormSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});
export const ResetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'The password field must be at least 8 characters.')
    .matches(
      /[a-z]/,
      'The password field must contain at least one lowercase letter.'
    )
    .matches(
      /[A-Z]/,
      'The password field must contain at least one uppercase letter.'
    )
    .matches(/[0-9]/, 'The password field must contain at least one number.')
    .matches(
      /[^a-zA-Z0-9]/,
      'The password field must contain at least one symbol.'
    ),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match.')
    .required('Confirm password is required'),
});
export const AccountInfoSchema = yup.object().shape({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});
export const PasswordSettingsSchema = yup.object({
  current_password: yup.string().required('Current password is required'),
  new_password: yup
    .string()
    .required('New password is required')
    .notOneOf(
      [yup.ref('current_password')],
      'New password must be different from current password'
    ),
  new_password_confirmation: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Passwords do not match')
    .required('Confirm new password'),
});
export const DeleteAccountSchema = yup.object().shape({
  reason: yup.string().required('Reason is required'),
  password: yup.string().required('Password is required'),
});

export const AddAdminSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.string().nullable().notRequired(),
  address: yup.string().nullable().notRequired(),
});

export const AddLiveSessionSchema = yup.object({
  topic: yup
    .string()
    .required('Live session topic is required')
    .min(5, 'Topic must be at least 5 characters'),

  date: yup.string().required('Date is required'),

  time: yup.string().required('Time is required'),

  url: yup
    .string()
    .url('Enter a valid URL')
    .required('Live session URL is required'),

  speakerName: yup.string().required('Guest speaker name is required'),

  bio: yup
    .string()
    .min(20, 'Bio must be at least 20 characters')
    .required('Bio is required'),

  linkedinUrl: yup
    .string()
    .nullable()
    .notRequired()
    .url('Enter a valid LinkedIn URL'),
});

export const AddModuleSchema = yup.object({
  title: yup.string().required('Module title is required'),
  ModuleNumber: yup.number().required('Module number is required').positive(),
  notes: yup.string().required('Content is required'),
  additionalResources: yup.string().required('Resources is required'),
  deliverables: yup.string().required('Deliverables is required'),
  workbookFile: yup
    .mixed()
    .required('Workbook file is required')
    .test('fileRequired', 'Workbook file is required', (value) => {
      return value && value.length > 0;
    })
    .test('fileType', 'Only PDF files are allowed', (value) => {
      if (!value || value.length === 0) return true;
      return value[0]?.type === 'application/pdf';
    })
    .test('fileSize', 'File size must be less than 10MB', (value) => {
      if (!value || value.length === 0) return true;
      return value[0]?.size <= 10 * 1024 * 1024; // 10MB
    }),
});

export const EditModuleSchema = yup.object({
  title: yup.string().required('Module title is required'),
  ModuleNumber: yup.number().required('Module number is required').positive(),
  notes: yup.string().required('Content is required'),
  additionalResources: yup.string().required('Resources is required'),
  deliverables: yup.string().required('Deliverables is required'),
  workbookFile: yup
    .mixed()
    .notRequired()
    .test('fileType', 'Only PDF files are allowed', (value) => {
      if (!value || value.length === 0) return true;
      return value[0]?.type === 'application/pdf';
    })
    .test('fileSize', 'File size must be less than 10MB', (value) => {
      if (!value || value.length === 0) return true;
      return value[0]?.size <= 10 * 1024 * 1024; // 10MB
    }),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),

  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Must contain at least one special character')
    .notOneOf(
      [yup.ref('currentPassword')],
      'New password must be different from current password'
    ),

  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
});

export const contactFormValidation = yup.object({
  firstName: {
    required: 'First name is required',
    minLength: {
      value: 2,
      message: 'First name must be at least 2 characters',
    },
    maxLength: {
      value: 50,
      message: 'First name cannot exceed 50 characters',
    },
  },

  lastName: {
    required: 'Last name is required',
    minLength: {
      value: 2,
      message: 'Last name must be at least 2 characters',
    },
    maxLength: {
      value: 50,
      message: 'Last name cannot exceed 50 characters',
    },
  },

  emailAddress: {
    required: 'Email address is required',
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Enter a valid email address',
    },
  },

  message: {
    required: 'Message is required',
  },
});
