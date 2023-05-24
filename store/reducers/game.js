import * as ActionTypes from "../action-types";
const initState = {};

const gameReducer = (state = initState, action) => {
  const { payload } = action;
  switch (action.type) {
    case ActionTypes.GAME_PLAY_STATUS:
      return { ...payload };
    default:
      return state;
  }
};

export default gameReducer;
