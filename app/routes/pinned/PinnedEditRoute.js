import { compose } from 'redux';
import { connect } from 'react-redux';

import { selectPinnedById } from 'app/reducers/pinned';
import {
  fetchPinned,
  deletePinned,
  editPinned
} from 'app/actions/PinnedAction';
import { selectEventById } from 'app/reducers/events';
import { selectArticleById } from 'app/reducers/articles';
import prepare from 'app/utils/prepare';
import PinnedEditor from './components/PinnedEditor';
import { push } from 'react-router-redux';
import loadingIndicator from 'app/utils/loadingIndicator';
import { selectGroup } from 'app/reducers/groups';

const mapDispachToProps = {
  deletePinned,
  push,
  handleSubmitCallback: editPinned
};

const mapStateToProps = (state, props) => {
  const id = props.params.pinnedId;
  const pinned = selectPinnedById(state, id);
  const article = selectArticleById(state, { articleId: pinned.article });
  const event = selectEventById(state, { eventId: pinned.event });
  const targetGroups = (pinned.targetGroups || []).map(groupId =>
    selectGroup(state, { groupId })
  );

  return {
    initialValues: {
      ...pinned,
      article: article && { label: article.title, value: article.id },
      event: event && { label: event.title, value: event.id },
      targetGroups: targetGroups.map(group => ({
        label: group.name,
        value: group.id
      }))
    },
    actionGrant: state.pinned.actionGrant
  };
};

export default compose(
  prepare((props, dispatch) => dispatch(fetchPinned())),
  connect(mapStateToProps, mapDispachToProps),
  loadingIndicator(['initialValues.id'])
)(PinnedEditor);
