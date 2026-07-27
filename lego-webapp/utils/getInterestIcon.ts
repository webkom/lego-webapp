import { Banana, Gamepad, MountainSnow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS = [Banana, Gamepad, MountainSnow];

// The interest-group icon rotates daily. Picked deterministically instead of
// with Math.random, and at render time instead of module load, so the server
// and client agree on the icon even when the server has run for days
const getInterestIcon = (): LucideIcon =>
  ICONS[new Date().getDate() % ICONS.length];

export default getInterestIcon;
