<template>
  <v-card
    height="100%"
    auto
    class="flex-grow-1"
    color="primaryBack"
    ref="cardChart"
  >
    <v-tabs
      ref="tabsChart"
      height="56px"
      background-color="secondaryBack"
      slider-color="success"
      color="primaryColor"
    >
      <div class="d-flex justify-space-between" style="flex: 1">
        <v-menu
          offset-y
          z-index="5"
          :close-on-content-click="false"
          disabled
          open-on-hover
        >
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              @click="overlay = true"
              text
              large
              class="d-flex align-self-center pl-2 pr-1"
            >
              <!-- v-bind="attrs" v-on="on" -->
              <v-icon style="margin-right: 5px" size="16" color="emdxBlue"
                >mdi-star</v-icon
              >
              <span class="chartSymbol ml-1">
                {{ pairData.baseTokenName + "/" + pairData.quoteTokenName }}
              </span>
              <span
                style="margin-left: 15px; font-size: 11px; letter-spacing: 0px;"
                :class="{
                  'success--text': percentChangeUp(getPercentChange()),
                  'error--text': !percentChangeUp(getPercentChange())
                }"
              >
                <p class="intrument-chart-price">
                  {{ pairData.lastPrice }}
                </p>
                <div class="d-flex justify-end">
                  {{ getPercentChange() }}
                  <div class="d-flex align-center justify-center">
                    <v-icon
                      v-if="percentChangeUp(getPercentChange())"
                      style="margin-top: 1px"
                      class="success--text top-2"
                      size="12"
                      >mdi-arrow-up</v-icon
                    >
                    <v-icon
                      v-else
                      style="margin-top: 1px"
                      class="error--text top-2"
                      size="12"
                      >mdi-arrow-down</v-icon
                    >
                  </div>
                </div>
              </span>

              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.0001 9.93933L12.5001 12.4393L15.0001 9.93933L16.0608 11L13.0304 14.0303C12.7375 14.3232 12.2627 14.3232 11.9698 14.0303L8.93945 11L10.0001 9.93933Z"
                  fill="white"
                />
              </svg>
              <v-divider vertical></v-divider>
            </v-btn>
          </template>

          <v-card color="primaryBack">
            <v-tabs
              height="56"
              background-color="secondaryBack"
              slider-color="success"
              color="primaryColor"
              class="elevation-1"
            >
              <v-tab active href="#tab-all-products">All Products</v-tab>
              <v-tab href="#tab-futures">Futures</v-tab>
              <v-tab href="#tab-options">Options</v-tab>
              <v-tab href="#tab-spot">Spot</v-tab>

              <v-text-field
                class="ml-8 mr-2 d-flex align-center font-size-14 rounded-0 border-0 menu-search-input"
                background-color="selectBackground"
                outlined
                append-icon="mdi-magnify"
                dense
                placeholder="Search"
                hide-details
                color="emdxBlue"
              ></v-text-field>

              <v-tab-item value="tab-all-products">
                <v-simple-table
                  class="primaryBack"
                  dense
                  fixed-header
                  height="268"
                >
                  <template v-slot:default>
                    <thead class="larger-header">
                      <tr>
                        <th class="secondaryBack text-no-wrap">
                          <v-icon size="16" color="#565b61">mdi-star</v-icon>
                        </th>
                        <th class="background-header-dark text-no-wrap">
                          Market
                        </th>
                        <th class="background-header-dark text-no-wrap">
                          Last Price
                        </th>
                        <th class="background-header-dark text-no-wrap">
                          24hs Change
                        </th>
                        <th class="background-header-dark text-no-wrap">
                          24hs Volume
                        </th>
                        <th class="background-header-dark text-no-wrap"></th>
                      </tr>
                    </thead>

                    <tbody class="borderless">
                      <tr v-for="(item, index) in instruments" :key="index">
                        <td class="text-no-wrap">
                          <v-icon size="16" color="#565b61">mdi-star</v-icon>
                        </td>
                        <td class="text-no-wrap font-size-12">
                          <router-link
                            :to="{
                              name: 'Market',
                              params: { symbol: item.symbol }
                            }"
                            :style="{ cursor: 'pointer' }"
                            class="marketSymbol"
                            >{{ item.symbol }}</router-link
                          >
                        </td>
                        <td class="text-no-wrap font-size-12 text-center">
                          {{ item.marketPrice }}
                        </td>
                        <td
                          class="text-no-wrap font-size-12 text-center"
                          :class="{
                            'success--text': percentChangeUp(
                              item.percentChange
                            ),
                            'error--text': !percentChangeUp(item.percentChange)
                          }"
                        >
                          {{ item.percentChange.toFixed(2) }}%
                        </td>
                        <td class="text-no-wrap font-size-12">
                          {{ item.volume24hs }}
                        </td>
                        <td
                          class="text-no-wrap font-size-12 py-3"
                          style="max-width: 150px;"
                        >
                          <tableChart
                            :graphData="graphData[item.symbol]"
                            :tableChartOptions="tableChartOptions"
                            :chartHeight="30"
                            :chartColor="item.percentChange"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-tab-item>

              <v-tab-item value="tab-futures"></v-tab-item>

              <v-tab-item value="tab-options"></v-tab-item>

              <v-tab-item value="tab-spot"></v-tab-item>
            </v-tabs>
          </v-card>
        </v-menu>

        <span
          class="graph-instrument align-self-center mr-4 ml-2 my-0"
          v-if="pairData"
        >
          <span
            color="secondaryColor"
            style="line-height: 12px;"
            class="d-flex graph-instrument-sub"
            >Last Price</span
          >
          {{ pairData.lastPrice }}
        </span>

        <span class="graph-instrument align-self-center mr-4 ml-2 my-0">
          <span style="line-height: 12px;" class="d-flex graph-instrument-sub"
            >24hs High</span
          >
          {{ pairData.high24hs ? pairData.high24hs : "" }}
        </span>

        <span class="graph-instrument align-self-center mx-4 my-0">
          <span
            color="secondaryColor"
            style="line-height: 12px;"
            class="d-flex graph-instrument-sub"
            >24hs Low</span
          >
          {{ pairData.low24hs }}
        </span>

        <span class="graph-instrument align-self-center mx-4 my-0">
          <span
            color="secondaryColor"
            style="line-height: 12px;"
            class="d-flex graph-instrument-sub"
            >24hs Vol</span
          >
          {{ pairData.vol24hs }}
        </span>

        <v-spacer></v-spacer>

        <v-tab class="graph-tab" href="#tab-chart">Chart</v-tab>
        <v-tab class="graph-tab" href="#tab-depth">Depth</v-tab>

        <div class="d-flex align-center">
          <v-select
            background-color="selectBackground"
            class="ml-2 pa-1 select-in-header"
            :items="compressionArray"
            v-model="compression"
            item-color="#fff"
            dense
            solo
            flat
            :full-width="false"
            hide-details
            color="emdxBlue"
            @change="setCompression()"
          ></v-select>
        </div>

        <v-btn
          @click="toggleFullscreen"
          class="d-flex align-self-center"
          text
          fab
          small
        >
          <svg
            v-if="!isFullscreen"
            width="21"
            height="21"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <path
                d="M16.5059 0H1.57342C0.727629 0 0 0.662273 0 1.50789V16.4403C0 17.2859 0.727629 18 1.57342 18H16.5059C17.3517 18 18 17.2859 18 16.4403V1.50789C18 0.662273 17.3516 0 16.5059 0ZM17.2341 16.4662C17.2341 16.8902 16.8903 17.234 16.4662 17.234H1.5338C1.10971 17.234 0.765984 16.8902 0.765984 16.4662V1.5338C0.765984 1.10978 1.10974 0.765984 1.5338 0.765984H16.4662C16.8903 0.765984 17.2341 1.10978 17.2341 1.5338V16.4662Z"
                fill="white"
              />
              <path
                d="M14.3588 3.29791H10.529C10.3175 3.29791 10.146 3.46919 10.146 3.6809C10.146 3.89262 10.3175 4.0639 10.529 4.0639H13.4343L9.49232 7.99296C9.34273 8.14255 9.34273 8.37838 9.49232 8.52797C9.56713 8.60278 9.66511 8.63699 9.76309 8.63699C9.86107 8.63699 9.93923 8.598 10.014 8.52319L13.9362 4.5795V7.48474C13.9362 7.69642 14.1077 7.86773 14.3192 7.86773C14.5307 7.86773 14.7022 7.69645 14.7022 7.48474V3.65499C14.7022 3.44328 14.5703 3.29791 14.3588 3.29791Z"
                fill="white"
              />
              <path
                d="M8.96015 9.05017C8.81056 8.90058 8.55828 8.89411 8.40869 9.0437L4.44689 12.9857V10.0805C4.44689 9.86879 4.2754 9.69747 4.0639 9.69747C3.8524 9.69747 3.68091 9.86875 3.68091 10.0805V13.9102C3.68091 13.9354 3.70334 13.9604 3.70829 13.9852C3.71062 13.9971 3.72496 14.0082 3.7284 14.0196C3.7321 14.032 3.73987 14.0446 3.74482 14.0566C3.75073 14.0708 3.7611 14.0837 3.76855 14.097C3.77326 14.1054 3.77819 14.1143 3.78356 14.1224C3.81169 14.1645 3.8486 14.2008 3.89079 14.229C3.89902 14.2344 3.90823 14.2381 3.91677 14.2429C3.92996 14.2503 3.94296 14.2581 3.95706 14.264C3.96908 14.269 3.98171 14.2718 3.99408 14.2755C4.00558 14.2789 4.01662 14.2963 4.0285 14.2986C4.05321 14.3036 4.07838 14.3191 4.10349 14.3191H7.93327C8.14477 14.3191 8.31626 14.1478 8.31626 13.9361C8.31626 13.7244 8.14477 13.5531 7.93327 13.5531H5.02803L8.97003 9.59822C9.11969 9.4487 9.10977 9.1998 8.96015 9.05017Z"
                fill="white"
              />
            </g>
          </svg>
          <svg
            v-else
            width="21"
            height="21"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <path
                d="M16.5059 0H1.57342C0.727629 0 0 0.662273 0 1.50789V16.4403C0 17.2859 0.727629 18 1.57342 18H16.5059C17.3517 18 18 17.2859 18 16.4403V1.50789C18 0.662273 17.3516 0 16.5059 0ZM17.2341 16.4662C17.2341 16.8902 16.8903 17.234 16.4662 17.234H1.5338C1.10971 17.234 0.765984 16.8902 0.765984 16.4662V1.5338C0.765984 1.10978 1.10974 0.765984 1.5338 0.765984H16.4662C16.8903 0.765984 17.2341 1.10978 17.2341 1.5338V16.4662Z"
                fill="white"
              />
              <path
                d="M9.72345 8.63696H13.5532C13.7647 8.63696 13.9362 8.46568 13.9362 8.25397C13.9362 8.04226 13.7647 7.87098 13.5532 7.87098H10.648L14.59 3.94191C14.7395 3.79232 14.7395 3.5565 14.59 3.40691C14.5151 3.33209 14.4172 3.29789 14.3192 3.29789C14.2212 3.29789 14.1431 3.33687 14.0682 3.41169L10.1461 7.35538V4.45013C10.1461 4.23846 9.97458 4.06714 9.76308 4.06714C9.55158 4.06714 9.38008 4.23842 9.38008 4.45013V8.27988C9.38012 8.49159 9.51195 8.63696 9.72345 8.63696Z"
                fill="white"
              />
              <path
                d="M3.79791 14.2036C3.9475 14.3532 4.19978 14.3597 4.34937 14.2101L8.31116 10.2681V13.1733C8.31116 13.385 8.48266 13.5563 8.69416 13.5563C8.90566 13.5563 9.07715 13.385 9.07715 13.1733V9.34354C9.07715 9.3184 9.05472 9.29334 9.04976 9.26855C9.04744 9.25667 9.0331 9.24563 9.02965 9.23414C9.02596 9.2218 9.01819 9.20917 9.01323 9.19722C9.00733 9.18302 8.99696 9.17012 8.9895 9.15683C8.98479 9.14843 8.97987 9.13953 8.97449 9.13141C8.94637 9.08926 8.90945 9.05298 8.86727 9.02482C8.85904 9.0194 8.84983 9.01564 8.84129 9.01089C8.8281 9.00351 8.81509 8.99564 8.801 8.98976C8.78897 8.98481 8.77635 8.982 8.76398 8.97827C8.75248 8.97489 8.74144 8.95753 8.72956 8.95517C8.70484 8.95021 8.67967 8.93468 8.65457 8.93468H4.82479C4.61329 8.93468 4.4418 9.10596 4.4418 9.31767C4.4418 9.52938 4.61329 9.70066 4.82479 9.70066H7.73003L3.78803 13.6556C3.63837 13.8051 3.64828 14.054 3.79791 14.2036Z"
                fill="white"
              />
            </g>
          </svg>
        </v-btn>
      </div>

      <v-tab-item
        active-class="testing"
        id="tab-chart"
        value="tab-chart"
        class="primaryBack"
      >
        <div class="d-flex border-top-color" ref="chartContainer">
          <div
            style="width: 50px"
            class="d-flex flex-column justify-space-between align-center border-right-color primaryBack"
          >
            <v-btn large class="mt-2" icon text>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.5 7C6.77637 7 7 6.77637 7 6.5C7 6.22363 6.77637 6 6.5 6C6.22363 6 6 6.22363 6 6.5C6 6.77637 6.22363 7 6.5 7ZM7.5791 5.45898C7.72656 5.61133 7.8418 5.7959 7.91406 6H17.085C17.291 5.41797 17.8477 5 18.5 5C19.3281 5 20 5.67188 20 6.5C20 6.61035 19.9883 6.71777 19.9658 6.82031C19.9287 6.98926 19.8633 7.14844 19.7744 7.29102C19.6846 7.43555 19.5703 7.56445 19.4375 7.6709C19.3594 7.73438 19.2744 7.78906 19.1846 7.83594C19.125 7.86621 19.0635 7.89258 19 7.91504V17.085C19.582 17.291 20 17.8477 20 18.5C20 19.3281 19.3281 20 18.5 20C17.8477 20 17.291 19.582 17.085 19H7.91504C7.70898 19.582 7.15234 20 6.5 20C5.67188 20 5 19.3281 5 18.5C5 17.8477 5.41797 17.291 6 17.085V7.91504C5.41797 7.70898 5 7.15234 5 6.5C5 5.88867 5.36621 5.3623 5.89062 5.12891C6.07715 5.0459 6.2832 5 6.5 5C6.73633 5 6.95996 5.05469 7.1582 5.15234C7.31641 5.22949 7.45898 5.33398 7.5791 5.45898ZM7 17.085C7.42578 17.2354 7.76465 17.5742 7.91504 18H17.0859C17.1279 17.8818 17.1826 17.7715 17.251 17.6689C17.4297 17.4014 17.6914 17.1943 18 17.085V7.91504C17.5742 7.76465 17.2354 7.42578 17.085 7H7.91504C7.76465 7.42578 7.42578 7.76465 7 7.91504V17.085ZM7 18.5C7 18.2236 6.77637 18 6.5 18C6.34277 18 6.20215 18.0732 6.11035 18.1865C6.04102 18.2725 6 18.3809 6 18.5C6 18.7764 6.22363 19 6.5 19C6.77637 19 7 18.7764 7 18.5ZM18.5 7C18.7764 7 19 6.77637 19 6.5C19 6.22363 18.7764 6 18.5 6C18.2236 6 18 6.22363 18 6.5C18 6.77637 18.2236 7 18.5 7ZM18 18.5C18 18.5928 18.0254 18.6797 18.0693 18.7539C18.1104 18.8242 18.1689 18.8838 18.2383 18.9258C18.3145 18.9727 18.4043 19 18.5 19C18.6357 19 18.7598 18.9453 18.8496 18.8574C18.9424 18.7666 19 18.6406 19 18.5C19 18.4229 18.9824 18.3506 18.9521 18.2852C18.9346 18.248 18.9121 18.2139 18.8867 18.1826C18.7949 18.0713 18.6553 18 18.5 18C18.2236 18 18 18.2236 18 18.5Z"
                    fill="white"
                  />
                </g>
              </svg>
            </v-btn>

            <v-btn large class="mt-2" icon text>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.28 6.15999C16.523 6.15999 16.72 5.963 16.72 5.71999C16.72 5.47699 16.523 5.27999 16.28 5.27999C16.037 5.27999 15.84 5.47699 15.84 5.71999C15.84 5.963 16.037 6.15999 16.28 6.15999ZM16.28 7.03999C17.009 7.03999 17.6 6.44901 17.6 5.71999C17.6 4.99098 17.009 4.39999 16.28 4.39999C15.5509 4.39999 14.96 4.99098 14.96 5.71999C14.96 6.44901 15.5509 7.03999 16.28 7.03999Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.7199 16.72C5.96291 16.72 6.1599 16.523 6.1599 16.28C6.1599 16.037 5.96291 15.84 5.7199 15.84C5.4769 15.84 5.2799 16.037 5.2799 16.28C5.2799 16.523 5.4769 16.72 5.7199 16.72ZM5.7199 17.6C6.44892 17.6 7.0399 17.009 7.0399 16.28C7.0399 15.551 6.44892 14.96 5.7199 14.96C4.99089 14.96 4.3999 15.551 4.3999 16.28C4.3999 17.009 4.99089 17.6 5.7199 17.6Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.7111 6.91113L6.91107 15.7111L6.28882 15.0889L15.0888 6.28888L15.7111 6.91113Z"
                    fill="white"
                  />
                </g>
              </svg>
            </v-btn>

            <v-btn large class="mt-2" icon text>
              <svg
                width="23"
                height="22"
                viewBox="0 0 23 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.5 7C6.77637 7 7 6.77637 7 6.5C7 6.22363 6.77637 6 6.5 6C6.22363 6 6 6.22363 6 6.5C6 6.77637 6.22363 7 6.5 7ZM6 17.085V7.91504C5.41797 7.70898 5 7.15234 5 6.5C5 5.67188 5.67188 5 6.5 5C7.32812 5 8 5.67188 8 6.5C8 6.59277 7.99219 6.68359 7.97559 6.77148L17.5312 9.35547C17.5938 9.30273 17.6611 9.25488 17.7324 9.21191C17.957 9.07715 18.2197 9 18.5 9C19.3281 9 20 9.67188 20 10.5C20 11.3281 19.3281 12 18.5 12L18.4229 11.999L18.3418 11.9922L16.5625 16.4414C16.833 16.7129 17 17.0869 17 17.5C17 18.3281 16.3281 19 15.5 19C14.8662 19 14.3242 18.6064 14.1045 18.0498L7.97754 18.7627C7.85352 19.4658 7.23828 20 6.5 20C5.67188 20 5 19.3281 5 18.5C5 17.8477 5.41797 17.291 6 17.085ZM7 17.085V7.91504C7.06445 7.89258 7.12695 7.86523 7.18652 7.83398C7.2793 7.78613 7.36621 7.72949 7.44629 7.66406L17.0205 10.2529C17.0068 10.333 17 10.416 17 10.5C17 10.9131 17.167 11.2871 17.4375 11.5586L15.6582 16.0078C15.6064 16.002 15.5537 16 15.5 16C14.8301 16 14.2627 16.4395 14.0703 17.0459L7.8125 17.7734C7.63574 17.4551 7.34766 17.208 7 17.085ZM6.5 18C6.22363 18 6 18.2236 6 18.5C6 18.7764 6.22363 19 6.5 19C6.77637 19 7 18.7764 7 18.5C7 18.2236 6.77637 18 6.5 18ZM18.5 11C18.7764 11 19 10.7764 19 10.5C19 10.2236 18.7764 10 18.5 10C18.2236 10 18 10.2236 18 10.5C18 10.7764 18.2236 11 18.5 11ZM16 17.5C16 17.7764 15.7764 18 15.5 18C15.2236 18 15 17.7764 15 17.5C15 17.2236 15.2236 17 15.5 17C15.6133 17 15.7178 17.0371 15.8018 17.1006C15.9219 17.1924 16 17.3369 16 17.5Z"
                    fill="white"
                  />
                </g>
              </svg>
            </v-btn>

            <v-btn large class="mt-2" icon text>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.5 7C12.7764 7 13 6.77637 13 6.5C13 6.22363 12.7764 6 12.5 6C12.2236 6 12 6.22363 12 6.5C12 6.77637 12.2236 7 12.5 7ZM12.5 8C12.5674 8 12.6338 7.99609 12.6982 7.9873L17.4102 16.4697C17.2676 16.6201 17.1553 16.8008 17.085 17H7.91504C7.84473 16.7998 7.73242 16.6191 7.58984 16.4688L12.3018 7.9873C12.3662 7.99609 12.4326 8 12.5 8ZM6.69824 16.0127L11.4102 7.53027C11.1562 7.26172 11 6.89941 11 6.5C11 5.67188 11.6719 5 12.5 5C13.3281 5 14 5.67188 14 6.5C14 6.89941 13.8438 7.26172 13.5898 7.53027L18.3018 16.0127C18.3662 16.0039 18.4326 16 18.5 16C18.9463 16 19.3467 16.1943 19.6211 16.5039C19.8564 16.7686 20 17.1182 20 17.5C20 17.8896 19.8506 18.2451 19.6064 18.5117C19.4609 18.6719 19.2812 18.7998 19.0781 18.8848C18.9004 18.959 18.7051 19 18.5 19C17.8477 19 17.291 18.582 17.085 18H7.91504C7.78516 18.3662 7.51758 18.668 7.17383 18.8408C6.9707 18.9424 6.74219 19 6.5 19C5.67188 19 5 18.3281 5 17.5C5 16.6719 5.67188 16 6.5 16C6.56738 16 6.63379 16.0039 6.69824 16.0127ZM7 17.5C7 17.2236 6.77637 17 6.5 17C6.22363 17 6 17.2236 6 17.5C6 17.6367 6.05469 17.7598 6.14258 17.8496C6.2334 17.9424 6.36035 18 6.5 18C6.77637 18 7 17.7764 7 17.5ZM18 17.5C18 17.7764 18.2236 18 18.5 18C18.6221 18 18.7344 17.9561 18.8213 17.8838C18.9307 17.792 19 17.6543 19 17.5C19 17.2236 18.7764 17 18.5 17C18.4375 17 18.3779 17.0107 18.3232 17.0322C18.2773 17.0498 18.2354 17.0732 18.1973 17.1016C18.1729 17.1201 18.1494 17.1416 18.1289 17.165C18.0488 17.2539 18 17.3711 18 17.5Z"
                    fill="white"
                  />
                </g>
              </svg>
            </v-btn>

            <v-btn large class="mt-2" icon text>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.8359 15.8848C14.8291 17.1729 13.2607 18 11.5 18C8.46289 18 6 15.5371 6 12.5C6 9.46289 8.46289 7 11.5 7C14.5371 7 17 9.46289 17 12.5C17 13.418 16.7754 14.2832 16.3779 15.0439L12.9238 12.9717C12.9453 12.9053 12.9629 12.8369 12.9756 12.7666C12.9922 12.6797 13 12.5908 13 12.5C13 11.6719 12.3281 11 11.5 11C10.6719 11 10 11.6719 10 12.5C10 13.3281 10.6719 14 11.5 14C11.7959 14 12.0723 13.9141 12.3047 13.7656L15.8359 15.8848ZM16.0078 17.1826C14.8389 18.3076 13.251 19 11.5 19C7.91016 19 5 16.0898 5 12.5C5 8.91016 7.91016 6 11.5 6C15.0898 6 18 8.91016 18 12.5C18 13.4131 17.8115 14.2822 17.4717 15.0703C17.6396 15.0244 17.8174 15 18 15C19.1045 15 20 15.8955 20 17C20 18.1045 19.1045 19 18 19C16.957 19 16.0996 18.2012 16.0078 17.1826ZM11.5 13C11.7764 13 12 12.7764 12 12.5C12 12.4639 11.9961 12.4287 11.9893 12.3955C11.9775 12.3428 11.959 12.2939 11.9326 12.249C11.8457 12.0996 11.6846 12 11.5 12C11.2236 12 11 12.2236 11 12.5C11 12.7764 11.2236 13 11.5 13ZM18.6016 17.7988C18.4346 17.9248 18.2266 18 18 18C17.4473 18 17 17.5527 17 17C17 16.4473 17.4473 16 18 16C18.2549 16 18.4873 16.0947 18.6641 16.251C18.8701 16.4346 19 16.7021 19 17C19 17.1064 18.9834 17.209 18.9521 17.3057C18.8887 17.5039 18.7646 17.6758 18.6016 17.7988Z"
                    fill="white"
                  />
                </g>
              </svg>
            </v-btn>

            <v-btn large class="mt-2" icon text>
              <svg
                width="23"
                height="22"
                viewBox="0 0 23 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18 8C18.5527 8 19 7.55273 19 7C19 6.44727 18.5527 6 18 6C17.4473 6 17 6.44727 17 7C17 7.55273 17.4473 8 18 8ZM18 9C19.1045 9 20 8.10449 20 7C20 5.89551 19.1045 5 18 5C16.8955 5 16 5.89551 16 7C16 7.59473 16.2598 8.12891 16.6719 8.49512L15.0771 11.5068C14.2383 11.1797 13.3604 11 12.5 11C9.22559 11 5.68457 13.6074 5.08789 17C5.03027 17.3262 5 17.6602 5 18H6H7H8H11.085C11.291 18.582 11.8477 19 12.5 19C13.1523 19 13.709 18.582 13.915 18H17H18H19H20C20 17.8535 19.9941 17.708 19.9834 17.5635C19.9688 17.373 19.9453 17.1855 19.9121 17C19.5303 14.8271 17.9404 12.9766 15.9863 11.9268L17.5615 8.95215C17.6396 8.96973 17.7197 8.98242 17.8018 8.99023L17.915 8.99805L18 9ZM17.874 17H18.8936C18.6357 15.7939 17.9268 14.6807 16.9326 13.7979C16.499 13.4121 16.0215 13.0811 15.5195 12.8105L15.0664 13.667C16.4062 14.3711 17.5107 15.5762 17.874 17ZM14.1426 13.2744L14.6064 12.3975C13.9102 12.1396 13.1914 12 12.5 12C10.9814 12 9.33594 12.6709 8.06738 13.7979C7.07324 14.6807 6.36426 15.7939 6.10645 17H7.12598C7.70801 14.7178 10.1943 13 12.5 13C13.0469 13 13.6035 13.0967 14.1426 13.2744ZM8.16895 17C8.39258 16.3447 8.82617 15.7314 9.41699 15.2207C9.88867 14.8125 10.4346 14.4932 11 14.2842C11.4971 14.0996 12.0098 14 12.5 14C12.8809 14 13.2754 14.0605 13.666 14.1738L12.6924 16.0127C12.6533 16.0078 12.6143 16.0039 12.5742 16.002L12.5 16C11.8477 16 11.291 16.418 11.085 17H8.16895ZM13.915 17H16.8311C16.6074 16.3447 16.1738 15.7314 15.583 15.2207C15.2803 14.959 14.9473 14.7344 14.5977 14.5508L13.585 16.4639C13.7305 16.6162 13.8438 16.7979 13.915 17Z"
                    fill="white"
                  />
                </g>
              </svg>
            </v-btn>

            <v-btn large class="mt-2" icon text>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.9072 6.29004L7.77246 16.2793L16.8594 11.6416L17.3135 12.5322L8.56055 17H17.085C17.1914 16.6992 17.3906 16.4424 17.6484 16.2646C17.8906 16.0977 18.1846 16 18.5 16C19.3281 16 20 16.6719 20 17.5C20 18.3281 19.3281 19 18.5 19C18.1709 19 17.8652 18.8936 17.6172 18.7129C17.375 18.5361 17.1865 18.2881 17.085 18H7.91504C7.70898 18.582 7.15234 19 6.5 19C6.05859 19 5.66113 18.8086 5.38672 18.5049C5.14648 18.2393 5 17.8867 5 17.5C5 16.8252 5.44629 16.2539 6.05957 16.0654L7.50586 6.42578L8.49414 6.57422L7.16992 15.4004L14.0938 5.70801L14.9072 6.29004ZM18.5 18C18.7764 18 19 17.7764 19 17.5C19 17.2236 18.7764 17 18.5 17C18.2236 17 18 17.2236 18 17.5C18 17.7764 18.2236 18 18.5 18ZM7 17.5C7 17.7764 6.77637 18 6.5 18C6.22363 18 6 17.7764 6 17.5C6 17.2236 6.22363 17 6.5 17C6.67578 17 6.83008 17.0908 6.91992 17.2275C6.9707 17.3057 7 17.3994 7 17.5Z"
                    fill="white"
                  />
                </g>
              </svg>
            </v-btn>

            <v-btn large class="mt-2 mb-2" icon text>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.3599 4.84002C7.87389 4.84002 7.4799 5.23401 7.4799 5.72002C7.4799 6.20603 7.87389 6.60002 8.3599 6.60002C8.84591 6.60002 9.2399 6.20603 9.2399 5.72002C9.2399 5.23401 8.84591 4.84002 8.3599 4.84002ZM6.65535 5.28002C6.85073 4.52092 7.53981 3.96002 8.3599 3.96002C9.17999 3.96002 9.86908 4.52092 10.0645 5.28002H17.5999V6.16002H10.0645C9.97838 6.49446 9.79647 6.79043 9.54974 7.01691L10.0726 7.92002H17.5999V8.80002H10.5821L12.1105 11.44H17.5999V12.32H12.6199L13.9485 14.6149C14.1277 14.5534 14.3199 14.52 14.5199 14.52C15.34 14.52 16.0291 15.0809 16.2245 15.84H17.5999V16.72H16.2245C16.0291 17.4791 15.34 18.04 14.5199 18.04C13.6998 18.04 13.0107 17.4791 12.8154 16.72H4.3999V15.84H12.8154C12.8872 15.5609 13.0258 15.3085 13.2131 15.101L11.6031 12.32H4.3999V11.44H11.0936L9.56522 8.80002H4.3999V7.92002H9.05575L8.77282 7.43131C8.64038 7.46316 8.50211 7.48002 8.3599 7.48002C7.53981 7.48002 6.85073 6.91912 6.65535 6.16002H4.3999V5.28002H6.65535ZM14.5199 15.4C14.0339 15.4 13.6399 15.794 13.6399 16.28C13.6399 16.766 14.0339 17.16 14.5199 17.16C15.0059 17.16 15.3999 16.766 15.3999 16.28C15.3999 15.794 15.0059 15.4 14.5199 15.4Z"
                    fill="white"
                  />
                </g>
              </svg>
            </v-btn>
          </div>

          <trading-vue
            :width="gWidth"
            :height="gHeight"
            :data="{ ohlcv: this.recordset }"
            :color-back="
              this.$vuetify.theme.dark
                ? $vuetify.theme.themes.dark.primaryBack
                : $vuetify.theme.themes.light.primaryBack
            "
            ref="tradingChart"
            @click.native="getCursorData()"
          ></trading-vue>
        </div>

        <v-tabs
          height="32"
          background-color="secondaryBack"
          slider-color="success"
          color="primaryColor"
        >
          <v-tab @click="() => this.setTimeFrame('1d')">1d</v-tab>
          <v-tab @click="() => this.setTimeFrame('5d')">5d</v-tab>
          <v-tab @click="() => this.setTimeFrame('1m')">1m</v-tab>
          <v-tab @click="() => this.setTimeFrame('3m')">3m</v-tab>
          <v-tab @click="() => this.setTimeFrame('6m')">6m</v-tab>
          <v-tab @click="() => this.setTimeFrame('1y')">1y</v-tab>
          <v-tab @click="() => this.setTimeFrame('5y')">5y</v-tab>
          <v-spacer></v-spacer>
          <div class="d-flex align-center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5">
                <path
                  d="M6 0C2.69166 0 0 2.69166 0 6C0 9.30834 2.69166 12 6 12C9.30834 12 12 9.30834 12 6C12 2.69166 9.30834 0 6 0ZM6 11.25C3.1051 11.25 0.750003 8.8949 0.750003 6C0.750003 3.1051 3.1051 0.750003 6 0.750003C8.8949 0.750003 11.25 3.1051 11.25 6C11.25 8.8949 8.8949 11.25 6 11.25Z"
                  fill="white"
                />
                <path
                  d="M6.375 2.25H5.625V6.15526L7.98486 8.51512L8.51513 7.98485L6.375 5.84472V2.25Z"
                  fill="white"
                />
              </g>
            </svg>
            <span class="chartClock mx-2">{{ timeNow }}</span>
          </div>
        </v-tabs>
      </v-tab-item>

      <!--       <v-tab-item active-class="testing" value="tab-depth" class="primaryBack">
        <div class="border-top-color" id="depth-chart" ref="depthContainer" :style="`min-height: ${gHeight +30}px;`">
          <vue-depth-chart :key="chartUpdate" :data="depthChart" :customizeOptions="depthChartOptions" :theme="depthChartTheme" />
        </div>
      </v-tab-item> -->
    </v-tabs>
    <v-overlay
      color="backgroundOverlay"
      opacity="0.9"
      :z-index="4"
      :value="overlay"
    >
      <div class="overlay" @click="overlay = false"></div>
    </v-overlay>
  </v-card>
