import vikeServer from 'vike-server/config';
import type { Config } from 'vike/types';

export default {
  extends: [vikeServer],
  server: 'server/index.ts',
} satisfies Config;
