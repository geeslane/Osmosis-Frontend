'use client';

import { Edit } from '@/assets/icons';
import {
  CalendarIcon,
  CourseIcon,
  EmailIcon,
  HeartIcon,
  LocationIcon,
  PhoneIcon,
  UserAddIcon,
  UserIcon,
} from '@/assets/icons';
import MentorDetail from '@/components/common/Details/MentorDetails';
import { DetailRow } from '@/components/common/Details/DetailRow';
import { Info } from '@/components/common/Details/Info';
import Button from '@/components/ui/button/Button';
import InputForm from '@/components/form/InputForm';
import { useGetMeQuery } from '@/store/profile/profile.api';
import {
  useGetAdminByIdQuery,
  useGetMentorByIdQuery,
  useGetTeenagerByIdQuery,
  useUpdateAdminProfileMutation,
  useUpdateMentorProfileMutation,
  useUpdateTeenagerProfileMutation,
} from '@/store/users/users.api';
import { formatDate, normalizeImageUrl } from '@/utils/helper';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import useToastify from '@/hooks/useToastify';

function unwrapRecord(res: { data?: unknown } | undefined): Record<string, unknown> | null {
  const d = res?.data;
  if (d == null || typeof d !== 'object') return null;
  const obj = d as Record<string, unknown>;
  const inner = obj.data;
  if (inner != null && typeof inner === 'object' && !Array.isArray(inner)) {
    return inner as Record<string, unknown>;
  }
  return obj;
}

function mapMentorStatus(raw: unknown): string {
  const st = String(raw ?? '').toUpperCase();
  if (st === 'ACTIVE') return 'Active';
  if (st === 'INACTIVE') return 'Inactive';
  if (st === 'PENDING') return 'Pending';
  return String(raw ?? '—');
}

function mentorApiToMentorDetail(m: Record<string, unknown>) {
  const topics = m.mentorshipTopics;
  const topicsStr = Array.isArray(topics)
    ? topics.map(String).join(', ')
    : topics != null
      ? String(topics)
      : '';
  return {
    name: String(m.fullName ?? ''),
    fullName: m.fullName,
    email: String(m.email ?? ''),
    status: mapMentorStatus(m.status),
    image: m.pictureUrl,
    pictureUrl: m.pictureUrl,
    phone: m.phoneNumber ?? '',
    phoneNumber: m.phoneNumber,
    address: m.address != null ? String(m.address) : '',
    dateOfBirth: m.dateOfBirth,
    gender: m.gender != null ? String(m.gender) : '',
    occupation: m.occupation != null ? String(m.occupation) : '',
    topics: topicsStr,
    mentorshipTopics: Array.isArray(topics) ? (topics as string[]) : [],
    linkedinUrl: m.linkedinUrl != null ? String(m.linkedinUrl) : '',
    inspiration: m.inspiration != null ? String(m.inspiration) : '',
    bio: m.bio != null ? String(m.bio) : '',
  };
}

type MentorFormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  linkedinUrl: string;
  inspiration: string;
  bio: string;
  mentorshipTopics: string;
};

type TeenFormValues = {
  teenagerFullName: string;
  teenagerEmail: string;
  teenagerPhoneNumber: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  class: string;
  hobbies: string;
  parentFullName: string;
  parentEmail: string;
  parentPhoneNumber: string;
};

type AdminFormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
};

