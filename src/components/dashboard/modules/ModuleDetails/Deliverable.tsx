import React from 'react';

type DeliverableProps = {
  title?: string;
  deliverables?: string;
};

export default function Deliverable({
  title,
  deliverables,
}: DeliverableProps) {
  if (!title && !deliverables) {
    return (
      <div className="font-montserrat montserrat space-y-10 text-green-200">
        <p className="text-green-200/70">No deliverable content available.</p>
      </div>
    );
  }

  return (
    <div className="font-montserrat montserrat space-y-10 w-full min-w-0">
      {title && (
        <h3 className="text-green-200 font-bold text-xl md:text-[32px] break-words">
          {title}
        </h3>
      )}
      {deliverables && (
        <div
          className="rich-text-content text-green-200 font-medium break-words [&_strong]:font-semibold [&_p]:mb-3 [&_p:last-child]:mb-0 [&_*]:break-words"
          dangerouslySetInnerHTML={{ __html: deliverables }}
        />
      )}
    </div>
  );
}
