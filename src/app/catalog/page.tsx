'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Grid3X3,
  List,
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Menu
} from 'lucide-react';
import Link from 'next/link';

import { ProductCard } from '../../components/ui/ProductCard';
import { FilterSidebar } from '../../components/ui/FilterSidebar';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useToast } from '../../components/ui/Toast';
import { useTranslations } from '../../utils/translations';
import { shopifyLiveService } from '../../services/shopify-live';

interface Product {
  id: string;
  title: string;
  description?: string;
  sku: string;
  price?: string;
  availability?: string;
  categoryName?: string;
  images: Array<{
    id: string;
    url: string;
    altText?: string;
    isPrimary: boolean;
  }>;
  shopifyVariants: Array<{
    id: string;
    sku?: string;
    inventoryQty?: number;
  }>;
}

function CatalogContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const { showToast } = useToast();
  const t = useTranslations('catalog');
  const tCommon = useTranslations('common');

  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');

  // Available categories - could be fetched dynamically
  const categories = [
    'Marine Locks',
    'Hinges', 
    'Hardware',
    'Ajar Hooks',
    'Deck Hardware',
    'Hatch Hardware',
    'Fasteners'
  ];

  const productsPerPage = 12;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const fetchProducts = async (page = 1, search = '', category = '') => {
    try {
      setLoading(true);
      setError(null);

      // Use the working shopify live service
      const categoryFilter = category && category !== 'ALL' ? category : undefined;
      const response = await shopifyLiveService.getProducts(page, productsPerPage, search, categoryFilter);
      
      let filteredProducts = response.data || [];
      
      // Client-side search filtering if needed (server-side preferred)
      if (search && !categoryFilter) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.title.toLowerCase().includes(searchLower) ||
          product.sku?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
        );
      }

      setProducts(filteredProducts);
      setTotalProducts(response.pagination?.total || filteredProducts.length);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load products:', error);
      const errorMessage = error instanceof Error ? error.message : t('errors.failedToLoad');
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set initial category from URL
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    fetchProducts(1, searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page, searchQuery, selectedCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    fetchProducts(currentPage, searchQuery, selectedCategory);
  };

  const handleProductDetails = (product: Product) => {
    // Navigate to product details page
    window.open(`/product/${product.id}`, '_blank');
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='bg-white border-b border-gray-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
            <div className='flex items-center text-sm text-gray-500 mb-4'>
              <Link href='/' className='hover:text-gray-700'>
                {tCommon('home')}
              </Link>
              <span className='mx-2'>/</span>
              <span className='text-gray-900'>{t('title')}</span>
            </div>
            <div className='h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse'></div>
            <div className='h-4 bg-gray-200 rounded w-2/3 animate-pulse'></div>
          </div>
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center max-w-md mx-auto'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-lg font-semibold text-gray-900 mb-2'>{t('errors.failedToLoad')}</h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={handleRetry}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            {tCommon('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          {/* Breadcrumb */}
          <div className='flex items-center text-sm text-gray-500 mb-4'>
            <Link href='/' className='hover:text-gray-700'>
              {tCommon('home')}
            </Link>
            <span className='mx-2'>/</span>
            <span className='text-gray-900'>{t('title')}</span>
          </div>

          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                {selectedCategory ? `${selectedCategory}` : t('title')}
                <span className="ml-2 text-sm font-normal text-red-600">🔴 LIVE</span>
              </h1>
              <p className='text-gray-600 mb-4 lg:mb-0'>
                {selectedCategory
                  ? `Browse our ${selectedCategory.toLowerCase()} products`
                  : 'Browse our complete selection of marine hardware and supplies'}
              </p>
            </div>

            {/* Search */}
            <div className='flex-shrink-0'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder={t('search')}
                  className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mt-6 gap-4'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0'>
              <p className='text-gray-600 flex-shrink-0'>
                {t('showing', {
                  start: (currentPage - 1) * productsPerPage + 1,
                  end: Math.min(currentPage * productsPerPage, totalProducts),
                  total: totalProducts
                })}
              </p>
            </div>

            <div className='flex items-center space-x-4'>
              {/* View mode toggle */}
              <div className='flex items-center border border-gray-300 rounded-lg'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                  title={t('viewGrid')}
                >
                  <Grid3X3 className='h-4 w-4' />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                  title={t('viewList')}
                >
                  <List className='h-4 w-4' />
                </button>
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className='lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50'
              >
                <Filter className='h-4 w-4 mr-2' />
                {t('filters')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex gap-8'>
          {/* Filters sidebar */}
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            categories={categories}
          />

          {/* Products */}
          <div className='flex-1'>
            {products.length === 0 ? (
              <div className='text-center py-12'>
                <Package className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>{t('noResults')}</h3>
                <p className='text-gray-600'>Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {products.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        viewMode="grid"
                        onViewDetails={handleProductDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <div className='space-y-6'>
                    {products.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        viewMode="list"
                        onViewDetails={handleProductDetails}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='flex items-center justify-center mt-8 space-x-2'>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className='flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      <ChevronLeft className='h-4 w-4 mr-1' />
                      {tCommon('previous')}
                    </button>
                    
                    <span className='px-4 py-2 text-gray-600'>
                      {tCommon('page')} {currentPage} {tCommon('of')} {totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className='flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {tCommon('next')}
                      <ChevronRight className='h-4 w-4 ml-1' />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function CatalogPage() {
  return <CatalogContent />;
}