import { Button, ConfirmModal, Icon } from '@webkom/lego-bricks';
import { useNavigate } from 'react-router-dom';
import { deleteCompany } from 'app/actions/CompanyActions';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { EventTypeConfig, colorForEventType } from 'app/routes/events/utils';
import { useAppDispatch } from 'app/store/hooks';
import { NonEventContactStatus } from 'app/store/models/Company';
import { EventType } from 'app/store/models/Event';
import type { ConfigProperties } from '../events/utils';
import type { EntityId } from '@reduxjs/toolkit';
import type { Semester } from 'app/models';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import type { CompanySemesterContactStatus } from 'app/store/models/Company';
import type { ReactNode } from 'react';

export const NonEventContactStatusConfig: Record<
  NonEventContactStatus,
  ConfigProperties
> = {
  [NonEventContactStatus.BEDEX]: {
    displayName: 'Bedex',
    color: colorForEventType(EventType.ALTERNATIVE_PRESENTATION),
    textColor: '#000',
  },
  [NonEventContactStatus.INTERESTED]: {
    displayName: 'Interessert',
    color: 'var(--success-color)',
    textColor: '#000',
  },
  [NonEventContactStatus.NOT_INTERESTED]: {
    displayName: 'Ikke interessert',
    color: 'var(--danger-color)',
    textColor: '#ff0000',
  },
  [NonEventContactStatus.CONTACTED]: {
    displayName: 'Kontaktet',
    color: 'var(--color-yellow-5)',
    textColor: '#000',
  },
  [NonEventContactStatus.NOT_CONTACTED]: {
    displayName: 'Ikke kontaktet',
    color: 'var(--additive-background)',
    textColor: '#000',
  },
};

export const contactStatuses: CompanySemesterContactStatus[] = [
  EventType.BREAKFAST_TALK,
  EventType.COMPANY_PRESENTATION,
  EventType.COURSE,
  EventType.LUNCH_PRESENTATION,
  ...(Object.keys(NonEventContactStatusConfig) as NonEventContactStatus[]),
];

export const getStatusDisplayName = (
  status: CompanySemesterContactStatus = NonEventContactStatus.NOT_CONTACTED,
) =>
  EventTypeConfig[status]?.displayName ||
  NonEventContactStatusConfig[status]?.displayName;

export const getStatusColor = (
  status: CompanySemesterContactStatus = NonEventContactStatus.NOT_CONTACTED,
) =>
  EventTypeConfig[status]?.color || NonEventContactStatusConfig[status]?.color;

export const sortStatusesByProminence = (
  statuses: CompanySemesterContactStatus[],
): CompanySemesterContactStatus[] => {
  // Create a copy of the array before sorting
  return [...statuses].sort((a, b) => {
    return contactStatuses.indexOf(a) - contactStatuses.indexOf(b);
  });
};

export const selectMostProminentStatus = (
  statuses: CompanySemesterContactStatus[] = [],
) => {
  return (
    contactStatuses.find((status) => statuses.includes(status)) ||
    NonEventContactStatus.NOT_CONTACTED
  );
};

export const semesterNameOf = (index: number) => {
  const indexToSemesterName = {
    '0': 'spring',
    '1': 'autumn',
  };
  return indexToSemesterName[index] || 'spring';
};
export const semesterCodeToName = (code: Semester) => {
  const codeToName = {
    spring: 'Vår',
    autumn: 'Høst',
  };
  return codeToName[code] || '-';
};
export const sortByYearThenSemester = (
  a: CompanySemesterEntity,
  b: CompanySemesterEntity,
): number => {
  const semesterCodeToPriority = {
    spring: 0,
    autumn: 1,
  };
  return a.year !== b.year
    ? parseInt(b.year, 10) - parseInt(a.year, 10)
    : semesterCodeToPriority[b.semester] - semesterCodeToPriority[a.semester];
};
export const indexToSemester = (
  index: number,
  startYear: number,
  startSem: number,
  companySemesters?: Array<CompanySemesterEntity>,
) => {
  const semester = semesterNameOf(((index % 2) + startSem) % 2);
  let year = 0;

  if (startSem === 0) {
    year = index < 2 ? startYear : startYear + 1;
  } else if (index === 0) {
    year = startYear;
  } else if (index === 3) {
    year = startYear + 2;
  } else {
    year = startYear + 1;
  }

  return (
    (companySemesters &&
      companySemesters.find(
        (companySemester) =>
          companySemester.year === year &&
          companySemester.semester === semester,
      )) || {
      year,
      semester,
    }
  );
};

export const httpCheck = (link: string) => {
  const httpLink =
    link.startsWith('http://') || link.startsWith('https://')
      ? link
      : `http://${link}`;
  return link === '' ? link : httpLink;
};

export const getContactStatuses = (
  contactStatuses: CompanySemesterContactStatus[],
  statusString: CompanySemesterContactStatus,
) => {
  const statuses = new Set(contactStatuses);

  if (statuses.has(statusString)) {
    statuses.delete(statusString);
  } else {
    statuses.add(statusString);
  }

  // Remove 'not contacted' if anything else is selected
  if (statuses.size > 1 && statuses.has(NonEventContactStatus.NOT_CONTACTED)) {
    statuses.delete(NonEventContactStatus.NOT_CONTACTED);
  }

  // Remove 'contacted', 'not_interested and 'interested'
  // as statuses if any the other statuses are selected
  if (
    statuses.size > 1 &&
    statusString !== NonEventContactStatus.NOT_CONTACTED
  ) {
    [
      NonEventContactStatus.CONTACTED,
      NonEventContactStatus.NOT_INTERESTED,
      NonEventContactStatus.INTERESTED,
    ].forEach((status) => {
      if (status !== statusString) {
        statuses.delete(status);
      }
    });
  }

  return Array.from(statuses);
};

export const ListNavigation = ({ title }: { title: ReactNode }) => (
  <NavigationTab title={title}>
    <NavigationLink to="/companyInterest">Interesseskjema</NavigationLink>
    <NavigationLink to="/bdb">BDB</NavigationLink>
    <NavigationLink to="/bdb/add">Ny bedrift</NavigationLink>
  </NavigationTab>
);

export const DetailNavigation = ({
  title,
  companyId,
}: {
  title: ReactNode;
  companyId: EntityId;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <NavigationTab
      title={title}
      back={{
        label: 'Tilbake til liste',
        path: '/bdb',
      }}
    >
      <NavigationLink to={`/bdb/${companyId}`}>Bedriftens side</NavigationLink>
      <NavigationLink to={`/bdb/${companyId}/edit`}>Rediger</NavigationLink>
      <NavigationLink to={'/bdb/add'}>Ny bedrift</NavigationLink>
      <ConfirmModal
        title="Slett bedrift"
        message="Er du sikker på at du vil slette denne bedriften?"
        onConfirm={() =>
          dispatch(deleteCompany(companyId)).then(() => {
            navigate('/bdb');
          })
        }
      >
        {({ openConfirmModal }) => (
          <Button onClick={openConfirmModal} danger>
            <Icon name="trash" size={19} />
            Slett bedrift
          </Button>
        )}
      </ConfirmModal>
    </NavigationTab>
  );
};
