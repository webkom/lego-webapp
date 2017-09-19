import React, { Component } from 'react';
import CompanyList from './CompanyList';
import styles from './bdb.css';
import sortCompanies from '../SortCompanies.js';
import { indexToSemester } from '../utils.js';
import Button from 'app/components/Button';
import OptionsBox from './OptionsBox';
import TextInput from 'app/components/Form/TextInput';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Icon from 'app/components/Icon';

type Props = {
  companies: Array<Object>,
  query: Object,
  editSemesterStatus: () => void,
  addSemesterStatus: () => void,
  addSemester: () => void,
  companySemesters: {}
};

export default class BdbPage extends Component {
  state = {
    companies: [],
    startYear: 2016,
    startSem: 0,
    changedStatuses: [],
    submitted: false,
    displayOptions: false,
    filters: {},
    searchQuery: ''
  };

  componentWillMount() {
    const date = new Date();
    this.setState({
      startYear: date.getFullYear(),
      startSem: date.getMonth() > 6 ? 1 : 0
    });
  }

  componentWillReceiveProps(newProps) {
    if (this.state.companies.length === 0) {
      this.setState({
        companies: newProps.companies
      });
    }
  }
  props: Props;

  changeSemesters = forward => {
    // Change which three semesters are displayed (move ahead or back in time)
    const { startSem, startYear } = this.state;
    const newSem = (startSem + 1) % 2;

    let newYear = 0;
    if (forward) {
      newYear = startSem === 0 ? startYear : startYear + 1;
    } else {
      newYear = startSem === 1 ? startYear : startYear - 1;
    }
    this.setState({ ...this.state, startYear: newYear, startSem: newSem });
  };

  editSemester = (companyId, tableIndex, semesterStatusId, contactedStatus) => {
    // Update state whenever a semesterStatus is graphically changed by the user
    const { companySemesters } = this.props;
    const { changedStatuses, companies, startYear, startSem } = this.state;
    const globalSemester = indexToSemester(
      tableIndex,
      startYear,
      startSem,
      companySemesters
    );

    const matchSemester = status =>
      status.semester.year === globalSemester.year &&
      status.semester.semester === globalSemester.semester &&
      status.companyId === companyId;

    // Find which semester has been changed.
    const changedCompanyIndex = companies.indexOf(
      companies.find(company => company.id === companyId)
    );
    const changedCompanyStatuses = (companies[changedCompanyIndex] || {
      semesterStatuses: []
    }).semesterStatuses;
    const changedSemesterIndex = changedCompanyStatuses.indexOf(
      changedCompanyStatuses.find(
        status => status.semester === globalSemester.id
      )
    );

    // Check if we've already edited this semester. First checking in
    // state.companies
    if (changedSemesterIndex === -1) {
      // We have to add a new semester to state.companies
      companies[changedCompanyIndex].semesterStatuses.push({
        semesterStatusId,
        contactedStatus,
        semester: globalSemester.semester,
        year: globalSemester.year
      });
    } else {
      // We're changing an existing semesterStatus in state.companies.
      // We have to check if the semesterStatus already has this contactedStatus
      // (since each semester can have several values in contactedStatus):
      companies[changedCompanyIndex].semesterStatuses[
        changedSemesterIndex
      ].contactedStatus = contactedStatus;
    }

    // Then in state.changedStatuses.
    if (typeof changedStatuses.find(matchSemester) === 'undefined') {
      // We have to add a new semester to state.changedStatuses
      changedStatuses.push({
        companyId,
        semesterStatusId,
        contactedStatus,
        semester: globalSemester
      });
    } else {
      // We're changing an existing entry in state.changedStatuses
      changedStatuses.find(matchSemester).contactedStatus = contactedStatus;
    }

    this.setState({
      companies,
      changedStatuses,
      submitted: false
    });
  };

