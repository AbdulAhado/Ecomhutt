import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid, List, X } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useShop } from '../../context/ShopContext';
import './Shop.css';

export default function Shop() {
  const { products } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Derive categories and collections from fetched products
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const collections = useMemo(() => {
    const tags = new Set();
    products.forEach(p => {
      if (p.tags) p.tags.forEach(t => tags.add(t));
    });
    return ['all', ...Array.from(tags)];
  }, [products]);

  // Sync state with URL params on load
  useEffect(() => {
    const cat = searchParams.get('category');
    const col = searchParams.get('collection');
    if (cat) setCategoryFilter(cat);
    if (col) setCollectionFilter(col);
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleCollectionChange = (col) => {
    setCollectionFilter(col);
    if (col === 'all') {
      searchParams.delete('collection');
    } else {
      searchParams.set('collection', col);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setCategoryFilter('all');
    setCollectionFilter('all');
    setSearchParams({});
  };

  const searchVal = searchParams.get('search') || '';

  // Filter products
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchVal && !product.name.toLowerCase().includes(searchVal.toLowerCase()) && !(product.description && product.description.toLowerCase().includes(searchVal.toLowerCase()))) {
      return false;
    }
    // Category filter
    if (categoryFilter !== 'all' && product.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    // Collection filter (using tags)
    if (collectionFilter !== 'all' && (!product.tags || !product.tags.includes(collectionFilter))) {
      return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    // Featured is default (by in-stock and order)
    return (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0);
  });

  return (
    <div className="shop-page container page-enter page-enter-active">
      {/* Page Title & Breadcrumb */}
      <header className="shop-header">
        <span className="shop-breadcrumb text-label-caps">EcomHutt Collection</span>
        <h1 className="shop-title">Shop All</h1>
        {searchVal && <p className="search-results-text">Search results for "{searchVal}" ({filteredProducts.length} items)</p>}
      </header>

      {/* Toolbar */}
      <div className="shop-toolbar">
        <button 
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={16} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="sort-selector">
          <label htmlFor="sort-select" className="sr-only">Sort by</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-dropdown"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="shop-main-layout">
        {/* Sidebar Filters */}
        <aside className={`shop-sidebar ${showFilters ? 'show' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="sidebar-close-btn" onClick={() => setShowFilters(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title text-label-caps">Categories</h4>
            <ul className="filter-options-list">
              {categories.map(cat => (
                <li key={cat}>
                  <button 
                    className={`filter-option-btn ${categoryFilter === cat ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title text-label-caps">Tags & Collections</h4>
            <ul className="filter-options-list">
              {collections.map(col => (
                <li key={col}>
                  <button 
                    className={`filter-option-btn ${collectionFilter === col ? 'active' : ''}`}
                    onClick={() => handleCollectionChange(col)}
                  >
                    {col === 'all' ? 'All' : col.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {(categoryFilter !== 'all' || collectionFilter !== 'all') && (
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              Reset Filters
            </button>
          )}
        </aside>

        {/* Product Listing Grid */}
        <main className="shop-content-area">
          {sortedProducts.length > 0 ? (
            <div className="shop-products-grid">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-results-state">
              <span className="no-results-icon">∅</span>
              <h3 className="no-results-title">No items found</h3>
              <p className="no-results-desc">
                Your filter combination did not match any products in our current collection.
              </p>
              <button className="btn btn-primary" onClick={clearAllFilters}>
                View All Collection
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
