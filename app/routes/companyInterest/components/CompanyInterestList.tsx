import {
  Button,
  ConfirmModal,
  Flex,
  Icon,
  LinkButton,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { FileDown, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchSemesters } from 'app/actions/CompanyActions';
import {
  deleteCompanyInterest,
  fetchAll,
} from 'app/actions/CompanyInterestActions';
import SelectInput from 'app/components/Form/SelectInput';
import Table, { type ColumnProps } from 'app/components/Table';
import Tooltip from 'app/components/Tooltip';
import { selectCompanyInterests } from 'app/reducers/companyInterest';
import { selectAllCompanySemesters } from 'app/reducers/companySemesters';
import { selectPaginationNext } from 'app/reducers/selectors';
import {
  BdbTabs,
  getClosestCompanySemester,
  getCompanySemesterBySlug,
  getSemesterSlugById,
} from 'app/routes/bdb/utils';
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
  year: number;
  semester: string;
  label: string;
};

const defaultCompanyInterestsQuery = {
  semester: '',
  event: CompanyInterestEventType.All,
  companyName: '',
};

const CompanyInterestList = () => {
  const [generatedCSV, setGeneratedCSV] = useState<
    { url: string; filename: string } | undefined
  >(undefined);

  const { query, setQuery, setQueryValue } = useQuery(
    defaultCompanyInterestsQuery,
  );
  const companySemesters = useAppSelector(selectAllCompanySemesters);

  const resolveCurrentSemester = (
    slug: string | undefined,
    companySemesters: CompanySemester[],
  ) => {
    if (slug === '') return null;

    if (slug) {
      const companySemester = getCompanySemesterBySlug(slug, companySemesters);
      if (companySemester) return companySemester;
    }

    return getClosestCompanySemester(companySemesters);
  };

  const currentCompanySemester = useMemo(
    () => resolveCurrentSemester(query.semester, companySemesters),
    [companySemesters, query.semester],
  );

  const selectedEventOption: CompanyInterestEventTypeOption = {
    value: query.event,
    label:
      EVENT_TYPE_OPTIONS.find((eventType) => eventType.value === query.event)
        ?.label ?? 'Vis alle arrangementstyper',
  };

  const companyInterestList = useAppSelector((state) =>
    selectCompanyInterests(state, {
      semesterId: currentCompanySemester?.id ?? 0,
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
  }, [currentCompanySemester]);

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
    if (!currentCompanySemester) {
      return;
    }
    const blob = await fetch(
      getCsvUrl(
        currentCompanySemester.year,
        currentCompanySemester.semester,
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
      filename: `company-interests-${currentCompanySemester.year}-${
        currentCompanySemester.semester
      }${selectedEventOption.value ? `-${selectedEventOption.value}` : ''}.csv`,
    };
  };

  const columns: ColumnProps<(typeof companyInterestList)[number]>[] = [
    {
      title: 'Bedriftsnavn',
      dataIndex: 'companyName',
      search: true,
      inlineFiltering: true,
      render: (companyName: string, companyInterest) => (
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
              <Icon
                onPress={openConfirmModal}
                iconNode={<Trash2 />}
                size={18}
                danger
              />
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
    ...companySemesters.map((semesterObj: CompanySemester) => {
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
              value={{
                label: currentCompanySemester
                  ? semesterToText({
                      semester: currentCompanySemester.semester,
                      year: currentCompanySemester.year,
                      language: 'norwegian',
                    })
                  : 'Vis alle semestre',
                value: Number(currentCompanySemester?.id),
                year: Number(currentCompanySemester?.year),
                semester: currentCompanySemester?.semester ?? '',
              }}
              onChange={(e) =>
                setQueryValue('semester')(
                  getSemesterSlugById(
                    (e as SemesterOptionType).id,
                    companySemesters,
                  ) ?? '',
                )
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
              onChange={(e) =>
                setQueryValue('event')(
                  (e as CompanyInterestEventTypeOption).value,
                )
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
              <Icon iconNode={<FileDown />} size={19} />
              Last ned CSV
            </LinkButton>
          ) : (
            <Tooltip
              disabled={!currentCompanySemester}
              content={'Vennligst velg semester'}
            >
              <Button
                onPress={async () =>
                  setGeneratedCSV(await exportInterestList())
                }
                disabled={!currentCompanySemester}
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
          filters={query}
          onChange={setQuery}
          data={companyInterestList}
        />
      </Flex>
    </Page>
  );
};

export default guardLogin(CompanyInterestList);
