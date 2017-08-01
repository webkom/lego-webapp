import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import Overview from './components/Overview';
import { selectGalleries } from 'app/reducers/galleries';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state) {
  return {
    galleries: selectGalleries(state)
  };
}

const mapDispatchToProps = { fetchAll, push };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(Overview);
