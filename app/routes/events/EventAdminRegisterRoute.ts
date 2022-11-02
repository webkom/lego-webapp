import { connect } from "react-redux";
import { adminRegister } from "app/actions/EventActions";
import AdminRegister from "./components/EventAdministrate/AdminRegister";
import { selectPoolsForEvent } from "app/reducers/events";

const mapStateToProps = (state, {
  eventId,
  event,
  actionGrant,
  loading
}) => {
  const pools = selectPoolsForEvent(state, {
    eventId
  });
  return {
    eventId,
    actionGrant,
    loading,
    event,
    pools
  };
};

const mapDispatchToProps = {
  adminRegister
};
export default connect(mapStateToProps, mapDispatchToProps)(AdminRegister);