import {
  Button,
  ConfirmModal,
  Flex,
  Icon,
  LinkButton,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchSemesters } from 'app/actions/CompanyActions';
import {
  deleteCompanyInterest,
  fetchAll,
} from 'app/actions/CompanyInterestActions';
import SelectInput from 'app/components/Form/SelectInput';
import Table from 'app/components/Table';
import Tooltip from 'app/components/Tooltip';
import { selectCompanyInterests } from 'app/reducers/companyInterest';
import {
  selectAllCompanySemesters,
  selectCompanySemesterById,
} from 'app/reducers/companySemesters';
import { selectPaginationNext } from 'app/reducers/selectors';
import { BdbTabs } from 'app/routes/bdb/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { CompanyInterestEventType } from 'app/store/models/CompanyInterest';
import { EntityType } from 'app/store/models/entities';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import useQuery from 'app/utils/useQuery';
import { EVENT_TYPE_OPTIONS, getCsvUrl, semesterToText } from '../utils';
import type { CompanyInterestEventTypeOption } from '../utils';
import type CompanySemester from 'app/store/models/CompanySemester';

type SemesterOptionType = {
  id: number;
  semester: string;
  year: string;
  label: string;
};

const defaultCompanyInterestsQuery = {
  semesters: '',
  event: CompanyInterestEventType.All,
};

