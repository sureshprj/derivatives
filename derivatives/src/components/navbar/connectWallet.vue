<template>
  <div>
    <div v-if="coinbase" class="d-flex align-center">
      <router-link to="/wallet">
        <!-- <div class="e-icon mr-3 mt-1">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.8895 10.2485H20.8339V5.39296C20.8339 4.2289 19.8869 3.2819 18.7229 3.2819H17.2933L15.8303 0.651505C15.6073 0.249512 15.183 0 14.7228 0C14.5083 0 14.2955 0.0553158 14.1076 0.159575L8.493 3.28183H2.22142C1.05736 3.28183 0.110352 4.22884 0.110352 5.3929V19.8889C0.110352 21.0529 1.05736 21.9999 2.22142 21.9999H18.7229C19.8869 21.9999 20.8339 21.0529 20.8339 19.8889V15.6316H21.8895V10.2485ZM18.7229 4.12628C19.3731 4.12628 19.9042 4.62025 19.9756 5.25231H18.3889L17.7631 4.12628H18.7229ZM14.5184 0.897601C14.7164 0.786575 14.9829 0.864228 15.0922 1.06145L17.4228 5.25192H6.68761L14.5184 0.897601ZM19.9895 19.8889C19.9895 20.5872 19.4212 21.1555 18.7228 21.1555H2.22142C1.52307 21.1555 0.954739 20.5872 0.954739 19.8889V5.39296C0.954739 4.69462 1.52307 4.12628 2.22142 4.12628H6.9747L4.94976 5.25238H2.48532C2.25184 5.25238 2.06309 5.44151 2.06309 5.6746C2.06309 5.90769 2.25184 6.09683 2.48532 6.09683H3.43107H18.8584H19.9895V10.2489H16.9019C15.468 10.2489 14.301 11.4159 14.301 12.8497V13.0313C14.301 14.4652 15.468 15.6321 16.9019 15.6321H19.9895V19.8889ZM21.045 14.7873H20.8339H16.9019C15.9333 14.7873 15.1454 13.9994 15.1454 13.0308V12.8492C15.1454 11.8807 15.9332 11.0928 16.9019 11.0928H20.8339H21.045V14.7873ZM18.1951 12.9747C18.1951 13.4898 17.7779 13.9069 17.2629 13.9069C16.7477 13.9069 16.3306 13.4898 16.3306 12.9747C16.3306 12.4597 16.7478 12.0425 17.2629 12.0425C17.778 12.0424 18.1951 12.46 18.1951 12.9747Z"
              fill="white"
            />
          </svg> -->
        <!-- </div> -->
        <div class="e-icon mr-3 mt-1 admin">
          <img
            src="../../assets/navbar/vector-up.svg"
            alt=""
            fill="rgba(255,255,255,0.7)"
          />
          <img src="../../assets/navbar/vector-down.svg" alt="" />
          <img src="../../assets/navbar/vector-up.svg" alt="" />
          <span>Admin</span>
        </div>
      </router-link>
      <div class="d-flex-column align-center" style="margin: 0 20px">
        <img
          class="help-icon"
          src="../../assets/navbar/help-icon.svg"
          alt=""
          v-bind="attrs"
          v-on="on"
        />
        <!-- <div class="d-flex align-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="6"
              cy="6"
              r="5"
              fill="#00D46A"
              stroke="#242837"
              stroke-width="2"
            />
          </svg>
          <p v-if="ethBalance" class="account-network mb-0 ml-1">
            Connected ({{ network }})
          </p>
        </div> -->

        <!-- <div class="d-flex align-center">
          <a
            :href="'https://etherscan.io/address/' + coinbase"
            class="clear-link"
            target="_blank"
          >
            <h3 class="account-address">
              {{ reduceAddress(coinbase) }}
            </h3>
          </a>
          <v-btn
            v-if="!justCopied"
            x-small
            @click="copyToClipboard(coinbase)"
            color="primaryBack"
            class="elevation-0"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5" clip-path="url(#clip0)">
                <path
                  d="M8.57141 2.14453H1.28571C0.575633 2.14453 0 2.72016 0 3.43024V10.7159C0 11.426 0.575633 12.0017 1.28571 12.0017H8.57141C9.2815 12.0017 9.85713 11.426 9.85713 10.7159V3.43024C9.85713 2.72016 9.2815 2.14453 8.57141 2.14453ZM8.99999 10.716C8.99999 10.9527 8.80812 11.1446 8.57141 11.1446H1.28571C1.04901 11.1446 0.857134 10.9527 0.857134 10.716V3.43024C0.857134 3.19354 1.04901 3.00167 1.28571 3.00167H8.57141C8.80812 3.00167 8.99999 3.19354 8.99999 3.43024V10.716Z"
                  fill="white"
                />
                <path
                  d="M10.7143 0H3.00007C2.28999 0 1.71436 0.575633 1.71436 1.28571C1.71436 1.52242 1.90623 1.71429 2.14294 1.71429C2.37964 1.71429 2.57149 1.52242 2.57149 1.28571C2.57149 1.04901 2.76337 0.857134 3.00007 0.857134H10.7143C10.9511 0.857134 11.1429 1.04901 11.1429 1.28571V8.99999C11.1429 9.2367 10.9511 9.42857 10.7143 9.42857C10.4776 9.42857 10.2858 9.62045 10.2858 9.85715C10.2858 10.0939 10.4776 10.2857 10.7143 10.2857C11.4244 10.2857 12.0001 9.7101 12.0001 9.00002V1.28571C12.0001 0.575633 11.4244 0 10.7143 0Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="12" height="12" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </v-btn>
          <v-tooltip v-else v-model="justCopied" bottom color="success">
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="mx-2" x-small icon v-bind="attrs" v-on="on">
                <v-icon size="12" color="success" class="pl-2 pr-2 ma-0"
                  >mdi-check</v-icon
                >
              </v-btn>
            </template>
            <span>Copied!</span>
          </v-tooltip>
        </div> -->
      </div>
      <div class="user-icon">
        <img src="../../assets/navbar/user.svg" alt="" />
      </div>
      <div class="ml-3">
        <v-menu :nudge-width="200" offset-y open-on-hover close-delay="500">
          <template v-slot:activator="{ on, attrs }">
            <svg
              width="9"
              height="6"
              viewBox="0 0 9 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              v-on="on"
              v-bind="attrs"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.00011 0.939331L4.50011 3.43933L7.00011 0.939331L8.06077 1.99999L5.03044 5.03032C4.73755 5.32321 4.26268 5.32321 3.96978 5.03032L0.939453 1.99999L2.00011 0.939331Z"
                fill="white"
              />
            </svg>
          </template>
          <v-card>
            <v-list-item-group class="secondaryBack">
              <v-list-item>
                <img
                  src="../../assets/navbar/menu/manage-account.svg"
                  alt=""
                  class="mr-4"
                />
                <v-list-item-title class="menu-item"
                  >Manage Account</v-list-item-title
                >
              </v-list-item>
              <v-list-item class="d-flex align-center">
                <img
                  src="../../assets/navbar/menu/defi-governance.svg"
                  alt=""
                  class="mr-4"
                />
                <v-list-item-title class="menu-item"
                  >DeFi & Governance</v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <img
                  src="../../assets/navbar/menu/games-competitions.svg"
                  alt=""
                  class="mr-4"
                />
                <v-list-item-title class="menu-item"
                  >Games and Competitions</v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <img
                  src="../../assets/navbar/menu/refer-friend.svg"
                  alt=""
                  class="mr-4"
                />
                <v-list-item-title class="menu-item"
                  >Refer to a friend</v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <img
                  src="../../assets/navbar/menu/disconnect.svg"
                  alt=""
                  class="mr-4"
                />
                <v-list-item-title class="menu-item"
                  >Disconnect</v-list-item-title
                >
              </v-list-item>
            </v-list-item-group>
          </v-card>
        </v-menu>
      </div>
      <!-- <v-divider class="mx-4" vertical></v-divider> -->
    </div>
    <div v-else class="d-flex align-center mr-4">
      <img
        src="../../assets/navbar/connect-wallet-button.svg"
        alt=""
        @click="$store.commit('changeConnectDialogStatus', true)"
        style="cursor: pointer"
      />
      <div class="mx-2">or</div>
      <img
        src="../../assets/navbar/create-wallet-button.svg"
        alt=""
        @click="
          $store.commit('changeConnectDialogStatus', true);
          creatingNewWallet = true;
        "
        style="cursor: pointer"
      />
    </div>

    <!-- SWITCH TO KOVAN NETWORK DIALOG -->
    <!-- <v-dialog
      v-model="network"
      v-if="network != 'Kovan'"
      width="400"
      persistent
    >
      <v-card>
        <v-card-title class="dialog-title dialogBackDark"
          >Switch to Kovan Network</v-card-title
        >
        <div class="dialog-container text-center primaryBack py-4">
          <img src="../../assets/navbar/metamask-fox-lg.svg" alt="" />
        </div>
        <p class="mb-0 pa-6 pt-0 primaryBack text-center">
          Switch to Kovan Network to operate with our trading dashboard.
        </p>
      </v-card>
    </v-dialog> -->

    <!-- Connect and Create Wallet DIALOG -->
    <v-dialog v-model="connectDialog" width="400" persistent>
      <v-card v-if="creatingNewWallet">
        <v-card-title class="dialog-title secondaryBack">
          Create New Wallet
        </v-card-title>
        <section class="body">
          <div class="content text-center" id="dialog-content">
            <div class="d-flex flex-column scan-content primaryBack pa-4">
              <div class="create-wallet-title">
                Your new Ethereum wallet was generated.<br />Save your private
                key in a safe place.
              </div>
              <div class="create-wallet-subtitle">
                The wallet was generated in your browser. <br />You are the only
                one having access to the private key
              </div>
            </div>
            <div class="d-flex justify-center py-2 primaryBack">
              <qr-code
                :size="parseInt(130)"
                :text="createWalletAddress"
                class="qr-code text-center my-2"
              ></qr-code>
            </div>
            <v-divider></v-divider>
            <div class="form-content secondaryBack pa-4">
              <div>
                <div class="form-field">
                  <div class="label-txt">Wallet address</div>
                  <v-text-field
                    background-color="rgba(0, 0, 0,0.3)"
                    color="#FFF"
                  >
                    <template slot="append">
                      <div class="append-items">
                        <v-img
                          class="icon-select"
                          src="../../assets/navbar/create-new-wallet/copy.svg"
                        >
                        </v-img>
                      </div>
                    </template>
                  </v-text-field>
                </div>
                <div class="form-field form-pass">
                  <div class="label-txt">Private Key</div>
                  <v-text-field
                    background-color="rgba(0, 0, 0,0.3)"
                    color="#FFF"
                    :type="showKey ? 'text' : 'password'"
                  >
                    <template slot="append">
                      <div class="append-items">
                        <v-img
                          class="icon-select"
                          @click="showKey = !showKey"
                          src="../../assets/navbar/create-new-wallet/eye.svg"
                        >
                        </v-img>
                        <v-img
                          class="icon-select"
                          src="../../assets/navbar/create-new-wallet/copy.svg"
                        >
                        </v-img>
                      </div>
                    </template>
                  </v-text-field>
                </div>
                <v-divider></v-divider>
                <v-row>
                  <v-col cols="2">
                    <img
                      v-if="isAgree"
                      @click="isAgree = !isAgree"
                      src="../../assets/navbar/create-new-wallet/checked.svg"
                    />
                  </v-col>
                  <v-col cols="10">
                    <div class="agreement">
                      I understand that EMDX has no access to my private key and
                      in case of loss I will not be able to restore access to my
                      wallet and the funds on the smart contracts.
                    </div>
                  </v-col>
                </v-row>
                <div class="terms-txt">
                  <div
                    v-if="!isAgree"
                    @click="isAgree = !isAgree"
                    class="uncheckedbox"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <v-divider></v-divider>
        </section>
        <div class="primaryBack text-center pa-2">
          <v-btn
            class="dialogBackDark"
            @click="
              $store.commit('changeConnectDialogStatus', false);
              metaMaskConnecting = false;
              creatingNewWallet = false;
            "
            large
            >CLOSE</v-btn
          >
        </div>
      </v-card>

      <v-card v-else>
        <!-- Dialog Title -->

        <v-card-title class="dialog-title dialogBackDark">
          Connect a wallet
        </v-card-title>

        <!-- Dialog Subtitle with conditional -->
        <div
          v-if="metaMaskConnecting"
          class="dialog-container text-center dialogBackLight"
        >
          <h3>Connect Metamask</h3>
          <p class="mb-0">
            Check your Metamask notification or sign in in the opened Metamask
            popup
          </p>
        </div>
        <div v-else class="dialog-container text-center dialogBackLight">
          <h3>Select Method</h3>
          <p class="mb-0">Connect a wallet using one of the methods below</p>
        </div>

        <div
          v-if="metaMaskConnecting"
          class="dialog-container text-center dialogBackDark py-4"
        >
          <img
            src="../../assets/navbar/metamask-fox-lg.svg"
            alt=""
            @click="connectDialog = true"
            style="cursor: pointer"
          />
        </div>

        <div v-else class="dialog-container dialogBackDark">
          <div class="connect-button d-flex align-center justify-center">
            <img
              style="max-height: 20px"
              src="../../assets/navbar/lock.svg"
              alt=""
            />
            <span class="ml-3">Private Key</span>
          </div>

          <div
            @click="activateMetaMask()"
            class="connect-button d-flex align-center justify-center"
          >
            <img
              style="max-height: 20px"
              src="../../assets/navbar/metamask-fox.svg"
              alt=""
            />
            <span class="ml-3">Metamask</span>
          </div>

          <div class="connect-button d-flex align-center justify-center">
            <img
              style="max-height: 20px"
              src="../../assets/navbar/ledger-logo.svg"
              alt=""
            />
            <span class="ml-3">Ledger</span>
          </div>

          <v-divider class="mt-6 mb-4"></v-divider>

          <div class="text-center">
            <p>Don't have one?</p>
            <img
              @click="activateMetaMask()"
              style="cursor: pointer"
              src="../../assets/navbar/create-wallet-button.svg"
              alt=""
            />
          </div>
        </div>

        <div class="dialogBackLight text-center pa-2">
          <v-btn
            class="dialogBackDark"
            @click="
              $store.commit('changeConnectDialogStatus', false);
              metaMaskConnecting = false;
            "
            large
            >OK</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import VueQRCodeComponent from "vue-qr-generator";
Vue.component("qr-code", VueQRCodeComponent);

export default {
  data() {
    return {
      justCopied: false,
      accountChanged: 0,
      coinbase: "0xd6aD3cA2AC745e20B97d195ee539f39Ed8c8497C",
      // Dialog
      metaMaskConnecting: false,
      openDialog: false,
      showKey: false,
      isAgree: true,
      creatingNewWallet: false,
      createWalletAddress: "0xd6aD3cA2AC745e20B97d195ee539f39Ed8c8497C",
      createPrivateKey: "",
    };
  },
  created() {
    // window.ethereum.on("accountsChanged", function() {
    //   location.reload();
    // });
    // window.ethereum.on("networkChanged", function() {
    //   location.reload();
    // });
    // this.$store.dispatch("registerWeb3");
  },
  computed: {},

  methods: {
    activateMetaMask() {
      this.metaMaskConnecting = true;
      window.ethereum.enable();
    },
    reduceAddress(str) {
      let firstDigits = str.slice(0, 6);
      let lastDigits = str.slice(36, 42);
      return firstDigits + "..." + lastDigits.toUpperCase();
    },
    reducedBalance(balance) {
      return balance.toFixed(6);
    },
    async copyToClipboard(s) {
      this.justCopied = true;
      setTimeout(() => {
        this.justCopied = false;
      }, 3000);
      await navigator.clipboard.writeText(s);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.account-address {
  font-size: 12px;
}
.account-network {
  font-size: 11px;
  text-transform: capitalize;
}
.e-icon {
  position: relative;
  width: 30px;
  height: 100%;
}
.clear-link {
  color: var(--v-primaryColor-base);
  text-decoration: none;
}
.connect-button {
  background-color: rgba(255, 255, 255, 0.03);
  padding: 15px;
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin: 15px 0px 15px 0px;
  cursor: pointer;
}
.connect-button:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
.menu-item {
  font-size: 12px;
  color: var(--v-secondaryColor-base);
}
.qr-code {
  border: 2px white solid;
}
.create-wallet-title {
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  padding-bottom: 10px;
}
.create-wallet-subtitle {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #ffffff;
  opacity: 0.7;
}
.label-txt,
.agreement {
  font-family: PT Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  color: #ffffff;
  opacity: 0.5;
}

.admin {
  width: 100px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 0 15px;
  cursor: pointer;
  height: 34px;
  line-height: 34px;
}
.admin > span {
  margin-left: 15px;
  font-size: 14px;
  opacity: 0.7;
}

.help-icon {
  margin: auto;
  display: block;
  padding: 3px 0;
  cursor: pointer;
}
.user-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 0 0 15px;
}

.user-icon > img {
  margin: auto;
  display: block;
  padding: 7px 0;
  height: 30px;
}
</style>
