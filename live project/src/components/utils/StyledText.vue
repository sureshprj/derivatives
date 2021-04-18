<template>
  <span>
    <span :class="firstClass">{{ text.substring(0, breakIndex) }}</span
    ><span :class="lastClass">{{
      text.substring(breakIndex, text.length)
    }}</span>
  </span>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    breakIndex: {
      type: Number,
      default: 3
    },
    firstClass: {
      type: String,
      default: "text--primary key"
    },
    lastClass: {
      type: String,
      default: "text--secondary key"
    }
  },
  computed: {
    integerPart() {
      const splitted = this.number.toString().split(".");

      return splitted.length > 1 ? splitted[0] : this.number;
    },
    decimalPart() {
      const splitted = this.number.toString().split(".");

      return splitted.length > 1 ? `.${splitted[1]}` : ".00";
    }
  }
};
</script>

<style scoped>
.key {
  font-weight: 600;
}
</style>
