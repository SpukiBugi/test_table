<template>
  <main class="content-wrapper">
    <h2 class="main-title">Table UI</h2>

    <div class="control-panel">
      <div class="sort-by">
        <h3 class="panel-title">Sorting by:</h3>
        <button
          v-for="button in $options.sort_buttons"
          :key="button"
          class="sort-button"
          :class="{'active': button === active_sort}"
          @click="changeSort(button)"
        >
          {{button}}
        </button>
      </div>

      <button class="control-delete">Delete</button>

      <Dropdown :options="$options.perpage_options" />

      <div class="control-page">
        <button class="page-switch" v-html="$options.Svg.common_angle"></button>
        <div>{{`${(page - 1) * per_page + 1} - ${Math.min(page * per_page, products.length)}`}} of {{products.length}}</div>
        <button class="page-switch forward" v-html="$options.Svg.common_angle"></button>
      </div>

      <Dropdown :options="$options.columns_options" />
    </div>

    <Table v-if="loaded" />

    <Dialog v-if="error">
      <div class="error-box">
        <p class="error-message">Произошла ошибка</p>
        <button 
          class="error-button"
          @click="reloadPage"
        >Попробовать снова</button>
      </div>
    </Dialog>
  </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import Dropdown from "@/components/dropdown";
import Multidrop from "@/components/multidrop";
import Dialog from "@/components/dialog";
import Table from "@/components/table";

import { getProducts, deleteProducts } from  "@/assets/api/request.js";

import Svg from "@/assets/js/svg.js";

export default {
  components: {
    Dropdown,
    Multidrop,
    Table,
    Dialog
  },

  Svg,

  sort_buttons: ["Product (100g serving)", "Calories", "Fat (g)", "Carbs (g)", "Protein (g)", "Iron (%)"],

  perpage_options: ["10 Per Page", "15 Per Page", "20 Per Page"],

  columns_options: ["Select all", "Product (100g serving)", "Calories", "Fat (g)", "Carbs (g)", "Protein (g)", "Iron (%)"],

  data() {
    return {
      /** Флаг загрузки данных для таблицы */
      loaded: false,
      error: false,
      
      active_sort: "Product (100g serving)",
    }
  },
  
  computed: {
    ...mapState({
      products: (state) => state.products,
      page: (state) => state.page,
      per_page: (state) => state.per_page,
    }),
  },

  created() {
    this.getProductData();
  },

  methods: {
    ...mapMutations([
      'loadProducts',
    ]),

    reloadPage() {
      window.location.reload();
    },

    /** Запрос данных о продуктах */
    async getProductData() {
      let products;

      await getProducts()
      .then(response => {
        this.loadProducts(response);
        this.loaded = true;
      })
      .catch(error => {
        this.error = true;
      })
    },

    changeSort(sort) {
      this.active_sort = sort;
    },
  }
}
</script>

<style lang="scss" scoped>
.content-wrapper {
  max-width: 1140px;
  width: 100%;
}

.main-title {
  padding-bottom: 16px;
  margin-bottom: 17px;
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  color: #282136;
  border-bottom: 1px solid #EDEDED;
}

.control-panel {
  display: flex;
  align-items: center;
  color: $CLR_DARK_2;

  > * :not(:last-child) {
    margin-right: 8px;
  }
}

.sort-by {
  display: flex;
  align-items: center;
  margin-right: auto;
}

.sort-button {
  padding: 3px 8px 5px;

  &.active {
    background-color: $CLR_PRIMARY;
    color: white;
  }
}

.control-delete {
  padding: 3px 16px 5px;
  margin-right: 12px;
}

.control-page {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

/deep/.page-switch {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid #D5DAE0;
  border-radius: $BRDR_RAD;

  svg {
    width: 8px;
    height: 5px;
    fill: $CLR_GRAY;
    transform: rotate(90deg);
  }

  &.forward {
    svg {
      transform: rotate(-90deg);
    }
  }
}
</style>