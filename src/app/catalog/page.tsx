import { Suspense } from 'react';
import SimpleCatalogPage from './components/SimpleCatalogPage';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function CatalogPage() {
  return (
    <Suspense 
      fallback={
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading catalog...</p>
          </div>
        </div>
      }
    >
      <SimpleCatalogPage />
    </Suspense>
  );
}