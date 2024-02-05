import { Button } from '@webkom/lego-bricks';

type AddToCalenderProps = {
  title: string;
  startTime: Dateish;
  endTime: Dateish;
  description?: string;
  location?: string;
};

const AddToCalender = ({
  title,
  startTime,
  endTime,
  description = '',
  location = '',
}: AddToCalenderProps) => {
  const createGoogleCalenderLink = () => {
    const baseURL = 'https://calendar.google.com/calendar/event';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      dates: `${formatTimeForGoogle(startTime)}/${formatTimeForGoogle(
        endTime
      )}`,
      text: title,
      details: description,
      location: location,
      sf: 'true',
      output: 'xml',
    });
    return `${baseURL}?${params.toString()}`;
  };
  const formatTimeForGoogle = (dateTime: string) => {
    return dateTime.replace(/-|:/g, '');
  };

  return (
    <div>
      <a
        href={`${createGoogleCalenderLink()}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button ghost>Legg til i Google Calender</Button>
      </a>
    </div>
  );
};

export default AddToCalender;
