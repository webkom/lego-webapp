import { Card, LoadingIndicator } from '@webkom/lego-bricks';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import TextInput from 'app/components/Form/TextInput';
import sortCompanies from '../SortCompanies';
import { indexToSemester, ListNavigation } from '../utils';
import CompanyList from './CompanyList';
import OptionsBox from './OptionsBox';
import type { CompanySemesterContactedStatus } from 'app/models';
import type {
  CompanyEntity,
  BaseSemesterStatusEntity,
} from 'app/reducers/companies';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import type { ID } from 'app/store/models';
import type { Location, History } from 'history';
import type { KeyboardEvent } from 'react';

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
  push: History['push'];
  location: Location;
};

const BdbPage = (props: Props) => {
  const [startYear, setStartYear] = useState(2016);
  const [startSem, setStartSem] = useState(0);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const date = new Date();
    setStartYear(date.getFullYear());
    setStartSem(date.getMonth() > 6 ? 1 : 0);
  }, []);

  const navigateThroughTime = (options: Record<string, any>) => {
    // Change which three semesters are displayed (move ahead or back in time)
    const newSem = (startSem + 1) % 2;
    let newYear = 0;

    if (options.direction === 'forward') {
      newYear = startSem === 0 ? startYear : startYear + 1;
    } else {
      newYear = startSem === 1 ? startYear : startYear - 1;
    }

    setStartYear(newYear);
    setStartSem(newSem);
  };

  const editChangedStatuses = (
    companyId: ID,
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
    } = props;
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
      semester: companySemester?.id,
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

  const updateFilters = (name: string, value: unknown) => {
    // For OptionsBox
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const removeFilters = (name: string) => {
    // For OptionsBox
    setFilters((prev) => ({ ...prev, [name]: undefined }));
  };

  const companySearch = (companies: CompanyEntity[]): CompanyEntity[] =>
    companies.filter((company: CompanyEntity) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filterCompanies = (companies: CompanyEntity[]): CompanyEntity[] => {
    if (searchQuery !== '') {
      companies = companySearch(companies);
    }

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

  const updateSearchQuery = (event: Record<string, any>) => {
    setSearchQuery(event.target.value);
  };

  const { location, companies, fetching, push } = props;
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  if (!companies) {
    return <LoadingIndicator loading />;
  }

  const sortedCompanies = sortCompanies(companies, query, startYear, startSem);
  const filteredCompanies = filterCompanies(sortedCompanies);

  const searchKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
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
        onChange={updateSearchQuery}
        onKeyPress={searchKeyPress}
      />

      <OptionsBox
        companies={companies}
        updateFilters={updateFilters}
        removeFilters={removeFilters}
        filters={filters}
      />

      <Card severity="info">
        <Card.Header>Tips</Card.Header>
        Du kan endre semestere ved å trykke på dem i listen!
      </Card>

      <CompanyList
        companies={filteredCompanies}
        startYear={startYear}
        startSem={startSem}
        query={query}
        navigateThroughTime={navigateThroughTime}
        editChangedStatuses={editChangedStatuses}
        fetching={fetching}
      />
    </Content>
  );
};

export default BdbPage;
