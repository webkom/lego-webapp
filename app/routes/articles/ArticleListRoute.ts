import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchAll } from 'app/actions/ArticleActions';
import { fetchPopular } from 'app/actions/TagActions';
import { selectArticlesWithAuthorDetails } from 'app/reducers/articles';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectPopularTags } from 'app/reducers/tags';
import { parseQueryString } from 'app/utils/useQuery';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import Overview from './components/Overview';
import type { PublicArticle } from 'app/store/models/Article';
import type { PublicUser } from 'app/store/models/User';

export const articlesListDefaultQuery = {
  tag: '',
};

export type ArticleWithAuthorDetails = Omit<PublicArticle, 'authors'> & {
  authors: Array<PublicUser>;
};

const mapStateToProps = (state, props) => {
  const query = parseQueryString(
    props.location.search,
    articlesListDefaultQuery
  );
  const { pagination } = selectPaginationNext({
    endpoint: `/articles/`,
    query,
    entity: 'articles',
  })(state);
  const articles = selectArticlesWithAuthorDetails(state, {
    pagination,
  });

  return {
    articles,
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
            tag: parseQueryString(
              props.location.search,
              articlesListDefaultQuery
            ),
          },
        })
      ),
    ])
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(Overview);
