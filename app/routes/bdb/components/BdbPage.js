import React, { Component } from 'react';
import CompanyList from './CompanyList';
import styles from './bdb.css';
import sortCompanies from '../SortCompanies.js';
import { indexToSemester, ListNavigation } from '../utils.js';
import OptionsBox from './OptionsBox';
import TextInput from 'app/components/Form/TextInput';
import LoadingIndicator from 'app/components/LoadingIndicator';

type Props = {
  companies: Array<Object>,
  query: Object,
  editSemesterStatus: () => void,
  addSemesterStatus: () => void,
  addSemester: () => void,
  companySemesters: {}
};

export default class BdbPage extends Component {
  props: Props;

  state = {
    startYear: 2016,
    startSem: 0,
    submitted: false,
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

  navigateThroughTime = forward => {
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
    const {
      companySemesters,
      addSemester,
      addSemesterStatus,
      editSemesterStatus
    } = this.props;
    const { startYear, startSem } = this.state;

    const companySemester = indexToSemester(
      tableIndex,
      startYear,
      startSem,
      companySemesters
    );

    const newStatus = {
      companyId,
      contactedStatus,
      semesterStatusId,
      semester: companySemester.id
    };

    if (typeof companySemester.id === 'undefined') {
      addSemester(companySemester).then(response => {
        const updatedStatus = { ...newStatus, semester: response.payload.id };
        return typeof updatedStatus.semesterStatusId === 'undefined'
          ? addSemesterStatus(updatedStatus)
          : editSemesterStatus(updatedStatus);
      });
    } else {
      return typeof newStatus.semesterStatusId === 'undefined'
        ? addSemesterStatus(newStatus)
        : editSemesterStatus(newStatus);
    }
  };

  updateFilters = (name, value) => {
    // For OptionsBox
    const filters = this.state.filters;
    filters[name] = value;
    this.setState({ filters });
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
        const filterShouldApply = filters[key] !== undefined;
        if (filterShouldApply && !company[key]) return false;

        const shouldFilterById =
          filterShouldApply && company[key].id && filters[key].id;
        const regularFilter =
          !shouldFilterById && company[key] !== filters[key];
        const idFilter =
          shouldFilterById && company[key].id !== filters[key].id;

        if (filterShouldApply && (regularFilter || idFilter)) {
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
      companies,
      query,
      this.state.startYear,
      this.state.startSem
    );

    return (
      <div className={styles.root}>
        <ListNavigation title="Bedriftsdatabase" />

        <div className={styles.search}>
          <h2>Søk</h2>
          <TextInput onChange={this.updateSearchQuery} />
        </div>

        <OptionsBox
          companies={companies}
          updateFilters={this.updateFilters}
          filters={this.state.filters}
        />

        <i style={{ display: 'block' }}>
          <b>Tips:</b> Du kan endre semestere ved å trykke på dem i listen!
        </i>

        <CompanyList
          {...this.props}
          startYear={this.state.startYear}
          startSem={this.state.startSem}
          companies={this.filterCompanies(sortedCompanies)}
          navigateThroughTime={this.navigateThroughTime}
          editSemester={this.editSemester}
          removeChangedStatus={this.removeChangedStatus}
        />
      </div>
    );
  }
}
