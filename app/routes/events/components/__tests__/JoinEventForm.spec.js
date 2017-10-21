jest.useFakeTimers();

const EVENT = {
  title: 'Big Test Event',
  useCaptcha: true,
  activeCapacity: 10,
  spotsLeft: 0,
  price: 100,
  feedbackRequired: true,
  activationTime: Date.now()
};

describe('<JoinEventForm />', () => {
  it('should render forms conditionally', () => {
    // TODO: Write some wicked tests
    expect(EVENT.activeCapacity).toEqual(10);
  });
});
