import { shallow } from 'enzyme';
import { describe, it, expect } from 'vitest';
import TextInput from 'app/components/Form/TextInput';
import BdbPage from '../BdbPage';
import CompanyList from '../CompanyList';
import OptionsBox from '../OptionsBox';
import companies from './fixtures/companies';
import companySemesters from './fixtures/companySemesters';

describe('components', () => {
  describe('BdbPage', () => {
    it('should render sub-components properly', () => {
      const location = {
        search: '',
      };
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
      expect(searchField).toHaveLength(1);
      const optionsBox = wrapper.find(OptionsBox);
      expect(optionsBox).toHaveLength(1);
      const companyList = wrapper.find(CompanyList);
      expect(companyList).toHaveLength(1);
    });
  });
});
