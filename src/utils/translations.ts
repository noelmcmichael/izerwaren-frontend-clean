// Simplified translation system without i18n dependency
const translations = {
  catalog: {
    title: 'Marine Hardware Catalog',
    search: 'Search products...',
    showing: 'Showing {start}-{end} of {total} products',
    resultsFound: '{count} products found',
    noResults: 'No products found',
    viewGrid: 'Grid view',
    viewList: 'List view',
    filters: 'Filters',
    clearFilters: 'Clear filters',
    sortBy: 'Sort by',
    errors: {
      failedToLoad: 'Failed to load products'
    }
  },
  common: {
    home: 'Home',
    loading: 'Loading...',
    retry: 'Try again',
    next: 'Next',
    previous: 'Previous',
    page: 'Page',
    of: 'of'
  },
  product: {
    viewDetails: 'View Details',
    addToCart: 'Add to Cart',
    sku: 'SKU',
    price: 'Price',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock'
  }
};

export function useTranslations(namespace: keyof typeof translations) {
  return (key: string, params?: Record<string, any>) => {
    const keys = key.split('.');
    let value: any = translations[namespace];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) return key;
    
    // Simple parameter replacement
    if (params) {
      return Object.entries(params).reduce((str, [param, val]) => {
        return str.replace(`{${param}}`, String(val));
      }, value);
    }
    
    return value;
  };
}