  submitSemesters = () => {
    const {
      addSemester,
      addSemesterStatus,
      editSemesterStatus,
      companySemesters
    } = this.props;
    this.state.changedStatuses.map(status => {
      const companySemesterId = status.semester.id;

      if (typeof companySemesterId === 'undefined') {
        // This semesterStatus had no companySemester when it was created.
        // The companySemester might have been created since then:
        const foundCompanySemester = companySemesters.find(
          semester =>
            semester.year === status.semester.year &&
            semester.semester === status.semester.semester
        );
        if (foundCompanySemester) {
          // the semester has already been created
          addSemesterStatus({ ...status, semester: foundCompanySemester.id });
        } else {
          // We have to add the companySemester
          addSemester(
            status.semester.year,
            status.semester.semester
          ).then(() => {
            const newlyCreatedId = this.props.companySemesters.find(
              companySemester =>
                companySemester.year === status.semester.year &&
                companySemester.semester === status.semester.semester
            ).id;
            addSemesterStatus({ ...status, semester: newlyCreatedId });
          });
        }
      } else if (typeof status.semesterStatusId === 'undefined') {
        // The companySemester was already nicely in place, but this company
        // had no semesterStatus created here
        addSemesterStatus({ ...status, semester: companySemesterId });
      } else {
        // The company already had a semesterStatus tied to this companySemester
        editSemesterStatus(status);
      }
    });
    this.setState({ changedStatuses: [], submitted: true });
  };

  updateFilters = (name, value) => {
    // For OptionsBox
    const filters = this.state.filters;
    filters[name] = value;
    this.setState({ filters });
  };

  toggleDisplay = () => {
    this.setState({
      displayOptions: !this.state.displayOptions
    });
  };

  companySearch = companies =>
    companies.filter(company =>
      company.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())
    );

  filterCompanies = companies => {
    if (this.state.searchQuery !== '') {
      companies = this.companySearch(companies);
    }
    const { filters } = this.state;
    return companies.filter(company => {
      // Using 'for of' here. Probably a cleaner way to do it, but I couldn't think of one
      for (const key of Object.keys(filters)) {
        if (filters[key] !== undefined && company[key] !== filters[key]) {
          return false;
        }
      }
      return true;
    });
  };

  updateSearchQuery = event => {
    const searchQuery = event.target.value;
    this.setState({ searchQuery });
  };

  render() {
    const { query, companies } = this.props;

    if (!companies) {
      return <LoadingIndicator loading />;
    }

    const sortedCompanies = sortCompanies(
      this.state.companies.length > 0 ? this.state.companies : companies,
      query,
      this.state.startYear,
      this.state.startSem
    );

    return (
      <div className={styles.root}>
        <h1>Bedriftsdatabase</h1>

        <div className={styles.search}>
          <h2>Søk</h2>
          <TextInput onChange={this.updateSearchQuery} />
        </div>

        <h2
          onClick={this.toggleDisplay}
          className={styles.optionsHeader}
          style={{ cursor: 'pointer', margin: '15px 0' }}
        >
          Valg{' '}
          {this.state.displayOptions
            ? <i className="fa fa-caret-down" />
            : <i className="fa fa-caret-right" />}
        </h2>

        <OptionsBox
          companies={companies}
          updateFilters={this.updateFilters}
          display={this.state.displayOptions}
          filters={this.state.filters}
        />

        {this.state.changedStatuses.length > 0
          ? <Button onClick={this.submitSemesters} dark>
              Lagre endringer
            </Button>
          : ''}
        {this.state.submitted &&
          <div>
            <Icon
              name="checkmark"
              size={30}
              style={{ color: 'green', marginBottom: '-10px' }}
            />{' '}
            Lagret!
          </div>}

        <i style={{ display: 'block' }}>
          <b>Tips:</b> Du kan endre semestere ved å trykke på dem i listen!
        </i>

        <CompanyList
          {...this.props}
          startYear={this.state.startYear}
          startSem={this.state.startSem}
          companies={this.filterCompanies(sortedCompanies)}
          changeSemesters={this.changeSemesters}
          editSemester={this.editSemester}
          removeChangedStatus={this.removeChangedStatus}
          changedStatuses={this.state.changedStatuses}
        />
      </div>
    );
  }
}
