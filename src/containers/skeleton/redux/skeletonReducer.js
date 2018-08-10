const initialState = {
  coins: {},
  loading: true,
  errors: false
};

const skeleton = (state = initialState, action) => {
  switch (action.type) {
    case "GET_AVAILABLE_COINS":
      return {
        ...state,
        coins: action.coins
      };

    case "GET_BALANCE_COINS":
      return {
        ...state,
        coins: action.coins
      };

    case "POST_CREATE_COINS_ADDRESS":
      return {
        ...state,
        coins: action.coins
      };

    case "CHANGE_LOADING_GENERAL_STATE":
      return {
        ...state,
        loading: !state.loading
      };

    case "CHANGE_SKELETON_ERROR_STATE":
      return {
        ...state,
        errors: action.state
      };

    default: {
      return {
        ...state
      };
    }
  }
};

export default skeleton;
