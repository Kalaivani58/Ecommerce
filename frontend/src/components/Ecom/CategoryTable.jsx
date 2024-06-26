import React from 'react';

const CategoryTable = ({ categories, handleCategorySelect }) => (
  <table className="table" id="CategoryTable">
    <thead>
      <tr>
        <th>Category ID</th>
        <th>Category Name</th>
        <th>Total Products</th>
        <th>Updated Date</th>
      </tr>
    </thead>
    <tbody id="categoryTableBody">
      {categories.map((category) => (
        <tr key={category.category_id}>
          <td>{category.category_id}</td>
          <td>
            <a href="#" className="category-link" onClick={() => handleCategorySelect(category.category_name)}>
              {category.category_name}
            </a>
          </td>
          <td>{category.total_products}</td>
          <td>{new Date(category.updated_date).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default CategoryTable;
