'use client';

import React from 'react';
import Deliverable from '@/components/dashboard/modules/ModuleDetails/Deliverable';

type MenteeDeliverableTabProps = {
  title?: string;
  deliverables?: string;
  /** Mentee ID for future API: fetch assignment submission for this mentee */
  menteeId?: string;
  /** Module ID for future API */
  moduleId?: string;
};

export default function MenteeDeliverableTab({
  title,
  deliverables,
  menteeId,
  moduleId,
}: MenteeDeliverableTabProps) {
  // Placeholder: backend would return { submitted: boolean, submittedAt?: string, fileUrl?: string }
  const assignmentStatus = {
    submitted: false,
    submittedAt: null as string | null,
    fileUrl: null as string | null,
  };

  return (
    <div className="font-montserrat montserrat space-y-10 w-full min-w-0">
      <Deliverable title={title} deliverables={deliverables} />

      {/* Mentee assignment submission section */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <h3 className="text-green-200 font-bold text-lg md:text-xl mb-4">
          Mentee assignment submission
        </h3>
        <div className="rounded-lg border border-[#6CBB0180] bg-[#F7FDF2] p-6">
          {assignmentStatus.submitted ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-700">
                  Submitted
                </span>
                {assignmentStatus.submittedAt && (
                  <span className="text-sm text-gray-600">
                    {assignmentStatus.submittedAt}
                  </span>
                )}
              </div>
              {assignmentStatus.fileUrl && (
                <a
                  href={assignmentStatus.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-green-200 hover:underline"
                >
                  View submission
                </a>
              )}
            </div>
          ) : (
            <p className="text-green-200/70 text-sm">
              No assignment submitted yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
