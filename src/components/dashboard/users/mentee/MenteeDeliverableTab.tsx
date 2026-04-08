'use client';

import React, { useState } from 'react';
import Deliverable from '@/components/dashboard/modules/ModuleDetails/Deliverable';
import Button from '@/components/ui/button/Button';
import useToastify from '@/hooks/useToastify';

type MenteeDeliverableTabProps = {
  title?: string;
  deliverables?: string;
  /** Mentee ID for future API: fetch assignment submission for this mentee */
  menteeId?: string;
  /** Module ID for future API */
  moduleId?: string;
  /** Called when mentee submits answers (so parent can show "Mark as completed" outside tabs) */
  onAnswersSubmitted?: () => void;
};

export default function MenteeDeliverableTab({
  title,
  deliverables,
  menteeId,
  moduleId,
  onAnswersSubmitted,
}: MenteeDeliverableTabProps) {
  const { showToast } = useToastify();
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState('');

  const handleSubmit = () => {
    if (!answer.trim()) return;
    // TODO: API call to submit answer (e.g. POST /teenager/me/modules/:moduleId/deliverable with { answer })
    setSubmittedAnswer(answer.trim());
    setIsSubmitted(true);
    showToast('Answers submitted successfully', 'success');
    onAnswersSubmitted?.();
  };

  return (
    <div className="font-montserrat montserrat space-y-10 w-full min-w-0">
      <Deliverable title={title} deliverables={deliverables} />

      {/* Field for mentee to type their answers */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-green-200 font-bold text-lg md:text-xl mb-2">
          Your answers
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Type your answers to the questions above in the box below.
        </p>
        {isSubmitted && submittedAnswer ? (
          <div className="rounded-lg border border-[#6CBB0180] bg-[#F7FDF2] p-4">
            <p className="text-sm text-[#101828] whitespace-pre-wrap">
              {submittedAnswer}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-700">
                Submitted
              </span>
            </div>
          </div>
        ) : (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answers here..."
              rows={8}
              className="w-full rounded-lg border border-[#6CBB0180] bg-white px-4 py-3 text-sm text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200/50 resize-y min-h-[160px]"
            />
            <div className="mt-4">
              <Button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="bg-green-200 text-white px-6 py-2.5 rounded-xl"
              >
                Submit answers
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
