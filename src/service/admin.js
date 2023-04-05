import axios from "axios";
import { adminApi, getBaseApi, handelError } from "../configuration";

const token = localStorage.getItem("token");

const headers = { Authorization: `Bearer ${token}` };

export async function getCallsPagination(
  column,
  value,
  offset,
  limit,
  search,
  order
) {
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

export async function getAllUsers() {
  const userApiUrl = adminApi() + "users";

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getAllCalls() {
  const userApiUrl = adminApi() + "calls";

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getAllReports(user_id, count) {
  const userApiUrl = adminApi() + "reports/" + user_id + "/" + count;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getCallsFilter(results) {
  const userApiUrl = adminApi() + "call_filter/results/" + results;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getAllNoti() {
  const userApiUrl = adminApi() + "notifications";

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getSingleCall(id) {
  const userApiUrl = adminApi() + "calls/" + id;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}
