import { Button } from '@webkom/lego-bricks';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Content } from 'app/components/Content';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import Table from 'app/components/Table';
import Tooltip from 'app/components/Tooltip';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import { ListNavigation } from 'app/routes/bdb/utils';
import { getCsvUrl, semesterToText } from '../utils';
import styles from './CompanyInterest.css';
import { EVENT_TYPE_OPTIONS } from './CompanyInterestPage';

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
  router: any;
  authToken: string;
};

type State = {
  generatedCSV?: { url: string; filename: string };
};

class CompanyInterestList extends Component<Props, State> {
  state = {
    generatedCSV: undefined,
  };

  handleSemesterChange = (clickedOption: SemesterOptionType): void => {
    const { id } = clickedOption;
    this.props
      .fetch({
        filters: {
          semesters: id !== null ? id : null,
        },
      })
      .then(() => {
        this.props.replace(
          `/companyInterest?semesters=${clickedOption.id}&event=${this.props.selectedEventOption.value}`
        );
      });
  };

  handleEventChange = (clickedOption: EventOptionType): void => {
    this.props.replace(
      `/companyInterest?semesters=${this.props.selectedSemesterOption.id}&event=${clickedOption.value}`
    );
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.selectedSemesterOption !== prevProps.selectedSemesterOption
    ) {
      this.setState({
        generatedCSV: undefined,
      });
    }
  }

  async exportInterestList(event?: string) {
    const blob = await fetch(
      getCsvUrl(
        this.props.selectedSemesterOption.year,
        this.props.selectedSemesterOption.semester,
        event
      ),
      {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      }
    ).then((response) => response.blob());
    return {
      url: URL.createObjectURL(blob),
      filename: `company-interests-${this.props.selectedSemesterOption.year}-${
        this.props.selectedSemesterOption.semester
      }${
        this.props.selectedEventOption.value
          ? `-${this.props.selectedEventOption.value}`
          : ''
      }.csv`,
    };
  }

  render() {
    const { generatedCSV } = this.state;
    const columns = [
      {
        title: 'Bedriftsnavn',
        dataIndex: 'companyName',
        render: (companyName: string, companyInterest: Record<string, any>) => (
          <Link to={`/companyInterest/${companyInterest.id}/edit`}>
            {companyInterest.company
              ? companyInterest.company.name
              : companyName}
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
              onConfirm={() => this.props.deleteCompanyInterest(id)}
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
      ...this.props.semesters.map((semesterObj: CompanySemesterEntity) => {
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
              value={this.props.selectedSemesterOption}
              onChange={this.handleSemesterChange}
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
              value={this.props.selectedEventOption}
              onChange={this.handleEventChange}
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
              disabled={!!this.props.selectedSemesterOption.id}
              content={'Vennligst velg semester'}
            >
              <Button
                onClick={async () =>
                  this.setState({
                    generatedCSV: await this.exportInterestList(
                      this.props.selectedEventOption.value
                    ),
                  })
                }
                disabled={!this.props.selectedSemesterOption.id}
              >
                Eksporter til CSV
              </Button>
            </Tooltip>
          )}
        </Flex>

        <Table
          columns={columns}
          onLoad={(filters) => {
            this.props.fetch({
              next: true,
              filters,
            });
          }}
          onChange={(filters) => {
            this.props.fetch({
              filters,
            });
          }}
          hasMore={this.props.hasMore}
          loading={this.props.fetching}
          data={this.props.companyInterestList}
        />
      </Content>
    );
  }
}

export default CompanyInterestList;
