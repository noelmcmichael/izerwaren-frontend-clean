import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Catalog</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Marine Hardware Catalog
          </h1>
          <p className="text-gray-600 mb-4">
            Browse our complete selection of marine hardware and supplies
            <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              🔴 LIVE
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Catalog is being updated
          </h2>
          <p className="text-gray-600 mb-6">
            We're working to improve your catalog experience. In the meantime, you can browse our live catalog:
          </p>
          <Link
            href="/catalog-live"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            🔴 View LIVE Catalog
          </Link>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Marine Locks</h3>
            <p className="text-gray-600 mb-4">Cam locks, barrel locks, and security hardware</p>
            <Link 
              href="/catalog-live" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse Products →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fasteners</h3>
            <p className="text-gray-600 mb-4">High-grade bolts, screws, and fastening solutions</p>
            <Link 
              href="/catalog-live" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse Products →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hardware</h3>
            <p className="text-gray-600 mb-4">General marine hardware and components</p>
            <Link 
              href="/catalog-live" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse Products →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}