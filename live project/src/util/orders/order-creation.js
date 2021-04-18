import { assetDataUtils } from "@emdx-dex/order-utils";
import { BigNumber } from "@0x/utils";

import { HttpClient } from "@0x/connect";

import { CHAIN_ID } from "../../util/constants/main";
/* import { CHAIN_ID, PROTOCOL_FEE_MULTIPLIER, ZERO, ZERO_ADDRESS } from '../common/constants';
import { getRelayer } from '../services/relayer'; */

import * as orderHelper from "./order-creation";
import { getExpirationTimeOrdersFromConfig } from "./time-utils";
import { isWeth } from "./known-tokens";
/* import { OrderSide } from './types'; */

import { signatureUtils } from "@emdx-dex/order-utils";
import { MetamaskSubprovider } from "@0x/subproviders";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO = new BigNumber(0);
const GWEI_IN_WEI = new BigNumber(1000000000);
const DEFAULT_GAS_PRICE = GWEI_IN_WEI.multipliedBy(225);
const FEE_RECIPIENT = ZERO_ADDRESS;
const FEE_PERCENTAGE = ZERO;
const PROTOCOL_FEE_MULTIPLIER = 150000;

import { Web3Wrapper } from "@0x/web3-wrapper";
import { getWeb3Wrapper } from "../../services/web3_wrapper";
import { getContractWrappers } from "../../services/contract_wrappers";

const Web3Utils = require("web3-utils");

export const TX_DEFAULTS = {
  gas: 1000000
};

const tokenAmountInUnitsToBigNumber = (amount, decimals) => {
  const decimalsPerToken = new BigNumber(10).pow(decimals);
  return amount.div(decimalsPerToken);
};

const unitsInTokenAmount = (units, decimals) => {
  const decimalsPerToken = new BigNumber(10).pow(decimals);

  return new BigNumber(units).multipliedBy(decimalsPerToken);
};

const getOrderPrice = (side, order) => {
  return side === "buy"
    ? order.takerAssetAmount.div(order.makerAssetAmount)
    : order.makerAssetAmount.div(order.takerAssetAmount);
};

export const getTransactionOptions = gasPrice => {
  let options = {
    gasPrice
  };

  if (process.env.NODE_ENV === "development") {
    options = {
      ...options,
      ...TX_DEFAULTS
    };
  }

  return options;
};

/* import { tokenAmountInUnitsToBigNumber, unitsInTokenAmount } from "./tokens"; */

/* 
export const buildSellCollectibleOrder = async (params: BuildSellCollectibleOrderParams, side: OrderSide) => {
    const {
        account,
        collectibleId,
        collectibleAddress,
        amount,
        price,
        exchangeAddress,
        expirationDate,
        wethAddress,
    } = params;
    const collectibleData = assetDataUtils.encodeERC721AssetData(collectibleAddress, collectibleId);
    const wethAssetData = assetDataUtils.encodeERC20AssetData(wethAddress);

    const round = (num: BigNumber): BigNumber => num.integerValue(BigNumber.ROUND_FLOOR);
    const orderConfigRequest: OrderConfigRequest = {
        exchangeAddress,
        makerAssetData: collectibleData,
        takerAssetData: wethAssetData,
        makerAssetAmount: side === OrderSide.Buy ? round(amount.multipliedBy(price)) : amount,
        takerAssetAmount: side === OrderSide.Buy ? amount : round(amount.multipliedBy(price)),
        makerAddress: account,
        takerAddress: ZERO_ADDRESS,
        expirationTimeSeconds: expirationDate,
    };

    return orderHelper.getOrderWithTakerAndFeeConfigFromRelayer(orderConfigRequest);
}; */

export const buildLimitOrder = async (params, side) => {
  const {
    account,
    baseTokenAddress,
    amount,
    price,
    quoteTokenAddress
  } = params;

  const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(
    baseTokenAddress
  );
  const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(
    quoteTokenAddress
  );

  const isBuy = side === "buy";
  console.log("Amount por price", (amount * price).toString());

  const orderConfigRequest = {
    exchangeAddress: process.env.VUE_APP_EXCHANGE_ADDRESS,
    makerAssetData: isBuy ? quoteTokenAssetData : baseTokenAssetData,
    takerAssetData: isBuy ? baseTokenAssetData : quoteTokenAssetData,
    makerAssetAmount: isBuy ? (amount * price).toString() : amount,
    takerAssetAmount: isBuy ? amount : (amount * price).toString(),
    makerAddress: account,
    takerAddress: "0x0000000000000000000000000000000000000000",
    expirationTimeSeconds: getExpirationTimeOrdersFromConfig()
  };

  return orderHelper.getOrderWithTakerAndFeeConfigFromRelayer(
    orderConfigRequest
  );
};

