import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    dark: true,
    themes: {
      dark: {
        background: "#050E18",

        primary: "#1262FF",
        secondary: "#111a24",
        error: "#FF576B",
        success: "#00D46A",

        // Custom Remake
        primaryBack: "#121A24",
        secondaryBack: "#0E151D",
        lightBack: "#162230",
        fieldBack: "#0A0F14",

        dialogBackDark: "#1D202C",
        dialogBackLight: "#242837",

        primaryColor: "#ffffff",
        secondaryColor: "#888C91",
        lightColor: "#293039"
      },
      light: {
        background: "#ECEFF0",

        primary: "#1262FF",
        error: "#EF5C6D",
        success: "#49BF78",

        // Custom Remake
        primaryBack: "#ffffff",
        secondaryBack: "#F5F5F5",
        lightBack: "#F5F5F5",

        primaryColor: "#050E18",
        secondaryColor: "#82878C",
        lightColor: "#293039"
      }
    }
  }
});
