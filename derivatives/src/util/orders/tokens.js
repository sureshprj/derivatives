import { BigNumber } from "@0x/utils";
import { isWeth } from "./known-tokens";
import Web3Utils from "web3-utils";

/**
 * const amount = new BigNumber('123');
 * const decimals = 2;
 * const result = tokenAmountInUnits(amount, decimals);
 * expect(result).toEqual('1.23');
 */
export const tokenAmountInUnitsToBigNumber = (amount, decimals) => {
  const decimalsPerToken = new BigNumber(10).pow(decimals);

  return amount + decimalsPerToken;
};

export const tokenAmountInUnits = (amount, decimals, toFixedDecimals = 2) => {
  return tokenAmountInUnitsToBigNumber(amount, decimals).toFixed(
    toFixedDecimals
  );
};

/**
 * const amount = '1.23';
 * const decimals = 2;
 * const result = unitsInTokenAmount(amount, decimals);
 * const expected = new BigNumber('123');
 * expect(result.eq(expected)).toBe(true);
 */
export const unitsInTokenAmount = (units, decimals) => {
  const decimalsPerToken = new BigNumber(10).pow(decimals);

  return new BigNumber(units).multipliedBy(decimalsPerToken);
};

export const tokenSymbolToDisplayString = symbol => {
  return isWeth(symbol) ? "wETH" : symbol.toUpperCase();
};

/**
 *
 * @param {BigNumber} [units]
 * @param {Number} [decimals=2]
 * @returns {String}
 */
export const toEther = (units, decimals = 2) => {
  const ethValue = Web3Utils.fromWei(units.toString());

  return Number(ethValue).toFixed(decimals);
};
