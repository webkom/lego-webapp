import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchPage } from 'app/actions/PageActions';
import PageDetail from './components/PageDetail';
import { selectPageBySlug } from 'app/reducers/pages';

function loadData({ pageSlug }, props) {
  props.fetchPage(pageSlug);
}

function mapStateToProps(state, props) {
  const { pageSlug } = props.params;
  const page = selectPageBySlug(state, { pageSlug });
  return { page, pageSlug };
}

const mapDispatchToProps = { fetchPage };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['pageSlug', 'loggedIn'], loadData),
)(PageDetail);
