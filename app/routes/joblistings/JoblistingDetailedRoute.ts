import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchJoblisting } from 'app/actions/JoblistingActions';
import { selectJoblistingById } from 'app/reducers/joblistings';
import helmet from 'app/utils/helmet';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import JoblistingDetail from './components/JoblistingDetail';

const mapStateToProps = (state, props) => {
  const { joblistingId } = props.match.params;
  const joblisting = selectJoblistingById(state, {
    joblistingId,
  });
  const { fetching } = state.joblistings;
  const actionGrant = (joblisting && joblisting.actionGrant) || [];
  return {
    joblisting,
    joblistingId,
    actionGrant,
    fetching,
  };
};

const propertyGenerator = ({ joblisting }, config) => {
  if (!joblisting) return;

  return [
    {
      property: 'og:title',
      content: joblisting.title,
    },
    {
      element: 'title',
      children: joblisting.title,
    },
    {
      element: 'link',
      rel: 'canonical',
      href: `${config.webUrl}/joblistings/${joblisting.id}`,
    },
    {
      property: 'og:description',
      content: joblisting.description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image:width',
      content: '1667',
    },
    {
      property: 'og:image:height',
      content: '500',
    },
    {
      property: 'og:url',
      content: `${config.webUrl}/joblistings/${joblisting.id}`,
    },
    {
      property: 'og:image',
      content: joblisting.company.logo,
    },
  ];
};

const mapDispatchToProps = {
  fetchJoblisting,
  push,
};
export default compose(
  withPreparedDispatch('fetchJoblistingDetailed', (props, dispatch) =>
    dispatch(fetchJoblisting(props.match.params.joblistingId))
  ),
  connect(mapStateToProps, mapDispatchToProps),
  helmet(propertyGenerator)
)(JoblistingDetail);
