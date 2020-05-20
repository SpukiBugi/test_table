<template>
  <div
    class="tooltip"
    :class="tool_position"
    :style="style_target"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "Tooltip",

  props: {
    /** Расстояние между тултипом и блоком */
    tool_gap: {
      type: Number,
      default: 0,
    }
  },

  data() {
    return {
      target: null,

      tool_position: "above",

      style: {
        target: {
          top: '',
        },
      }
    };
  },

  computed: {
    style_target() {
      let obj = {
        top: this.style.target.top,
      };

      return obj;
    },
  },

  mounted() {
    this.changePosition();
    
    window.addEventListener("resize", this.changePosition);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.changePosition);
  },

  methods: {
    getTarget() {
      return this.$el.getBoundingClientRect();
    },

    getParent() {
      return this.$el.parentElement.getBoundingClientRect();
    },

    getViewbox() {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    },

    changePosition() {
      const target = this.getTarget();
      const parent = this.getParent();
      const view = this.getViewbox();

      if (target.height < view.height - parent.bottom) {
        /** Выставляем тултип снизу */
        this.style.target.top = parent.height + this.tool_gap + "px";
        this.tool_position = 'below';
      } else {
        /** Выставляем тултип сверху */
        this.style.target.top = -(target.height + this.tool_gap)  + "px";
        this.tool_position = 'above';
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.tooltip {
  position: absolute;
  z-index: 5;
}

</style>