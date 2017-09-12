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

  componentDidMount() {
    const date = new Date();
    console.log('mounted');
    console.log(this.props);
    this.setState({
      companies: this.props.companies,
      startYear: date.getFullYear(),
      startSem: date.getMonth() > 6 ? 1 : 0
    });
  }

  componentWillReceiveProps(newProps) {
    console.log('got new props');
    console.log(newProps);
    this.setState({
      companies: newProps.companies
    });
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

  editSemester = (companyId, tableIndex, semesterId, contactedStatus) => {
    // Update state whenever a semesterStatus is graphically changed by the user
    const { addSemester, companySemesters } = this.props;
    const { changedStatuses, companies, startYear, startSem } = this.state;
    const globalSemester = indexToSemester(
      tableIndex,
      startYear,
      startSem,
      companySemesters
    );

    // If the semester doesn't exist yet, make it before continuing
    if (!globalSemester.id) {
      addSemester(globalSemester.year, globalSemester.semester).then(response =>
        this.editSemesterSupportFunction(
          companyId,
          tableIndex,
          semesterId,
          contactedStatus,
          addSemester,
          companySemesters,
          changedStatuses,
          companies,
          startYear,
          startSem,
          indexToSemester(tableIndex, startYear, startSem, companySemesters)
        )
      );
    } else {
      this.editSemesterSupportFunction(
        companyId,
        tableIndex,
        semesterId,
        contactedStatus,
        addSemester,
        companySemesters,
        changedStatuses,
        companies,
        startYear,
        startSem,
        globalSemester
      );
    }
  };

  editSemesterSupportFunction = (
    companyId,
    tableIndex,
    semesterStatusId,
    contactedStatus,
    addSemester,
    companySemesters,
    changedStatuses,
    companies,
    startYear,
    startSem,
    globalSemester
  ) => {
    const matchSemester = status =>
      status.semester === globalSemester.id && status.companyId === companyId;

    // Find which semester has been changed.
    const changedCompanyIndex = companies.indexOf(
      companies.find(company => company.id === companyId)
    );
    console.log('asd');
    console.log(companies);
    console.log(changedCompanyIndex);
    console.log(companies[changedCompanyIndex]);
    const changedCompanyStatuses =
      companies[changedCompanyIndex].semesterStatuses;
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
        semesterId: semesterStatusId,
        contactedStatus,
        semester: Number(globalSemester.id)
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
        semesterId: semesterStatusId,
        contactedStatus,
        semester: Number(globalSemester.id)
      });
    } else {
      // We're changing an existing entry in state.changedStatuses
      changedStatuses.find(matchSemester).contactedStatus = contactedStatus;
    }

    console.log('next changedStatuses');
    console.log(changedStatuses);

    this.setState({
      companies,
      changedStatuses
    });
  };

  submitSemesters = () => {
    const { addSemesterStatus, editSemesterStatus } = this.props;
    this.state.changedStatuses.forEach(status => {
      console.log('status');
      console.log(status);
      if (typeof status.semesterId === 'undefined') {
        addSemesterStatus(status);
      } else {
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
          {this.state.displayOptions ? (
            <i className="fa fa-caret-down" />
          ) : (
            <i className="fa fa-caret-right" />
          )}
        </h2>

        <OptionsBox
          companies={companies}
          updateFilters={this.updateFilters}
          display={this.state.displayOptions}
          filters={this.state.filters}
        />

        {this.state.changedStatuses.length > 0 ? (
          <Button onClick={this.submitSemesters} dark>
            Lagre endringer
          </Button>
        ) : (
          ''
        )}
        {this.state.submitted &&
          <Icon name="checkmark" size={30} /> + 'Lagret!'}

        <i style={{ display: 'block' }}>
          <b>Tips:</b> Du kan endre semestere ved å trykke på dem i listen!
          Semestere merket med * er endringer klare for lagring.
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
