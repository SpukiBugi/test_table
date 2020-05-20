/**
* Таблица
*/
<template>
  <div>
    <div class="table-header">
      <div class="table-cell cell-check">
        <div class="check-square" v-html="$options.Svg.check"></div>
      </div>
      <div class="table-cell cell-name">Product (100g serving)</div>
      <div class="table-cell">Calories</div>
      <div class="table-cell">Fat (g)</div>
      <div class="table-cell">Carbs (g)</div>
      <div class="table-cell">Protein (g) </div>
      <div class="table-cell">Iron (%)</div>
      <div class="table-cell cell-delete"></div>
    </div>

    <div class="table-body">
      <div
        v-for="product in table_data" 
        :key="product.id"
        class="table-row"
      >
        <div class="table-cell cell-check">
          <div class="check-square" v-html="$options.Svg.check"></div>
        </div>
        <div class="table-cell cell-name">{{product.product}}</div>
        <div class="table-cell">{{product.calories}}</div>
        <div class="table-cell">{{product.fat}}</div>
        <div class="table-cell">{{product.carbs}}</div>
        <div class="table-cell">{{product.protein}}</div>
        <div class="table-cell">{{product.iron}}</div>
        <div class="table-cell cell-delete">
          <div class="delete-svg" v-html="$options.Svg.bin"></div>
          <p>delete</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Svg from "@/assets/js/svg.js";

export default {
  name: "Table",

  Svg,

  data() {
    return {
      table_data: [],
    }
  },
  
  computed: {
    ...mapState({
      products: (state) => state.products,
      page: (state) => state.page,
      per_page: (state) => state.per_page,
      sort_by: (state) => state.sort_by,
    }),
  },

  created() {
    this.prepareData();
  },

  methods: {
    /** Подготовка данных таблицы */
    prepareData() {
      const products = JSON.parse(JSON.stringify(this.products));
      let sort_products;

      if (typeof(products[0][this.sort_by]) === "string") {
        sort_products = products.sort();
      } else {
        sort_products = products.sort((a, b) => a[this.sort_by] - b[this.sort_by]);
      }

      // this.table_data = sort_products.slice(0, this.per_page - 1);
      this.table_data = sort_products.slice((this.page - 1) * this.per_page, Math.min(this.page * this.per_page - 1, this.products.length - 1));
    },
  }
}
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  align-items: center;
  height: 57px;
  border-bottom: 1px solid #EDEDED;
}

.table-row {
  display: flex;
  align-items: center;
  height: 49px;
  transition: all .3s ease;

  &:nth-child(2n) {
    background-color: $CLR_GRAY_BACK;
  }

  &:hover {
    background-color: $CLR_SECONDARY;

    .cell-delete {
      opacity: 1;
    }
  }
}

.table-cell {
  display: flex;
  align-items: center;
  width: 13.6%;
  height: 100%;
  overflow: hidden;

  &.cell-name {
    width: 16.8%;
    padding-right: 15px;
  }

  &.cell-check {
    width: 7%;
    justify-content: center;
    padding-right: 8px;
  }

  &.cell-delete {
    display: flex;
    align-items: center;
    width: auto;
    min-width: 80px;
    flex-grow: 1;
    opacity: 0;
    color: $CLR_GRAY;
    transition: all .3s ease;
  }
}

.delete-svg {
  display: flex;
  margin-right: 5px;
}

.check-square {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  border: 1px #C6CBD4 solid;
}
</style>
