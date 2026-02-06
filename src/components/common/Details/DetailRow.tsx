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
    <div className="flex gap-4">
      {icon}
      <div className="flex flex-col gap-1">
        <p className="text-green-300 text-sm font-medium">{label}</p>
        <p className="text-green-300 font-medium">{value}</p>
      </div>
    </div>
  );
};
