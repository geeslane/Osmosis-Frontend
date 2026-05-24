import { CallsApi } from '@/store/calls/calls.api';

type Dispatch = (action: unknown) => void;

/**
 * Upcoming/previous lists use callsApi; accept/reject uses dashboardApi.
 * Refetch callsApi after dashboard/schedule mutations so tabs update without reload.
 */
export function invalidateCallsApiCaches(dispatch: Dispatch) {
  dispatch(CallsApi.util.invalidateTags(['Calls']));
}

/** Use on call-request accept/reject/create in dashboardApi and scheduleApi. */
export function onCallMutationStarted(
  _: unknown,
  {
    dispatch,
    queryFulfilled,
  }: { dispatch: Dispatch; queryFulfilled: Promise<unknown> }
) {
  queryFulfilled
    .then(() => invalidateCallsApiCaches(dispatch))
    .catch(() => undefined);
}
