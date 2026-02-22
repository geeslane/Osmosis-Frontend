import { LinkedinIcon } from '@/assets/icons';
import Image from 'next/image';
import React from 'react';

const TEAM_IMAGES = [
  'AdedayoKuseju.jpeg',
  'JesuyemiMercy.jpeg',
  'MegbodofoTimilehin.jpeg',
  'OluwafunsoOdumewu.jpeg',
  'OtuofokMonday.jpeg',
] as const;

const TEAM_LINKEDIN: Record<(typeof TEAM_IMAGES)[number], string> = {
  'AdedayoKuseju.jpeg': 'https://www.linkedin.com/in/adedayo-kuseju/',
  'JesuyemiMercy.jpeg': 'https://bit.ly/JesuyemiMercy',
  'MegbodofoTimilehin.jpeg': 'https://www.linkedin.com/in/timilehin-megbodofo-048243266',
  'OluwafunsoOdumewu.jpeg': 'https://www.linkedin.com/in/oluwafunso-odumewu',
  'OtuofokMonday.jpeg':
    'https://www.linkedin.com/in/otoufok-udo-25626219a?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BIVAAwTA6QmawvbBpCInBkw%3D%3D',
};

function fileNameToName(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '');
  return base.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function nameToTwoLines(fullName: string): [string, string] {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) return [parts[0], parts.slice(1).join(' ')];
  return [fullName, ''];
}

export default function Team() {
  return (
    <div className="flex flex-col mb-30 font-montserrat montserrat items-center justify-center py-4 px-8">
      <h3 className="text-green-200 text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
        Our Team
      </h3>
      <div className="grid mt-10 lg:mx-[85px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-[95%] xl:max-w-6xl">
        {TEAM_IMAGES.map((file) => (
          <div
            key={file}
            className="flex flex-col gap-2 items-center justify-center w-full"
          >
            <div className="relative w-full min-w-[180px] max-w-[280px] mx-auto aspect-square rounded-xl overflow-hidden">
              <Image
                src={`/image/teamMembers/${file}`}
                alt={fileNameToName(file)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover rounded-xl transition-all duration-700"
              />
            </div>
            <div className="flex items-center justify-center gap-2 w-full">
              <div className="flex flex-col items-center text-center">
                {(() => {
                  const fullName = fileNameToName(file);
                  const [line1, line2] = nameToTwoLines(fullName);
                  return (
                    <>
                      <span className="text-[#282F2E] font-bold md:text-xl leading-tight sm:hidden">
                        {fullName}
                      </span>
                      <div className="hidden sm:flex flex-col items-center">
                        <span className="text-[#282F2E] font-bold md:text-xl leading-tight">
                          {line1}
                        </span>
                        {line2 && (
                          <span className="text-[#282F2E] font-bold md:text-xl leading-tight">
                            {line2}
                          </span>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
              <a
                href={TEAM_LINKEDIN[file]}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 cursor-pointer text-green-200 hover:text-green-300 transition-colors [&_svg]:w-5 [&_svg]:h-5"
                aria-label={`${fileNameToName(file)} LinkedIn`}
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
