<template>
  <div
    class="core-progress-bar absolute"
    :class="{
      right: !left,
      left: left,
      negative: !positive,
      positive: positive
    }"
    :style="{
      width: `${computedWidth}%`
    }"
  ></div>
</template>

<script>
export default {
  props: {
    positive: {
      type: Boolean,
      default: false
    },

    left: {
      type: Boolean,
      default: false
    },

    width: {
      type: Number,
      required: 0
    },

    size: {
      type: Number
    }
  },

  computed: {
    computedWidth: function() {
      return (this.width * 100) / this.size;
    }
  }
};
</script>

<style scoped>
.core-progress-bar {
  position: absolute;
  height: 96%;
  top: 2%;
  transition: 0.3s;
  width: 0;
}

.core-progress-bar.right {
  right: 0;
}

.core-progress-bar.left {
  left: 0;
}

.core-progress-bar.positive {
  background: linear-gradient(88.97deg, #2e7d3218 0.09%, #2e7d3244 107.32%);
}

.core-progress-bar.negative {
  background: linear-gradient(88.97deg, #c6282833 0.09%, #c6282818 80.32%);
}
</style>
