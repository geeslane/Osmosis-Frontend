export const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex gap-4 min-w-0">
      {icon}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <p className="text-green-300 text-sm font-medium">{label}</p>
        <p className="text-green-300 font-medium break-words whitespace-normal">{value}</p>
      </div>
    </div>
  );
};
