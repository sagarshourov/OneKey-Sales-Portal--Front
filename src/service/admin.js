import axios from "axios";
import { adminApi, getBaseApi, handelError } from "../configuration";

// const token = localStorage.getItem("token");

// const headers = { Authorization: `Bearer ${token}` };

export async function getCallsPagination(
  loginstate,
  column,
  value,
  offset,
  limit,
  search,
  order
) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl =
    adminApi() +
    "call_filter/" +
    column +
    "/" +
    value +
    "/" +
    offset +
    "/" +
    limit +
    "/" +
    search +
    "/" +
    order;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getAllUsers(loginstate) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };
  const userApiUrl = adminApi() + "users";

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getAllCalls(loginstate) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };
  const userApiUrl = adminApi() + "calls";

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getAllReports(loginstate, user_id, count) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl = adminApi() + "reports/" + user_id + "/" + count;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getCallsFilter(loginstate, results) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };
  const userApiUrl = adminApi() + "call_filter/results/" + results;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getAllNoti(loginstate) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };
  const userApiUrl = adminApi() + "notifications";

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getSingleCall(loginstate, id) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl = adminApi() + "calls/" + id;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}
