const ChristmasCalendarOverview = () => {
  const slots: number[] = Array.from({length: 24}, (_, i) => i + 1)
  return (
    <ul>
      {slots.map((slot: number) => (
        <li key={slot}>
          <a href={`/christmas-calendar/${slot}`}>Slot {slot}</a>
        </li>
      ))}
    </ul>
  );
};

export default ChristmasCalendarOverview;