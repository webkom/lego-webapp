import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/ArticleActions';
import Overview from './components/Overview';
import { selectArticlesByTag } from 'app/reducers/articles';
import { selectUserById } from 'app/reducers/users';
import prepare from 'app/utils/prepare';
import { fetchPopular } from 'app/actions/TagActions';
import { selectPopularTags } from 'app/reducers/tags';
import qs from 'qs';

const mapStateToProps = (state, props) => ({
  articles: selectArticlesByTag(state, {
    tag: qs.parse(props.location.search, { ignoreQueryPrefix: true }).tag
  }).map(article => ({
    ...article,
    author: selectUserById(state, { userId: article.author })
  })),
  fetching: state.articles.fetching,
  hasMore: state.articles.hasMore,
  tags: selectPopularTags(state),
  actionGrant: state.articles.actionGrant
});

const mapDispatchToProps = { fetchAll, fetchPopular };

export default compose(
  prepare(
    (props, dispatch) => {
      return Promise.all([
        dispatch(
          fetchAll({
            tag: qs.parse(props.location.search, { ignoreQueryPrefix: true })
              .tag
          })
        ),
        dispatch(fetchPopular())
      ]);
    },
    ['location.search']
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Overview);
