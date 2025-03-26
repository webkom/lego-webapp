import { Button, Card, Icon } from '@webkom/lego-bricks';
import { CalendarPlus } from 'lucide-react';
import { useState } from 'react';
import { getIcalUrl, getIcalUrlGoogle } from '~/pages/events/index/EventFooter';
import styles from './AddToCalendar.module.css';
import type { PropsWithChildren } from 'react';
import type { DetailedMeeting } from '~/redux/models/Meeting';

type Props = {
  icalToken: string;
  meeting: DetailedMeeting;
};

const formatTimeForGoogle = (dateTime: string) => {
  return dateTime.replace(/-|:/g, '');
};

const getGoogleCalendarLink = (meeting) => {
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
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);

  return (
    <div>
      <Button onPress={() => setCalendarIsOpen(!calendarIsOpen)}>
        <Icon iconNode={<CalendarPlus />} size={19} />
        {!calendarIsOpen ? 'Vis kalenderimport' : 'Skjul kalenderimport'}
      </Button>

      {calendarIsOpen && (
        <Card className={styles.calendarImportCard}>
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
        </Card>
      )}
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
