import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/ArticleActions';
import { login, logout } from 'app/actions/UserActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import Overview from './components/Overview';
import { selectArticles } from 'app/reducers/articles';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state) {
  return {
    articles: selectArticles(state)
  };
}

const mapDispatchToProps = { fetchAll, login, logout };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(Overview);
