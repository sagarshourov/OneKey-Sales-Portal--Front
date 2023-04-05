import { atom, selector, atomFamily, selectorFamily } from "recoil";
import {
  getAllUsers,
  getAllCalls,
  getCallsFilter,
  getSingleCall,
  getAllReports,
  getAllNoti,
  getCallsPagination,
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

export const pageLimit = atom({
  key: "pageLimit",
  default: 20,
});

export const pagOffset = atom({
  key: "pagOffset",
  default: 0,
});

export const columnState = atom({
  key: "columnState",
  default: "sections",
});

export const valueState = atom({
  key: "valueState",
  default: null,
});

export const searchAtom = atom({
  key: "searchAtom",
  default: "0",
});
export const CancelOrder = atom({
  key: "CancelOrder",
  default: "DESC",
});

export const cancelSelect = selector({
  key: "cancelSelect",
  get: async ({ get }) => {
    try {
      const response = await getCallsPagination(
        "results",
        1,
        get(pagOffset),
        get(pageLimit),
        get(searchAtom),
        get(CancelOrder)
      );

      //console.log('canN_res',response);

      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const resultState = atom({
  key: "resultState",
  default: 1,
});

export const clientSelect = selector({
  key: "clientSelect",
  get: async ({ get }) => {
    try {
      const response = await getCallsPagination(
        "results",
        2,
        get(pagOffset),
        get(pageLimit),
        get(searchAtom),
        'ASC'
      );

      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const callIdState = atom({
  key: "callIdState",
  default: 1,
});

export const singleCallselect = selector({
  key: "singleCallselect",
  get: async ({ get }) => {
    try {
      const response = await getSingleCall(get(callIdState));
      return response.data || [];
    } catch (error) {
      console.error(`getSingleCall -> getSingleCall() ERROR: \n${error}`);
      return [];
    }
  },
});

export const reportCount = atom({
  key: "reportCount",
  default: 0,
});
export const reportUser = atom({
  key: "reportUser",
  default: 0,
});

export const reportSelect = selector({
  key: "reportSelect",
  get: async ({ get }) => {
    try {
      const response = await getAllReports(get(reportUser), get(reportCount));
      return response.data || [];
    } catch (error) {
      console.error(`reportSelect -> reportSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const reportListState = atom({
  key: "reportListState",
  default: reportSelect,
});

export const searchListSelect = selector({
  key: "searchListSelect",
  get: async ({ get }) => {
    try {
      const response = await getCallsPagination(
        get(columnState),
        get(valueState),
        get(pagOffset),
        get(pageLimit),
        get(searchAtom),
        "ASC"
      );

      //console.log('canN_res',response);

      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const searchListState = atom({
  key: "searchListState",
  default: searchListSelect,
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

export const cancelListState = atom({
  key: "cancelListState",
  default: cancelSelect,
});

export const clientListState = atom({
  key: "clientListState",
  default: clientSelect,
});

export const singleCallState = atom({
  key: "singleCallState",
  default: singleCallselect,
});
