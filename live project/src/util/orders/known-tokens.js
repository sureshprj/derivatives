import { assetDataUtils } from "@emdx-dex/order-utils";

import { KNOWN_TOKENS_META_DATA } from "./common/tokens-meta-data-common";

import {
  getWethTokenFromTokensMetaDataByNetworkId,
  mapTokensMetaDataToTokenByNetworkId
} from "./tokens-meta-data";

export class KnownTokens {
  _tokens = [];
  _wethToken;

  constructor(knownTokensMetadata) {
    this._tokens = mapTokensMetaDataToTokenByNetworkId(
      knownTokensMetadata
    ).filter(token => !isWeth(token.symbol));
    this._wethToken = getWethTokenFromTokensMetaDataByNetworkId(
      knownTokensMetadata
    );
  }

  getTokenBySymbol = symbol => {
    const symbolInLowerCaseScore = symbol.toLowerCase();
    const token = this._tokens.find(t => t.symbol === symbolInLowerCaseScore);
    if (!token) {
      if (symbolInLowerCaseScore === "weth") {
        return this.getWethToken();
      }
      const errorMessage = `Token with symbol ${symbol} not found in known tokens`;
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
    return token;
  };

  getTokenByAddress = address => {
    console.log("GetTokenByAddress: ", address);
    const addressInLowerCase = address.toLowerCase();
    let token = this._tokens.find(
      t => t.address.toLowerCase() === addressInLowerCase
    );
    if (!token) {
      // If it's not on the tokens list, we check if it's an wETH token
      // TODO - Maybe the this._tokens could be refactored to also have wETH inside
      token = this._wethToken.address === address ? this._wethToken : undefined;
    }
    if (!token) {
      throw new Error(
        `Token with address ${address} not found in known tokens`
      );
    }
    return token;
  };

  getTokenByAssetData = assetData => {
    const tokenAddress = assetDataUtils.decodeERC20AssetData(assetData)
      .tokenAddress;
    return this.getTokenByAddress(tokenAddress);
  };

  isKnownAddress = address => {
    try {
      this.getTokenByAddress(address);
      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * Checks if a Fill event is valid.
   *
   * A Fill event is considered valid if the order involves two ERC20 tokens whose addresses we know.
   *
   */
  isValidFillEvent = fillEvent => {
    const { makerAssetData, takerAssetData } = fillEvent.args;

    if (
      !isERC20AssetData(makerAssetData) ||
      !isERC20AssetData(takerAssetData)
    ) {
      return false;
    }

    const makerAssetAddress = assetDataUtils.decodeERC20AssetData(
      makerAssetData
    ).tokenAddress;
    const takerAssetAddress = assetDataUtils.decodeERC20AssetData(
      takerAssetData
    ).tokenAddress;

    if (
      !this.isKnownAddress(makerAssetAddress) ||
      !this.isKnownAddress(takerAssetAddress)
    ) {
      return false;
    }

    return true;
  };

  getWethToken = () => {
    return this._wethToken;
  };

  getTokens = () => {
    return this._tokens;
  };
}

let knownTokens;
export const getKnownTokens = (
  knownTokensMetadata = KNOWN_TOKENS_META_DATA
) => {
  console.log("knownTokensMetadata", knownTokensMetadata, knownTokens);
  if (!knownTokens) {
    knownTokens = new KnownTokens(knownTokensMetadata);
  }
  console.log("knownTokens", knownTokens);
  return knownTokens;
};

export const getColorBySymbol = symbol => {
  const token = KNOWN_TOKENS_META_DATA.find(
    t => t.symbol === symbol.toLowerCase()
  );
  if (!token) {
    throw new Error(`Token with symbol ${symbol} not found in known tokens`);
  }

  return token.primaryColor;
};

export const isZrx = token => {
  return token === "zrx";
};

export const isWeth = token => {
  return token === "weth";
};

export const isERC20AssetData = assetData => {
  try {
    assetDataUtils.decodeERC20AssetData(assetData);
    return true;
  } catch (e) {
    return false;
  }
};
