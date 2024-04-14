import { Card, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  fetchAllAdmin,
  addSemesterStatus,
  editSemesterStatus,
  fetchSemesters,
  addSemester,
} from 'app/actions/CompanyActions';
import { Content } from 'app/components/Content';
import TextInput from 'app/components/Form/TextInput';
import { selectTransformedAdminCompanies } from 'app/reducers/companies';
import { selectAllCompanySemesters } from 'app/reducers/companySemesters';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import sortCompanies from '../SortCompanies';
import {
  indexToCompanySemester,
  indexToYearAndSemester,
  ListNavigation,
} from '../utils';
import CompanyList from './CompanyList';
import OptionsBox from './OptionsBox';
import type { EntityId } from '@reduxjs/toolkit';
import type { TransformedAdminCompany } from 'app/reducers/companies';
import type { CompanySemesterContactStatus } from 'app/store/models/Company';
import type { ChangeEvent, KeyboardEvent } from 'react';

const BdbPage = () => {
  const [startYear, setStartYear] = useState(2016);
  const [startSem, setStartSem] = useState(0);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const companies = useAppSelector(selectTransformedAdminCompanies);
  const companySemesters = useAppSelector(selectAllCompanySemesters);
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
    [],
  );

  const navigateThroughTime = (options: {
    direction: 'forward' | 'backward';
  }) => {
    // Change which three semesters are displayed (move ahead or back in time)
    const newSem = (startSem + 1) % 2;
    let newYear: number;
    if (options.direction === 'forward') {
      newYear = startSem === 0 ? startYear : startYear + 1;
    } else {
      newYear = startSem === 1 ? startYear : startYear - 1;
    }

    setStartYear(newYear);
    setStartSem(newSem);
  };

  const editChangedStatuses = async (
    companyId: EntityId,
    tableIndex: number,
    semesterStatusId: EntityId | undefined,
    contactedStatus: CompanySemesterContactStatus[],
  ) => {
    // Update state whenever a semesterStatus is graphically changed by the user
    const companySemester = indexToCompanySemester(
      tableIndex,
      startYear,
      startSem,
      companySemesters,
    );

    let companySemesterId: EntityId;

    if (!companySemester) {
      const newCompanySemester = indexToYearAndSemester(
        tableIndex,
        startYear,
        startSem,
      );
      const response = await dispatch(addSemester(newCompanySemester));
      companySemesterId = response.payload.result;
    } else {
      companySemesterId = companySemester.id;
    }

    const semesterStatus = {
      companyId,
      contactedStatus,
      semester: companySemesterId,
    };
    return semesterStatusId
      ? dispatch(editSemesterStatus({ ...semesterStatus, semesterStatusId }))
      : dispatch(addSemesterStatus(semesterStatus)).then(() => {
          navigate('/bdb');
        });
  };

  const updateFilters = (name: string, value: unknown) => {
    // For OptionsBox
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const removeFilters = (name: string) => {
    // For OptionsBox
    setFilters((prev) => ({ ...prev, [name]: undefined }));
  };

  const companySearch = (companies: TransformedAdminCompany[]) =>
    companies.filter((company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const filterCompanies = (companies: TransformedAdminCompany[]) => {
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
