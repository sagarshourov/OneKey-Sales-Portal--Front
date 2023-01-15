import { atom, selector, atomFamily, selectorFamily } from "recoil";
import {
  getAllUsers,
  getAllCalls,
  getAllNoti
} from "../service/admin";

/**
 * Populate the default selector return value with a service call.
 */



export const allUserSelect = selector({
  key: "allUserSelect",
  get: async ({ get }) => {
    try {
      const response = await getAllUsers();
      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const callSelect = selector({
  key: "callSelect",
  get: async ({ get }) => {
    try {
      const response = await getAllCalls();
      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const notiSelect = selector({
  key: "notiSelect",
  get: async ({ get }) => {
    try {
      const response = await getAllNoti();
      return response.data || [];
    } catch (error) {
      console.error(`getAllNoti -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});








export const allUserListState = atom({
  key: "allUserListState",
  default: allUserSelect,
});

export const callListState = atom({
  key: "callListState",
  default: callSelect,
});

export const notiState = atom({
  key: "notiState",
  default: notiSelect,
});







