let state = {
  user: {
    ethAddress: "",
    ethBalance: "",
    orders: []
  },
  tradePair: {
    baseToken: "0x6fdad8993714c37e02eb929c81b93c397931fe51",
    lgBaseToken: "",
    quoteToken: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
    lgQuoteToken: "",
    data: {
      baseTokenName: "iemdx",
      quoteTokenName: "weth"
    },
    recentTrades: [],
    orderbook: {
      items: [],
      bidPercentage: 0,
      askPercentage: 0,
      loading: false
    }
  },
  utils: {
    connectDialog: false,
    loadingOrders: false,
    loadingOrderbook: false,
    loadingRecentTrades: false
  },
  web3: {
    isInjected: false,
    web3Instance: null,
    networkId: null,
    coinbase: null,
    balance: null,
    error: null,
    isCheckingTransaction: false,
    latestTransactions: [],
    currentAccount: null
  },
  contractInstance: null,
  // Trade View
  markPrice: null,
  positionsMarkPrice: {},
  indexPrice: null,
  marketPrice: null,
  limitPrice: 0,
  instrument: null,
  leverage: 0,
  realizedPNL: 0,
  unrealizedPNL: 0,
  _ohlcv: null,
  depthChartData: {
    buy: [],
    sell: []
  }
};
export default state;