</template>

<script>
import TradingVue from "trading-vue-js";
import { mapActions, mapGetters } from "vuex";
/* import tableChart from "./tableChart"; */
import moment from "moment";
const api = require("../../services/api");
const { formatNumber } = require("../../lib/utils");
/* import "vue-depth-chart"; */

export default {
  name: "MarketChart",
  components: {
    TradingVue
    /*     tableChart, */
  },
  props: ["symbol", "instruments", "timeframe", "compression", "pairData"],
  data: () => ({
    timeNow: "",
    timeZone: "",
    // ohlcv: [],
    // chart
    chartUpdate: 0,
    overlay: false,
    gWidth: 0,
    gHeight: 0,
    isFullscreen: false,
    originalHeight: 0,
    compressionArray: [
      "1",
      "3",
      "5",
      "15",
      "30",
      "45",
      "1h",
      "2h",
      "3h",
      "4h",
      "1d",
      "1w",
      "1m"
    ],
    // Instruments modal line charts
    recordset: [],
    tableChartOptions: {
      chart: {
        height: "auto",
        type: "line",
        stacked: false,
        sparkline: {
          enabled: true
        }
      },
      fill: {
        type: "gradient",
        colors: ["#00D46A"],
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.3,
          opacityTo: 0,
          stops: [0, 80, 100]
        }
      },
      colors: ["#00D46A"],
      stroke: {
        width: 2,
        curve: "smooth"
      },
      xaxis: {
        type: "datetime"
      },
      tooltip: {
        enabled: false,
        shared: false,
        x: {
          format: "dd MMM - HH:mm:ss"
        },
        y: {
          formatter: function(val) {
            return "$" + val.toFixed(2);
          }
        }
      }
    },
    // Depth chart variables
    depthChartOptions: {
      width: 700,
      height: 500,
      tipType: "axis",
      bgColor: "transparent",
      buyStrokeColor: "#00D46A",
      sellStrokeColor: "#E33C50",
      buyLinearGradientArray: [
        "rgba(0, 212, 106, 0.4)",
        "rgba(0, 212, 106, 0.3)",
        "rgba(0, 212, 106, 0.2)",
        "rgba(0, 212, 106, 0.1)",
        "rgba(0, 212, 106, 0.0)"
      ],
      sellLinearGradientArray: [
        "rgba(227, 60, 80, 0.4)",
        "rgba(227, 60, 80, 0.3)",
        "rgba(227, 60, 80, 0.2)",
        "rgba(227, 60, 80, 0.1)",
        "rgba(227, 60, 80, 0.3)"
      ]
    },
    depthChartTheme: "night",
    depthChart: {}
  }),

  methods: {
    ...mapActions(["SET_LIMIT_PRICE"]),
    ...mapGetters([
      "getInstrument",
      "getMarketPrice",
      "getIndexPrice",
      "getOhlcv"
    ]),

    getCursorData() {
      this.SET_LIMIT_PRICE(
        parseFloat(this.$refs.tradingChart.getCursor().y$.toFixed(2))
      );
    },

    onResize() {
      if (this.originalHeight === 0) {
        // ninja purpura appears
        this.originalHeight = this.$refs.chartContainer.clientHeight;
      }

      this.gWidth = this.$refs.chartContainer.clientWidth - 50;

      this.gHeight = !this.isFullscreen
        ? this.originalHeight + 4
        : this.$refs.cardChart.$el.clientHeight;

      this.depthChartOptions.width =
        this.$refs.depthContainer == undefined
          ? this.gWidth + 46
          : this.$refs.depthContainer.clientWidth - 1;
      this.depthChartOptions.height =
        this.$refs.depthContainer == undefined
          ? this.gHeight + 30
          : this.$refs.depthContainer.clientHeight - 1;
      this.chartUpdate++;
      this.$refs.tabsChart.callSlider();
    },
    getPercentChange() {
      if (this.getInstrument().percentChange != null) {
        return this.getInstrument().percentChange.toFixed(2);
      }
    },
    percentChangeUp(percent) {
      return Math.sign(percent) >= 0;
    },
    calculateMarkerPrice() {
      return this.getMarketPrice()
        ? formatNumber(this.getMarketPrice().price)
        : formatNumber(this.getIndexPrice());
    },

    setTimeFrame(value) {
      return this.$emit("updateTimeframe", value);
    },
    setCompression() {
      this.getChartData();
    },

    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
      setTimeout(this.onResize, 1000);
      return this.$emit("updateChartsize", this.isFullscreen);
    },
    getChartData() {
      api
        .getMarketGraph24hs(
          this.$store.state.tradePair.id,
          this.timeframe,
          this.compression
        )
        .then(res => {
          this.recordset = res.data.data;
          this.tableLoading = false;
        })
        .catch(console.log);
    },

    updateClock() {
      this.timeNow = moment().format("HH:mm:ss");
    }
  },

  computed: {
    depthChartData() {
      return this.$store.state.market.depthChartData;
    }
  },

  watch: {
    depthChartData(newValue) {
      this.depthChart = newValue;
    },
    recordset: function() {
      //console.log('watch recordset', newVal.length, oldVal.length)
      // console.log('watch Prop changed: ', newVal.length, ' | was: ', oldVal.length)
      // if (newVal.length !== oldVal.length) {}
      this.onResize();
    },
    pairData: function() {
      this.getChartData();
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("load", () => {
      this.onResize();
    });
    setInterval(this.updateClock, 100);
    this.getChartData();
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("load", this.onResize);
  }
};
</script>

