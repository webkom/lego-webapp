export default function fetchHistory(state: State = {}, action: Action) {
  const success = action.meta && action.meta.success;
  if (success && action.type === success) {
    return {
      ...state,
      [action.meta.endpoint]: Date.now()
    };
  }
  return state;
}
