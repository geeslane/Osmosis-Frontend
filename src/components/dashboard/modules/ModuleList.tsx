'use client';
import { Modules } from '@/utils/data';
import { useRouter } from 'next/navigation';

export default function ModuleList() {
  const router = useRouter();

  return (
    <div className="max-full font-montserrat mt-8 montserrat mx-auto space-y-6">
      {Modules.map((module) => (
        <div
          key={module.id}
          className="flex flex-col gap-5  border-b px-5 border-green-100 pb-4"
        >
          <div className="flex flex-col gap-3 ">
            <div className="flex flex-col gap-3 md:flex-row justify-between md:items-center w-full">
              <div>
                <h2 className="font-medium  text-[#282F2E]">
                  {module.title}: {module.name}
                </h2>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/modules/${module.id}?fileId=${module.fileid}`
                    )
                  }
                  className="bg-green-200 text-white px-2 md:px-6 py-3 rounded-md text-xs font-medium"
                >
                  View Modules
                </button>

                <button
                  onClick={() => console.log('Remove module', module.fileid)}
                  className="bg-green-100 text-white px-2 md:px-6 py-3 rounded-md text-xs font-medium"
                >
                  Remove Module
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
