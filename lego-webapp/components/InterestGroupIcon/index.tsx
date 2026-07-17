import { sample } from 'lodash-es';
import { Banana, Gamepad, MountainSnow } from 'lucide-react';

// The interest-group icon is intentionally random: sampled once per page
// load, so every surface shows the same icon until the next visit
const InterestGroupIcon = sample([Banana, Gamepad, MountainSnow]) ?? Banana;

export default InterestGroupIcon;
