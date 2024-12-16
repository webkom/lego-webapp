import {
  LinkButton,
  Page,
  filterSidebar,
  FilterSection,
} from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Outlet, useLocation } from 'react-router-dom';
import { CheckBox, RadioButton } from 'app/components/Form';
import ToggleSwitch from 'app/components/Form/ToggleSwitch';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import { EventTime } from 'app/models';
import { useAppSelector } from 'app/store/hooks';
import useQuery from 'app/utils/useQuery';
import type { ListEvent } from 'app/store/models/Event';
import type { ParsedQs } from 'qs';

type FilterEventType = 'company_presentation' | 'course' | 'social' | 'other';
type FilterRegistrationsType = 'all' | 'open' | 'future';

export const eventListDefaultQuery = {
  eventTypes: [] as FilterEventType[],
  registrations: 'all' as FilterRegistrationsType,
  showPrevious: '' as '' | 'true' | 'false',
};

type Option = {
  filterRegDateFunc: (event: ListEvent) => boolean;
  label: string;
  value: FilterRegistrationsType;
  field: EventTime;
};
const filterRegDateOptions: Option[] = [
  {
    filterRegDateFunc: (event) => !!event,
    label: 'Vis alle',
    value: 'all',
    field: EventTime.start,
  },
  {
    filterRegDateFunc: (event) =>
      event.activationTime != null &&
      moment(event.activationTime).isBefore(moment()),
    label: 'Påmelding åpnet',
    value: 'open',
    field: EventTime.start,
  },
  {
    filterRegDateFunc: (event) =>
      event.activationTime != null &&
      moment(event.activationTime).isAfter(moment()),
    label: 'Åpner i fremtiden',
    value: 'future',
    field: EventTime.activate,
  },
];

type EventsOutletContext = {
  query: ParsedQs;
  regDateFilter: Option;
  showCourse: boolean;
  showSocial: boolean;
  showOther: boolean;
  showCompanyPresentation: boolean;
};

const EventsOverview = () => {
  const actionGrant = useAppSelector((state) => state.events.actionGrant);

  const location = useLocation();
  const showFilters = location.pathname === '/events';

  const { query, setQueryValue } = useQuery(eventListDefaultQuery);

  const showCourse = query.eventTypes.includes('course');
  const showSocial = query.eventTypes.includes('social');
  const showOther = query.eventTypes.includes('other');
  const showCompanyPresentation = query.eventTypes.includes(
    'company_presentation',
  );

  const toggleEventType =
    (type: 'company_presentation' | 'course' | 'social' | 'other') => () => {
      setQueryValue('eventTypes')(
        query.eventTypes.includes(type)
          ? query.eventTypes.filter((t) => t !== type)
          : [...query.eventTypes, type],
      );
    };

  const regDateFilter =
    filterRegDateOptions.find(
      (option) => option.value === query.registrations,
    ) || filterRegDateOptions[0];

  return (
    <Page
      title="Arrangementer"
      sidebar={
        showFilters
          ? filterSidebar({
              children: (
                <>
                  <FilterSection title="Vis tidligere">
                    <ToggleSwitch
                      id="showPrevious"
                      checked={query.showPrevious === 'true'}
                      onChange={(checked) =>
                        setQueryValue('showPrevious')(
                          checked ? 'true' : 'false',
                        )
                      }
                    />
                  </FilterSection>
                  <FilterSection title="Arrangementstype">
                    <CheckBox
                      id="companyPresentation"
                      label="Bedpres"
                      checked={showCompanyPresentation}
                      onChange={toggleEventType('company_presentation')}
                    />
                    <CheckBox
                      id="course"
                      label="Kurs"
                      checked={showCourse}
                      onChange={toggleEventType('course')}
                    />
                    <CheckBox
                      id="social"
                      label="Sosialt"
                      checked={showSocial}
                      onChange={toggleEventType('social')}
                    />
                    <CheckBox
                      id="other"
                      label="Annet"
                      checked={showOther}
                      onChange={toggleEventType('other')}
                    />
                  </FilterSection>
                  <FilterSection title="Påmelding">
                    {filterRegDateOptions.map((option) => (
                      <RadioButton
                        key={option.value}
                        name="registrations"
                        id={option.value}
                        label={option.label}
                        checked={query.registrations === option.value}
                        onChange={() => {
                          setQueryValue('registrations')(option.value);
                        }}
                      />
                    ))}
                  </FilterSection>
                </>
              ),
            })
          : undefined
      }
      actionButtons={
        actionGrant.includes('create') && (
          <LinkButton href="/events/create">Lag nytt</LinkButton>
        )
      }
      tabs={
        <>
          <NavigationTab href="/events">Oversikt</NavigationTab>
          <NavigationTab href="/events/calendar" matchSubpages>
            Kalender
          </NavigationTab>
        </>
      }
    >
      <Outlet
        context={{
          query,
          regDateFilter,
          showCourse,
          showSocial,
          showOther,
          showCompanyPresentation,
        }}
      />
    </Page>
  );
};

export default EventsOverview;
export type { EventsOutletContext };
