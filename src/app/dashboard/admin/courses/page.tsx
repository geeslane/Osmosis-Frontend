import CoursesDetails from '@/components/admin/courses/CoursesDetails';

export default function AdminCourse() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="ml-0 mb-1 font-lora font-bold text-black text-title-sm sm:text-title-md">
        Courses
      </h1>
      <CoursesDetails />
    </div>
  );
}
