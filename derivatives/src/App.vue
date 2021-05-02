<template>
  <v-app>
    <Navbar />
    <ContentBar />
    <v-main>
      <router-view class="background"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";
import ContentBar from "./components/ContentBar";

export default {
  name: "App",

  components: {
    Navbar,
    ContentBar,
  },

  data: () => ({
    //
  }),
};
</script>