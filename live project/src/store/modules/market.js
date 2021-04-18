export default {
  state: {
    markPrice: null,
    positionsMarkPrice: {},
    indexPrice: null,
    marketPrice: null,
    limitPrice: 0,
    instrument: {
      base: "BTC",
      contractSize: 0.0001,
      feeMaker: 0.00025,
      feeTaker: 0.00075,
      last24hsHigh: 36700.42,
      last24hsLow: 35384.72,
      last24hsVolume: 80246,
      margin: 1000,
      marketId: "btcusd",
      maturityDate: "2021-12-30T00:00:00.000Z",
      percentChange: -3.7182942241735946,
      precision: 4,
      quote: "USD",
      lastPrice: 35870.32
    },
    intruments: [],
    leverage: 0,
    realizedPNL: 0,
    unrealizedPNL: 0,
    _ohlcv: null,
    depthChartData: {
      buy: [],
      sell: []
    }
  },

  mutations: {
    LIMIT_PRICE(state, price) {
      state.limitPrice = parseFloat(price);
    },
    INDEX_PRICE(state, price) {
      state.indexPrice = price;
    },
    MARK_PRICE(state, price) {
      state.markPrice = price;
    },
    POSITIONS_MARK_PRICE(state, data) {
      let temp = {};
      temp[data.SYMBOL] = data.MARK_PRICE;
      state.positionsMarkPrice = { ...state.positionsMarkPrice, ...temp };
    },
    MARKET_PRICE(state, price) {
      state.marketPrice = price;
    },
    INSTRUMENT(state, instrument) {
      state.instrument = instrument;
    },
    INSTRUMENTS(state, instruments) {
      state.instruments = instruments;
    },
    OHLCV(state, ohlcv) {
      state._ohlcv = ohlcv;
    },
    DEPTH_CHART_DATA(state, data) {
      state.depthChartData = data;
    },
    LEVERAGE(state, leverage) {
      state.leverage = leverage;
    },
    REALIZED_PNL(state, realizedPNL) {
      state.realizedPNL = realizedPNL;
    },
    UNREALIZED_PNL(state, unrealizedPNL) {
      state.unrealizedPNL = unrealizedPNL;
    }
  },

  actions: {
    SET_LIMIT_PRICE({ commit }, price) {
      commit("LIMIT_PRICE", price);
    }
  },

  getters: {
    getLimitPrice: state => {
      return state.limitPrice;
    },
    getIndexPrice: state => {
      return state.indexPrice;
    },
    getMarkPrice: state => {
      return state.markPrice;
    },
    getPositionsMarkPrice: (state, symbol) => {
      return state.positionsMarkPrice[symbol]
        ? state.positionsMarkPrice[symbol]
        : null;
    },
    getMarketPrice: state => {
      return state.marketPrice;
    },
    getInstrument: state => {
      return state.instrument;
    },
    getOhlcv: state => {
      return state._ohlcv;
    },
    getLeverage: state => {
      return state.leverage;
    },
    getRealizedPNL: state => {
      return state.realizedPNL;
    },
    getUnrealizedPNL: state => {
      return state.unrealizedPNL;
    }
  }
};
