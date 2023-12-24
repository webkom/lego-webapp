import { Card, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';
import {
  fetchAllAdmin,
  addSemesterStatus,
  editSemesterStatus,
  fetchSemesters,
  addSemester,
} from 'app/actions/CompanyActions';
import { Content } from 'app/components/Content';
import TextInput from 'app/components/Form/TextInput';
import { selectCompanies, type CompanyEntity } from 'app/reducers/companies';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import sortCompanies from '../SortCompanies';
import { indexToSemester, ListNavigation } from '../utils';
import CompanyList from './CompanyList';
import OptionsBox from './OptionsBox';
import type { CompanySemesterContactedStatus } from 'app/models';
import type { ID } from 'app/store/models';
import type { ChangeEvent, KeyboardEvent } from 'react';

const BdbPage = () => {
  const [startYear, setStartYear] = useState(2016);
  const [startSem, setStartSem] = useState(0);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const companies = useAppSelector(selectCompanies);
  const companySemesters = useAppSelector(selectCompanySemesters);
  const fetching = useAppSelector((state) => state.companies.fetching);

  const navigate = useNavigate();
  const location = useLocation();
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  useEffect(() => {
    const date = new Date();
    setStartYear(date.getFullYear());
    setStartSem(date.getMonth() > 6 ? 1 : 0);
  }, []);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchBdb',
    () => dispatch(fetchSemesters()).then(() => dispatch(fetchAllAdmin())),
    []
  );

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
    contactedStatus: CompanySemesterContactedStatus[]
  ) => {
    // Update state whenever a semesterStatus is graphically changed by the user
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
      return dispatch(addSemester(companySemester)).then((response) => {
        const updatedStatus = { ...newStatus, semester: response.payload.id };
        return typeof updatedStatus.semesterStatusId === 'undefined'
          ? dispatch(addSemesterStatus(updatedStatus)).then(() => {
              navigate('/bdb');
            })
          : dispatch(editSemesterStatus(updatedStatus));
      });
    }

    return typeof newStatus.semesterStatusId === 'undefined'
      ? dispatch(addSemesterStatus(newStatus)).then(() => {
          navigate('/bdb');
        })
      : dispatch(editSemesterStatus(newStatus));
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

  const updateSearchQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (!companies) {
    return <LoadingIndicator loading={fetching} />;
  }

  const sortedCompanies = sortCompanies(companies, query, startYear, startSem);
  const filteredCompanies = filterCompanies(sortedCompanies);

  const searchKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && filteredCompanies.length === 1) {
      navigate(`/bdb/${filteredCompanies[0].id}`);
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

export default guardLogin(BdbPage);
