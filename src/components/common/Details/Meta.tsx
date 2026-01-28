export const Meta = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="space-y-1">
      <p className="text-green-300 text-sm font-medium">{label}</p>
      <p className="text-green-200 font-medium">{value}</p>
    </div>
  );
};
