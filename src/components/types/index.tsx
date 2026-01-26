export interface DashboardResponse {
  message: string;
  data: {
    completed_lessons: number;
    certificate: number;
    hours_spent: number;
    total_lessons: number;
    ongoing_course: number;
    completed_course: number;
    current_ongoing_course: {
      title: string;
      slug: string;
      completed_lessons: number;
      total_lessons: number;
      percentage_completed: number;
    };
  };
}

export type RegisterFormData = {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  address: string;
  occupation: string;
  linkedin: string;
  topic: string;
  inspires: string;
  bio: string;
};

export type TeenagerRegisterFormData = {
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

export interface DropdownItem {
  label: string;
  value: string;
}
export interface DropdownResponse {
  success: boolean;
  message: string;
  data: DropdownItem[];
}
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
    token?: string;
  };
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    message?: string;
    data?: {
      sessionId?: string;
      requiresOtp?: boolean;
      requiresPasswordChange?: boolean;
      userType?: 'ADMIN' | 'MENTOR' | 'TEENAGER';
      userId?: string;
      token?: string;
    };
  };
  message?: string;
  timestamp?: string;
}
export interface OtpResendRequest {
  sessionId: string;
}
export interface OtpResendResponse {
  data: {
    message: string;
    success: boolean;
  };
}

export interface OtpVerifyRequest {
  sessionId: string;
  otpCode: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
    data?: {
      token: string;
      userType: 'ADMIN' | 'MENTOR' | 'TEENAGER';
      userId: string;
      requiresPasswordChange?: boolean;
      user?: any;
    };
    token?: string;
    userType?: 'ADMIN' | 'MENTOR' | 'TEENAGER';
    userId?: string;
    requiresPasswordChange?: boolean;
  };
}

export type Admin = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  image?: string;
  role?: string;
};
