import React from 'react';
import expect from 'expect';
import CompanyList from '../CompanyList';
import { shallow } from 'enzyme';
import companies from './fixtures/companies';

describe('components', () => {
  describe('CompanyList', () => {
    it('should render companies properly in table', () => {
      const query = {};
      const wrapper = shallow(
        <CompanyList companies={companies} query={query} />
      );
      const foundCompanies = wrapper.find('tbody').children();
      expect(foundCompanies.length).toEqual(companies.length);
    });
    /**
    * This would have to be tested in the container, which I couldn't figure out how to do.
    * Keeping it for now
    it('should sort "ascending" alphabetically if selected (C > B > A)', () => {
      const query = {
        'nameSort': 'ascending'
      };
      const wrapper = shallow(
        <CompanyList companies={companies} query={query} />
      );
      const foundCompanies = wrapper.find('tbody').children();
      expect(foundCompanies.at(0).props().company).toEqual(companies[2]);
      expect(foundCompanies.at(1).props().company).toEqual(companies[1]);
      expect(foundCompanies.at(2).props().company).toEqual(companies[0]);
    }); */
  });
});
