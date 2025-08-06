'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Grid3X3,
  List,
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  XCircle,
  DollarSign,
  Hash,
  Building2,
  Tag,
  Eye,
  ShoppingCart,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

import { shopifyLiveService } from '../../services/shopify-live';
import { Product } from '../../lib/types';

interface ConnectionStatus {
  isConnected: boolean;
  usingLiveData: boolean;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    usingLiveData: false
  });
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'ALL',
    'Marine Locks',
    'Hinges', 
    'Hardware',
    'Ajar Hooks',
    'Deck Hardware',
    'Hatch Hardware',
    'Fasteners'
  ];

  useEffect(() => {
    loadProducts();
    checkConnectionStatus();
  }, [currentPage, selectedCategory]);

  const checkConnectionStatus = async () => {
    try {
      const status = shopifyLiveService.getConnectionStatus();
      setConnectionStatus(status);
    } catch (error) {
      console.error('Failed to check connection status:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔴 Loading live products - page ${currentPage}, category: ${selectedCategory}`);

      const category = selectedCategory === 'ALL' ? undefined : selectedCategory;
      const response = await shopifyLiveService.getProducts(currentPage, 12, undefined, category);

      setProducts(response.data);
      setTotalProducts(response.pagination?.total || 956);
      setTotalPages(response.pagination?.totalPages || 80);

      setConnectionStatus({
        isConnected: true,
        usingLiveData: true
      });

      console.log(`✅ Loaded ${response.data.length} live products`);

    } catch (error) {
      console.error('Failed to load live products:', error);
      setError('Failed to load products. Please try again.');
      setConnectionStatus({
        isConnected: false,
        usingLiveData: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    try {
      setSearching(true);
      setError(null);

      console.log(`🔍 Searching live products for: "${searchQuery}"`);

      const searchResults = await shopifyLiveService.searchProducts(searchQuery, 24);
      setProducts(searchResults);
      setCurrentPage(1);
      setTotalPages(1);

      console.log(`✅ Found ${searchResults.length} search results`);

    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const EnhancedProductCard = ({ product }: { product: Product }) => {
    if (viewMode === 'list') {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-200">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-48 h-48 md:h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      <span className="truncate">{product.manufacturer}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Tag className="h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="truncate">{product.category_name}</span>
                    </div>
                    
                    {product.sku && (
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 flex-shrink-0 text-purple-500" />
                        <span className="font-mono text-xs bg-purple-50 px-2 py-1 rounded-full text-purple-700 truncate">
                          SKU: {product.sku}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                      <span className="font-bold text-emerald-600 text-lg">
                        ${product.price?.toFixed(2) || product.display_price}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 md:ml-6">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200 hover:-translate-y-1">
        <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-full h-48 flex items-center justify-center text-gray-400">
            <Package className="h-16 w-16" />
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
            {product.title}
          </h3>
          
          <div className="space-y-3 text-sm mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="h-4 w-4 flex-shrink-0 text-blue-500" />
              <span className="truncate font-medium">{product.manufacturer}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Tag className="h-4 w-4 flex-shrink-0 text-green-500" />
              <span className="truncate">{product.category_name}</span>
            </div>
            
            {product.sku && (
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 flex-shrink-0 text-purple-500" />
                <span className="font-mono text-xs bg-purple-50 px-2 py-1 rounded-full text-purple-700 truncate">
                  {product.sku}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 flex-shrink-0 text-emerald-500" />
              <span className="font-bold text-emerald-600 text-xl">
                ${product.price?.toFixed(2) || product.display_price}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-100">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
              <Eye className="h-4 w-4" />
              View Details
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-6" />
          <p className="text-gray-600 text-xl font-medium">Loading enhanced catalog from Shopify...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Failed to load products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700 cursor-pointer">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Catalog</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Marine Hardware Catalog
              </h1>
              <p className="text-gray-600 text-lg flex items-center gap-2">
                Browse our complete selection of marine hardware and supplies
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                  🔴 LIVE
                </span>
              </p>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 bg-white shadow-sm">
              {connectionStatus.isConnected ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div className="text-sm">
                    <div className="text-green-600 font-semibold">🔴 LIVE Connected</div>
                    <div className="text-gray-500">Real-time Shopify data</div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  <div className="text-sm">
                    <div className="text-red-600 font-semibold">Disconnected</div>
                    <div className="text-gray-500">Unable to connect</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search marine hardware products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searching}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'ALL' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              ✅ Showing live results: {products.length} of {totalProducts} products
            </p>
            <p className="text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              title="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <EnhancedProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {products.map((product) => (
                  <EnhancedProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <span className="px-4 py-2 text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}