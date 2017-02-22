import { Company } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'companies',
  types: {
    fetch: Company.FETCH,
    mutate: Company.ADD
  },
  mutate(state, action) {
    switch (action.type) {

      case Company.DELETE_FAILURE: {
        const byId = state.byId.filter((company) => company.id !== action.meta.companyId);
        return {
          ...state,
          byId
        };
      }

      case Company.DELETE_SEMESTER_FAILURE: {
        const byId = state.byId;
        byId[action.meta.companyId].semesterStatuses = byId[action.meta.companyId]
        .semesterStatuses.filter((status) => status.id !== action.meta.semesterId
        );
        return {
          ...state,
          byId
        };
      }

      default:
        return state;
    }
  }
});
