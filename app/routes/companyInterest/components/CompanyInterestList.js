// @flow
import { ListNavigation } from 'app/routes/bdb/utils';
import { semesterToText } from '../utils';
import styles from './CompanyInterest.css';
import React, { Component } from 'react';
import Button from 'app/components/Button';
import { Link } from 'react-router';
import { Content } from 'app/components/Content';
import Flex from 'app/components/Layout/Flex';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import Table from 'app/components/Table';
import Select from 'react-select';

export type Option = {
  value: number,
  semester: string,
  year: string,
  label: string
};

export type Props = {
  companyInterestList: Array<CompanyInterestEntity>,
  deleteCompanyInterest: number => Promise<*>,
  fetch: Object => Promise<*>,
  hasMore: boolean,
  fetching: boolean,
  semesters: Array<CompanySemesterEntity>,
  push: string => void,
  selectedOptions: [Option],
  router: any
};

type State = {
  clickedCompanyInterest: number
};

const RenderCompanyActions = ({
  id,
  handleDelete,
  fetching,
  clickedCompanyInterest
}: {
  id: number,
  handleDelete: number => void,
  fetching: boolean,
  clickedCompanyInterest: number
}) => (
  <a onClick={() => handleDelete(id)}>
    <i
      className="fa fa-minus-circle"
      style={{ color: '#C24538', marginRight: '5px' }}
    />
    {clickedCompanyInterest === id ? 'Er du sikker?' : 'Slett'}
  </a>
);

class CompanyInterestList extends Component<Props, State> {
  state = {
    clickedCompanyInterest: 0
  };

  handleDelete = (clickedCompanyInterest: number) => {
    if (this.state.clickedCompanyInterest === clickedCompanyInterest) {
      this.props
        .deleteCompanyInterest(this.state.clickedCompanyInterest)
        .then(() => {
          this.setState({
            clickedCompanyInterest: 0
          });
        });
    } else {
      this.setState({
        clickedCompanyInterest
      });
    }
  };

  handleChange = (clickedOption: [Option]): void => {
    const optionIds = clickedOption.map(option => Number(option.value));
    this.props
      .fetch({
        filters: {
          semesters: optionIds
        }
      })
      .then(() => {
        this.props.router.replace({
          pathname: '/companyInterest',
          query: {
            semesters: optionIds
          }
        });
      });
  };

  render() {
    const columns = [
      {
        title: 'Bedriftsnavn',
        dataIndex: 'companyName',
        render: (companyName: string, companyInterest: Object) => (
          <Link to={`/companyInterest/${companyInterest.id}/edit`}>
            {companyName}
          </Link>
        )
      },
      {
        title: 'Kontaktperson',
        dataIndex: 'contactPerson',
        render: (contactPerson: string) => <span>{contactPerson}</span>
      },
      {
        title: 'Mail',
        dataIndex: 'mail',
        render: (mail: string) => <span>{mail}</span>
      },
      {
        title: '',
        dataIndex: 'id',
        render: id => (
          <RenderCompanyActions
            fetching={this.props.fetching}
            handleDelete={this.handleDelete}
            id={id}
            clickedCompanyInterest={this.state.clickedCompanyInterest}
          />
        )
      }
    ];

    const options = this.props.semesters
      .map((semesterObj: CompanySemesterEntity) => {
        let { id, year, semester } = semesterObj;
        return {
          value: id,
          year,
          semester,
          label: semesterToText(semesterObj)
        };
      })
      .sort((o1, o2) => {
        if (Number(o1.year) === Number(o2.year)) {
          if (o1.semester === 'spring') {
            return -1;
          }
          return 1;
        }
        return Number(o1.year) > Number(o2.year) ? -1 : 1;
      });
    return (
      <Content>
        <ListNavigation title="Bedriftsinteresser" />
        <Flex className={styles.section}>
          <Flex column>
            <p>
              Her finner du all praktisk informasjon knyttet til
              <strong> bedriftsinteresser</strong>.
            </p>
            <Select
              name="selectCompanySemesters"
              value={this.props.selectedOptions}
              onChange={this.handleChange}
              options={options}
              placeholder="Velg semestre"
              multi
            />
          </Flex>
          <Link to={'/companyInterest/semesters'} className={styles.link}>
            <Button>Endre aktive semestre</Button>
          </Link>
          <Link to={'/companyInterest/create'} className={styles.link}>
            <Button>Opprett ny bedriftsinteresse</Button>
          </Link>
        </Flex>
        <Table
          infiniteScroll
          columns={columns}
          onLoad={(filters, sort) => {
            this.props.fetch({ next: true, filters });
          }}
          onChange={(filters, sort) => {
            this.props.fetch({ filters });
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
