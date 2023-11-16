import { Button, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Content } from 'app/components/Content';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import Table from 'app/components/Table';
import Tooltip from 'app/components/Tooltip';
import { ListNavigation } from 'app/routes/bdb/utils';
import { defaultCompanyInterestListQuery } from 'app/routes/companyInterest/CompanyInterestListRoute';
import useQuery from 'app/utils/useQuery';
import { getCsvUrl, semesterToText } from '../utils';
import styles from './CompanyInterest.css';
import { EVENT_TYPE_OPTIONS } from './CompanyInterestPage';
import type { EventTypeOption } from './CompanyInterestPage';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import type { CompanyInterestEventType } from 'app/store/models/CompanyInterest';

type SemesterOptionType = {
  id: number;
  semester: string;
  year: string;
  label: string;
};

type EventOptionType = {
  value: CompanyInterestEventType | '';
  label: string;
};

type Props = {
  companyInterestList: Array<CompanyInterestEntity>;
  deleteCompanyInterest: (arg0: number) => Promise<any>;
  fetch: (arg0: Record<string, any>) => Promise<any>;
  hasMore: boolean;
  fetching: boolean;
  semesters: Array<CompanySemesterEntity>;
  replace: (arg0: string) => void;
  selectedSemesterOption: SemesterOptionType;
  selectedEventOption: EventOptionType;
  authToken: string;
};

type GeneratedCSV = {
  url: string;
  filename: string;
};

const CompanyInterestList = ({
  selectedSemesterOption,
  selectedEventOption,
  ...props
}: Props) => {
  const [generatedCSV, setGeneratedCSV] = useState<GeneratedCSV>();

  const { setQueryValue } = useQuery(defaultCompanyInterestListQuery);

  useEffect(() => {
    setGeneratedCSV(undefined);
  }, [selectedSemesterOption, selectedEventOption]);

  const handleSemesterChange = (clickedOption: SemesterOptionType) => {
    const { id } = clickedOption;
    props
      .fetch({
        filters: {
          semesters: id !== null ? id : null,
        },
      })
      .then(() => {
        setQueryValue('semester')(String(id));
      });
  };

  const exportInterestList = async (event: CompanyInterestEventType | '') => {
    const blob = await fetch(
      getCsvUrl(
        selectedSemesterOption.year,
        selectedSemesterOption.semester,
        event
      ),
      {
        headers: {
          Authorization: `Bearer ${props.authToken}`,
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
            onConfirm={() => props.deleteCompanyInterest(id)}
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
    ...props.semesters.map((semesterObj: CompanySemesterEntity) => {
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
            <strong> bedriftsinteresser</strong>.
          </p>
          <Select
            name="form-semester-selector"
            value={selectedSemesterOption}
            onChange={handleSemesterChange}
            options={semesterOptions}
            isClearable={false}
            theme={selectTheme}
            styles={selectStyles}
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
          <Select
            name="form-event-selector"
            value={selectedEventOption}
            onChange={(eventType: EventTypeOption) =>
              setQueryValue('event')(eventType.value)
            }
            options={EVENT_TYPE_OPTIONS}
            isClearable={false}
            theme={selectTheme}
            styles={selectStyles}
          />
        </Flex>

        {generatedCSV ? (
          <a href={generatedCSV.url} download={generatedCSV.filename}>
            Last ned
          </a>
        ) : (
          <Tooltip
            disabled={!!selectedSemesterOption.id}
            content={'Vennligst velg semester'}
          >
            <Button
              onClick={async () =>
                setGeneratedCSV(
                  await exportInterestList(selectedEventOption.value)
                )
              }
              disabled={!selectedSemesterOption.id}
            >
              Eksporter til CSV
            </Button>
          </Tooltip>
        )}
      </Flex>

      <Table
        columns={columns}
        onLoad={(filters) => {
          props.fetch({
            next: true,
            filters,
          });
        }}
        onChange={(filters) => {
          props.fetch({
            filters,
          });
        }}
        hasMore={props.hasMore}
        loading={props.fetching}
        data={props.companyInterestList}
      />
    </Content>
  );
};

export default CompanyInterestList;
