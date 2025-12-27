export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About us', href: '/about' },
  { label: 'Mentors', href: '/mentor' },
  { label: 'FAQs', href: '/FAQ' },
  { label: 'Contact us', href: '/contact' },
];
export const users = [
  '/reviews/user1.png',
  '/reviews/user2.png',
  '/reviews/user3.png',
  '/reviews/user.png',
];

export const mentors = [
  {
    image: '/image/mentor1.jpg',
    name: 'Alex Johnson',
    role: 'Mentor',
  },
  {
    image: '/image/prod1.jpg',
    name: 'Sarah Williams',
    role: 'Lead Mentor',
  },
  {
    image: '/image/prod.jpg',
    name: 'Michael Brown',
    role: 'Youth Coach',
  },
  {
    image: '/image/prod2.jpg',
    name: 'Michael Brown',
    role: 'Youth Coach',
  },
];

export const IMAGES = [
  '/image/Av.jpg',
  '/image/Avs.jpg',
  '/image/Avss.jpg',
  '/image/Avsss.jpg',
];
export const ProductIMAGES = [
  '/image/prod.jpg',
  '/image/prod2.jpg',
  '/image/prod1.jpg',
];
export const imageSources = [
  '/image/us.jpg',
  '/image/user2.jpg',
  '/image/user.png',
];
export const AboutimageSources = [
  '/AboutImage/us.jpg',
  '/AboutImage/user.jpg',
  '/AboutImage/user2.jpg',
];
export const courseCategories = [
  {
    title: 'Foundations',
    description:
      'Start your journey with core teachings on salvation, prayer, and Scripture.',
    image: '/images/home/Foundations.png',
    lessons: 15,
  },
  {
    title: ' Disciple',
    description: 'Learn to follow Jesus daily with obedience and intimacy.',
    image: '/images/home/Disciple.png',
    lessons: 15,
  },
  {
    title: ' Ministry',
    description:
      'Discover your calling and how to serve effectively in the body of Christ.',
    image: '/images/home/Ministry.png',
    lessons: 15,
  },
  {
    title: 'Leadership',
    description:
      'Grow into a Christ-centered leader — humble, bold, and Spirit-led.',
    image: '/images/home/Christ.png',
    lessons: 15,
  },
];

export const courseFeatures = [
  {
    icon: '/images/home/bible_icon.svg',
    alt: 'Bible Icon',
    title: 'Browse Biblical Courses.',
    description: (
      <>
        Explore our free library of Bible-based discipleship
        <br />
        courses created to help you grow in Christ.
      </>
    ),
    linkText: 'Explore Courses →',
    href: '/dashboard/explore-courses',
  },
  {
    icon: '/images/home/video_icon.svg',
    alt: 'Video Icon',
    title: 'Learn At Your Pace.',
    description: (
      <>
        Watch videos, listen to audio teachings, or read
        <br />
        notes all at your convenience.
      </>
    ),
    linkText: 'Browse Library →',
    href: '/dashboard/explore-courses',
  },
  {
    icon: '/images/home/cross_icon.svg',
    alt: 'Cross Icon',
    title: 'Grow In Christ.',
    description: (
      <>
        Apply what you learn as we help you become a
        <br />
        disciple who reflects Jesus in everyday life.
      </>
    ),
    linkText: 'Start Growing →',
    href: '/dashboard/explore-courses',
  },
];

export const switchConfigs = {
  account: [
    {
      key: 'personal',
      label: 'Personal Information',
      description: 'Edit your personal information.',
    },
  ],
  notification: [
    {
      key: 'push',
      label: 'Push Notifications',
      description: 'Control alerts for new activities and updates.',
    },
    {
      key: 'lesson',
      label: 'Lesson Notifications',
      description: 'Receive notifications about your lesson progress.',
    },
    {
      key: 'live',
      label: 'Live & Special Events',
      description:
        'Get notified about special events, fasts, or prayer meetings.',
    },
    {
      key: 'general',
      label: 'General Notifications',
      description: 'Manage announcements and feedback requests.',
    },
  ],
  security: [
    {
      key: 'password',
      label: 'Password Settings',
      description: 'Change to a new password.',
    },
    {
      key: 'delete',
      label: 'Delete Account',
      description: 'Request permanent deletion of my account',
    },
  ],
};

