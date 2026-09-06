import { useState } from 'react';
import { BSOD, BSOD_CHANCE } from './BSOD';
import {
  FAKE_ERROR_CHANCE,
  FAKE_ERRORS,
  FakeErrorPopup,
} from './FakeErrorPopup';

type ChaosEvent =
  | { type: 'bsod' }
  | { type: 'error'; title: string; message: string };

const rollChaosEvent = (): ChaosEvent | null => {
  if (Math.random() < BSOD_CHANCE) return { type: 'bsod' };
  if (Math.random() < FAKE_ERROR_CHANCE) {
    const error = FAKE_ERRORS[Math.floor(Math.random() * FAKE_ERRORS.length)];
    return { type: 'error', title: error.title, message: error.message };
  }
  return null;
};

/**
 * One random "chaos" event per page mount - a BSOD or a real Windows
 * 95-era error dialog, independently rolled with BSOD taking priority if
 * both happen to hit. Owning both rolls and the priority order here (rather
 * than each page rolling its own and ordering its own JSX) means a page
 * can't accidentally break the "BSOD wins" rule by reordering things.
 */
export const PageChaos = () => {
  const [event, setEvent] = useState<ChaosEvent | null>(rollChaosEvent);
  if (!event) return null;
  if (event.type === 'bsod') return <BSOD />;
  return (
    <FakeErrorPopup
      title={event.title}
      message={event.message}
      onDismiss={() => setEvent(null)}
    />
  );
};
