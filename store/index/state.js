export default () => ({
  products: [],

  /** Нынешняя страница */
  page: 1,
  /** Количество продуктов на странице */
  per_page: 10,
  /** Колонка сортировки */
  sort_by: "product",
  /** Направление сортировки, false - по убыванию, true - по возрастанию */
  sort_direction: false,
  /** Массив id выбранных продуктов */
  selected_products: [],

  show_columns: [
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
});
