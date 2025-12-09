import { axiosBaseQuery } from '@/lib/baseApi';
import { createApi } from '@reduxjs/toolkit/query/react';

interface DashboardResponse {
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
interface AllCourse {
  isStarted: any;
  completed_lesson: number;
  slug: string;
  id: number;
  title: string;
  about_course: string;
  course_image: string;
  description: string;
  lesson_count?: number;
  lesson_progress?: {
    completed_lessons: number;
    total_lessons: number;
    percentage_completed?: number;
  };
}
interface AllCourseResponse {
  success: boolean;
  message?: string;
  data: AllCourse[];
}
interface Course {
  title: string;
  about: string;
  bgColor: string;
  badgeColor: string;
  bgImage: string;
  thumbnail: string;
  totalLessons: number;
  totalDuration: string;
  lessons: Lesson[];
  about_course: string;
  slug: string;
  description: string;
  color_code: string;
  lesson_count: number;
  course_video: string;
  isStarted: boolean;
  lesson_progress?: {
    completed_lessons: number;
    total_lessons: number;
  };
  completed_lessons: number;
  total_lesson: number;
  total_lessons_duration: number;
}
interface EventsResponse {
  status: boolean;
  message: string;
  data: EventItem[];
  meta: PaginationMeta;
}
interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}
interface EventItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  avatar: string;
  video_url: string;
  audio_url: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  status: string;
  is_live: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface CourseResponse {
  success: boolean;
  message?: string;
  data: Course;
}
interface ShowLessonResponse {
  lesson_order: number;
  content: string;
  success: boolean;
  message?: string;
  data: {
    lesson: Lesson;
    next_lessons: Lesson[];
    previous_lessons: Lesson[];
  };
}
interface Lesson {
  slug: string;
  title: string;
  lesson_content: string;
  lesson_note: string;
  lesson_order: number;
  description: string;
  color_code: string;
  lesson_count: number;
  lesson_video: string;
  isCompleted: any;
}
interface LessonQueryArg {
  lesson: string;
}
interface CourseQueryArg {
  course: string;
}
interface MarkLessonPayload {
  lesson: string;
}
interface StartCoursePayload {
  course: string;
}
interface SearchResult {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  about_course?: string;
  course_video?: string;
  course_image?: string;
  lesson_note?: string;
  lesson_content?: string;
  lesson_video?: string;
  lesson_image?: string;
  lesson_duration?: number;
  isCompleted?: boolean | string;
  lesson_order?: number;
  created_at?: string;
}

interface SearchResponse {
  status: boolean;
  message: string;
  data: {
    courses: SearchResult[];
    lessons: SearchResult[];
  };
}

interface SearchQueryArg {
  query: string;
}
export const DashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Course', 'AllCourses'],
  endpoints: (builder) => ({
    dashboard: builder.query<DashboardResponse, void>({
      query: () => ({
        url: '/api/dashboard',
        method: 'GET',
      }),
    }),
    allCourses: builder.query<AllCourseResponse, void>({
      query: () => ({
        url: '/api/courses/user/course',
        method: 'GET',
      }),
      providesTags: ['AllCourses'],
    }),
    ExploreCourses: builder.query<AllCourseResponse, void>({
      query: () => ({
        url: '/api/courses',
        method: 'GET',
      }),
    }),
    homepageCourses: builder.query<AllCourseResponse, void>({
      query: () => ({
        url: '/api/all-courses',
        method: 'GET',
      }),
    }),
    Course: builder.query<CourseResponse, CourseQueryArg>({
      query: ({ course }) => ({
        url: `/api/courses/${course}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [
        { type: 'Course', id: arg.course },
      ],
    }),

    ShowALesson: builder.query<ShowLessonResponse, LessonQueryArg>({
      query: ({ lesson }) => ({
        url: `/api/lessons/${lesson}`,
        method: 'GET',
      }),
    }),
    MarkLesson: builder.mutation<DashboardResponse, MarkLessonPayload>({
      query: ({ lesson }) => ({
        url: `/api/lessons/${lesson}/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['AllCourses'],
    }),
    StartCourse: builder.mutation<DashboardResponse, StartCoursePayload>({
      query: ({ course }) => ({
        url: `/api/courses/${course}/start`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Course', id: arg.course },
      ],
    }),
    Events: builder.query<EventsResponse, number | void>({
      query: (page = 1) => ({
        url: `/api/events?page=${page}`,
        method: 'GET',
      }),
    }),
    LiveEvents: builder.query<EventsResponse, void>({
      query: () => ({
        url: `/api/events/live`,
        method: 'GET',
      }),
    }),
    UpComingEvents: builder.query<EventsResponse, void>({
      query: () => ({
        url: `/api/events/scheduled`,
        method: 'GET',
      }),
    }),
    searchCoursesAndLessons: builder.query<SearchResponse, SearchQueryArg>({
      query: ({ query }) => ({
        url: `/api/search?query=${query}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useDashboardQuery,
  useAllCoursesQuery,
  useCourseQuery,
  useHomepageCoursesQuery,
  useShowALessonQuery,
  useMarkLessonMutation,
  useExploreCoursesQuery,
  useStartCourseMutation,
  useEventsQuery,
  useLiveEventsQuery,
  useUpComingEventsQuery,
  useSearchCoursesAndLessonsQuery,
} = DashboardApi;
