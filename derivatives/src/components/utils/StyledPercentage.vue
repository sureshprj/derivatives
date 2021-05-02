<template>
  <b
    v-if="number != null"
    class="ml-1"
    :class="{ 'success--text': up, 'error--text': !up }"
  >
    {{ number.toFixed(2) }}%
    <v-icon size="18" class="success--text top-2" v-if="up"
      >mdi-arrow-up</v-icon
    >
    <v-icon size="18" class="error--text top-2" v-else>mdi-arrow-down</v-icon>
  </b>
</template>

<script>
export default {
  props: ["number", "up"]
};
</script>

<style scoped>
.top-2 {
  position: relative;
  top: -2px;
}
</style>