export default function AccountProfile() {
  const { showToast } = useToastify();
  const user = useSelector((state: RootState) => state.profile.user);
  const role = (user?.role ?? '').toUpperCase();
  const userId = user?.id != null ? String(user.id) : '';

  const { refetch: refetchMe } = useGetMeQuery();

  const skipMentor = role !== 'MENTOR' || !userId;
  const skipTeen = role !== 'TEENAGER' || !userId;
  const skipAdmin = !['ADMIN', 'SUPERADMIN'].includes(role) || !userId;

  const mentorQ = useGetMentorByIdQuery(userId, { skip: skipMentor });
  const teenQ = useGetTeenagerByIdQuery(userId, { skip: skipTeen });
  const adminQ = useGetAdminByIdQuery(userId, { skip: skipAdmin });

  const [updateMentor, { isLoading: savingMentor }] = useUpdateMentorProfileMutation();
  const [updateTeen, { isLoading: savingTeen }] = useUpdateTeenagerProfileMutation();
  const [updateAdmin, { isLoading: savingAdmin }] = useUpdateAdminProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);

  const mentorRecord = useMemo(
    () => (skipMentor ? null : unwrapRecord(mentorQ.data)),
    [mentorQ.data, skipMentor]
  );
  const teenRecord = useMemo(
    () => (skipTeen ? null : unwrapRecord(teenQ.data)),
    [teenQ.data, skipTeen]
  );
  const adminRecord = useMemo(() => {
    if (skipAdmin) return null;
    const payload = adminQ.data?.data;
    if (payload && typeof payload === 'object' && 'data' in payload) {
      const inner = (payload as { data?: unknown }).data;
      if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
        return inner as Record<string, unknown>;
      }
    }
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
      return payload as Record<string, unknown>;
    }
    return null;
  }, [adminQ.data, skipAdmin]);

  const mentorDetail = useMemo(
    () => (mentorRecord ? mentorApiToMentorDetail(mentorRecord) : null),
    [mentorRecord]
  );

  const mentorForm = useForm<MentorFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      occupation: '',
      linkedinUrl: '',
      inspiration: '',
      bio: '',
      mentorshipTopics: '',
    },
  });

  const teenForm = useForm<TeenFormValues>({
    defaultValues: {
      teenagerFullName: '',
      teenagerEmail: '',
      teenagerPhoneNumber: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      class: '',
      hobbies: '',
      parentFullName: '',
      parentEmail: '',
      parentPhoneNumber: '',
    },
  });

  const adminForm = useForm<AdminFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      address: '',
    },
  });

  useEffect(() => {
    if (!mentorRecord || !isEditing) return;
    const topics = mentorRecord.mentorshipTopics;
    const topicsLine = Array.isArray(topics) ? topics.join(', ') : String(topics ?? '');
    mentorForm.reset({
      fullName: String(mentorRecord.fullName ?? ''),
      email: String(mentorRecord.email ?? ''),
      phoneNumber: String(mentorRecord.phoneNumber ?? ''),
      address: String(mentorRecord.address ?? ''),
      dateOfBirth: String(mentorRecord.dateOfBirth ?? '').slice(0, 10),
      gender: String(mentorRecord.gender ?? ''),
      occupation: String(mentorRecord.occupation ?? ''),
      linkedinUrl: String(mentorRecord.linkedinUrl ?? ''),
      inspiration: String(mentorRecord.inspiration ?? ''),
      bio: String(mentorRecord.bio ?? ''),
      mentorshipTopics: topicsLine,
    });
  }, [mentorRecord, isEditing, mentorForm]);

  useEffect(() => {
    if (!teenRecord || !isEditing) return;
    teenForm.reset({
      teenagerFullName: String(teenRecord.teenagerFullName ?? ''),
      teenagerEmail: String(teenRecord.teenagerEmail ?? ''),
      teenagerPhoneNumber: String(teenRecord.teenagerPhoneNumber ?? ''),
      address: String(teenRecord.address ?? ''),
      dateOfBirth: String(teenRecord.dateOfBirth ?? '').slice(0, 10),
      gender: String(teenRecord.gender ?? ''),
      class: String(teenRecord.class ?? ''),
      hobbies: String(teenRecord.hobbies ?? ''),
      parentFullName: String(teenRecord.parentFullName ?? ''),
      parentEmail: String(teenRecord.parentEmail ?? ''),
      parentPhoneNumber: String(teenRecord.parentPhoneNumber ?? ''),
    });
  }, [teenRecord, isEditing, teenForm]);

  useEffect(() => {
    if (!adminRecord || !isEditing) return;
    adminForm.reset({
      fullName: String(adminRecord.fullName ?? ''),
      email: String(adminRecord.email ?? ''),
      phoneNumber: String(adminRecord.phoneNumber ?? ''),
      address: String(adminRecord.address ?? ''),
    });
  }, [adminRecord, isEditing, adminForm]);

  const loading =
    (role === 'MENTOR' && mentorQ.isLoading) ||
    (role === 'TEENAGER' && teenQ.isLoading) ||
    (['ADMIN', 'SUPERADMIN'].includes(role) && adminQ.isLoading);

  const onSaveMentor = mentorForm.handleSubmit(async (values) => {
    if (!userId) return;
    try {
      const topicParts = values.mentorshipTopics
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      await updateMentor({
        id: userId,
        data: {
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address: values.address,
          dateOfBirth: values.dateOfBirth || undefined,
          gender: values.gender || undefined,
          occupation: values.occupation || undefined,
          linkedinUrl: values.linkedinUrl || undefined,
          inspiration: values.inspiration || undefined,
          bio: values.bio || undefined,
          mentorshipTopics: topicParts.length ? topicParts : undefined,
          picture: pictureFile ?? undefined,
        },
      }).unwrap();
      showToast('Profile updated', 'success');
      setPictureFile(null);
      setIsEditing(false);
      void mentorQ.refetch();
      void refetchMe();
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'data' in e
          ? String((e as { data?: { message?: string } }).data?.message ?? 'Update failed')
          : 'Update failed';
      showToast(msg, 'error');
    }
  });

  const onSaveTeen = teenForm.handleSubmit(async (values) => {
    if (!userId) return;
    try {
      await updateTeen({
        id: userId,
        data: {
          teenagerFullName: values.teenagerFullName,
          teenagerEmail: values.teenagerEmail,
          teenagerPhoneNumber: values.teenagerPhoneNumber,
          address: values.address,
          dateOfBirth: values.dateOfBirth || undefined,
          gender: values.gender || undefined,
          class: values.class || undefined,
          hobbies: values.hobbies || undefined,
          parentFullName: values.parentFullName || undefined,
          parentEmail: values.parentEmail || undefined,
          parentPhoneNumber: values.parentPhoneNumber || undefined,
          picture: pictureFile ?? undefined,
        },
      }).unwrap();
      showToast('Profile updated', 'success');
      setPictureFile(null);
      setIsEditing(false);
      void teenQ.refetch();
      void refetchMe();
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'data' in e
          ? String((e as { data?: { message?: string } }).data?.message ?? 'Update failed')
          : 'Update failed';
      showToast(msg, 'error');
    }
  });

  const onSaveAdmin = adminForm.handleSubmit(async (values) => {
    if (!userId) return;
    try {
      await updateAdmin({
        id: userId,
        data: {
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address: values.address,
          picture: pictureFile ?? undefined,
        },
      }).unwrap();
      showToast('Profile updated', 'success');
      setPictureFile(null);
      setIsEditing(false);
      void adminQ.refetch();
      void refetchMe();
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'data' in e
          ? String((e as { data?: { message?: string } }).data?.message ?? 'Update failed')
          : 'Update failed';
      showToast(msg, 'error');
    }
  });

  if (!userId || !role) {
    return <p className="text-sm text-gray-500">Sign in to manage your profile.</p>;
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-[#6CBB0180] px-8 py-12 text-center text-green-200">
        Loading profile…
      </div>
    );
  }

  if (role === 'MENTOR' && !mentorRecord) {
    return (
      <p className="text-red-600 text-sm">
        Could not load your mentor profile. Please try again later.
      </p>
    );
  }

  if (role === 'TEENAGER' && !teenRecord) {
    return (
      <p className="text-red-600 text-sm">
        Could not load your profile. Please try again later.
      </p>
    );
  }

  if (['ADMIN', 'SUPERADMIN'].includes(role) && !adminRecord) {
    return (
      <p className="text-red-600 text-sm">
        Could not load your admin profile. Please try again later.
      </p>
    );
  }

  const pictureInput = (
    <div className="flex flex-col gap-2 max-w-md">
      <label className="text-sm font-medium text-green-300">Profile photo</label>
      <input
        type="file"
        accept="image/*"
        className="text-sm text-gray-600"
        onChange={(e) => {
          const f = e.target.files?.[0];
          setPictureFile(f ?? null);
        }}
      />
      {pictureFile && (
        <p className="text-xs text-gray-500">Selected: {pictureFile.name}</p>
      )}
    </div>
  );

  if (role === 'MENTOR') {
    if (!mentorDetail) {
      return <p className="text-red-600 text-sm">Could not load mentor profile.</p>;
    }
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-end w-full gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="secondary"
                className="px-5 py-2.5"
                onClick={() => {
                  setIsEditing(false);
                  setPictureFile(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="mentor-profile-form"
                variant="primary"
                className="bg-green-200 text-white px-5 py-2.5"
                disabled={savingMentor}
              >
                {savingMentor ? 'Saving…' : 'Save'}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="bg-green-200 text-white font-medium text-xs px-5 py-3 flex items-center gap-1 rounded-md"
              onClick={() => setIsEditing(true)}
            >
              <Edit />
              Edit
            </Button>
          )}
        </div>
        {isEditing ? (
          <form
            id="mentor-profile-form"
            className="rounded-lg border border-[#6CBB0180] px-6 md:px-10 py-8 space-y-6 max-w-3xl"
            onSubmit={(e) => {
              e.preventDefault();
              void onSaveMentor();
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputForm label="Full name" name="fullName" register={mentorForm.register} error={mentorForm.formState.errors.fullName} />
              <InputForm label="Email" name="email" type="email" register={mentorForm.register} error={mentorForm.formState.errors.email} />
              <InputForm label="Phone" name="phoneNumber" register={mentorForm.register} error={mentorForm.formState.errors.phoneNumber} />
              <InputForm label="Date of birth" name="dateOfBirth" type="date" register={mentorForm.register} error={mentorForm.formState.errors.dateOfBirth} />
              <InputForm label="Gender" name="gender" register={mentorForm.register} error={mentorForm.formState.errors.gender} />
              <InputForm label="Occupation" name="occupation" register={mentorForm.register} error={mentorForm.formState.errors.occupation} />
              <InputForm label="LinkedIn URL" name="linkedinUrl" register={mentorForm.register} error={mentorForm.formState.errors.linkedinUrl} />
              <InputForm
                label="Mentorship topics (comma-separated)"
                name="mentorshipTopics"
                register={mentorForm.register}
                error={mentorForm.formState.errors.mentorshipTopics}
              />
            </div>
            <InputForm label="Address" name="address" as="textarea" rows={3} register={mentorForm.register} error={mentorForm.formState.errors.address} />
            <InputForm label="What inspires you?" name="inspiration" as="textarea" rows={3} register={mentorForm.register} error={mentorForm.formState.errors.inspiration} />
            <InputForm label="Bio" name="bio" as="textarea" rows={4} register={mentorForm.register} error={mentorForm.formState.errors.bio} />
            {pictureInput}
          </form>
        ) : (
          <MentorDetail selectedDetails={mentorDetail} />
        )}
      </div>
    );
  }

  if (role === 'TEENAGER' && teenRecord) {
    const dob = teenRecord.dateOfBirth ? formatDate(String(teenRecord.dateOfBirth)) : null;
    const pic =
      teenRecord.pictureUrl && typeof teenRecord.pictureUrl === 'string'
        ? normalizeImageUrl(teenRecord.pictureUrl)
        : null;

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-end w-full gap-2">
          {isEditing ? (
            <>
              <Button type="button" variant="secondary" className="px-5 py-2.5" onClick={() => { setIsEditing(false); setPictureFile(null); }}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                className="bg-green-200 text-white px-5 py-2.5"
                onClick={() => void onSaveTeen()}
                disabled={savingTeen}
              >
                {savingTeen ? 'Saving…' : 'Save'}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="bg-green-200 text-white font-medium text-xs px-5 py-3 flex items-center gap-1 rounded-md"
              onClick={() => setIsEditing(true)}
            >
              <Edit />
              Edit
            </Button>
          )}
        </div>
        {isEditing ? (
          <form className="rounded-lg border border-[#6CBB0180] px-6 md:px-10 py-8 space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputForm label="Full name" name="teenagerFullName" register={teenForm.register} error={teenForm.formState.errors.teenagerFullName} />
              <InputForm label="Email" name="teenagerEmail" type="email" register={teenForm.register} error={teenForm.formState.errors.teenagerEmail} />
              <InputForm label="Phone" name="teenagerPhoneNumber" register={teenForm.register} error={teenForm.formState.errors.teenagerPhoneNumber} />
              <InputForm label="Date of birth" name="dateOfBirth" type="date" register={teenForm.register} error={teenForm.formState.errors.dateOfBirth} />
              <InputForm label="Gender" name="gender" register={teenForm.register} error={teenForm.formState.errors.gender} />
              <InputForm label="Class" name="class" register={teenForm.register} error={teenForm.formState.errors.class} />
            </div>
            <InputForm label="Address" name="address" as="textarea" rows={2} register={teenForm.register} error={teenForm.formState.errors.address} />
            <InputForm label="Hobbies" name="hobbies" as="textarea" rows={2} register={teenForm.register} error={teenForm.formState.errors.hobbies} />
            <h3 className="text-lg font-semibold text-green-300">Parent / guardian</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputForm label="Parent full name" name="parentFullName" register={teenForm.register} error={teenForm.formState.errors.parentFullName} />
              <InputForm label="Parent email" name="parentEmail" type="email" register={teenForm.register} error={teenForm.formState.errors.parentEmail} />
              <InputForm label="Parent phone" name="parentPhoneNumber" register={teenForm.register} error={teenForm.formState.errors.parentPhoneNumber} />
            </div>
            {pictureInput}
          </form>
        ) : (
          <div className="rounded-lg border border-[#6CBB0180] px-6 md:px-10 lg:px-16 py-8 flex flex-col md:flex-row gap-8">
            <div className="shrink-0 flex justify-center md:justify-start">
              <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden bg-green-100/30">
                {pic ? (
                  <Image src={pic} alt="" fill sizes="120px" className="object-cover rounded-full" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-100 text-green-200 text-2xl font-semibold">
                    {String(teenRecord.teenagerFullName || 'T').trim().slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Info icon={<UserAddIcon />} label="Full Name" value={String(teenRecord.teenagerFullName ?? '')} />
                <Info icon={<EmailIcon color="#6CBB01" />} label="Email" value={String(teenRecord.teenagerEmail ?? '')} />
                <Info icon={<PhoneIcon color="#6CBB01" />} label="Phone Number" value={String(teenRecord.teenagerPhoneNumber ?? '')} />
                <Info icon={<LocationIcon color="#6CBB01" />} label="Address" value={String(teenRecord.address ?? '')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Info icon={<CalendarIcon />} label="Date of Birth" value={dob} />
                <Info icon={<UserIcon width={20} height={20} />} label="Gender" value={String(teenRecord.gender ?? '')} />
                <Info icon={<HeartIcon />} label="Hobbies" value={String(teenRecord.hobbies ?? '')} />
                <Info icon={<CourseIcon width={20} height={20} />} label="Class" value={String(teenRecord.class ?? '')} />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-green-300">Parent Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Info icon={<UserAddIcon />} label="Full Name" value={String(teenRecord.parentFullName ?? '')} />
                  <Info icon={<EmailIcon color="#6CBB01" />} label="Email" value={String(teenRecord.parentEmail ?? '')} />
                  <Info icon={<PhoneIcon color="#6CBB01" />} label="Phone Number" value={String(teenRecord.parentPhoneNumber ?? '')} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (['ADMIN', 'SUPERADMIN'].includes(role) && adminRecord) {
    const pic =
      adminRecord.pictureUrl && typeof adminRecord.pictureUrl === 'string'
        ? normalizeImageUrl(String(adminRecord.pictureUrl))
        : null;

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-end w-full gap-2">
          {isEditing ? (
            <>
              <Button type="button" variant="secondary" className="px-5 py-2.5" onClick={() => { setIsEditing(false); setPictureFile(null); }}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                className="bg-green-200 text-white px-5 py-2.5"
                onClick={() => void onSaveAdmin()}
                disabled={savingAdmin}
              >
                {savingAdmin ? 'Saving…' : 'Save'}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="bg-green-200 text-white font-medium text-xs px-5 py-3 flex items-center gap-1 rounded-md"
              onClick={() => setIsEditing(true)}
            >
              <Edit />
              Edit
            </Button>
          )}
        </div>
        {isEditing ? (
          <form className="rounded-lg border border-[#6CBB0180] px-6 md:px-10 py-8 space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputForm label="Full name" name="fullName" register={adminForm.register} error={adminForm.formState.errors.fullName} />
              <InputForm label="Email" name="email" type="email" register={adminForm.register} error={adminForm.formState.errors.email} />
              <InputForm label="Phone" name="phoneNumber" register={adminForm.register} error={adminForm.formState.errors.phoneNumber} />
            </div>
            <InputForm label="Address" name="address" as="textarea" rows={3} register={adminForm.register} error={adminForm.formState.errors.address} />
            {pictureInput}
          </form>
        ) : (
          <div className="rounded-lg flex flex-col md:flex-row gap-10 border border-[#6CBB0180] px-10 md:px-[64px] py-8">
            <div className="w-[90px] h-[90px] rounded-full shrink-0 overflow-hidden">
              {pic ? (
                <Image src={pic} alt="" width={90} height={90} className="rounded-full object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center text-white font-bold text-2xl">
                  {String(adminRecord.fullName || 'A').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="space-y-6 min-w-0 flex-1">
              <DetailRow icon={<UserAddIcon />} label="Full Name" value={String(adminRecord.fullName ?? '—')} />
              <DetailRow icon={<EmailIcon color="#6CBB01" />} label="Email" value={String(adminRecord.email ?? '—')} />
              <DetailRow icon={<PhoneIcon color="#6CBB01" />} label="Phone Number" value={String(adminRecord.phoneNumber ?? '—')} />
              <DetailRow icon={<LocationIcon color="#6CBB01" />} label="Address" value={String(adminRecord.address ?? '—')} />
              <p className="text-green-300 font-medium text-sm ml-0 md:ml-8">
                Role:{' '}
                <span className="rounded-full px-3 py-1 text-xs bg-green-50 text-green-600">{String(adminRecord.role ?? role)}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <p className="text-sm text-gray-500">
      Profile for this account type could not be loaded.
    </p>
  );
}
