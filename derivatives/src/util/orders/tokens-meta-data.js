/* import {
  CHAIN_ID,
  UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION
} from "../common/constants"; */

import { CHAIN_ID } from "../../util/constants/main";

export const getWethTokenFromTokensMetaDataByNetworkId = tokensMetaData => {
  const tokenMetaData = tokensMetaData.find(t => t.symbol === "weth");
  if (!tokenMetaData) {
    throw new Error("WETH Token MetaData not found");
  }
  return {
    address: tokenMetaData.addresses[CHAIN_ID],
    symbol: tokenMetaData.symbol,
    decimals: tokenMetaData.decimals,
    name: tokenMetaData.name,
    primaryColor: tokenMetaData.primaryColor,
    icon: tokenMetaData.icon,
    displayDecimals: tokenMetaData.displayDecimals
  };
};

export const mapTokensMetaDataToTokenByNetworkId = tokensMetaData => {
  return tokensMetaData
    .filter(tokenMetaData => tokenMetaData.addresses[CHAIN_ID])
    .map(tokenMetaData => {
      return {
        address: tokenMetaData.addresses[CHAIN_ID],
        symbol: tokenMetaData.symbol,
        decimals: tokenMetaData.decimals,
        name: tokenMetaData.name,
        primaryColor: tokenMetaData.primaryColor,
        icon: tokenMetaData.icon,
        displayDecimals: tokenMetaData.displayDecimals
      };
    });
};
