<template>
  <div class="page-wrapper">
    <main class="content-wrapper">
      <h2 class="main-title">Table UI</h2>

      <div class="control-panel">
        <div class="sort-by">
          <h3 class="panel-title">Sorting by:</h3>
          <button
            v-for="button in show_columns"
            :key="button.title"
            class="sort-button"
            :class="{'active': button.title === active_sort}"
            @click="changeSort(button)"
          >
            {{button.title}}
          </button>
        </div>

        <div class="delete-wrap">
          <button
            class="control-delete"
            :class="{'active': selected_products.length}"
            @click="callSelectedTool()"
          >
            Delete
            <span class="delete-length">({{selected_products.length}})</span>
          </button>
            
          <Tooltip v-show="tool_select" ref="tool_sel">
            <div class="tool-box">
              <p>Are you sure you want to <b>delete items</b>?</p>
              <div class="tool-buttons">
                <button
                  class="tool-button tool-cancel"
                >Cancel</button>
                <button 
                  class="tool-button"
                  @click="deleteSelected(); tool_select = false"
                >Confirm</button>
              </div>
            </div>
          </Tooltip>
        </div>

        <Dropdown 
          :options="$options.perpage_options" 
          @drop_change="changePerpage"
        />

        <div class="control-page">
          <button class="page-switch" v-html="$options.Svg.common_angle" @click="switchPage(-1)"></button>
          <h3>{{`${(page - 1) * per_page + 1} - ${Math.min(page * per_page, products.length)}`}} <span class="page-span">of</span> {{products.length}}</h3>
          <button class="page-switch forward" v-html="$options.Svg.common_angle" @click="switchPage(1)"></button>
        </div>

        <Multidrop 
          :options="$options.all_columns" 
          @drop_change="changeColumns" 
        />
      </div>

      <Table v-if="loaded" @delete_prod="deleteOne" :key="page + per_page + products.length" />
    </main>

    <Dialog v-if="error">
      <div class="error-box">
        <p class="error-message">Произошла ошибка</p>
        <button 
          class="error-button"
          @click="tryAgain"
        >Попробовать снова</button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import Dropdown from "@/components/dropdown";
import Multidrop from "@/components/multidrop";
import Dialog from "@/components/dialog";
import Table from "@/components/table";
import Tooltip from "@/components/Tooltip";

import { getProducts, deleteProducts } from  "@/assets/api/request.js";

import Svg from "@/assets/js/svg.js";

export default {
  head () {
    return {
      script: [
        { src: 'simple-scrollbar.js' }
      ],
    }
  },

  components: {
    Dropdown,
    Multidrop,
    Table,
    Dialog,
    Tooltip
  },

  Svg,

  perpage_options: ["10 Per Page", "15 Per Page", "20 Per Page"],

  all_columns: [
    {
      title: "Product (100g serving)",
      field: "product"
    },
    {
      title: "Calories",
      field: "calories"
    },
    {
      title: "Fat (g)",
      field: "fat"
    },
    {
      title: "Carbs (g)",
      field: "carbs"
    },
    {
      title: "Protein (g)",
      field: "protein"
    },
    {
      title: "Iron (%)",
      field: "iron"
    },
  ],

  data() {
    return {
      /** Флаг загрузки данных для таблицы */
      loaded: false,
      error: false,
      /** Функция обработки ошибки */
      err_callback: null,
      /** Вызов окна подтверждения удаления выделенных продуктов */
      tool_select: false,
      
      /** Колонка сортировки */
      active_sort: "Product (100g serving)",
    }
  },
  
  computed: {
    ...mapState({
      products: (state) => state.products,
      page: (state) => state.page,
      per_page: (state) => state.per_page,
      show_columns: (state) => state.show_columns,
      selected_products: (state) => state.selected_products,
    }),
  },

  created() {
    this.getProductData();
  },

  mounted() {
    /** Закрытие выпадающего меню по клику вне */
    document.addEventListener("click", this.closeTool);
  },

  beforeDestroy() {
    document.removeEventListener("click", this.closeTool);
  },

  methods: {
    ...mapMutations([
      "loadProducts",
      "switchPage",
      "mutatePerPage",
      "mutateSortBy",
      "mutateColumns",
      "clearSelected",
      "deleteStoreProduct",
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
        this.error = "getting_data";
        this.err_callback = this.reloadPage;
      })
    },

    changeSort(sort) {
      this.active_sort = sort.title;
      this.mutateSortBy(sort.field);
    },

    changePerpage(option) {
      this.mutatePerPage(parseInt(option, 10));
    },

    changeColumns(columns) {
      this.mutateColumns(columns);
    },

    callSelectedTool() {
      this.tool_select = true;

      const tooltip = this.$refs.tool_sel.$el;

      let removeSelTool = (event) => {
        if (
          !tooltip.contains(event.target) 
          && !tooltip !== event.target 
          || event.target.classList.contains("tool-cancel")
        ) {
          this.tool_select = false;
          window.removeEventListener("click", removeSelTool);
        }
      }

      setTimeout(() => {
        window.addEventListener("click", removeSelTool);
      }, 100);
    },

    tryAgain() {
      this.err_callback(); 
      this.error = false;
    },

    /** Удаление продуктов одного продукта*/
    async deleteOne(id) {

      await deleteProducts()
      .then(response => {
        this.error = false;
        this.deleteStoreProduct(id);
      })
      .catch(error => {
        this.error = "deleting_data";
        this.err_callback = () => {this.deleteOne(id)};
      })
    },

    /** Удаление выделенных продуктов */
    async deleteSelected() {
      const delete_ids = JSON.parse(JSON.stringify(this.selected_products));

      await deleteProducts()
      .then(response => {
        this.error = false;
        this.deleteStoreProduct(delete_ids);
        this.clearSelected();
      })
      .catch(error => {
        this.error = "deleting_data";
        this.err_callback = this.deleteSelected;
      })
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
  margin-bottom: 15px;
  color: $CLR_DARK_2;
}

.panel-title {
  padding-bottom: 2px;
}

.sort-by {
  display: flex;
  align-items: center;
  margin-right: auto;

  > :first-child {
    margin-right: 8px;
  }
}

.sort-button {
  padding: 3px 5px 5px 8px;
  transition: all .3s ease;
  color: $CLR_DARK_2;

  &.active {
    background-color: $CLR_PRIMARY;
    color: white;
  }
}

.delete-wrap {
  position: relative;
}

.control-delete {
  padding: 3px 16px 5px;
  margin-right: 12px;
  border: 1px solid #C6CBD4;
  opacity: 0.3;
  pointer-events: none;

  &.active {
    background-color: $CLR_PRIMARY;
    color: white;
    opacity: 1;
    pointer-events: all;

    .delete-length {
      display: inline;
    }
  }
}

.delete-length {
  display: none;
}

.control-page {
  display: flex;
  align-items: center;
  margin: 0 16px;

  > *:not(:last-child) {
    margin-right: 8px;
  }
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

.page-span {
  font-weight: normal;
}


.error-button {
  margin-top: 8px;
  padding: 3px 16px 5px;
  border: 1px solid #D5DAE0;
  border-radius: $BRDR_RAD;
  background-color: $CLR_PRIMARY;
  color: white;
}
</style>