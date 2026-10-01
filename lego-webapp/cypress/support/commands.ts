import type { MountOptions, MountReturn } from 'cypress/react';
import type { ReactNode } from 'react';
import type store from '~/cypress/fixtures/store';

declare global {
  namespace Cypress {
    interface Chainable {
      mount(
        component: ReactNode,
        options?: MountOptions & { reduxStore?: ReturnType<typeof store> },
      ): Chainable<MountReturn>;
    }
  }
}
