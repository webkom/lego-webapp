import { Component } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import Flex from 'app/components/Layout/Flex';
import Table from 'app/components/Table';
import config from 'app/config';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import { ListNavigation } from 'app/routes/bdb/utils';
import { semesterToText } from '../utils';
import styles from './CompanyInterest.css';
import { getCsvUrl } from '../utils';

export type SemesterOption = {
  id: number;
  semester: string;
  year: string;
  label: string;
};

export type EventOption = {
  value: string;
  label: string;
};

export type Props = {
  companyInterestList: Array<CompanyInterestEntity>;
  deleteCompanyInterest: (arg0: number) => Promise<any>;
  fetch: (arg0: Record<string, any>) => Promise<any>;
  hasMore: boolean;
  fetching: boolean;
  semesters: Array<CompanySemesterEntity>;
  push: (arg0: string) => void;
  selectedSemesterOption: SemesterOption;
  selectedEventOption: EventOption;
  router: any;
  exportSurvey?: (arg0?: string) => Promise<any>;
};
type State = {
  clickedCompanyInterest: number;
  generatedCSV:
    | {
        url: string;
      }
    | null
    | undefined;
  selectedEvent: string;
};

const RenderCompanyActions = ({
  id,
  handleDelete,
  fetching,
  clickedCompanyInterest,
}: {
  id: number;
  handleDelete: (arg0: number) => void;
  fetching: boolean;
  clickedCompanyInterest: number;
}) => (
  <Button flat onClick={() => handleDelete(id)}>
    <i
      className="fa fa-minus-circle"
      style={{
        color: '#C24538',
        marginRight: '5px',
      }}
    />
    {clickedCompanyInterest === id ? 'Er du sikker?' : 'Slett'}
  </Button>
);

class CompanyInterestList extends Component<Props, State> {
  state = {
    clickedCompanyInterest: 0,
    generatedCSV: undefined,
    selectedEvent: '',
  };
  handleDelete = (clickedCompanyInterest: number) => {
    if (this.state.clickedCompanyInterest === clickedCompanyInterest) {
      this.props
        .deleteCompanyInterest(this.state.clickedCompanyInterest)
        .then(() => {
          this.setState({
            clickedCompanyInterest: 0,
          });
        });
    } else {
      this.setState({
        clickedCompanyInterest,
      });
    }
  };
  handleSemesterChange = (clickedOption: SemesterOption): void => {
    const { id } = clickedOption;
    this.props
      .fetch({
        filters: {
          semesters: id !== null ? id : null,
        },
      })
      .then(() => {
        this.props.push(`/companyInterest?semesters=${clickedOption.id}`);
      });
  };
  handleEventChange = (clickedOption: EventOption): void => {
    // const { value } = clickedOption;
    // this.props
    //   .fetch({
    //     filters: {
    //       events: value !== null ? value : null,
    //     },
    //   })
    //   .then(() => {
    //     this.props.push(`/companyInterest?events=${clickedOption.value}`);
    //   });
    this.setState({ selectedEvent: clickedOption.value });
  };

  componentDidUpdate(prevProps, prevStates) {
    if (
      this.props.selectedSemesterOption !== prevProps.selectedSemesterOption ||
      this.state.selectedEvent !== prevStates.selectedEvent
    ) {
      this.setState({
        generatedCSV: undefined,
      });
    }
  }

  render() {
    const { exportSurvey } = this.props;
    const { generatedCSV, selectedEvent } = this.state;
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
        title: 'Mail',
        dataIndex: 'mail',
        render: (mail: string) => <span>{mail}</span>,
      },
      {
        title: '',
        dataIndex: 'id',
        render: (id) => (
          <RenderCompanyActions
            fetching={this.props.fetching}
            handleDelete={this.handleDelete}
            id={id}
            clickedCompanyInterest={this.state.clickedCompanyInterest}
          />
        ),
      },
    ];
    const semester_options = [
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
      if (Number(o1.year) === Number(o2.year)) {
        if (o1.semester === 'spring') {
          return -1;
        }

        return 1;
      }

      return Number(o1.year) > Number(o2.year) ? -1 : 1;
    });

    const event_type_options = [
      { value: 'company_presentation', label: 'Bedriftspresentasjon' },
      { value: 'course', label: 'Kurs' },
      { value: 'breakfast_talk', label: 'Frokostforedrag' },
      { value: 'lunch_presentation', label: 'Lunsjpresentasjon' },
      { value: 'bedex', label: 'BedEx' },
      { value: 'digital_presentation', label: 'Digital presentasjon' },
      { value: 'other', label: 'Alternativt arrangement' },
      { value: 'sponsor', label: 'Sponser' },
      { value: 'start_up', label: 'Start-up kveld' },
      { value: 'company_to_company', label: 'Bedrift-til-bedrift' },
    ];
    return (
      <Content>
        <ListNavigation title="Bedriftsinteresser" />
        <Flex className={styles.section}>
          <Flex column>
            <p onClick={() => console.log('p', selectedEvent)}>
              Her finner du all praktisk informasjon knyttet til
              <strong> bedriftsinteresser</strong>.
            </p>
            <Select
              name="form-field-name"
              value={this.props.selectedSemesterOption}
              onChange={this.handleSemesterChange}
              options={semester_options}
              isClearable={false}
              theme={selectTheme}
              styles={selectStyles}
            />
          </Flex>
          <Link to="/companyInterest/semesters" className={styles.link}>
            <Button>Endre aktive semestre</Button>
          </Link>
          <Link to="/companyInterest/create" className={styles.link}>
            <Button>Opprett ny bedriftsinteresse</Button>
          </Link>
        </Flex>

        <Flex className={styles.event_section}>
          <div style={{ minWidth: '500px' }}>
            <Select
              name="form-field-name"
              value={this.props.selectedEventOption}
              onChange={this.handleEventChange}
              options={event_type_options}
              isClearable={false}
              theme={selectTheme}
              styles={selectStyles}
            />
          </div>

          <div
            style={{
              marginTop: '5px',
            }}
          >
            {generatedCSV ? (
              <a href={generatedCSV.url}>Last ned</a>
            ) : (
              <Button
                onClick={async () =>
                  this.setState({
                    generatedCSV: await exportSurvey(selectedEvent),
                  })
                }
              >
                Eksporter til CSV
              </Button>
            )}
          </div>
        </Flex>

        <Table
          infiniteScroll
          columns={columns}
          onLoad={(filters, sort) => {
            this.props.fetch({
              next: true,
              filters,
            });
          }}
          onChange={(filters, sort) => {
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
