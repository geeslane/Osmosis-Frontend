const emptyDisplay = '—';

export const Meta = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}) => {
  const display = value?.trim() ? value : emptyDisplay;
  return (
    <div className={`flex gap-3 min-w-0 ${icon ? 'items-start' : ''}`}>
      {icon && (
        <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#DCFFAD91] [&_svg]:w-5 [&_svg]:h-5 [&_svg]:text-[#282F2E]">
          {icon}
        </span>
      )}
      <div className="min-w-0 space-y-0.5">
        <p className="text-green-300 text-sm font-medium">{label}</p>
        <p className="text-green-200 font-medium break-words whitespace-normal">{display}</p>
      </div>
    </div>
  );
};
