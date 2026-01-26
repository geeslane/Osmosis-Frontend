type NoResultsProps = {
  title?: string;
  description?: string;
};

export function NoResult({
  title = 'No results found',
  description = 'We couldn’t find anything matching your search.',
}: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
