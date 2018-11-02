import { compose } from 'redux';
import { connect } from 'react-redux';
import PageList from './components/PageList';
import { dispatched } from '@webkom/react-prepare';
import { fetchAll } from 'app/actions/PageActions';

const mapStateToProps = (state, props) => ({
  pages: state.pages.byId
});

const mapDispatchToProps = { fetchAll };

export default compose(
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PageList);
