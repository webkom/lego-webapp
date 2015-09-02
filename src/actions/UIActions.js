import { UI } from './ActionTypes';

export function toggleMenu() {
  return {
    type: UI.TOGGLE_MENU
  };
}

export function openMenu() {
  return {
    type: UI.OPEN_MENU
  };
}

export function closeMenu() {
  return (dispatch, getState) => {
    if (!getState().ui.menuOpen) return;
    dispatch({
      type: UI.CLOSE_MENU
    });
  };
}
