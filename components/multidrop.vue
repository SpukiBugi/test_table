/**
 * Дропдаун с несколькими опциями
 */
<template>
  <div ref="dropdown" class="drop">
    <div
      class="drop-opener angle-rotate"
      :class="{active: drop_open}"
      @click="drop_open = !drop_open"
     >
      <p class="opener-text">{{ selected_options }} columns selected</p>
      <div class="drop-angle" v-html="$options.Svg.common_angle"></div>
    </div>

    <div class="drop-options" :class="{'visible': drop_open}" ss-container>
      <div class="drop-option" @click="optionClick('all')">
        <div class="common-check" :class="{'active': select_all}" v-html="$options.Svg.check"></div>
        Select all
      </div>

      <div
        v-for="(option, key) in options"
        :key="option.title"
        class="drop-option"
        @click="optionClick(key)"
      >
        <div class="common-check" :class="{'active': active_option_keys[key]}" v-html="$options.Svg.check"></div>
        {{ option.title }}
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/simple-scrollbar.scss';
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
      /** Массив логических значений, совпадающих с ключами опций дропдауна. 
       * Нужны для отбора выбранных опций в том же порядке в котором они были присланы */
      active_option_keys: this.options.map(el => true),
      /** Количество выбранных опций с вычетом опции для выбора всех */
      selected_options: this.options.length,
      /** Флаг выбора всех опций */
      select_all: true,
    };
  },

  watch: {
    /** Применяем изменения по закрытию дропдауна */
    drop_open(value) {
      if (!value) {
        let ordered_array = [];

        this.options.forEach((element, key) => {
          if (this.active_option_keys[key]) {
            ordered_array.push(element);
          } 
        });

        this.$emit('drop_change', ordered_array);
      }
    }
  },

  mounted() {
    /** Закрытие выпадающего меню по клику вне */
    document.addEventListener("click", this.closeDrop);
  },

  beforeDestroy() {
    document.removeEventListener("click", this.closeDrop);
  },

  methods: {
    /** Обработка клика опции */
    optionClick(drop_key) {
      /** Обработка нажатия опции для выбора всех колонок */
      if (drop_key === "all") {
        if (this.select_all) {
          this.select_all = false;
          this.active_option_keys = this.active_option_keys.map(el => false);
          this.selected_options = 0;
        } else {
          this.select_all = true;
          this.active_option_keys = this.active_option_keys.map(el => true);
          this.selected_options = this.options.length;
        }
        return;
      }

      this.active_option_keys[drop_key] = !this.active_option_keys[drop_key];

      if (this.active_option_keys[drop_key]) {
        this.selected_options++;
      } else {
        this.selected_options--;
      }
    },

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
  padding: 3px 13px 3px 20px;
  width: 160px;
  border: 1px solid #D5DAE0;
  border-radius: $BRDR_RAD;
  color: $CLR_GRAY;
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
  margin-left: 6px;
  flex-shrink: 0;

  /deep/ svg {
    width: 8px;
    fill: $CLR_GRAY;
  }
}

.drop-options {
  position: absolute;
  top: 46px;
  left: 0;
  padding: 16px 0;
  width: 207px;
  height: 243px;
  border: 1px solid #D3D6DE;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px rgba(34, 36, 43, 0.15);
  border-radius: 0px 0px 3px 3px;
  background-color: white;
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s ease;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }

  .drop-option {
    display: flex;
    align-items: center;
    padding: 6px 15px;
    cursor: pointer;
    transition: all .3s ease;
    white-space: nowrap;

    &:first-child {
      padding-top: 0;
      color: $CLR_DARK;
    }

    .common-check {
      margin-right: 13px;
    }
  }
}
</style>
