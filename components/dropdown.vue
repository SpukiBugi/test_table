/**
 * Дропдаун
 */
<template>
  <div ref="dropdown" class="drop">
    <div
      class="drop-opener angle-rotate"
      :class="{active: drop_open}"
      @click="drop_open = !drop_open"
     >
      <p class="opener-text">{{ active_option }}</p>
      <div class="drop-angle" v-html="$options.Svg.common_angle"></div>
    </div>
    <transition name="fade">
      <div v-show="drop_open" class="drop-options">
        <div
          v-for="option in options"
          :key="option"
          class="drop-option"
          @click="active_option = option, drop_open = false, $emit('drop_change')"
        >
          {{ option }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Svg from '@/assets/js/svg.js';

export default {
  name: 'Dropdown',

  Svg,

  props: {
    options: Array,
  },

  data() {
    return {
      drop_open: false,
      active_option: this.options[0],
    };
  },

  mounted() {
    /** Закрытие выпадающего меню по клику вне */
    document.addEventListener("click", this.closeDrop);
  },

  beforeDestroy() {
    document.removeEventListener("click", this.closeDrop);
  },

  methods: {
    closeDrop(e) {
      let dropdown = this.$refs.dropdown;
      if (!dropdown) {
        return;
      }
      if ((dropdown !== e.target) && !dropdown.contains(e.target)) {
        this.drop_open = false;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.drop {
  position: relative;
  // width: 191px;
  height: 32px;
  padding: 6px 13px 7px 10px;
  border-radius: 3px;
  color: #22242B;
  background-color: white;
  z-index: 2;
  cursor: pointer;
}

.drop-opener {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.opener-text {
  overflow: hidden;
  white-space: nowrap;
}

.drop-angle {
  display: flex;
  margin-left: 21px;
  flex-shrink: 0;

  /deep/ svg {
    width: 10px;
  }
}

.drop-options {
  position: absolute;
  top: 43px;
  right: 0;
  padding: 15px 0;
  width: 300px;
  border: 1px solid #D3D6DE;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px rgba(34, 36, 43, 0.15);
  border-radius: 0px 0px 3px 3px;
  background-color: white;

  .drop-option {
    padding: 7px 15px;
    cursor: pointer;
    transition: all .3s ease;
    white-space: nowrap;

    &:hover {
      background-color: #EFF1F5;
    }
  }
}
</style>
