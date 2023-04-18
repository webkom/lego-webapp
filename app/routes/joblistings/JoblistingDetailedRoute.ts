import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchJoblisting } from 'app/actions/JoblistingActions';
import {
  selectJoblistingById,
  selectJoblistingBySlug,
} from 'app/reducers/joblistings';
import helmet from 'app/utils/helmet';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import JoblistingDetail from './components/JoblistingDetail';

const mapStateToProps = (state, props) => {
  const { joblistingIdOrSlug } = props.match.params;
  const joblisting = !isNaN(joblistingIdOrSlug)
    ? selectJoblistingById(state, {
        joblistingId: joblistingIdOrSlug,
      })
    : selectJoblistingBySlug(state, {
        joblistingSlug: joblistingIdOrSlug,
      });
  const { fetching } = state.joblistings;
  const joblistingId = joblisting && joblisting.id;
  const actionGrant = (joblisting && joblisting.actionGrant) || [];
  setTimeout(() => {
    if (joblisting?.slug && joblistingIdOrSlug !== joblisting?.slug) {
      props.history.replace(`/joblistings/${joblisting.slug}`);
    }
  }, 0);
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
      href: `${config.webUrl}/joblistings/${joblisting.slug}`,
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
      content: `${config.webUrl}/joblistings/${joblisting.slug}`,
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
    dispatch(fetchJoblisting(props.match.params.joblistingIdOrSlug))
  ),
  connect(mapStateToProps, mapDispatchToProps),
  helmet(propertyGenerator)
)(JoblistingDetail);
