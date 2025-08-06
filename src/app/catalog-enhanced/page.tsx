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
  Tag
} from 'lucide-react';
import Link from 'next/link';

import { shopifyLiveService } from '../../services/shopify-live';
import { Product } from '../../lib/types';

interface ConnectionStatus {
  isConnected: boolean;
  usingLiveData: boolean;
}

export default function EnhancedCatalogPage() {
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

      console.log(`🔴 Loading enhanced products - page ${currentPage}, category: ${selectedCategory}`);

      const category = selectedCategory === 'ALL' ? undefined : selectedCategory;
      const response = await shopifyLiveService.getProducts(currentPage, 12, undefined, category);

      setProducts(response.data);
      setTotalProducts(response.pagination?.total || 956);
      setTotalPages(response.pagination?.totalPages || 80);

      setConnectionStatus({
        isConnected: true,
        usingLiveData: true
      });

      console.log(`✅ Enhanced catalog loaded ${response.data.length} products`);

    } catch (error) {
      console.error('Failed to load enhanced products:', error);
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

      console.log(`🔍 Enhanced search for: "${searchQuery}"`);

      const searchResults = await shopifyLiveService.searchProducts(searchQuery, 24);
      setProducts(searchResults);
      setCurrentPage(1);
      setTotalPages(1);

      console.log(`✅ Enhanced search found ${searchResults.length} results`);

    } catch (error) {
      console.error('Enhanced search failed:', error);
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const EnhancedProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-200">
      <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full h-48 flex items-center justify-center text-gray-400">
          <Package className="h-16 w-16" />
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 flex-shrink-0 text-blue-500" />
            <span className="truncate font-medium">{product.manufacturer}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 flex-shrink-0 text-green-500" />
            <span className="truncate">{product.category_name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 flex-shrink-0 text-emerald-500" />
            <span className="truncate font-semibold text-green-700">{product.display_price}</span>
          </div>
          
          {product.sku && (
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="truncate font-mono text-xs bg-gray-100 px-2 py-1 rounded">{product.sku}</span>
            </div>
          )}
        </div>
        
        <button className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
          View Details
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 font-semibold leading-6 text-sm shadow-lg rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition ease-in-out duration-150">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading Enhanced Catalog...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load enhanced catalog</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadProducts}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Enhanced Catalog</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                Enhanced Marine Hardware Catalog
                <span className="text-sm font-normal bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  🔴 LIVE
                </span>
              </h1>
              <p className="text-gray-600 text-lg">
                Real-time inventory with enhanced search and filtering from izerw-marine.myshopify.com
              </p>
            </div>

            <div className="flex items-center gap-3">
              {connectionStatus.isConnected ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">🔴 LIVE Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Disconnected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Enhanced Search */}
            <div className="flex-1">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search marine hardware products, SKUs, descriptions..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium min-w-[120px] justify-center"
                >
                  <Search className="h-4 w-4" />
                  {searching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Enhanced Category Filter */}
            <div className="lg:w-80">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
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
      </div>

      {/* Enhanced Results Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-6">
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
              <span className="font-medium">✅ Showing live results: {products.length} of {totalProducts} products</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">Page {currentPage} of {totalPages}</span>
            </div>
          </div>

          {/* Enhanced View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="text-sm font-medium">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
              <span className="text-sm font-medium">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <EnhancedProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex gap-6 hover:shadow-md transition-shadow">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{product.title}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-500" />
                          <span>Manufacturer: <span className="font-medium">{product.manufacturer}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-green-500" />
                          <span>Category: <span className="font-medium">{product.category_name}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          <span>Price: <span className="font-semibold text-green-700">{product.display_price}</span></span>
                        </div>
                        {product.sku && (
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <span>SKU: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{product.sku}</span></span>
                          </div>
                        )}
                      </div>
                      <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 space-x-3">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 text-gray-600 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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