import vikeServer from 'vike-server/config';
import type { Config } from 'vike/types';

export default {
  extends: [vikeServer],
  server: {
    entry: {
      index: 'server/index.ts',
      instrument: 'server/instrument.ts',
    },
  },
} satisfies Config;
