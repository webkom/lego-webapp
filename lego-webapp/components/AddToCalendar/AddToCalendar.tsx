import { Accordion, Flex, Icon } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { CalendarIcon, ChevronRight } from 'lucide-react';
import { Dateish } from 'app/models';
import { getIcalUrl, getIcalUrlGoogle } from '~/pages/events/index/EventFooter';
import styles from './AddToCalendar.module.css';
import type { PropsWithChildren } from 'react';
import type { DetailedMeeting } from '~/redux/models/Meeting';

type Props = {
  icalToken: string;
  meeting: DetailedMeeting;
};

const formatTimeForGoogle = (dateTime: Dateish) => {
  return moment(dateTime).toISOString().replace(/[-:]/g, '');
};

const getGoogleCalendarLink = (meeting: DetailedMeeting) => {
  const baseURL = 'https://calendar.google.com/calendar/event';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    dates: `${formatTimeForGoogle(meeting.startTime)}/${formatTimeForGoogle(
      meeting.endTime,
    )}`,
    text: meeting.title,
    details: meeting.description,
    location: meeting.location,
    sf: 'true',
    output: 'xml',
  });
  return `${baseURL}?${params.toString()}`;
};

const AddToCalendarToggle = ({ icalToken, meeting }: Props) => {
  return (
    <div className={styles.calendarTrigger}>
      <Accordion
        triggerComponent={({ onClick, rotateClassName }) => (
          <div onClick={onClick}>
            <Flex alignItems="center" className={styles.calendarContainer}>
              <Icon iconNode={<CalendarIcon />} /> Kalenderimport
            </Flex>
            <Icon
              onPress={() => {
                onClick();
              }}
              iconNode={<ChevronRight />}
              className={rotateClassName}
            />
          </div>
        )}
      >
        <Flex alignItems="baseline" column>
          <h3>Google kalender</h3>
          <CalendarLink href={getGoogleCalendarLink(meeting)}>
            Importer kun dette møtet
          </CalendarLink>

          <CalendarLink href={getIcalUrlGoogle(icalToken, 'personal')}>
            Synkroniser alle dine møter og favorittarrangementer
          </CalendarLink>

          <h3>iCalendar</h3>

          <CalendarLink href={getIcalUrl(icalToken, 'personal')}>
            Synkroniser alle dine møter og favorittarrangementer
          </CalendarLink>
        </Flex>
      </Accordion>
    </div>
  );
};

export default AddToCalendarToggle;

type CalendarLinkProps = {
  href: string;
};

const CalendarLink: React.FC<PropsWithChildren<CalendarLinkProps>> = ({
  children,
  href,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.calendarLink}
  >
    {children}
  </a>
);
