import { BigNumber } from "@0x/utils";

export const ETH_DECIMALS = 18;

export const GWEI_IN_WEI = new BigNumber(1000000000);

export const DEFAULT_GAS_PRICE = GWEI_IN_WEI.multipliedBy(225);

export const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2)
  .pow(256)
  .minus(1);

export const ZERO = new BigNumber(0);
