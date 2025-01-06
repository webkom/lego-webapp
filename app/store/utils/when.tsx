import { LoadingIndicator } from '@webkom/lego-bricks';
import { RequestStatus } from 'app/reducers/requests';
import type { RequestState } from 'app/reducers/requests';
import type { ReactNode } from 'react';

type WhenArg<T, E = unknown> = {
  pending?: (
    state: RequestState<T, E> & { status: RequestStatus.PENDING },
  ) => ReactNode;
  error?: (
    error: E,
    state: RequestState<T, E> & { status: RequestStatus.FAILURE },
  ) => ReactNode;
  success?: (
    data: T,
    state: RequestState<T, E> & { status: RequestStatus.SUCCESS },
  ) => ReactNode;
  /**
   * This will render whenever the request has data regardless of the status, overriding the other renderers.
   */
  data?: (data: T, state: RequestState<T, E>) => ReactNode;
};

/**
 * Utility for creating components using async data from a `RequestState` object.
 * Makes it easier to handle pending and error states with type safety.
 *
 * Example:
 * ```typescript
 * const MyComponent = () => {
 *   const someAsyncData: RequestState<DataType> = useSomeData();
 *
 *   return when(someAsyncData, {
 *     pending: () => <Skeleton />,
 *     error: (error) => <Card severity="danger">{error.message}</Card>,
 *     success: (data) => <Card>{data}</Card>
 *     data: (data) => <Card>{data}</Card>
 *   });
 * }
 * ```
 */
export const when = <T, E>(
  request: RequestState<T, E>,
  {
    pending = () => <LoadingIndicator loading />,
    error = () => {
      throw Error(
        `No error renderer provided when displaying request "${request.id}"`,
      );
    },
    success = () => null,
    data,
  }: WhenArg<T, E>,
) => {
  if (request.data !== undefined && data !== undefined) {
    return data(request.data, request);
  }

  switch (request.status) {
    case RequestStatus.PENDING: {
      return pending(request);
    }
    case RequestStatus.FAILURE: {
      return error(request.error, request);
    }
    case RequestStatus.SUCCESS: {
      return success(request.data, request);
    }
  }
};
