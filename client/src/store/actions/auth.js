import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../types";
import { setAlert } from "./alert";
import {
  setAuthHeaders,
  setUser,
  removeUser,
  removeToken,
  isLoggedIn,
} from "../../utils";
import config from "../../config";

const host = config.host;

export const uploadImage = (id, image) => async (dispatch) => {
  try {
    const token = localStorage.getItem("jwtToken");
    const data = new FormData();
    data.append("file", image);
    const newhost = host + "/users/photo/" + id;

    const response = await fetch(newhost, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    const responseData = await response.json();
    if (response.ok) {
      dispatch(setAlert("Image Uploaded", "success", 5000));
    }
    if (responseData.error) {
      dispatch(setAlert(responseData.error.message, "error", 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, "error", 5000));
  }
};

// Login user
export const login = (username, password) => async (dispatch) => {
  try {
    const newhost = host + "/users/login";
    const response = await fetch(newhost, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const responseData = await response.json();
    if (response.ok) {
      const { user } = responseData;
      user && setUser(user);
      dispatch({ type: LOGIN_SUCCESS, payload: responseData });
      dispatch(setAlert(`Welcome ${user.name}`, "success", 5000));
    }
    if (responseData.error) {
      dispatch({ type: LOGIN_FAIL });
      dispatch(setAlert(responseData.error.message, "error", 5000));
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
    dispatch(setAlert(error.message, "error", 5000));
  }
};

// Register user
export const register =
  ({ name, username, email, phone, image, password }) =>
  async (dispatch) => {
    try {
      const newhost = host + "/users";
      const body = { name, username, email, phone, password };
      const response = await fetch(newhost, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const responseData = await response.json();
      if (response.ok) {
        const { user } = responseData;
        user && setUser(user);
        if (image) dispatch(uploadImage(user._id, image)); // Upload image
        dispatch({ type: REGISTER_SUCCESS, payload: responseData });
        dispatch(setAlert("Register Success", "success", 5000));
      }
      if (responseData._message) {
        dispatch({ type: REGISTER_FAIL });
        dispatch(setAlert(responseData.message, "error", 5000));
      }
    } catch (error) {
      dispatch({ type: REGISTER_FAIL });
      dispatch(setAlert(error.message, "error", 5000));
    }
  };

// Load user
export const loadUser = () => async (dispatch) => {
  if (!isLoggedIn()) return;
  try {
    const newhost = host + "/users/me";

    const response = await fetch(newhost, {
      method: "GET",
      headers: setAuthHeaders(),
    });
    const responseData = await response.json();
    if (response.ok) {
      const { user } = responseData;
      user && setUser(user);
      dispatch({ type: USER_LOADED, payload: responseData });
    }
    if (!response.ok) dispatch({ type: AUTH_ERROR });
  } catch (error) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Logout
export const logout = () => async (dispatch) => {
  try {
    removeUser();
    removeToken();
    dispatch({ type: LOGOUT });
    dispatch(setAlert("LOGOUT Success", "success", 5000));
  } catch (error) {
    dispatch(setAlert(error.message, "error", 5000));
  }
};
