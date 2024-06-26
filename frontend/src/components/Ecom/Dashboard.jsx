import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import CategoryTable from './CategoryTable';
import ProductTable from './ProductTable';

const limit = 5;

const Home = () => {
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCategoryTable, setIsCategoryTable] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page')) || 1;
    const category = urlParams.get('category');
    setCategoryId(category);
    if (category) {
      fetchProductsByCategory(category, page);
    } else {
      fetchCategoryTable(page);
    }
  }, []);
  
  const fetchCategoryTable = async (page) => {
    try {
      const response = await fetch(`http://localhost:3000/category_table?page=${page}&limit=${limit}`);
      const data = await response.json();
      setCategories(data.results);
      setTotalPages(data.totalPages);
      setIsCategoryTable(true);
      const params = new URLSearchParams();
      params.set('page', page);
      navigate(`/category_table?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching category table:', error);
    }
  };

  const fetchProductsByCategory = async (categoryId, page) => {
    try {
      const response = await fetch(`http://localhost:3000/product_table?category=${categoryId}&page=${page}`);
      const data = await response.json();
      setProducts(data.results);
      setTotalPages(data.totalPages);
      setIsCategoryTable(false);
      const params = new URLSearchParams();
      params.set('category', categoryId);
      params.set('page', page);
      navigate(`/product_table?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
  };

  const fetchProductTable = async (page = 1) => {
    try {
      const response = await fetch(`http://localhost:3000/product_table?page=${page}&limit=${limit}`);
      const data = await response.json();
      setProducts(data.results);
      setTotalPages(data.totalPages);
      setIsCategoryTable(false);
      const params = new URLSearchParams();
      params.set('page', page);
      navigate(`/product_table?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching product table:', error);
    }
  };

  const searchProducts = async (query, page = 1) => {
    try {
      const response = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setProducts(data.hits);
      setTotalPages(data.totalPages);
      setIsCategoryTable(false);
      const params = new URLSearchParams();
      params.set('query', query);
      params.set('page', page);
      navigate(`/product_table?${params.toString()}`);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleCategorySelect = async (selectedCategoryId) => {
    setCategoryId(selectedCategoryId);
    if (selectedCategoryId) {
      setCurrentQuery('');
      setCurrentPage(1);
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = '';
      }
      await fetchProductsByCategory(selectedCategoryId, 1);
    }
  };

  const handleSearchInput = async (event) => {
    const query = event.target.value.trim();
    setCurrentQuery(query);
    if (query === '') {
      await fetchProductTable(1);
      const allProductsBtn = document.getElementById('allProductsBtn');
      if (allProductsBtn) {
        allProductsBtn.classList.remove('active');
      }
      setCategoryId('');
    } else {
      setCategoryId('');
      const categorySelect = document.getElementById('categorySelect');
      if (categorySelect) {
        categorySelect.selectedIndex = 0;
      }
      searchProducts(query);
    }
  };

  const handlePaginationClick = async (page) => {
    setCurrentPage(page);
    const allProductsBtn = document.getElementById('allProductsBtn');
    const backButton = document.getElementById('backButton');

    if (allProductsBtn && allProductsBtn.classList.contains('active') && categoryId) {
      await fetchProductsByCategory(categoryId, page);
    } else if (allProductsBtn && allProductsBtn.classList.contains('active') && currentQuery) {
      await searchProducts(currentQuery, page);
    } else if (allProductsBtn && allProductsBtn.classList.contains('active')) {
      await fetchProductTable(page);
    } else if (backButton && backButton.classList.contains('active') && currentQuery === '') {
      fetchCategoryTable(page);
    } else if (isCategoryTable) {
      await fetchCategoryTable(page);
    } else if (categoryId) {
      await fetchProductsByCategory(categoryId, page);
    } else if (currentQuery) {
      await searchProducts(currentQuery, page);
    } else if (currentQuery === '') {
      fetchProductTable(page);
    } else {
      await fetchProductTable(page);
    }
  };

  const handleAllProductsButtonClick = async () => {
    setCategoryId('');
    setCurrentQuery('');
    await fetchProductTable(1);
    setIsCategoryTable(false);
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
    }
    const allProductsBtn = document.getElementById('allProductsBtn');
    if (allProductsBtn) {
      allProductsBtn.classList.add('active');
    }
    const backButton = document.getElementById('backButton');
    if (backButton) {
      backButton.classList.remove('active');
    }
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
      categorySelect.selectedIndex = 0;
    }
  };

  const handleBackButtonClick = () => {
    const backButton = document.getElementById('backButton');
    if (backButton) {
      backButton.classList.add('active');
    }
    const params = new URLSearchParams();
    params.set('page', 1);
    navigate(`/category_table?${params.toString()}`);
    window.location.reload();
  };

  const renderTable = () => {
    if (isCategoryTable) {
      return <CategoryTable categories={categories} handleCategorySelect={handleCategorySelect} />;
    } else {
      return <ProductTable products={products} />;
    }
  };

  return (
    <div className="container mt-5">
      <div className="input-group mb-3">
        <input type="text" id="searchInput" className="form-control" placeholder="Search..." onChange={handleSearchInput} />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        {!isCategoryTable && (
          <button id="backButton" className="btn btn-primary" onClick={handleBackButtonClick}>Back to Category table</button>
        )}
        <h1>{isCategoryTable ? 'Category Table' : 'Product Table'}</h1>
        {!isCategoryTable && (
          <select id="categorySelect" className="form-control" onChange={(e) => handleCategorySelect(e.target.value)} style={{width:'25%'}}>
            <option value="" disabled selected>Select Category</option>
            <option value="kitchen">Kitchen</option>
            <option value="fashion">Fashion</option>
            <option value="groceries">Groceries</option>
            <option value="electronics and appliances">Electronics and Appliances</option>
            <option value="home decors">Home Decors</option>
            <option value="furniture">Furniture</option>
            <option value="books">Books</option>
            <option value="sports">Sports</option>
            <option value="travel">Travel</option>
            <option value="baby products and toys">Baby Products and Toys</option>
          </select>
        )}
        <button id="allProductsBtn" className="btn btn-primary" onClick={handleAllProductsButtonClick}>All Products</button>
      </div>

      {renderTable()}
      <Pagination currentPage={currentPage} totalPages={totalPages} handlePaginationClick={handlePaginationClick} />
    </div>
  );
};

export default Home;





