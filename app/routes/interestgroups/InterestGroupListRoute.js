// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/InterestGroupActions';
import InterestGroupList from './components/InterestGroupList';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectInterestGroups } from 'app/reducers/interestGroups';

// Kaller på en action som henter data
function loadData(params, props) {
  props.fetchAll();
}

// Henter ut det vi bryr oss om (i dette tilfellet interessegrupper)
// fra den "globale" staten til nettsiden
function mapStateToProps(state) {
  const interestGroups = selectInterestGroups(state);
  return {
    interestGroups
  };
}

// Hvilke actions vi "bryr" oss om
// Hvilke actions skal reduserne se på
const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(InterestGroupList);
