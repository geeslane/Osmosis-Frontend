'use client';

import React, { useState } from 'react';
import SwitchToggle from '@/components/dashboard/profile/SwitchToggle';
import { switchConfigs } from "@/utils/data";
import SwitchRow from "../../../components/dashboard/profile/SwitchRow";
type SectionKey = 'push' | 'lesson' | 'live' | 'general';

type NotificationSettings = {
    push: {
        pushNotification: boolean;
        emailNotification: boolean;
    };
    lesson: {
        lessonProgress: boolean;
        newLesson: boolean;
        reminder: boolean;
        recommendation: boolean;
    };
    live: {
        eventAnnouncements: boolean;
    };
    general: {
        systemUpdates: boolean;
        feedbackRequests: boolean;
    };
};

type NotificationKey<T extends SectionKey> = keyof NotificationSettings[T];

const ProfileNotification = () => {
    const [activeSection, setActiveSection] = useState<SectionKey>('push');

    const [notifications, setNotifications] = useState<NotificationSettings>({
        push: {
            pushNotification: true,
            emailNotification: true,
        },
        lesson: {
            lessonProgress: true,
            newLesson: false,
            reminder: false,
            recommendation: false,
        },
        live: {
            eventAnnouncements: true,
        },
        general: {
            systemUpdates: true,
            feedbackRequests: true,
        },
    });

    const toggle = <T extends SectionKey>(section: T, key: NotificationKey<T>) => {
        setNotifications((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: !prev[section][key],
            },
        }));
    };

    const renderSwitches = () => {
        switch (activeSection) {
            case 'push':
                return (
                    <>
                        <h1 className="text-lg font-semibold">Push Notifications</h1>
                        <SwitchToggle
                            label="Allow Push Notification"
                            description="Enable alerts for new activities and content"
                            enabled={notifications.push.pushNotification}
                            onToggle={() => toggle('push', 'pushNotification')}
                        />
                        <SwitchToggle
                            label="Email Notification"
                            description="Get notifications sent to your email"
                            enabled={notifications.push.emailNotification}
                            onToggle={() => toggle('push', 'emailNotification')}
                        />
                    </>
                );
            case 'lesson':
                return (
                    <>
                        <h1 className="text-lg font-semibold">Lesson Notifications</h1>
                        <SwitchToggle
                            label="Allow Lesson Notifications"
                            description="Enable notifications for your lesson activities"
                            enabled={notifications.lesson.lessonProgress}
                            onToggle={() => toggle('lesson', 'lessonProgress')}
                        />
                        <SwitchToggle
                            label="New Lesson Published"
                            description="Be the first to know when a lesson is available"
                            enabled={notifications.lesson.newLesson}
                            onToggle={() => toggle('lesson', 'newLesson')}
                        />
                        <SwitchToggle
                            label="Lesson Reminder"
                            description="Remind me to complete my lesson"
                            enabled={notifications.lesson.reminder}
                            onToggle={() => toggle('lesson', 'reminder')}
                        />
                        <SwitchToggle
                            label="Lesson Recommendation"
                            description="Get personalized suggestions based on your progress"
                            enabled={notifications.lesson.recommendation}
                            onToggle={() => toggle('lesson', 'recommendation')}
                        />
                    </>
                );
            case 'live':
                return (
                    <>
                        <h1 className="text-lg font-semibold">Live & Special Events</h1>
                        <SwitchToggle
                            label="Event Announcements"
                            description="Get notified about special events, fasts, or prayer meetings"
                            enabled={notifications.live.eventAnnouncements}
                            onToggle={() => toggle('live', 'eventAnnouncements')}
                        />
                    </>
                );
            case 'general':
                return (
                    <>
                        <h1 className="text-lg font-semibold">General Notifications</h1>
                        <SwitchToggle
                            label="System Announcements & Updates"
                            description="Stay informed about major changes, features, or downtime"
                            enabled={notifications.general.systemUpdates}
                            onToggle={() => toggle('general', 'systemUpdates')}
                        />
                        <SwitchToggle
                            label="Surveys & Feedback Requests"
                            description="Help us improve your experience with occasional feedback prompts"
                            enabled={notifications.general.feedbackRequests}
                            onToggle={() => toggle('general', 'feedbackRequests')}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-9xl mx-auto px-4 flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-1/3 space-y-4 text-sm text-black">
                {switchConfigs.notification.map((section) => (
                    <SwitchRow
                        key={section.key}
                        label={section.label}
                        description={section.description}
                        active={activeSection === section.key}
                        onClick={() => setActiveSection(section.key as SectionKey)}
                    />
                ))}
            </div>
            <div className="max-w-100 md:w-2/3 space-y-6">{renderSwitches()}</div>
        </div>
    );
};

export default ProfileNotification;
