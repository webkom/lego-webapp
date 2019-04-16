import React from 'react';
import CompanyList from '../CompanyList';
import { shallow } from 'enzyme';
import companies from './fixtures/companies';

describe('components', () => {
  describe('CompanyList', () => {
    it('should render companies properly in table', () => {
      const query = {};
      const wrapper = shallow(
        <CompanyList
          companies={companies}
          query={query}
          startSem={0}
          startYear={2016}
          navigateThroughTime={() => null}
          changedStatuses={[]}
        />
      );
      const foundCompanies = wrapper.find('tbody').children();
      expect(foundCompanies.length).toEqual(companies.length);
    });
  });
});