export const createSignedOrder = async (
  amount,
  price,
  side,
  transactionInfo
) => {
  const ethAccount = transactionInfo.ethAccount;
  const baseToken = transactionInfo.baseToken;
  const quoteToken = transactionInfo.quoteToken;

  const web3Wrapper = await getWeb3Wrapper();

  const order = await orderHelper.buildLimitOrder(
    {
      account: ethAccount,
      amount,
      price,
      baseTokenAddress: baseToken,
      quoteTokenAddress: quoteToken
    },
    side
  );

  const provider = new MetamaskSubprovider(web3Wrapper.getProvider());
  return signatureUtils.ecSignOrderAsync(provider, order, ethAccount);
};

export const getOrderWithTakerAndFeeConfigFromRelayer = async orderConfigRequest => {
  let client = new HttpClient("https://apidex.emdx.io/sra/v3/");
  const orderResult = await client.getOrderConfigAsync(orderConfigRequest);
  return {
    ...orderConfigRequest,
    ...orderResult,
    chainId: CHAIN_ID,
    salt: new BigNumber(Date.now())
  };
};

export const submitMarketOrder = async (amount, side, data) => {
  /*   return async ({ getContractWrappers, getWeb3Wrapper }) => { */
  const { ethAccount, orders, quoteToken } = data;
  console.log("Entro a submitMarketOrder", amount, side, data);

  const ethBalance = BigNumber(
    Web3Utils.toWei(BigNumber(data.ethBalance).toString(), "ether")
  );

  /*   amount = BigNumber(Web3Utils.toWei(amount.toString(), "ether")); */
  const isBuy = side === "buy";
  const [ordersToFill, amounts, canBeFilled] = buildMarketOrders(side, {
    amount,
    orders
  });

  if (canBeFilled) {
    const contractWrappers = await getContractWrappers();

    const ethAmountRequired = amounts.reduce((total, currentValue) => {
      return total.plus(currentValue);
    }, ZERO);

    const protocolFee = calculateWorstCaseProtocolFee(
      ordersToFill,
      DEFAULT_GAS_PRICE
    );

    const affiliateFeeAmount = ethAmountRequired
      .plus(protocolFee)
      .multipliedBy(FEE_PERCENTAGE)
      .integerValue(BigNumber.ROUND_CEIL);
    const totalEthAmount = ethAmountRequired
      .plus(protocolFee)
      .plus(affiliateFeeAmount);
    const isEthBalanceEnough = ethBalance.isGreaterThan(totalEthAmount);

    let isMarketBuyForwarder =
      isBuy && isWeth(quoteToken) && isEthBalanceEnough;
    isMarketBuyForwarder = false;
    const orderSignatures = ordersToFill.map(o => o.signature);

    let txHash;
    try {
      if (isMarketBuyForwarder) {
        txHash = await contractWrappers.forwarder
          .marketBuyOrdersWithEth(
            ordersToFill,
            amount,
            orderSignatures,
            Web3Wrapper.toBaseUnitAmount(FEE_PERCENTAGE, 18),
            FEE_RECIPIENT
          )
          .sendTransactionAsync({
            from: ethAccount,
            value: totalEthAmount,
            ...getTransactionOptions(DEFAULT_GAS_PRICE)
          });
      } else {
        if (isBuy) {
          console.log("Entro a isBuy");
          txHash = await contractWrappers.exchange
            .marketBuyOrdersFillOrKill(ordersToFill, amount, orderSignatures)
            .sendTransactionAsync({
              from: ethAccount,
              value: protocolFee,
              ...getTransactionOptions(DEFAULT_GAS_PRICE)
            });
        } else {
          console.log("Entro a isSell");
          txHash = await contractWrappers.exchange
            .marketSellOrdersFillOrKill(ordersToFill, amount, orderSignatures)
            .sendTransactionAsync({
              from: ethAccount,
              value: protocolFee,
              ...getTransactionOptions(DEFAULT_GAS_PRICE)
            });
        }
      }
    } catch (e) {
      console.log("error", e);
      throw e;
    }

    const web3Wrapper = await getWeb3Wrapper();
    const tx = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
    console.log("Transaction result:", tx);
    /*     // tslint:disable-next-line:no-floating-promises
    dispatch(getOrderbookAndUserOrders());
    // tslint:disable-next-line:no-floating-promises
    dispatch(updateTokenBalances());
    dispatch(
      addNotifications([
        {
          id: txHash,
          kind: NotificationKind.Market,
          amount,
          token: baseToken,
          side,
          tx,
          timestamp: new Date()
        }
      ])
    ); */

    const amountInReturn = sumTakerAssetFillableOrders(
      side,
      ordersToFill,
      amounts
    );

    return { txHash, amountInReturn };
  } else {
    console.log("There is no enough orders to fill");
  }
  /*   }; */
};

export const sumTakerAssetFillableOrders = (side, ordersToFill, amounts) => {
  if (ordersToFill.length !== amounts.length) {
    throw new Error("ordersToFill and amount array lengths must be the same.");
  }
  if (ordersToFill.length === 0) {
    return ZERO;
  }
  return ordersToFill.reduce((sum, order, index) => {
    // Check buildMarketOrders for more details
    const price =
      side === "buy" ? 1 : order.makerAssetAmount.div(order.takerAssetAmount);
    return sum.plus(amounts[index].multipliedBy(price));
  }, ZERO);
};

