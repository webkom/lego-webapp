import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetchAll } from 'app/actions/ArticleActions';
import Overview from './components/Overview';
import { selectArticles } from 'app/reducers/articles';
import { selectUserById } from 'app/reducers/users';

const mapStateToProps = state => ({
  articles: selectArticles(state).map(article => ({
    ...article,
    author: selectUserById(state, { userId: article.author })
  })),
  fetching: state.articles.fetching,
  hasMore: state.articles.hasMore
});

const mapDispatchToProps = { fetchAll };

export default compose(
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(Overview);
