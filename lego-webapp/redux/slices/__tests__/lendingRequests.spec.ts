import { describe, expect, it } from 'vitest';
import { selectTransformedLendingRequests } from '../lendingRequests';
import type { ListLendableObject } from '~/redux/models/LendableObject';
import type { ListLendingRequest } from '~/redux/models/LendingRequest';
import { LendingRequestStatus } from '~/redux/models/LendingRequest';
import { createRootReducer, type RootState } from '~/redux/rootReducer';

const createLendingRequest = (
  id: number,
  lendableObjectId: number,
): ListLendingRequest => ({
  id,
  createdBy: 1,
  lendableObject: lendableObjectId,
  status: LendingRequestStatus.Created,
  startDate: '2026-01-01',
  endDate: '2026-01-02',
  actionGrant: [],
  timelineEntries: [],
});

const createLendableObject = (id: number): ListLendableObject => ({
  id,
  title: `Object ${id}`,
  description: '',
  image: '',
  location: 'R1',
  canLend: true,
  availability: [],
  category: 'other',
  responsibleGroups: [],
});

const rootReducer = createRootReducer();

const createState = (
  lendingRequests: ListLendingRequest[],
  lendableObjects: ListLendableObject[],
): RootState => {
  const base = rootReducer(undefined, { type: '@@INIT' });

  return {
    ...base,
    lendingRequests: {
      ...base.lendingRequests,
      ids: lendingRequests.map((r) => r.id),
      entities: Object.fromEntries(lendingRequests.map((r) => [r.id, r])),
    },
    lendableObjects: {
      ...base.lendableObjects,
      ids: lendableObjects.map((o) => o.id),
      entities: Object.fromEntries(lendableObjects.map((o) => [o.id, o])),
    },
  };
};

describe('selectTransformedLendingRequests', () => {
  it('transforms lending requests that have a matching lendable object', () => {
    const state = createState(
      [createLendingRequest(1, 10)],
      [createLendableObject(10)],
    );

    expect(selectTransformedLendingRequests(state)).toEqual([
      {
        ...createLendingRequest(1, 10),
        lendableObject: createLendableObject(10),
      },
    ]);
  });

  it('drops lending requests with missing lendable object', () => {
    const state = createState([createLendingRequest(1, 99)], []);

    expect(selectTransformedLendingRequests(state)).toEqual([]);
  });

  it('keeps only valid lending requests when data is mixed', () => {
    const state = createState(
      [
        createLendingRequest(1, 10),
        createLendingRequest(2, 99),
        createLendingRequest(3, 11),
      ],
      [createLendableObject(10), createLendableObject(11)],
    );

    expect(
      selectTransformedLendingRequests(state).map((request) => request.id),
    ).toEqual([1, 3]);
  });

  it('returns an empty list for empty inputs', () => {
    const state = createState([], []);

    expect(selectTransformedLendingRequests(state)).toEqual([]);
  });
});
