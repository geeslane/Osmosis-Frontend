'use client';
import { Modules } from '@/utils/data';
import { useRouter } from 'next/navigation';

export default function ModuleList() {
  const router = useRouter();

  return (
    <div className="max-w-4xl font-montserrat montserrat mx-auto space-y-6">
      {Modules.map((module) => (
        <div
          key={module.id}
          className="flex flex-col gap-5 border-b px-5 border-green-100 pb-4"
        >
          <h2 className="font-medium text-[#282F2E]">{module.title}</h2>

          <div className="flex flex-col gap-3">
            {module.files.map((file) => (
              <div
                key={file.id}
                className="flex justify-between items-center w-full"
              >
                <p className="font-medium text-[#282F2E]">{file.name}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/modules/${module.id}?fileId=${file.id}`
                      )
                    }
                    className="bg-green-200 text-white px-6 py-3 rounded-md text-xs font-medium"
                  >
                    View Modules
                  </button>

                  <button
                    onClick={() => console.log('Remove module', module.id)}
                    className="bg-green-100 text-white px-6 py-3 rounded-md text-xs font-medium"
                  >
                    Remove Module
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
