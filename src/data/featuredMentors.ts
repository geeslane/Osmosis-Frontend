export type FeaturedMentor = {
  slug: string;
  name: string;
  /** Shown on bio page heading (e.g. includes honorific). */
  pageTitle: string;
  title: string;
  image: string;
  linkedInUrl?: string;
  tagline?: string;
  paragraphs?: string[];
  /** Home grid: only some mentors link through to a full bio. */
  linkFromHome?: boolean;
  /** Bio page shows portrait only (no long copy). */
  imageOnly?: boolean;
};

export const FEATURED_MENTORS: FeaturedMentor[] = [
  {
    slug: 'toyin-sam-emehelu',
    name: 'Toyin Sam-Emehelu',
    pageTitle: 'Dr. Toyin Sam-Emehelu',
    title: 'Global Education Consultant',
    image: '/mentors/Toyin Sam-Emehelu.jpg',
    linkedInUrl: 'https://www.linkedin.com/in/toyinsam-emehelu/',
    linkFromHome: true,
    tagline:
      'Global education consultant, transformational leadership coach, and founder of Coreskills Transformational Academy.',
    paragraphs: [
      'Dr. Toyin Sam-Emehelu is a global education consultant, transformational leadership coach/mentor, and the visionary founder of Coreskills Transformational Academy. With nearly 30 years of experience as an educator, mentor, and trainer, she has devoted her life to unlocking human potential, building purposeful educators, and equipping organizations to grow sustainably—with excellence, heart, and results.',
      'Dr. Toyin’s work transcends classrooms. She has mentored over 60,000 learners across Africa and beyond, inspired more than 1,000 individuals through coaching, and guided over 80 education consultants into certified success. Her transformative programs have helped people—from emerging educators to executives—clarify their vision, elevate their influence, and live with deeper significance.',
      'She holds a Doctorate in Educational Planning and Management, alongside certifications in Public Leadership and Policy. As a Fellow of the Chartered Institute of Mentoring and Coaching, and the Partnership Lead at Equip Nigeria (John C. Maxwell’s nonprofit), her influence spans both local and global platforms. She mentors rising leaders through initiatives like the Tony Elumelu Foundation, Teach for Nigeria, West Africa Vocational Enterprise, Master Card Foundation, and Teach for Nigeria.',
      'Whether designing life-shaping curricula, training corporate teams, or keynoting global conferences, Dr. Toyin brings unmatched energy, grace, and clarity. Her work is a fusion of deep expertise, lived experience, and soulful teaching—the kind that doesn’t just inform, but transforms.',
      'A prolific author of 33 books, Dr. Toyin is also a beloved wife and mother, championing balance, faith, and family as part of her calling. Through her Coreskills Accountability Mentoring Program, she walks intimately with those she serves, creating space for purpose, passion, and progress to thrive.',
      'Dr. Toyin’s message is magnetic: “Teaching is not just a profession—it’s a legacy.” If you are ready to shift from content delivery to true transformation, she is not just a teacher for your journey—she is a partner in your evolution.',
    ],
  },
  {
    slug: 'oluwatobi-olajide',
    name: 'Oluwatobi Olajide',
    pageTitle: 'Oluwatobi Olajide',
    title: 'Chartered Accountant & AI Professional',
    image: '/mentors/Oluwatobi Olajide.jpg',
    linkedInUrl: 'https://www.linkedin.com/in/oluwatobiolajide/',
    linkFromHome: true,
    tagline:
      'Finance Leader, Chartered Accountant, AI Professional, & Teenage Coach',
    paragraphs: [
      'Oluwatobi Olajide is a seasoned finance professional, Business Consultant and Certified AI Professional and teenage coach with over a decade of cross-industry experience spanning telecoms, energy, education, and consulting.',
      'Currently serving as a Financial Planning & Analysis Specialist at a leading indigenous towerco company in Nigeria, he has led transformative initiatives in budgeting, financial modeling, and strategic planning.',
      'Beyond the boardroom, Oluwatobi is a passionate teen coach, mentor, and founder of the Analytics Mastery Group, where he empowers aspiring analysts across Nigeria. As an ALX Fellow, TEF Mentor, and HarvardX Executive Program Alumnus, he blends financial expertise with a deep commitment to human capital development.',
      'A dynamic speaker and lifelong learner, Oluwatobi brings a unique blend of technical mastery, leadership, and purpose-driven impact to every engagement. His mantra? “Mastery is Possible.”',
    ],
  },
  {
    slug: 'omowunmi-peter',
    name: 'Omowunmi Peter',
    pageTitle: 'Omowunmi Peter',
    title: 'Co-Convener, Anora Media TV',
    image: '/mentors/Omowunmi Peter.jpg',
    imageOnly: true,
    linkFromHome: true,
  },
];

export function getFeaturedMentorBySlug(
  slug: string
): FeaturedMentor | undefined {
  return FEATURED_MENTORS.find((m) => m.slug === slug);
}

export function getFeaturedMentorSlugs(): string[] {
  return FEATURED_MENTORS.map((m) => m.slug);
}

/** Where the user opened a mentor bio from (drives back link). */
export type MentorBioReturnKey = 'home' | 'about' | 'mentors';

export const MENTOR_BIO_RETURN: Record<
  MentorBioReturnKey,
  { href: string; label: string }
> = {
  home: { href: '/#mentors', label: '← Back to Our Mentors' },
  about: { href: '/about', label: '← Back to About' },
  mentors: { href: '/mentors', label: '← Back to Mentors' },
};

export function mentorBioPath(
  slug: string,
  from?: MentorBioReturnKey
): string {
  return from ? `/mentors/${slug}?from=${from}` : `/mentors/${slug}`;
}

export function resolveMentorBioReturn(
  from: string | null
): { href: string; label: string } | null {
  if (from && from in MENTOR_BIO_RETURN) {
    return MENTOR_BIO_RETURN[from as MentorBioReturnKey];
  }
  return null;
}
