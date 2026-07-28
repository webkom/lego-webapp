import 'moment/locale/nb';
import moment from 'moment-timezone';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EventStatusType } from '~/redux/models/Event';
import {
  activateOnKey,
  attendanceLabel,
  dayLabel,
  groupEvents,
  groupKeyOf,
  groupMonogram,
  isToday,
  isTomorrow,
  weekLabel,
} from './utils';
import type { Root } from 'react-dom/client';
import type { ListEvent } from '~/redux/models/Event';
import type { PublicGroup } from '~/redux/models/Group';

moment.locale('nb-NO');

const NOW = new Date(2026, 2, 11, 12);

const groupNamed = (name: string) => ({ name }) as PublicGroup;

const eventAt = (id: number, startTime: string) =>
  ({ id, startTime }) as unknown as ListEvent;

describe('activateOnKey', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const renderCard = (onActivate: () => void) => {
    act(() =>
      root.render(
        <div role="button" tabIndex={0} onKeyDown={activateOnKey(onActivate)}>
          <button type="button">Bli med</button>
        </div>,
      ),
    );

    return {
      card: container.querySelector('div[role="button"]') as HTMLElement,
      innerButton: container.querySelector('button') as HTMLElement,
    };
  };

  const pressKey = (target: HTMLElement, key: string) =>
    act(() => {
      target.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true }),
      );
    });

  it.each(['Enter', ' '])('activates the card on %s', (key) => {
    const onActivate = vi.fn();
    const { card } = renderCard(onActivate);

    pressKey(card, key);

    expect(onActivate).toHaveBeenCalledOnce();
  });

  it.each(['Enter', ' '])(
    'leaves the card alone when %s hits a nested control',
    (key) => {
      const onActivate = vi.fn();
      const { innerButton } = renderCard(onActivate);

      pressKey(innerButton, key);

      expect(onActivate).not.toHaveBeenCalled();
    },
  );

  it('ignores keys that do not activate a button', () => {
    const onActivate = vi.fn();
    const { card } = renderCard(onActivate);

    pressKey(card, 'a');
    pressKey(card, 'Tab');

    expect(onActivate).not.toHaveBeenCalled();
  });
});

describe('groupMonogram', () => {
  it('takes the first two letters, uppercased', () => {
    expect(groupMonogram(groupNamed('Klatring'))).toBe('KL');
  });

  it('skips the Aba prefix so the monograms stay distinct', () => {
    expect(groupMonogram(groupNamed('Abarun'))).toBe('RU');
    expect(groupMonogram(groupNamed('Abakino'))).toBe('KI');
  });
});

describe('attendanceLabel', () => {
  const event = (fields: Partial<ListEvent>) => fields as ListEvent;

  it('tells open events they need no registration', () => {
    expect(
      attendanceLabel(event({ eventStatusType: EventStatusType.OPEN })),
    ).toBe('ingen påmelding — bare møt opp');
  });

  it('says nothing until the count has loaded', () => {
    expect(attendanceLabel(event({ registrationCount: undefined }))).toBe('');
  });

  it('counts against the capacity when there is one', () => {
    expect(
      attendanceLabel(event({ registrationCount: 4, totalCapacity: 10 })),
    ).toBe('4 av 10 plasser');
  });

  it('just counts when the event is unlimited', () => {
    expect(
      attendanceLabel(event({ registrationCount: 4, totalCapacity: 0 })),
    ).toBe('4 blir med');
  });
});

describe('groupKeyOf', () => {
  it('keys upcoming events by day', () => {
    expect(groupKeyOf(moment('2026-03-11'), false)).toBe('2026-03-11');
  });

  it('keys past events by iso week, so a week collapses into one row', () => {
    expect(groupKeyOf(moment('2026-02-20'), true)).toBe('2026-08');
  });
});

describe('with the clock held still', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('isToday / isTomorrow', () => {
    it('matches on the calendar day, not on 24 hours elapsed', () => {
      expect(isToday(moment('2026-03-11T23:30:00'))).toBe(true);
      expect(isToday(moment('2026-03-12T00:30:00'))).toBe(false);
      expect(isTomorrow(moment('2026-03-12T00:30:00'))).toBe(true);
    });
  });

  describe('dayLabel', () => {
    it('highlights today and tomorrow by name', () => {
      expect(dayLabel(moment('2026-03-11'))).toMatchObject({
        label: 'I dag',
        highlight: true,
      });
      expect(dayLabel(moment('2026-03-12'))).toMatchObject({
        label: 'I morgen',
        highlight: true,
      });
    });

    it('falls back to the capitalised weekday further out', () => {
      expect(dayLabel(moment('2026-03-16'))).toMatchObject({
        label: 'Mandag',
        subLabel: '16. mars',
        highlight: false,
      });
    });
  });

  describe('weekLabel', () => {
    it('names the current and previous week', () => {
      expect(weekLabel(moment('2026-03-10')).label).toBe('Denne uken');
      expect(weekLabel(moment('2026-03-03')).label).toBe('Forrige uke');
    });

    it('numbers anything older', () => {
      expect(weekLabel(moment('2026-02-20')).label).toBe('Uke 8');
    });
  });

  describe('groupEvents', () => {
    it('groups upcoming events by day, keeping the given order', () => {
      const groups = groupEvents(
        [
          eventAt(1, '2026-03-11T17:00:00'),
          eventAt(2, '2026-03-11T19:00:00'),
          eventAt(3, '2026-03-12T18:00:00'),
        ],
        false,
      );

      expect(groups.map((group) => group.key)).toEqual([
        '2026-03-11',
        '2026-03-12',
      ]);
      expect(groups[0].label).toBe('I dag');
      expect(groups[0].events.map((event) => event.id)).toEqual([1, 2]);
    });

    it('groups past events by week instead', () => {
      const groups = groupEvents(
        [
          eventAt(1, '2026-02-20T17:00:00'),
          eventAt(2, '2026-02-16T17:00:00'),
          eventAt(3, '2026-03-03T17:00:00'),
        ],
        true,
      );

      expect(groups.map((group) => group.key)).toEqual(['2026-08', '2026-10']);
      expect(groups[0].events.map((event) => event.id)).toEqual([1, 2]);
    });

    it('has nothing to group when there are no events', () => {
      expect(groupEvents([], false)).toEqual([]);
    });
  });
});
