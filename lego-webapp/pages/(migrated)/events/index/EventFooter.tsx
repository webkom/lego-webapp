import { Flex } from '@webkom/lego-bricks';
import Circle from '~/components/Circle';
import { EventTypeConfig } from '~/pages/(migrated)/events/utils';
import { appConfig } from '~/utils/appConfig';
import type { IcalToken } from 'app/models';

const icalTypes: { name: IcalType; title: string }[] = [
  {
    name: 'events',
    title: 'Alle arrangementer',
  },
  {
    name: 'registrations',
    title: 'Registreringstidspunkt',
  },
  {
    name: 'personal',
    title: 'Dine møter og favorittarrangementer',
  },
];

type IcalType = 'events' | 'registrations' | 'personal';

export const getIcalUrl = (icalToken: IcalToken, icalType: IcalType) =>
  `${appConfig.serverUrl}/calendar-ical/${icalType}/?token=${icalToken}`;

export const getIcalUrlGoogle = (icalToken: IcalToken, icalType: IcalType) => {
  const icalUrl = getIcalUrl(icalToken, icalType).replace(/^https/i, 'http');
  return `https://www.google.com/calendar/render?cid=${icalUrl}`;
};

type Props = {
  icalToken: string;
};

const EventFooter = ({ icalToken }: Props) => (
  <Flex
    wrap
    justifyContent="space-between"
    gap="var(--spacing-md)"
    margin="var(--spacing-sm) 0"
  >
    {icalToken && (
      <Flex column gap="var(--spacing-md)">
        <div>
          <h3>Kalenderimport</h3>
          <span className="secondaryFontColor">
            Importer arrangementer og møter til din favorittkalender!
          </span>
        </div>

        <Flex wrap gap="var(--spacing-md)">
          <Flex column gap="var(--spacing-sm)">
            <h4>Google Kalender</h4>
            {icalTypes.map((type, key) => (
              <a key={key} href={getIcalUrlGoogle(icalToken, type.name)}>
                {type.title}
              </a>
            ))}
          </Flex>
          <Flex column gap="var(--spacing-sm)">
            <h4>iCalendar</h4>
            {icalTypes.map((type, key) => (
              <a key={key} href={getIcalUrl(icalToken, type.name)}>
                {type.title}
              </a>
            ))}
          </Flex>
        </Flex>
      </Flex>
    )}

    <div>
      <h3>Fargekoder</h3>
      <Flex column gap="var(--spacing-sm)">
        {Object.entries(EventTypeConfig).map(([key, config]) => (
          <Flex key={key} alignItems="center" gap="var(--spacing-sm)">
            <Circle color={config.color} />
            <span>{config.displayName}</span>
          </Flex>
        ))}
      </Flex>
    </div>
  </Flex>
);

export default EventFooter;
