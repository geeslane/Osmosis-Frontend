'use client';

import React, { useEffect, useState } from 'react';
import Deliverable from '@/components/dashboard/modules/ModuleDetails/Deliverable';
import Button from '@/components/ui/button/Button';
import useToastify from '@/hooks/useToastify';
import {
  useGetTeenagerMeModuleDeliverableQuery,
  useSubmitTeenagerModuleDeliverableMutation,
} from '@/store/dashboard/dashboard.api';

type MenteeDeliverableTabProps = {
  title?: string;
  deliverables?: string;
  readOnly?: boolean;
  initialSubmission?: string | null;
  menteeId?: string;
  moduleId?: string;
  onAnswersSubmitted?: () => void;
};

export default function MenteeDeliverableTab({
  title,
  deliverables,
  readOnly = false,
  initialSubmission = null,
  moduleId,
  onAnswersSubmitted,
}: MenteeDeliverableTabProps) {
  const { showToast } = useToastify();
  const [answer, setAnswer] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  const { data: serverAnswer, isLoading: loadingSubmission } =
    useGetTeenagerMeModuleDeliverableQuery(moduleId ?? '', {
      skip: readOnly || !moduleId,
    });

  const [submitDeliverable, { isLoading: submitting }] =
    useSubmitTeenagerModuleDeliverableMutation();

  useEffect(() => {
    if (!readOnly && serverAnswer?.trim()) {
      setAnswer(serverAnswer);
    }
  }, [readOnly, serverAnswer]);

  const teenHasSavedAnswer = Boolean(serverAnswer?.trim());

  const handleSubmit = async () => {
    if (!moduleId || !answer.trim()) return;
    try {
      await submitDeliverable({ moduleId, answer: answer.trim() }).unwrap();
      setJustSubmitted(true);
      showToast('Answers submitted successfully', 'success');
      onAnswersSubmitted?.();
    } catch {
      showToast('Could not submit answers. Please try again.', 'error');
    }
  };

  if (readOnly) {
    const text =
      initialSubmission != null && String(initialSubmission).trim()
        ? String(initialSubmission).trim()
        : '';
    return (
      <div className="font-montserrat montserrat space-y-10 w-full min-w-0">
        <Deliverable title={title} deliverables={deliverables} />
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-green-200 font-bold text-lg md:text-xl mb-2">
            Mentee submission
          </h3>
          {text ? (
            <div className="rounded-lg border border-[#6CBB0180] bg-[#F7FDF2] p-4">
              <p className="text-sm text-[#101828] whitespace-pre-wrap">{text}</p>
              <div className="mt-3">
                <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-700">
                  Submitted
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No submission recorded for this module yet.</p>
          )}
        </div>
      </div>
    );
  }

  const showSubmittedBlock = teenHasSavedAnswer || justSubmitted;

  return (
    <div className="font-montserrat montserrat space-y-10 w-full min-w-0">
      <Deliverable title={title} deliverables={deliverables} />

      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-green-200 font-bold text-lg md:text-xl mb-2">
          Your answers
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Type your answers to the questions above in the box below.
        </p>
        {loadingSubmission && !serverAnswer ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : showSubmittedBlock ? (
          <div className="rounded-lg border border-[#6CBB0180] bg-[#F7FDF2] p-4">
            <p className="text-sm text-[#101828] whitespace-pre-wrap">
              {(serverAnswer ?? answer).trim() || '—'}
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
                onClick={() => void handleSubmit()}
                disabled={!answer.trim() || submitting}
                className="bg-green-200 text-white px-6 py-2.5 rounded-xl"
              >
                {submitting ? 'Submitting…' : 'Submit answers'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
