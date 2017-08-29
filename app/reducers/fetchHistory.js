export default function fetchHistory(state: State = {}, action: Action) {
  const success = action.meta && action.meta.success;
  switch (action.type) {
    case success: {
      console.log('SUCCESS', action.meta.endpoint, Date.now());
      return {
        ...state,
        [action.meta.endpoint]: Date.now()
      };
    }
    default:
      return state;
  }
}
