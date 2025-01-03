import { RequestStatus } from 'app/reducers/requests';
import type { RequestState } from 'app/reducers/requests';
import type { ReactNode } from 'react';

type WhenArg<T, E = unknown> = {
  pending: (
    state: RequestState<T, E> & { status: RequestStatus.PENDING },
  ) => ReactNode;
  error?: (
    error: E,
    state: RequestState<T, E> & { status: RequestStatus.FAILURE },
  ) => ReactNode;
  data: (
    data: T,
    state: RequestState<T, E> & { status: RequestStatus.SUCCESS },
  ) => ReactNode;
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
 *     data: (data) => <Card>{data}</Card>
 *   });
 * }
 * ```
 */
export const when = <T>(
  request: RequestState<T>,
  { pending, error, data }: WhenArg<T>,
) => {
  switch (request.status) {
    case RequestStatus.PENDING: {
      return pending(request);
    }
    case RequestStatus.FAILURE: {
      if (!error)
        throw Error(
          `No error renderer provided when displaying request "${request.id}"`,
        );
      return error(request.error, request);
    }
    case RequestStatus.SUCCESS: {
      return data(request.data, request);
    }
  }
};
