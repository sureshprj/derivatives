import { BigNumber } from "@0x/utils";
import { getTokens } from "../../services/wallet";
import { toEther } from "../../util/orders/tokens";
import get from "lodash/get";

export default {
  state: {
    error: {},
    loading: false,
    tokens: []
  },
  mutations: {
    BEFORE_FETCH(state) {
      state.error = null;
      state.loading = true;
    },
    SUCCESS_FETCH(state, tokens) {
      state.loading = false;
      state.tokens = tokens;
    },
    ERROR_FETCH(state, error) {
      state.loading = false;
      state.error = error;
      state.tokens = [];
    },
    TOKEN_UPDATE(state, tokens) {
      state.tokens = tokens;
    }
  },
  actions: {
    FETCH_WALLET: async ({ commit }) => {
      commit("BEFORE_FETCH");

      try {
        const tokens = await getTokens();

        commit("SUCCESS_FETCH", tokens);
      } catch (error) {
        commit("ERROR_FETCH", error);
      }
    },
    TOKEN_UPDATE: async ({ commit, state }, { token, update }) => {
      const tokenIndex = state.tokens.findIndex(
        ({ symbol }) => symbol === token
      );
      const tokens = [
        ...state.tokens.slice(0, tokenIndex),
        {
          ...state.tokens[tokenIndex],
          ...update
        },
        ...state.tokens.slice(tokenIndex + 1)
      ];

      commit("TOKEN_UPDATE", tokens);
    }
  },
  getters: {
    wethToken: state =>
      state.tokens.find(({ symbol } = {}) => symbol === "weth"),
    wethBalance: (state, { wethToken }) =>
      get(wethToken, "balance", new BigNumber(0)),
    wethBalanceInEth: (state, { wethToken }) =>
      wethToken ? toEther(wethToken.balance, wethToken.displayDecimals) : 0.0,
    tokens: state => state.tokens
  }
};