export const calculateWorstCaseProtocolFee = (orders, gasPrice) => {
  const protocolFee = new BigNumber(
    orders.length * PROTOCOL_FEE_MULTIPLIER
  ).times(gasPrice);
  return protocolFee;
};

export const buildMarketOrders = (side, params) => {
  const { orders, amount } = params;

  const ordersToFill = [];
  const amounts = [];
  let filledAmount = ZERO;
  for (let i = 0; i < orders.length && filledAmount.isLessThan(amount); i++) {
    const order = orders[i];
    ordersToFill.push(order.order);

    let available = new BigNumber(
      order.metaData.remainingFillableTakerAssetAmount
    );

    if (filledAmount.plus(available).isGreaterThan(amount)) {
      amounts.push(amount.minus(filledAmount));
      filledAmount = amount;
    } else {
      amounts.push(available);
      filledAmount = filledAmount.plus(available);
    }

    if (side === "buy") {
      // @TODO: cache maker/taker info (decimals)
      const makerTokenDecimals = 18;
      const takerTokenDecimals = 18;
      const buyAmount = tokenAmountInUnitsToBigNumber(
        amounts[i],
        makerTokenDecimals
      );
      amounts[i] = unitsInTokenAmount(
        buyAmount.multipliedBy(getOrderPrice(side, order.order)).toString(),
        takerTokenDecimals
      );
    }
  }
  const canBeFilled = filledAmount.eq(amount);
  const roundedAmounts = amounts.map(a => a.integerValue(BigNumber.ROUND_CEIL));

  return [ordersToFill, roundedAmounts, canBeFilled];
};

export const cancelSignedOrder = async order => {
  const contractWrappers = await getContractWrappers();
  const web3Wrapper = await getWeb3Wrapper();
  const tx = await contractWrappers.exchange
    .cancelOrder(order)
    .sendTransactionAsync({
      from: order.makerAddress,
      gasPrice: DEFAULT_GAS_PRICE
    });
  return web3Wrapper.awaitTransactionSuccessAsync(tx);
};

export const createOrders = async (opositeLimitOrders, data) => {
  console.log(data);
  const { ethAccount, ethBalance, baseToken, quoteToken, side, price } = data;
  const amount = BigNumber(Web3Utils.toWei(data.amount.toString(), "ether"));
  // Check if the order can be filled with opositeLimitOrders with same price and submit Market Order
  let fillableAmount = new BigNumber(0);
  let toFill;
  let marketFillableOrders = [];
  opositeLimitOrders.forEach(elem => {
    let itemPrice;
    if (side === "buy") {
      itemPrice = new BigNumber(
        elem.order.takerAssetAmount / elem.order.makerAssetAmount
      );
    } else {
      itemPrice = new BigNumber(
        elem.order.makerAssetAmount / elem.order.takerAssetAmount
      );
    }
    if (side == "buy" && price.isGreaterThanOrEqualTo(itemPrice)) {
      marketFillableOrders.push(elem);
      fillableAmount = fillableAmount.plus(elem.order.makerAssetAmount);
    } else if (side == "sell" && price.isLessThanOrEqualTo(itemPrice)) {
      fillableAmount = fillableAmount.plus(
        new BigNumber(elem.metaData.remainingFillableTakerAssetAmount)
      );
      marketFillableOrders.push(elem);
    }
  });

  const marketOrderData = {
    ethAccount,
    ethBalance,
    orders: marketFillableOrders,
    baseToken,
    quoteToken
  };

  console.log("fillableAmount", fillableAmount, amount);

  // Check if there is any filled amount to create a Market Order with it
  if (fillableAmount.isGreaterThan(ZERO)) {
    fillableAmount.isGreaterThan(amount)
      ? await submitMarketOrder(amount, side, marketOrderData)
      : await submitMarketOrder(fillableAmount, side, marketOrderData);
    console.log("Entra a fillable");
  }
  // Check if there is any amount left to fill
  toFill = amount.minus(fillableAmount);
  console.log("toFill despues de crear la Market Order: ", toFill);
  // Check if there is amount to fill after Market Orders creation and create Limit Order
  if (toFill.isGreaterThan(0)) {
    console.log("Entro a toFill");
    let client = new HttpClient("https://apidex.emdx.io/sra/v3/");
    const order = await createSignedOrder(toFill, price, side, {
      ethAccount,
      baseToken: quoteToken,
      quoteToken: baseToken
    });
    await client.submitOrderAsync(order);
    /*         buildLimitOrder(limitOrderParams, side); */
  }
};

// Primero se checkea que no haya ordenes limit con el mismo precio
// Si hay se crea una market con esas ordenes del mismo precio
// Despues se checkea que la orden sea fill or kill

// Ordenes tramite,
