import { Banana, Gamepad, MountainSnow } from 'lucide-react';

// The interest-group icon rotates daily. Picked deterministically instead of
// with Math.random so the server and client agree on the icon - a random
// module-scope pick would risk hydration mismatches if it is ever
// server-rendered
const ICONS = [Banana, Gamepad, MountainSnow];
const InterestGroupIcon = ICONS[new Date().getDate() % ICONS.length];

export default InterestGroupIcon;