const CompanyInterestList = () => {
  const [generatedCSV, setGeneratedCSV] = useState<
    { url: string; filename: string } | undefined
  >(undefined);

  const { query, setQueryValue } = useQuery(defaultCompanyInterestsQuery);
  const semesters = useAppSelector(selectAllCompanySemesters);
  const filterSemester = useAppSelector((state) =>
    selectCompanySemesterById(state, query.semesters),
  );
  const selectedSemesterFilterOption = useMemo(
    () => ({
      id: Number(query.semesters),
      semester: filterSemester?.semester ?? '',
      year: filterSemester?.year ?? '',
      label: filterSemester
        ? semesterToText({
            semester: filterSemester.semester,
            year: filterSemester.year,
            language: 'norwegian',
          })
        : 'Vis alle semestre',
    }),
    [query.semesters, filterSemester],
  );
  const selectedEventOption: CompanyInterestEventTypeOption = {
    value: query.event,
    label:
      EVENT_TYPE_OPTIONS.find((eventType) => eventType.value === query.event)
        ?.label ?? 'Vis alle arrangementstyper',
  };
  const companyInterestList = useAppSelector((state) =>
    selectCompanyInterests(state, {
      semesterId: selectedSemesterFilterOption.id,
      eventType: selectedEventOption.value,
    }),
  );

  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/company-interests/',
      entity: EntityType.CompanyInterests,
      query,
    }),
  );
  const hasMore = pagination.hasMore;
  const fetching = useAppSelector((state) => state.companyInterest.fetching);
  const authToken = useAppSelector((state) => state.auth.token);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setGeneratedCSV(undefined);
  }, [selectedSemesterFilterOption]);

  usePreparedEffect(
    'fetchCompanyInterestList',
    () =>
      dispatch(
        fetchAll({
          query,
        }),
      ),
    [query],
  );
  usePreparedEffect(
    'fetchCompanyInterestListSemesters',
    () => dispatch(fetchSemesters()),

    [],
  );

  const exportInterestList = async (event?: string) => {
    const blob = await fetch(
      getCsvUrl(
        selectedSemesterFilterOption.year,
        selectedSemesterFilterOption.semester,
        event,
      ),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    ).then((response) => response.blob());
    return {
      url: URL.createObjectURL(blob),
      filename: `company-interests-${selectedSemesterFilterOption.year}-${
        selectedSemesterFilterOption.semester
      }${selectedEventOption.value ? `-${selectedEventOption.value}` : ''}.csv`,
    };
  };

  const columns = [
    {
      title: 'Bedriftsnavn',
      dataIndex: 'companyName',
      render: (companyName: string, companyInterest: Record<string, any>) => (
        <Link to={`/company-interest/${companyInterest.id}/edit`}>
          {companyInterest.company ? companyInterest.company.name : companyName}
        </Link>
      ),
    },
    {
      title: 'Kontaktperson',
      dataIndex: 'contactPerson',
      render: (contactPerson: string) => <span>{contactPerson}</span>,
    },
    {
      title: 'E-post',
      dataIndex: 'mail',
      render: (mail: string) => <span>{mail}</span>,
    },
    {
      title: '',
      dataIndex: 'id',
      render: (id) => (
        <Flex justifyContent="center">
          <ConfirmModal
            title="Bekreft fjerning av interesse"
            message="Er du sikker på at du vil fjerne?"
            closeOnConfirm
            onConfirm={() => {
              dispatch(deleteCompanyInterest(id));
            }}
          >
            {({ openConfirmModal }) => (
              <Icon onClick={openConfirmModal} iconNode={<Trash2 />} danger />
            )}
          </ConfirmModal>
        </Flex>
      ),
    },
  ];

  const semesterOptions = [
    {
      value: 9999,
      year: 9999,
      semester: '',
      label: 'Vis alle semestre',
    },
    ...semesters.map((semesterObj: CompanySemester) => {
      const { id, year, semester } = semesterObj;
      return {
        id,
        value: year,
        year,
        semester,
        label: semesterToText({ ...semesterObj, language: 'norwegian' }),
      };
    }),
  ].sort((o1, o2) => {
    return Number(o1.year) === Number(o2.year)
      ? o1.semester === 'spring'
        ? -1
        : 1
      : Number(o1.year) > Number(o2.year)
        ? -1
        : 1;
  });

  return (
    <Page
      title="Bedriftsinteresser"
      actionButtons={
        <LinkButton href="/company-interest/create">
          Ny bedriftsinteresse
        </LinkButton>
      }
      tabs={<BdbTabs />}
    >
      <Flex column gap="var(--spacing-md)">
        <p>
          Her finner du all praktisk informasjon knyttet til bedriftsinteresser
        </p>
        <Flex justifyContent="space-between" alignItems="flex-end">
          <Flex column>
            <SelectInput
              name="form-semester-selector"
              value={selectedSemesterFilterOption}
              onChange={(clickedOption: SemesterOptionType) =>
                setQueryValue('semesters')(String(clickedOption.id ?? ''))
              }
              options={semesterOptions}
              isClearable={false}
            />
          </Flex>
          <LinkButton href="/company-interest/semesters">
            Endre aktive semestre
          </LinkButton>
        </Flex>

        <Flex wrap justifyContent="space-between" alignItems="flex-end">
          <Flex column>
            <SelectInput
              name="form-event-selector"
              value={selectedEventOption}
              onChange={(clickedOption: CompanyInterestEventTypeOption) =>
                setQueryValue('event')(clickedOption.value)
              }
              options={EVENT_TYPE_OPTIONS}
              isClearable={false}
            />
          </Flex>

          {generatedCSV ? (
            <LinkButton
              success
              href={generatedCSV.url}
              download={generatedCSV.filename}
            >
              <Icon name="download-outline" size={19} />
              Last ned CSV
            </LinkButton>
          ) : (
            <Tooltip
              disabled={!!selectedSemesterFilterOption.year}
              content={'Vennligst velg semester'}
            >
              <Button
                onPress={async () =>
                  setGeneratedCSV(await exportInterestList())
                }
                disabled={!selectedSemesterFilterOption.year}
              >
                Eksporter til CSV
              </Button>
            </Tooltip>
          )}
        </Flex>

        <Table
          columns={columns}
          onLoad={() => {
            dispatch(
              fetchAll({
                next: true,
                query,
              }),
            );
          }}
          hasMore={hasMore}
          loading={fetching}
          data={companyInterestList}
        />
      </Flex>
    </Page>
  );
};

export default guardLogin(CompanyInterestList);