export const notifications = [
  {
    title: 'Start A New Course.',
    description: 'Continue your journey in Christ by starting the next course.',
    time: 'Just Now',
    read: false,
    iconBg: 'bg-gray-100',
    iconColor: 'text-black',
  },
  {
    title: 'Course Completed! 🎉',
    description:
      'Congratulations on completing all lessons in the Foundations Course!',
    time: '1 min',
    read: true,
    iconBg: 'bg-gray-100',
    iconColor: 'text-black',
  },
  {
    title: 'New Milestone! 🔥',
    description: 'You’ve completed 5 lessons in a row! Keep the streak alive',
    time: '1 day',
    read: true,
    iconBg: 'bg-gray-100',
    iconColor: 'text-black',
  },
  {
    title: 'Lesson Reminder',
    description: 'Don’t forget to complete your lesson for this week.',
    time: '1 day',
    read: false,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-400',
  },
];
export const data = [
  {
    id: '0001',
    name: 'Liam Harper',
    email: 'liam@untitledui.com',
    address: '123 Main St, Apt 4',
    phone: '+1 202 555 0111',
    status: 'Active',
    image: '/image/Avatar1.png',
  },
  {
    id: '0002',
    name: 'Olivia Rhye',
    email: 'olivia@untitledui.com',
    address: '456 Business Blvd, Ste 100',
    phone: '+234 801 234 5678',
    status: 'Inactive',
    image: '/image/Avatar.png',
  },
  {
    id: '0003',
    name: 'Noah Bennett',
    email: 'noah@untitledui.com',
    address: '78 Market St',
    phone: '+44 20 7946 0958',
    status: 'Pending',
    image: '/image/Avatar2.png',
  },
  {
    id: '0004',
    name: 'Emma Stone',
    email: 'emma@untitledui.com',
    address: '9 Elm Street',
    phone: '+1 303 555 0187',
    status: 'Active',
    image: '/image/user1.png',
  },
  {
    id: '0005',
    name: 'Olivia Harper',
    email: 'olivia.h@untitledui.com',
    address: '22 Oak Ave',
    phone: '+1 303 555 0188',
    status: 'Active',
    image: '/image/user2.jpg',
  },
  {
    id: '0006',
    name: 'Sophia Turner',
    email: 'sophia@untitledui.com',
    address: '200 Industrial Rd',
    phone: '+61 2 9999 0000',
    status: 'Inactive',
    image: '/image/Avs.jpg',
  },
  {
    id: '0007',
    name: 'Mason Cole',
    email: 'mason@untitledui.com',
    address: '400 Park Blvd',
    phone: '+1 415 555 0199',
    status: 'Active',
    image: '/image/prod.jpg',
  },
  {
    id: '0008',
    name: 'Ava Wilson',
    email: 'ava@untitledui.com',
    address: '33 Pine Ln',
    phone: '+1 415 555 0177',
    status: 'Pending',
    image: '/image/mentor.jpg',
  },
  {
    id: '0009',
    name: 'Ethan Brooks',
    email: 'ethan@untitledui.com',
    address: '56 Cedar St',
    phone: '+1 212 555 0123',
    status: 'Active',
    image: '/image/us.jpg',
  },
  {
    id: '0010',
    name: 'Isabella Clark',
    email: 'isabella@untitledui.com',
    address: '1010 Sunset Blvd',
    phone: '+1 310 555 0144',
    status: 'Inactive',
    image: '/image/Av.jpg',
  },
];
