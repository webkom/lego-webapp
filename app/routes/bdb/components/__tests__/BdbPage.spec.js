import React from 'react';
import BdbPage from '../BdbPage';
import { shallow } from 'enzyme';
import companies from './fixtures/companies';
import companySemesters from './fixtures/companies';
import CompanyList from '../CompanyList';
import OptionsBox from '../OptionsBox';
import TextInput from 'app/components/Form/TextInput';

describe('components', () => {
  describe('BdbPage', () => {
    it('should render sub-components properly', () => {
      const location = { search: '' };
      const wrapper = shallow(
        <BdbPage
          companies={companies}
          location={location}
          editSemesterStatus={() => null}
          addSemesterStatus={() => null}
          companySemesters={companySemesters}
        />
      );
      const searchField = wrapper.find(TextInput);
      expect(searchField.length).toEqual(1);
      const optionsBox = wrapper.find(OptionsBox);
      expect(optionsBox.length).toEqual(1);
      const companyList = wrapper.find(CompanyList);
      expect(companyList.length).toEqual(1);
    });
  });
});
