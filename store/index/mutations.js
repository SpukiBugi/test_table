export default {
  loadProducts: (state, products) => {
    state.products = products;
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

  addSelectProduct: (state, id) => {
    state.selected_products.push(id);
  },

  removeSelectProduct: (state, id) => {
    let remove_index;
    state.selected_products.find((element, key) => {
      if (element === id) {
        remove_index = key;
        return true;
      }
      return false;
    });

    state.selected_products.splice(remove_index, 1);
  },

  deleteStoreProduct: (state, ids) => {
    ids.forEach(id => {
      state.products.find((element, key) => {
        if (element.id === id) {
          state.products.splice(key, 1);
          return true;
        }
        return false;
      });
    });
  },
};
