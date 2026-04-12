const emptyDisplay = '—';

export const Info = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) => {
  const display = value?.trim() ? value : emptyDisplay;
  return (
    <div className="flex items-start gap-3 min-w-0">
      <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#DCFFAD91] text-[#6CBB01] [&_svg]:w-5 [&_svg]:h-5">
        {icon}
      </span>
      <div className="min-w-0 space-y-0.5 flex-1">
        <p className="text-green-300 text-sm font-medium">{label}</p>
        <p className="text-green-200 font-medium break-words whitespace-normal">
          {display}
        </p>
      </div>
    </div>
  );
};
