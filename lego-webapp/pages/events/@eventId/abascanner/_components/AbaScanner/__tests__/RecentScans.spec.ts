import { describe, it, expect } from 'vitest';
import { Presence } from '~/redux/models/Registration';
import { getRecentlyPresent } from '../RecentScans';

const registration = (
  id: number,
  presence: Presence,
  presenceDate: string | null,
) => ({ id, presence, presenceDate });

describe('getRecentlyPresent', () => {
  it('returns present registrations, newest first', () => {
    const result = getRecentlyPresent([
      registration(1, Presence.PRESENT, '2026-09-25T18:00:00+02:00'),
      registration(2, Presence.PRESENT, '2026-09-25T18:05:00+02:00'),
      registration(3, Presence.PRESENT, '2026-09-25T18:02:00+02:00'),
    ]);
    expect(result.map(({ id }) => id)).toEqual([2, 3, 1]);
  });

  it('skips registrations that are not present or have no time', () => {
    const result = getRecentlyPresent([
      registration(1, Presence.UNKNOWN, null),
      registration(2, Presence.LATE, '2026-09-25T18:05:00+02:00'),
      registration(3, Presence.PRESENT, null),
      registration(4, Presence.PRESENT, '2026-09-25T18:01:00+02:00'),
    ]);
    expect(result.map(({ id }) => id)).toEqual([4]);
  });

  it('keeps only the four most recent', () => {
    const result = getRecentlyPresent(
      [1, 2, 3, 4, 5].map((id) =>
        registration(id, Presence.PRESENT, `2026-09-25T18:0${id}:00+02:00`),
      ),
    );
    expect(result.map(({ id }) => id)).toEqual([5, 4, 3, 2]);
  });
});
