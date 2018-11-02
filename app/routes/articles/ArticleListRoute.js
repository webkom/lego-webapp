import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/ArticleActions';
import Overview from './components/Overview';
import { selectArticlesByTag } from 'app/reducers/articles';
import { selectUserById } from 'app/reducers/users';
import prepare from 'app/utils/prepare';
import { fetchPopular } from 'app/actions/TagActions';
import { selectPopularTags } from 'app/reducers/tags';

const mapStateToProps = (state, props) => ({
  articles: selectArticlesByTag(state, { tag: props.location.query.tag }).map(
    article => ({
      ...article,
      author: selectUserById(state, { userId: article.author })
    })
  ),
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
        dispatch(fetchAll({ tag: props.location.query.tag })),
        dispatch(fetchPopular())
      ]);
    },
    ['location.query.tag']
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Overview);
