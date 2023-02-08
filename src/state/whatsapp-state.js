import { atom, selector, selectorFamily } from "recoil";

import { chatHistory } from "../service/whatsapp";

/**
 * Populate the default selector return value with a service call.
 */



export const WhatsAppChatSele = selector({
  key: "WhatsAppChatSele",
  get: async ({ get }) => {
    try {
      const response = await chatHistory();
      return response.data || [];
    } catch (error) {
      console.error(`SlackConListSel -> SlackConListSel() ERROR: \n${error}`);
      return [];
    }
  },
});

export const WhatsAppChatList = atom({
  key: "WhatsAppChatList",
  default: WhatsAppChatSele,
});
