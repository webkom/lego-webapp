import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetchAll } from 'app/actions/ArticleActions';
import { login, logout } from 'app/actions/UserActions';
import Overview from './components/Overview';
import { selectArticles } from 'app/reducers/articles';

const mapStateToProps = state => ({
  articles: selectArticles(state)
});

const mapDispatchToProps = { fetchAll, login, logout };

export default compose(
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(Overview);
