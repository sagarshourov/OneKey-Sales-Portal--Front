import { atom, selector } from "recoil";
import { getPreMadeReport } from "../service/admin";
import { loginState } from "../state/login-atom";

export const pStartDate = atom({
  key: "pStartDate",
  default: "2022-01-01",
});

export const pEndDate = atom({
  key: "pEndDate",
  default: "2028-01-01",
});


export const pUser = atom({
  key: "pUser",
  default: 0,
});

export const pType = atom({
  key: "pType",
  default: 0,
});

// export const pLimit = atom({
//   key: "pLimit",
//   default: 0,
// });

export const pLimit = atom({
  key: "pLimit",
  default: 100,
});

export const pOffset = atom({
  key: "pOffset",
  default: 0,
});


export const preMadeReportSelect = selector({
  key: "preMadeReportSelect",
  get: async ({ get }) => {
    try {
      const response = await getPreMadeReport(
        get(loginState),
        get(pStartDate),
        get(pEndDate),
        get(pUser),
        get(pType),
        get(pOffset),
        get(pLimit),
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

export const preMadeState = atom({
  key: "preMadeState",
  default: preMadeReportSelect,
});
