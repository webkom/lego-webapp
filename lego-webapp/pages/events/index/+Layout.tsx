import {
  LinkButton,
  Page,
  filterSidebar,
  FilterSection,
} from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { createContext, PropsWithChildren } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import { EventTime } from 'app/models';
import { CheckBox, DatePicker, RadioButton } from '~/components/Form';
import ToggleSwitch from '~/components/Form/ToggleSwitch';
import { NavigationTab } from '~/components/NavigationTab/NavigationTab';
import { useAppSelector } from '~/redux/hooks';
import useQuery from '~/utils/useQuery';
import type { ParsedQs } from 'qs';
import type { ListEvent } from '~/redux/models/Event';

type FilterEventType = 'company_presentation' | 'course' | 'social' | 'other';
type FilterRegistrationsType = 'all' | 'open' | 'future';

export const eventListDefaultQuery = {
  showPrevious: '' as '' | 'true' | 'false',
  from: '',
  to: '',
  eventTypes: [] as FilterEventType[],
  registrations: 'all' as FilterRegistrationsType,
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

export type EventsOutletContextType = {
  query: ParsedQs;
  regDateFilter: Option;
  showCourse: boolean;
  showSocial: boolean;
  showOther: boolean;
  showCompanyPresentation: boolean;
};

export const EventsOutletContext = createContext<EventsOutletContextType>(
  {} as EventsOutletContextType,
);

export const Layout = ({ children }: PropsWithChildren) => {
  const pageContext = usePageContext();
  const actionGrant = useAppSelector((state) => state.events.actionGrant);

  const showFilters = pageContext.urlPathname === '/events';

  const { query, setQueryValue, setQueryValues } = useQuery(
    eventListDefaultQuery,
  );

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
                      isDisabled={query.from !== ''}
                      onChange={(checked) =>
                        setQueryValue('showPrevious')(
                          checked ? 'true' : 'false',
                        )
                      }
                    />
                  </FilterSection>
                  <FilterSection title="Periode">
                    <DatePicker
                      range
                      value={[query.from, query.to]}
                      showTimePicker={false}
                      onChange={(value) => {
                        if (!Array.isArray(value)) return;
                        const [from, to] = value;
                        const updates: Partial<typeof eventListDefaultQuery> =
                          {};

                        if (from && from !== '') {
                          updates.from = moment(from).format('YYYY-MM-DD');
                          updates.showPrevious = moment(from).isBefore(moment())
                            ? 'true'
                            : 'false';
                        } else {
                          updates.from = '';
                          updates.showPrevious = 'false';
                        }

                        if (to && to !== '') {
                          updates.to = moment(to).format('YYYY-MM-DD');
                        } else {
                          updates.to = '';
                        }

                        setQueryValues(updates);
                      }}
                      onBlur={() => {}}
                      onFocus={() => {}}
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
      <EventsOutletContext.Provider
        value={{
          query,
          regDateFilter,
          showCourse,
          showSocial,
          showOther,
          showCompanyPresentation,
        }}
      >
        {children}
      </EventsOutletContext.Provider>
    </Page>
  );
};
