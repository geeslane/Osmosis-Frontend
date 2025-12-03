import * as yup from 'yup';

export const RegisterFormSchema = yup.object().shape({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
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
