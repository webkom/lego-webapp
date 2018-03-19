import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/ArticleActions';
import Overview from './components/Overview';
import { selectArticles } from 'app/reducers/articles';
import { selectUserById } from 'app/reducers/users';
import prepare from 'app/utils/prepare';

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
  prepare((props, dispatch) => dispatch(fetchAll())),
  connect(mapStateToProps, mapDispatchToProps)
)(Overview);
