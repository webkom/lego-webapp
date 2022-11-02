import { connect } from "react-redux";
import { compose } from "redux";
import prepare from "app/utils/prepare";
import replaceUnlessLoggedIn from "app/utils/replaceUnlessLoggedIn";
import { LoginPage } from "app/components/LoginForm";
import { selectCompanySemesters, selectCompanySemestersForInterestForm } from "app/reducers/companySemesters";
import { addSemester, editSemester, fetchSemesters } from "app/actions/CompanyActions";
import CompanySemesterGUI from "./components/CompanySemesterGUI";

const loadSemesters = (props, dispatch) => dispatch(fetchSemesters());

const mapStateToProps = state => {
  const semesters = selectCompanySemesters(state);
  const activeSemesters = selectCompanySemestersForInterestForm(state);
  return {
    initialValues: {
      semester: 'spring'
    },
    semesters,
    activeSemesters
  };
};

const mapDispatchToProps = {
  addSemester,
  editSemester
};
export default compose(replaceUnlessLoggedIn(LoginPage), prepare(loadSemesters), connect(mapStateToProps, mapDispatchToProps))(CompanySemesterGUI);