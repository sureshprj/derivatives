<template>
  <v-app>
    <Navbar />
    <v-main>
      <!-- <router-view class="background"></router-view> -->
      <div>Content Section</div>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";

export default {
  name: "App",

  components: {
    Navbar
  },

  data: () => ({
    //
  })
};
</script>