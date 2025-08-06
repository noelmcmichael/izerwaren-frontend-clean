import React from 'react';
import Image from 'next/image';
import { Package, DollarSign, Hash } from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
}

interface ProductVariant {
  id: string;
  sku?: string;
  inventoryQty?: number;
}

interface Product {
  id: string;
  title: string;
  description?: string;
  sku: string;
  price?: string;
  availability?: string;
  categoryName?: string;
  images: ProductImage[];
  shopifyVariants: ProductVariant[];
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ product, viewMode = 'grid', onViewDetails }: ProductCardProps) {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const fallbackImageUrl = `https://via.placeholder.com/400x300?text=No+Image`;
  
  // Safe image URL - avoid complex query parameters
  const imageUrl = primaryImage?.url || fallbackImageUrl;
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 relative bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover"
                sizes="128px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = fallbackImageUrl;
                }}
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.title}
            </h3>
            
            {product.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-4 mb-4">
              {product.sku && (
                <div className="flex items-center text-sm text-gray-500">
                  <Hash className="h-4 w-4 mr-1" />
                  <span>{product.sku}</span>
                </div>
              )}
              
              {product.price && (
                <div className="flex items-center text-sm font-medium text-green-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>{product.price}</span>
                </div>
              )}
              
              {product.categoryName && (
                <div className="flex items-center text-sm text-gray-500">
                  <Package className="h-4 w-4 mr-1" />
                  <span>{product.categoryName}</span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleViewDetails}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="aspect-w-16 aspect-h-12 bg-gray-100">
        <div className="w-full h-48 relative">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackImageUrl;
            }}
          />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          {product.sku && (
            <div className="flex items-center text-sm text-gray-500">
              <Hash className="h-4 w-4 mr-1" />
              <span>{product.sku}</span>
            </div>
          )}
          
          {product.price && (
            <div className="flex items-center text-sm font-medium text-green-600">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>{product.price}</span>
            </div>
          )}
          
          {product.categoryName && (
            <div className="flex items-center text-sm text-gray-500">
              <Package className="h-4 w-4 mr-1" />
              <span>{product.categoryName}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleViewDetails}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}