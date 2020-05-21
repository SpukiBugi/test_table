export default {
  loadProducts: (state, products) => {
    state.products = products;
  },

  switchPage: (state, direction) => {
    const total_pages = Math.ceil(state.products.length / state.per_page); 
    state.page = Math.min(Math.max(state.page + direction, 1), total_pages);
  },

  mutatePage: (state, page) => {
    state.page = page;
  },

  mutatePerPage: (state, per_page) => {
    state.per_page = per_page;
  },

  mutateSortBy: (state, sort_by) => {
    state.sort_by = sort_by;
  },

  mutateColumns: (state, columns) => {
    state.show_columns = columns;
  },

  /** Изменение направления сортировки */
  mutateDirection: (state) => {
    state.sort_direction = !state.sort_direction;
  },

  /** Добавление выбора продукта */
  addSelectProduct: (state, id) => {
    state.selected_products.push(id);
  },

  /** Снятие выбора продукта */
  removeSelectProduct: (state, id) => {
    let remove_index;
    state.selected_products.find((element, key) => {
      if (element === id) {
        remove_index = key;
      }
      return element === id;
    });

    state.selected_products.splice(remove_index, 1);
  },

  /** Очистка выделенных продуктов */
  clearSelected(state) {
    state.selected_products = [];
  },

  deleteStoreProduct: (state, ids) => {
    switch (typeof ids) {
      case "object": {
        ids.forEach(id => {
          state.products.find((element, key) => {
            if (element.id === id) {
              state.products.splice(key, 1);
            }
            return element.id === id;
          });
        });
        break
      }

      case "number": {
        state.products.find((element, key) => {
          if (element.id === ids) {
            state.products.splice(key, 1);
          }
          return element.id === ids;
        });
      }
    }
  },
};
