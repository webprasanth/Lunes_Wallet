import { takeLatest } from "redux-saga";
import { put, call, fork } from "redux-saga/effects";
import {
  setAuthToken,
  getAuthToken,
  setUserSeedWords,
  getUserSeedWords,
  getUsername,
  setUserData,
  clearAll
} from "../../../utils/localStorage";
import { encryptHmacSha512Key } from "../../../utils/cryptography";
import { HEADER_RESPONSE } from "../../../constants/headers";
import { internalServerError } from "../../../containers/errors/statusCodeMessage";

// Services
import AuthService from "../../../services/authService";
import UserService from "../../../services/userService";
import CoinService from "../../../services/coinService";
// import PinService from "../../../services/pinService";
const authService = new AuthService();
const userService = new UserService();
const coinService = new CoinService();
// const pinService = new PinService();
const changeLoadingState = "CHANGE_LOADING_STATE";

export function* authenticateUser(action) {
  try {
    let username = yield call(getUsername);
    let response = yield call(
      authService.authenticate,
      action.username,
      action.password
    );

    if (response.error) {
      yield put(response.error);
      yield put({ type: changeLoadingState });
      return;
    }

    if (username !== action.username) {
      yield call(clearAll);
    }

    setUserData({ username: action.username });

    let twoFactorResponse = yield call(
      authService.hasTwoFactorAuth,
      response.data.data.token
    );
    let twoFactor = twoFactorResponse.data.code === 200 ? true : false;
    let seed = yield call(getUserSeedWords);

    // let pinResponse = yield call(pinService.consult, userToken);
    // let pin = pinResponse.data.code === 200 ? true : false;

    yield call(setAuthToken, twoFactorResponse.headers[HEADER_RESPONSE]);

    yield put({
      type: "POST_USER_AUTHENTICATE",
      user: {
        username: action.username,
        password: encryptHmacSha512Key(action.password),
        seed: twoFactor ? undefined : seed
        // pin
      },
      pages: { login: twoFactor ? 1 : 2 }
    });

    let token = yield call(getAuthToken);
    let data = yield call(coinService.getCoinPrice, "lunes", "brl", token);
    console.warn("price ", data);

    return;
  } catch (error) {
    yield put({ type: changeLoadingState });
    yield put(internalServerError());
  }
}

export function* hasTwoFactorAuth() {
  try {
    let userToken = yield call(getAuthToken);
    let seed = yield call(getUserSeedWords);
    const response = yield call(authService.hasTwoFactorAuth, userToken);

    if (response.error) {
      yield put(response.error);
      yield put({ type: changeLoadingState });
      return;
    }

    if (seed) {
      yield put({
        type: "SET_USER_SEED",
        seed: seed
      });
    }

    yield put({ type: "GET_USER_2FA", response });
    yield put({ type: changeLoadingState });
    return;
  } catch (error) {
    yield put({ type: changeLoadingState });
    yield put(internalServerError());
  }
}

export function* createTwoFactorAuth() {
  try {
    const response = yield call(authService.createTwoFactorAuth);

    yield put({ type: "POST_USER_CREATE_2FA", response });
    yield put({ type: changeLoadingState });
    return;
  } catch (error) {
    yield put({ type: changeLoadingState });
    yield put(internalServerError());
  }
}

export function* verifyTwoFactorAuth(action) {
  try {
    let seed = yield call(getUserSeedWords);
    const response = yield call(authService.verifyTwoFactoryAuth, action.token);

    if (response.error) {
      yield put(response.error);
      yield put({ type: changeLoadingState });
      return;
    }

    if (seed) {
      yield put({
        type: "SET_USER_SEED",
        seed: seed
      });
    }

    yield put({
      type: "POST_USER_VERIFY_2FA",
      response,
      pages: { login: 2 }
    });

    return;
  } catch (error) {
    yield put({ type: changeLoadingState });
    yield put(internalServerError());
  }
}

// export function* verifyUserPin(action) {
//   try {
//     let userToken = yield call(getAuthToken);
//     let response = yield call(pinService.verify, action.user.pin, userToken);
//     yield setUserData(action.user);

//     if (response.error) {
//       yield put(response.error);
//       yield put({ type: changeLoadingState });
//       return;
//     }

//     yield put({ type: "REQUEST_SUCCESS", message: "You are logged" });
//     yield put({ type: changeLoadingState });
//   } catch (error) {
//     yield put({ type: changeLoadingState });
//     yield put(internalServerError());
//   }
// }

// export function* createUserPin(action) {
//   try {
//     let userToken = yield call(getAuthToken);
//     let response = yield call(pinService.create, action.user.pin, userToken);
//     yield setUserData(action.user);

//     if (response.error) {
//       yield put(response.error);
//       yield put({ type: changeLoadingState });
//       return;
//     }

//     let message = "Pin has been created. You are logged";
//     yield put({ type: "REQUEST_SUCCESS", message });
//     yield put({ type: changeLoadingState });
//   } catch (error) {
//     yield put({ type: changeLoadingState });
//     yield put(internalServerError());
//   }
// }

export function* createUser(action) {
  try {
    let response = yield call(userService.createUser, action.user);

    if (response.error) {
      yield put(response.error);
      yield put({ type: changeLoadingState });

      return;
    }

    return yield put({ type: "POST_USER_CREATE_USER", page: 3 });
  } catch (error) {
    yield put({ type: changeLoadingState });
    yield put(internalServerError());
  }
}

export function* resetUser() {
  try {
    yield put({ type: "POST_USER_RESET_USER", page: 1 });
  } catch (error) {
    yield put({ type: changeLoadingState });
    yield put(internalServerError());
  }
}

export function* setUserSeed(action) {
  try {
    yield setUserSeedWords(action.seed, action.password);
    let seed = yield call(getUserSeedWords);

    return yield put({
      type: "SET_USER_SEED",
      seed: seed
    });
  } catch (error) {
    yield put({ type: changeLoadingState });
    yield put(internalServerError());
  }
}

export default function* rootSaga() {
  yield [
    fork(takeLatest, "POST_USER_AUTHENTICATE_API", authenticateUser),
    fork(takeLatest, "POST_USER_CREATE_2FA_API", createTwoFactorAuth),
    fork(takeLatest, "POST_USER_VERIFY_2FA_API", verifyTwoFactorAuth),
    fork(takeLatest, "POST_USER_CREATE_USER_API", createUser),
    fork(takeLatest, "POST_USER_RESET_USER_API", resetUser),
    // fork(takeLatest, "POST_USER_VERIFY_PIN_API", verifyUserPin),
    // fork(takeLatest, "POST_USER_CREATE_PIN_API", createUserPin),
    fork(takeLatest, "GET_USER_2FA_API", hasTwoFactorAuth),
    fork(takeLatest, "SET_USER_SEED_API", setUserSeed)
  ];
}
