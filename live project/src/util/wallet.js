import { CHAIN_ID } from "./constants/main";
import get from "lodash/get";

export const getAddressFromWallet = token => {
  return get(token, `addresses[0][${CHAIN_ID}]`, "");
};
