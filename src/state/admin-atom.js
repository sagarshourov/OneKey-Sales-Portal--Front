import { atom, selector, atomFamily, selectorFamily } from "recoil";
import {
  getAllUsers,
  getAllCalls,
  getCallsFilter,
  getSingleCall,
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


export const cancelSelect = selector({
  key: "cancelSelect",
  get: async ({ get }) => {
    try {
      const response = await getCallsFilter(1);

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
      const response = await getCallsFilter(get(resultState));
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
