export default function fetchHistory(state: State = {}, action: Action) {
  const success = action.meta && action.meta.success;
  switch (action.type) {
    case success: {
      return {
        ...state,
        [action.meta.endpoint]: Date.now()
      };
    }
    default:
      return state;
  }
}
