'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AddIcon, LoadingIcon, UserIcon } from '@/assets/icons';
import { useUpdateUserProfileImageMutation } from '@/store/profile/profile.api';
import useToastify from '@/hooks/useToastify';

const ProfileHeader = () => {
  const { showToast } = useToastify();
  const user = useSelector((state: RootState) => state.profile.user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [updateUserProfileImage, { isLoading }] =
    useUpdateUserProfileImageMutation();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'user');
    try {
      const response = await updateUserProfileImage(formData).unwrap();
      showToast(response.message, 'success');
    } catch (error) {
      showToast(error as string, 'error');
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="w-full relative h-25 rounded-xl overflow-hidden mb-6">
      <Image
        src="/images/home/Profile-Background.png"
        alt="Header background"
        fill
        className="object-cover"
        priority
      />

      <div className="relative  z-10 h-full flex items-center gap-4 bg-black/10 px-6">
        <div
          onClick={isLoading ? undefined : handleImageClick}
          className="relative w-16 h-16 border-[1px] rounded-full flex justify-center items-center"
        >
          {user?.avatar ? (
            <Image
              src={user?.avatar as string}
              width={44}
              height={44}
              alt="User"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <UserIcon width={18} height={18} />
          )}

          <span className="absolute bottom-0 right-0 cursor-pointer  bg-white dark:bg-gray-700 p-1 rounded-full shadow-md">
            {isLoading ? <LoadingIcon /> : <AddIcon />}
          </span>
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-black">
            {user?.full_name}
          </h2>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
