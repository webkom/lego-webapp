import { default as moment, Moment } from 'moment';
import EVENT from '../fixtures/events';
import type { Dateish, EventRegistration } from 'app/models';
import type { UserDetailedEvent } from '~/redux/models/Event';
import { useRegistrationCountdown } from '~/pages/events/@eventIdOrSlug/useRegistrationCountdown';

const CountdownComponent = ({
  event = EVENT,
  registration,
}: {
  event?: UserDetailedEvent;
  registration?: EventRegistration;
}) => {
  const props = useRegistrationCountdown(event, registration);
  return <PropChecker {...props} />;
};
const PropChecker = (props: ReturnType<typeof useRegistrationCountdown>) => {
  return <div data-testid="countdown-props">{JSON.stringify(props)}</div>;
};

const mountWithActivationTime = (time: Dateish) => {
  cy.mount(<CountdownComponent event={{ ...EVENT, activationTime: time }} />);
};

const assertPropsEquals = (props: any) => {
  cy.get('[data-testid="countdown-props"]').should(($el) => {
    const parsedProps = JSON.parse($el.text());
    expect(parsedProps).to.deep.include(props);
  });
};

describe('useRegistrationCountdown', () => {
  beforeEach(() => {
    const mockDate = new Date('2023-01-01T12:00:00Z').getTime();

    cy.clock(mockDate);
    cy.window().then((win) => {
      expect(win.Date.now()).to.equal(mockDate);
    });
  });

  it('should start with hidden form', () => {
    mountWithActivationTime(moment().add(20, 'minutes'));
    assertPropsEquals({
      buttonOpen: false,
      captchaOpen: false,
      formOpen: false,
      registrationOpensIn: moment.duration(20, 'minutes').toISOString(),
    });
  });

  it('should enable form when 10 minute is left', () => {
    mountWithActivationTime(moment().add(10, 'minutes'));
    /**
     * registrationOpensIn is 10:01 by intention due to we dont show 00:00
     * We go directly from 00:01 to "Meld deg på"
     */
    assertPropsEquals({
      buttonOpen: false,
      captchaOpen: false,
      formOpen: true,
      registrationOpensIn: moment.duration(10, 'minutes').toISOString(),
    });
  });

  it('should enable everything but the join button when 1 minute is left', () => {
    mountWithActivationTime(moment().add(1, 'minutes'));
    assertPropsEquals({
      buttonOpen: false,
      captchaOpen: true,
      formOpen: true,
      registrationOpensIn: moment.duration(1, 'minutes').toISOString(),
    });
  });
  it('should enable everything when activationTime is in the past', () => {
    mountWithActivationTime(moment().subtract(1, 'seconds'));
    assertPropsEquals({
      buttonOpen: true,
      captchaOpen: true,
      formOpen: true,
      registrationOpensIn: null,
    });
  });
  // TODO: Fix this test (vi.advanceTimersByTime is not working)
  it('should update when time passes', () => {
    mountWithActivationTime(moment().add(19, 'minutes'));
    assertPropsEquals({
      buttonOpen: false,
      captchaOpen: false,
      formOpen: false,
      registrationOpensIn: moment.duration(19, 'minutes').toISOString(),
    });

    cy.tick(10 * 60 * 1000);

    // 9 minutes until activation
    assertPropsEquals({
      buttonOpen: false,
      captchaOpen: false,
      formOpen: true,
      registrationOpensIn: moment.duration(9, 'minutes').toISOString(),
    });

    cy.tick(8 * 60 * 1000);

    // 1 minute until activation
    assertPropsEquals({
      buttonOpen: false,
      captchaOpen: true,
      formOpen: true,
      registrationOpensIn: moment.duration(1, 'minutes').toISOString(),
    });

    cy.tick(2 * 60 * 1000);

    // Activated
    assertPropsEquals({
      buttonOpen: true,
      captchaOpen: true,
      formOpen: true,
      registrationOpensIn: null,
    });
  });
});
