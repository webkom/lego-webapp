import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  fetchAll,
  createCompanyInterest
} from 'app/actions/CompanyInterestActions';
import CompanyInterestList from './components/CompanyInterestList';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
//import { selectCompanyInterestList } from 'app/reducers/companyInterest';

function loadData(params, props) {
  //props.fetchAll();
}

function mapStateToProps(state) {
  //const companyInterestList = selectCompanyInterestList(state);
  return {
    CompanyInterestList: [
      {
        name: 'test',
        id: 1,
        contactPerson: 'martin',
        mail: 'martin@kul.no',
        interestPic: 'https://i.redd.it/dz8mwvl4dgdy.jpg',
        companyPresentation: true,
        course: false,
        lunchPresentation: false,
        readme: true,
        collaboration: false,
        itdagene: true,
        comment: 'kommentar'
      },
      {
        name: 'testerino',
        id: 1,
        contactPerson: 'martin',
        mail: 'martin@kul.no',
        interestPic: 'https://i.redd.it/dz8mwvl4dgdy.jpg',
        companyPresentation: true,
        course: false,
        lunchPresentation: false,
        readme: true,
        collaboration: false,
        itdagene: true,
        comment: 'kommentar'
      },
      {
        name: 'testerano',
        id: 1,
        contactPerson: 'martin',
        mail: 'martin@kul.no',
        interestPic: 'https://i.redd.it/dz8mwvl4dgdy.jpg',
        companyPresentation: true,
        course: false,
        lunchPresentation: false,
        readme: true,
        collaboration: false,
        itdagene: true,
        comment: 'kommentar'
      }
    ]
  };
}

const mapDispatchToProps = { fetchAll, createCompanyInterest };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(CompanyInterestList);
