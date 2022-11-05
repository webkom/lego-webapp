import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/ArticleActions';
import Overview from './components/Overview';
import { selectArticles } from 'app/reducers/articles';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectUserById } from 'app/reducers/users';
import { fetchPopular } from 'app/actions/TagActions';
import { selectPopularTags } from 'app/reducers/tags';
import qs from 'qs';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => {
  const query = {
    tag: qs.parse(props.location.search, {
      ignoreQueryPrefix: true,
    }).tag,
  };
  const { pagination } = selectPaginationNext({
    endpoint: `/articles/`,
    query,
    entity: 'articles',
  })(state);
  return {
    articles: selectArticles(state, {
      pagination,
    }).map((article) => ({
      ...article,
      author: selectUserById(state, {
        userId: article.author,
      }),
    })),
    fetching: state.articles.fetching,
    hasMore: pagination.hasMore,
    tags: selectPopularTags(state),
    query,
    actionGrant: state.articles.actionGrant,
  };
};

const mapDispatchToProps = {
  fetchAll,
  fetchPopular,
};
export default compose(
  withPreparedDispatch('fetchArticleList', (props, dispatch) =>
    Promise.all([
      dispatch(fetchPopular()),
      dispatch(
        fetchAll({
          next: false,
          query: {
            tag: qs.parse(props.location.search, { ignoreQueryPrefix: true })
              .tag,
          },
        })
      ),
    ])
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(Overview);
