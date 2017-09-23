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
  props: Props;

  state = {
    startYear: 2016,
    startSem: 0,
    changedStatses: [],
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
    const { companySemesters } = this.props;
    const { changedStatses, startYear, startSem } = this.state;

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

    const semesterIsAlreadyChanged =
      typeof changedStatses.find(matchSemester) !== 'undefined';

    // Change the "changedSemester" if it's already in state, ie this
    // semesterStatus has been changed since last save. Otherwise, add it.
    const newchangedStatses = semesterIsAlreadyChanged
      ? changedStatses.map(
          changedSemester =>
            matchSemester(changedSemester)
              ? { ...changedSemester, contactedStatus }
              : changedSemester
        )
      : changedStatses.concat({
          companyId,
          contactedStatus,
          semesterStatusId,
          semester: globalSemester
        });

    this.setState({
      changedStatses: newchangedStatses,
      submitted: false
    });
  };

  submitSemesters = () => {
    const { addSemester, addSemesterStatus, editSemesterStatus } = this.props;
    const { changedStatses } = this.state;

    const semestersToAdd = changedStatses
      .filter(status => typeof status.semester.id === 'undefined')
      .map(status => status.semester)
      .filter((semester, index, arraySoFar) => {
        return (
          arraySoFar.indexOf(
            arraySoFar.find(
              alreadyAdded =>
                alreadyAdded.year === semester.year &&
                alreadyAdded.semester === semester.semester
            )
          ) === index
        );
      });

    const semesterPromises = semestersToAdd.map((toAdd, i) =>
      addSemester(semestersToAdd[i])
    );

    Promise.all(semesterPromises).then(responses => {
      const changedStatsesWithCompanySemesters = changedStatses.map(status => {
        const relevantResponse = responses.find(
          response =>
            response.payload.year === status.semester.year &&
            response.payload.semester === status.semester.semester
        );
        const newlyMadeSemester = relevantResponse && relevantResponse.payload;

        return {
          ...status,
          semester: status.semester.id || newlyMadeSemester.id
        };
      });

      changedStatsesWithCompanySemesters.map(
        status =>
          typeof status.semesterStatusId === 'undefined'
            ? addSemesterStatus(status)
            : editSemesterStatus(status)
      );
    });

    this.setState({ changedStatses: [], submitted: true });
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

    const mergedCompaniesWithState = companies.map(company => {
      const updatedSemesterStatuses = company.semesterStatuses.map(status => {
        const changedSemester = this.state.changedStatses.find(
          changed => changed.semesterStatusId === status.id
        );

        return changedSemester
          ? { ...status, contactedStatus: changedSemester.contactedStatus }
          : status;
      });

      const newSemesterStatuses = updatedSemesterStatuses.concat(
        this.state.changedStatses
          .filter(
            changed =>
              changed.companyId === company.id &&
              typeof changed.semesterStatusId === 'undefined'
          )
          .map(changed => ({
            contactedStatus: changed.contactedStatus,
            year: changed.semester.year,
            semester: changed.semester.semester
          }))
      );

      return { ...company, semesterStatuses: newSemesterStatuses };
    });

    const sortedCompanies = sortCompanies(
      mergedCompaniesWithState,
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

        {this.state.changedStatses.length > 0 ? (
          <Button onClick={this.submitSemesters} dark>
            Lagre endringer
          </Button>
        ) : (
          ''
        )}
        {this.state.submitted && (
          <div>
            <Icon
              name="checkmark"
              size={30}
              style={{ color: 'green', marginBottom: '-10px' }}
            />{' '}
            Lagret!
          </div>
        )}

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
          changedStatses={this.state.changedStatses}
        />
      </div>
    );
  }
}
