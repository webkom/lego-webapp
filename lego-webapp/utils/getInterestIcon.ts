import { Banana, Gamepad, MountainSnow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS = [Banana, Gamepad, MountainSnow];

// UTC so the server and client land on the same day, and with
// it the same icon, no matter the time zone
const getInterestIcon = (): LucideIcon =>
  ICONS[new Date().getUTCDate() % ICONS.length];

export default getInterestIcon;
