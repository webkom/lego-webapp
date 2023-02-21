import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchAll } from 'app/actions/ArticleActions';
import { fetchPopular } from 'app/actions/TagActions';
import { selectArticles } from 'app/reducers/articles';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectPopularTags } from 'app/reducers/tags';
import { selectUserById } from 'app/reducers/users';
import type { PublicArticle } from 'app/store/models/Article';
import type { PublicUser } from 'app/store/models/User';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import Overview from './components/Overview';

export type ArticleWithAuthorDetails = Omit<PublicArticle, 'author'> & {
  author: PublicUser;
};

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
  const articles: ArticleWithAuthorDetails[] = selectArticles<PublicArticle[]>(
    state,
    {
      pagination,
    }
  ).map((article) => ({
    ...article,
    author: selectUserById(state, {
      userId: article.author,
    }),
  }));

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
            tag: qs.parse(props.location.search, { ignoreQueryPrefix: true })
              .tag,
          },
        })
      ),
    ])
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(Overview);