<style scoped>
/* @import "~vue-depth-chart/dist/vue-depth-chart.css"; */
/* overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}

/* select min width */
.select-in-header {
  display: inline-block;
  width: min-content;
}

/* CARDS */
.card-title {
  padding-bottom: 6px;
  padding-top: 8px;
  margin: 0;
  line-height: 2em;
  display: flex;
  justify-content: space-between;
}

.card-title .main-title {
  color: var(--v-emdxBlue-base);
}

.custom-list-wrapper {
  display: flex;
  justify-content: space-between;
}

.divider {
  margin: 0 16px;
}

/* tabla */
.borderless td {
  border-bottom: 0 !important;
}

.larger-header th {
  height: 38px !important;
}

.table-input-text {
  max-width: 80px;
  top: 1px;
}

.v-select__selections input {
  display: none;
}

.v-data-table.v-data-table--fixed-header thead th {
  border-top: 1px solid hsla(0, 0%, 100%, 0.12);
  box-shadow: none;
  font-size: 14px;
  font-weight: normal;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover {
  background: var(--v-backgroundHeader-base) !important;
}

.border-top-color {
  border-top: 1px solid var(--v-borderColor-base);
}

.border-right-color {
  border-right: 1px solid var(--v-borderColor-base);
}

.background-header-dark {
  background-color: var(--v-backgroundHeader-base) !important;
}

.background-body-dark {
  background-color: var(--v-backgroundBody-base) !important;
}

.width-auto {
  width: auto !important;
}

.width-20 {
  width: 20%;
}
svg g path,
trading-vue-sidebar-0 {
  fill: var(--v-primaryColor-base) !important;
}
</style>

<style>
.v-select__selections input {
  width: 0;
}

.menu-search-input .v-input__append-inner {
  margin-top: 4px !important;
}
.marketSymbol {
  color: var(--v-primaryColor-base) !important;
  text-decoration: none;
  font-weight: 600;
}
.chartSymbol {
  font-size: 22px;
  letter-spacing: 0px;
  font-weight: bold;
}
.chartClock {
  margin-left: 5px;
  font-size: 14px;
}
.chartClockZone {
  margin-left: 5px;
  font-size: 14px;
  color: var(--v-secondaryColor-base);
}
.intrument-chart-price {
  text-align: right;
  margin-bottom: 0px !important;
  font-size: 12px;
  font-weight: bold;
}
.graph-instrument {
  font-size: 13px;
  color: var(--v-primaryColor-base);
}
.graph-instrument-sub {
  font-size: 11px;
  color: var(--v-secondaryColor-base);
}
.graph-tab {
  text-transform: capitalize;
  font-weight: 400;
  letter-spacing: 1px;
}
</style>
