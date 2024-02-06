import { Button, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import qs from 'qs';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { fetchSemesters } from 'app/actions/CompanyActions';
import {
  deleteCompanyInterest,
  fetch as fetchCompanyInterests,
  fetchAll,
} from 'app/actions/CompanyInterestActions';
import { Content } from 'app/components/Content';
import SelectInput from 'app/components/Form/SelectInput';
import Table from 'app/components/Table';
import Tooltip from 'app/components/Tooltip';
import { selectCompanyInterestList } from 'app/reducers/companyInterest';
import { selectCompanySemestersForInterestForm } from 'app/reducers/companySemesters';
import { ListNavigation } from 'app/routes/bdb/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { getCsvUrl, semesterToText, EVENT_TYPE_OPTIONS } from '../utils';
import styles from './CompanyInterest.css';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';

type SemesterOptionType = {
  id: number;
  semester: string;
  year: string;
  label: string;
};

type EventOptionType = {
  value: string;
  label: string;
};

const CompanyInterestList = () => {
  const [generatedCSV, setGeneratedCSV] = useState<
    { url: string; filename: string } | undefined
  >(undefined);

  const location = useLocation();
  const semesterId = Number(
    qs.parse(location.search, {
      ignoreQueryPrefix: true,
    }).semesters
  );
  const semesters = useAppSelector((state) =>
    selectCompanySemestersForInterestForm(state)
  );
  const semesterObj: CompanySemesterEntity | null | undefined = semesters.find(
    (semester) => semester.id === semesterId
  );
  const eventValue = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  }).event;
  const selectedSemesterOption = useMemo(
    () => ({
      id: semesterId ? semesterId : 0,
      semester: semesterObj != null ? semesterObj.semester : '',
      year: semesterObj != null ? semesterObj.year : '',
      label:
        semesterObj != null
          ? semesterToText({
              semester: semesterObj.semester,
              year: semesterObj.year,
              language: 'norwegian',
            })
          : 'Vis alle semestre',
    }),
    [semesterId, semesterObj]
  );
  const selectedEventOption = {
    value: eventValue ? eventValue : '',
    label: eventValue
      ? EVENT_TYPE_OPTIONS.find((eventType) => eventType.value === eventValue)
          .label
      : 'Vis alle arrangementstyper',
  };
  const companyInterestList = useAppSelector((state) =>
    selectCompanyInterestList(
      state,
      selectedSemesterOption.id,
      selectedEventOption.value
    )
  );
  const hasMore = useAppSelector((state) => state.companyInterest.hasMore);
  const fetching = useAppSelector((state) => state.companyInterest.fetching);
  const authToken = useAppSelector((state) => state.auth.token);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSemesterChange = (clickedOption: SemesterOptionType): void => {
    const { id } = clickedOption;
    dispatch(
      fetchCompanyInterests({
        filters: {
          semesters: id !== null ? id : null,
        },
      })
    ).then(() => {
      navigate(
        `/companyInterest?semesters=${clickedOption.id}&event=${selectedEventOption.value}`,
        { replace: true }
      );
    });
  };

  const handleEventChange = (clickedOption: EventOptionType): void => {
    navigate(
      `/companyInterest?semesters=${selectedSemesterOption.id}&event=${clickedOption.value}`,
      { replace: true }
    );
  };

  useEffect(() => {
    setGeneratedCSV(undefined);
  }, [selectedSemesterOption]);

  usePreparedEffect(
    'fetchCompanyInterestList',
    () => Promise.all([dispatch(fetchAll()), dispatch(fetchSemesters())]),
    []
  );

  const exportInterestList = async (event?: string) => {
    const blob = await fetch(
      getCsvUrl(
        selectedSemesterOption.year,
        selectedSemesterOption.semester,
        event
      ),
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    ).then((response) => response.blob());
    return {
      url: URL.createObjectURL(blob),
      filename: `company-interests-${selectedSemesterOption.year}-${
        selectedSemesterOption.semester
      }${selectedEventOption.value ? `-${selectedEventOption.value}` : ''}.csv`,
    };
  };

  const columns = [
    {
      title: 'Bedriftsnavn',
      dataIndex: 'companyName',
      render: (companyName: string, companyInterest: Record<string, any>) => (
        <Link to={`/companyInterest/${companyInterest.id}/edit`}>
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
            message={'Er du sikker på at du vil fjerne?'}
            closeOnConfirm
            onConfirm={() => dispatch(deleteCompanyInterest(id))}
          >
            {({ openConfirmModal }) => (
              <Icon onClick={openConfirmModal} name="trash" danger />
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
    ...semesters.map((semesterObj: CompanySemesterEntity) => {
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
    <Content>
      <ListNavigation title="Bedriftsinteresser" />
      <Flex
        wrap
        justifyContent="space-between"
        alignItems="flex-end"
        className={styles.section}
      >
        <Flex column>
          <p>
            Her finner du all praktisk informasjon knyttet til
            bedriftsinteresser
          </p>
          <SelectInput
            name="form-semester-selector"
            value={selectedSemesterOption}
            onChange={handleSemesterChange}
            options={semesterOptions}
            isClearable={false}
          />
        </Flex>
        <Link to="/companyInterest/semesters">
          <Button>Endre aktive semestre</Button>
        </Link>
        <Link to="/companyInterest/create">
          <Button>Opprett ny bedriftsinteresse</Button>
        </Link>
      </Flex>

      <Flex
        wrap
        justifyContent="space-between"
        alignItems="flex-end"
        className={styles.section}
      >
        <Flex column>
          <SelectInput
            name="form-event-selector"
            value={selectedEventOption}
            onChange={handleEventChange}
            options={EVENT_TYPE_OPTIONS}
            isClearable={false}
          />
        </Flex>

        {generatedCSV ? (
          <a href={generatedCSV.url} download={generatedCSV.filename}>
            Last ned
          </a>
        ) : (
          <Tooltip
            style={
              selectedSemesterOption.year ? { display: 'none' } : undefined
            }
            content={'Vennligst velg semester'}
          >
            <Button
              onClick={async () => setGeneratedCSV(await exportInterestList())}
              disabled={!selectedSemesterOption.year}
            >
              Eksporter til CSV
            </Button>
          </Tooltip>
        )}
      </Flex>

      <Table
        columns={columns}
        onLoad={(filters) => {
          dispatch(
            fetchCompanyInterests({
              next: true,
              filters,
            })
          );
        }}
        onChange={(filters) => {
          dispatch(
            fetchCompanyInterests({
              filters,
            })
          );
        }}
        hasMore={hasMore}
        loading={fetching}
        data={companyInterestList}
      />
    </Content>
  );
};

export default guardLogin(CompanyInterestList);
