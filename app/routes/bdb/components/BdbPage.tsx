import qs from 'qs';
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import TextInput from 'app/components/Form/TextInput';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { CompanySemesterContactedStatus } from 'app/models';
import type {
  CompanyEntity,
  BaseSemesterStatusEntity,
} from 'app/reducers/companies';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import sortCompanies from '../SortCompanies';
import { indexToSemester, ListNavigation } from '../utils';
import CompanyList from './CompanyList';
import OptionsBox from './OptionsBox';
import type { Location } from 'history';

type Props = {
  companies: Array<CompanyEntity>;
  query: Record<string, any>;
  fetching: boolean;
  editSemesterStatus: (
    arg0: BaseSemesterStatusEntity,
    arg1: Record<string, any> | null | undefined
  ) => Promise<any>;
  addSemesterStatus: (
    arg0: BaseSemesterStatusEntity,
    arg1: Record<string, any> | null | undefined
  ) => Promise<any>;
  addSemester: (arg0: CompanySemesterEntity) => Promise<any>;
  companySemesters: Array<CompanySemesterEntity>;
  push: (arg0: string) => void;
  location: Location;
};
type State = {
  startYear: number;
  startSem: number;
  submitted: boolean;
  filters: Record<string, Record<string, any>>;
  searchQuery: string;
};
export default class BdbPage extends Component<Props, State> {
  state = {
    startYear: 2016,
    startSem: 0,
    submitted: false,
    filters: {},
    searchQuery: '',
  };

  // eslint-disable-next-line
  componentWillMount() {
    const date = new Date();
    this.setState({
      startYear: date.getFullYear(),
      startSem: date.getMonth() > 6 ? 1 : 0,
    });
  }

  navigateThroughTime = (options: Record<string, any>) => {
    // Change which three semesters are displayed (move ahead or back in time)
    const { startSem, startYear } = this.state;
    const newSem = (startSem + 1) % 2;
    let newYear = 0;

    if (options.direction === 'forward') {
      newYear = startSem === 0 ? startYear : startYear + 1;
    } else {
      newYear = startSem === 1 ? startYear : startYear - 1;
    }

    this.setState({ ...this.state, startYear: newYear, startSem: newSem });
  };
  editChangedStatuses = (
    companyId: number,
    tableIndex: number,
    semesterStatusId: number | null | undefined,
    contactedStatus: Array<CompanySemesterContactedStatus>
  ) => {
    // Update state whenever a semesterStatus is graphically changed by the user
    const {
      companySemesters,
      addSemester,
      addSemesterStatus,
      editSemesterStatus,
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
      semester:
        typeof companySemester.id === 'undefined'
          ? undefined
          : companySemester.id,
    };

    if (typeof companySemester.id === 'undefined') {
      return addSemester(companySemester).then((response) => {
        const updatedStatus = { ...newStatus, semester: response.payload.id };
        return typeof updatedStatus.semesterStatusId === 'undefined'
          ? addSemesterStatus(updatedStatus)
          : editSemesterStatus(updatedStatus);
      });
    }

    return typeof newStatus.semesterStatusId === 'undefined'
      ? addSemesterStatus(newStatus)
      : editSemesterStatus(newStatus);
  };
  updateFilters = (name: string, value: unknown) => {
    // For OptionsBox
    const filters = { ...this.state.filters, [name]: value };
    this.setState({
      filters,
    });
  };
  removeFilters = (name: string) => {
    // For OptionsBox
    const filters = { ...this.state.filters, [name]: undefined };
    this.setState({
      filters,
    });
  };
  companySearch = (companies: CompanyEntity[]): CompanyEntity[] =>
    companies.filter((company: CompanyEntity) =>
      company.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())
    );
  filterCompanies = (companies: Array<CompanyEntity>): CompanyEntity[] => {
    if (this.state.searchQuery !== '') {
      companies = this.companySearch(companies);
    }

    const { filters } = this.state;
    return companies.filter((company) => {
      // Using 'for of' here. Probably a cleaner way to do it, but I couldn't think of one
      for (const key of Object.keys(filters)) {
        const filterShouldApply = filters[key] !== undefined;
        if (
          filterShouldApply &&
          (company[key] === undefined || company[key] === null)
        )
          return false;
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
  updateSearchQuery = (event: Record<string, any>) => {
    const searchQuery = event.target.value;
    this.setState({
      searchQuery,
    });
  };

  render() {
    const { location, companies, fetching, push } = this.props;
    const query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    if (!companies) {
      return <LoadingIndicator loading />;
    }

    const sortedCompanies = sortCompanies(
      companies,
      query,
      this.state.startYear,
      this.state.startSem
    );
    const filteredCompanies = this.filterCompanies(sortedCompanies);

    const searchKeyPress = (event: Record<string, any>) => {
      if (event.key === 'Enter' && filteredCompanies.length === 1) {
        push(`/bdb/${filteredCompanies[0].id}`);
      }
    };

    return (
      <Content>
        <Helmet title="Bedriftsdatabase" />
        <ListNavigation title="Bedriftsdatabase" />

        <TextInput
          prefix="search"
          placeholder="Søk etter bedrifter"
          onChange={this.updateSearchQuery}
          onKeyPress={searchKeyPress}
        />

        <OptionsBox
          companies={companies}
          updateFilters={this.updateFilters}
          removeFilters={this.removeFilters}
          filters={this.state.filters}
        />

        <i
          style={{
            display: 'block',
          }}
        >
          <b>Tips:</b> Du kan endre semestere ved å trykke på dem i listen!
        </i>

        <CompanyList
          companies={filteredCompanies}
          startYear={this.state.startYear}
          startSem={this.state.startSem}
          query={query}
          navigateThroughTime={this.navigateThroughTime}
          editChangedStatuses={this.editChangedStatuses}
          fetching={fetching}
        />
      </Content>
    );
  }
}
