import {
  formatModuleDate,
  moduleCountdownLabel,
} from '@/utils/moduleDateLabels';

type ModuleDateRangeProps = {
  startDate?: string;
  endDate?: string;
  className?: string;
};

/** Module period dates + relative countdown (shared across roles). */
export default function ModuleDateRange({
  startDate,
  endDate,
  className = 'text-xs text-gray-500 font-medium mt-1',
}: ModuleDateRangeProps) {
  if (!startDate && !endDate) return null;

  const label = moduleCountdownLabel(startDate, endDate);

  return (
    <p className={className}>
      {startDate && <span>{formatModuleDate(startDate)}</span>}
      {startDate && endDate && (
        <span aria-hidden>{' \u2013 '}</span>
      )}
      {endDate && <span>{formatModuleDate(endDate)}</span>}
      {label && (
        <>
          <span className="mx-0.5" aria-hidden>
            {'\u00B7'}
          </span>
          <span>{label}</span>
        </>
      )}
    </p>
  );
}
