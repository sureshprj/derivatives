<template>
  <div class="content-bar-layout">
    <v-sheet elevation="6" max-width="100%">
      <v-tabs
        background-color="black"
        dark
        next-icon="right-icon"
        prev-icon="left-icon"
        show-arrows
      >
        <v-tabs-slider color="#00D46A"></v-tabs-slider>
        <v-tab
          v-for="i in 30"
          :key="i"
          :href="'#tab-' + i"
          active-class="active"
        >
          <div class="content">
            ETH<span>USDT_PERP</span>
            <span>
              <img src="../assets/navbar/contentbar/arrow-down.svg" />
            </span>
          </div>
        </v-tab>
      </v-tabs>
    </v-sheet>
  </div>
</template>

<style scoped>
.content-bar-layout {
  position: relative;
  top: 70px;
  font-size: 14px;
}

.content-bar-layout .left-icon {
  content: "<";
  color: #fff;
}

.content-bar-layout .right-icon {
  content: ">";
  color: #fff;
}

.content-bar-layout .content {
  color: #fff;
}
.content-bar-layout .content span {
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.content-bar-layout .content span > img {
  position: relative;
  bottom: 2px;
  margin-left: 5px;
}

.content-bar-layout .active {
  background: rgba(0, 212, 106, 0.15);
}
</style>