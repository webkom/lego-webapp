import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetchAll } from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';
import Overview from './components/Overview';
import { selectGalleries } from 'app/reducers/galleries';

function mapStateToProps(state) {
  return {
    galleries: selectGalleries(state)
  };
}

const mapDispatchToProps = { fetchAll, push };

export default compose(
  dispatched((params, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(Overview);
