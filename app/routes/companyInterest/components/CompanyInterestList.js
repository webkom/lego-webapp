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
  selectedOption: Option,
  router: any
};

type State = {
  clickedCompanyInterest: number,
  selectedOption: Option
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
    clickedCompanyInterest: 0,
    selectedOption: this.props.selectedOption
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

  handleChange = (clickedOption: Option): void => {
    this.props
      .fetch({
        filters: {
          semester: clickedOption.semester,
          year: clickedOption.year
        }
      })
      .then(() => {
        //        let yearParam = selectedOption.year
        //          ? `?year=${selectedOption.year}`
        //          : '';
        //        let semesterParam = selectedOption.semester
        //          ? `?semester=${selectedOption.semester}`
        //          : '';
        //        console.log(
        //          'I should be called',
        //          `/companyInterest/${yearParam}${yearParam ? '&' : ''}${semesterParam}`
        //        );
        this.props.router.replace(
          {
            pathname: '/companyInterest',
            query: {
              semester: clickedOption.semester,
              year: clickedOption.year
            }
          }
          // `/companyInterest/${yearParam}${yearParam ? '&' : ''}${semesterParam}`
        );
      })
      .then(() => this.setState({ selectedOption: clickedOption }));
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

    const options = [
      {
        year: '',
        semester: '',
        label: 'Vis alle'
      },
      ...this.props.semesters.map((semester: CompanySemesterEntity) => ({
        year: semester.year,
        semester: semester.semester,
        label: semesterToText(semester)
      }))
    ];

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
              name="form-field-name"
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={options}
              clearable={false}
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
