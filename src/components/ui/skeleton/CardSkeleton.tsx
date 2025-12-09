import Skeleton from './Skeleton';

export default function CardSkeleton() {
  return (
    <div className="p-4 border rounded-md shadow-sm space-y-4">
      <Skeleton height="h-40" rounded="rounded-lg" />
      <Skeleton width="w-3/4" />
      <Skeleton width="w-1/2" />
    </div>
  );
}
