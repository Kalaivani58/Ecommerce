import React from 'react';

const ProductTable = ({ products }) => (
  <table className="table" id="ProductTable">
    <thead>
      <tr>
        <th>Product ID</th>
        <th>Product Name</th>
        <th>Category Name</th>
        <th>Price</th>
        <th>Discounted Price</th>
        <th>Updated Date</th>
      </tr>
    </thead>
    <tbody id="productTableBody">
      {products.map((product) => (
        <tr key={product.product_id}>
          <td>{product.product_id}</td>
          <td>{product.product_name}</td>
          <td>{product.category_name}</td>
          <td>{product.price}</td>
          <td>{product.discounted_price}</td>
          <td>{new Date(product.updated_date).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ProductTable;
