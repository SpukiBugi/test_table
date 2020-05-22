/**
* Таблица
*/
<template>
  <div>
    <div class="table-header">
      <div class="table-cell cell-check">
        <div 
          class="common-check" 
          :class="{'active': select_all}"
          v-html="$options.Svg.check"
          @click="selectAll"
        ></div>
      </div>

      <div
        v-for="column in show_columns"
        :key="column.title"
        class="table-cell"
        :class="{'cell-name': column.title === 'Product (100g serving)', 'cell-first': column.field === sort_by}"
        @click="addClickEv(column.field)"
      >
        {{column.title}}
        <span 
          class="sort-arrow"
          :class="{'down': !sort_direction}"
          v-html="$options.Svg.arrow"
        ></span>
      </div>

      <div class="table-cell cell-delete"></div>
    </div>

    <div class="table-body">
      <div
        v-for="product in table_data" 
        :key="product.id"
        class="table-row"
      >
        <div class="table-cell cell-check">
          <div 
            class="common-check"
            :class="{'active': selected_ids[product.id] || select_all}"
            v-html="$options.Svg.check"
            @click="selectProduct($event, product.id)"
          ></div>
        </div>

        <div
          v-for="column in show_columns"
          :key="column.title"
          class="table-cell"
          :class="{'cell-name': column.title === 'Product (100g serving)', 'cell-first': column.field === sort_by}"
        >
          {{product[column.field]}}
        </div>

        <div class="table-cell cell-delete">
          <button class="delete-button" @click="callTool">
            <div class="delete-svg" v-html="$options.Svg.bin"></div>
            <p>delete</p>
          </button>
          
          <Tooltip>
            <div class="tool-box">
              <p>Are you sure you want to <b>delete item</b>?</p>
              <div class="tool-buttons">
                <button
                  class="tool-button tool-cancel"
                >Cancel</button>
                <button 
                  class="tool-button"
                  @click="confirmDelete(product.id)"
                >Confirm</button>
              </div>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Tooltip from "@/components/Tooltip";

import Svg from "@/assets/js/svg.js";

export default {
  name: "Table",

  components: {
    Tooltip,
  },

  Svg,

  data() {
    return {
      table_data: [],
      /** Массив, где индексы равны выбранным id и содержащим в себе логическое значение выбранны ли они */
      selected_ids: [],
      /** Флаг выбора всех продутов */
      select_all: false,
    }
  },
  
  computed: {
    ...mapState({
      products: (state) => state.products,
      page: (state) => state.page,
      per_page: (state) => state.per_page,
      sort_by: (state) => state.sort_by,
      sort_direction: (state) => state.sort_direction,
      show_columns: (state) => state.show_columns,
      selected_products: (state) => state.selected_products,
    }),
  },

  created() {
    this.prepareData();
  },

  mounted() {
    this.clearSelected();
  },

  methods: {
    ...mapMutations([
      "mutateDirection",
      "addSelectProduct",
      "removeSelectProduct",
      "clearSelected",
      "mutatePage",
    ]),

    /** Подготовка данных таблицы */
    prepareData() {
      const products = JSON.parse(JSON.stringify(this.products));
      let sort_products;

      if (typeof(products[0][this.sort_by]) === "string") {
        sort_products = products.sort((a, b) => a[this.sort_by] > b[this.sort_by]);
      } else {
        sort_products = products.sort((a, b) => a[this.sort_by] - b[this.sort_by]);
      }

      if (this.sort_direction) {
        sort_products = sort_products.reverse();
      }

      this.table_data = sort_products.slice((this.page - 1) * this.per_page, Math.min(this.page * this.per_page, this.products.length));
    },

    /** Обработка ивента на клик у поля сортировки */
    addClickEv(field) {
      if (field === this.sort_by) {
        this.changeDirection();
      }
    },

    /** Смена направления сортировки */
    changeDirection() {
      this.mutateDirection();
      this.mutatePage(1);
    },

    /** Выбор продукта */
    selectProduct(event, id) {
      event.currentTarget.classList.toggle("active");
      
      if (this.selected_ids[id] !== undefined) {
        this.selected_ids[id] = !this.selected_ids[id];
      } else {
        this.selected_ids[id] = true;
      }

      if (this.selected_ids[id]) {
        this.addSelectProduct(id);
      } else {
        this.removeSelectProduct(id);
      }
    },

    /** Выбор всех продуктов на странице */
    selectAll() {
      this.select_all = !this.select_all;

      if (this.select_all) {
        this.table_data.forEach(element => {
          if (!this.selected_ids[element.id]) {
            this.selected_ids[element.id] = true;
            this.addSelectProduct(element.id);
          }
        });
      } else {
        this.table_data.forEach(element => {
          this.selected_ids[element.id] = false;
          this.removeSelectProduct(element.id);
        });
      }
    },

    callTool(e) {
      const cell_delete = e.currentTarget.parentElement;
      if (cell_delete.classList.contains("tool-open")) {
        return;
      }

      cell_delete.classList.add("tool-open");

      const tooltip = cell_delete.querySelector(".tooltip");

      /** Функция удаления тултипа по нажатию вне тултипа или по кнопке отмены в тултипе */
      let removeTool = (event) => {
        if (
          !tooltip.contains(event.target) 
          && !tooltip !== event.target 
          || event.target.classList.contains("tool-cancel")
        ) {
          cell_delete.classList.remove("tool-open");
          window.removeEventListener("click", removeTool);
        }
      }

      setTimeout(() => {
        window.addEventListener("click", removeTool);
      }, 100);
    },
    
    /** Подтверждение удаления продукта */
    confirmDelete(id) {
      this.$emit("delete_prod", id);
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
  font-weight: 600;

  .cell-first {
    color: $CLR_PRIMARY;
    cursor: pointer;

    .sort-arrow {
      display: inline;
    }
  }
}

.sort-arrow {
  display: none;
  transition: all .3s ease;
  margin-left: 9px;

  &.down {
    transform: rotate(180deg);
  }
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

    .cell-name {
      font-weight: 600;
    }

    .delete-button {
      opacity: 1;
    }
  }
}

.table-cell {
  display: flex;
  align-items: center;
  width: 13.6%;
  height: 100%;
  order: 3;

  &.cell-name {
    width: 16.8%;
    padding-right: 15px;
    overflow: hidden;
  }

  &.cell-check {
    width: 7%;
    justify-content: center;
    padding-right: 8px;
    order: 1;
  }

  &.cell-delete {
    display: flex;
    align-items: center;
    width: auto;
    min-width: 80px;
    margin-left: auto;
    color: $CLR_GRAY;
  }

  &.cell-first {
    order: 2;
  }
}

.cell-delete {
  position: relative;

  &.tool-open {
    .delete-button {
      opacity: 1;
    }

    .tooltip {
      opacity: 1;
      pointer-events: all;
    }
  }
}

.delete-button {
  display: flex;
  align-items: center;
  opacity: 0;
  transition: all .3s ease;
  z-index: 1;
}

.delete-svg {
  display: flex;
  margin-right: 5px;
}

.tooltip {
  right: -47px;
  opacity: 0;
  pointer-events: none;
}
</style>
