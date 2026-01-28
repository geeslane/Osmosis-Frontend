export const Info = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {icon}
      <div className="space-y-1">
        <p className="text-green-300 text-sm font-medium">{label}</p>
        <p className="text-green-200 font-medium truncate">{value}</p>
      </div>
    </div>
  );
};
