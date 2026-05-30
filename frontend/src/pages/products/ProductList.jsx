import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api from '@/services/api'
import ProductGrid from '@/components/product/ProductGrid'
import ProductFilters from '@/components/product/ProductFilters'
import Pagination from '@/components/common/Pagination'
import { DEMO_PRODUCTS } from '@/data/demoProducts'

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [pagination, setPagination] = useState({ count: 0, totalPages: 1, currentPage: 1 })

  const getFilters = useCallback(() => ({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    in_stock: searchParams.get('in_stock') || '',
    is_featured: searchParams.get('is_featured') || '',
    ordering: searchParams.get('ordering') || '-created_at',
    page: parseInt(searchParams.get('page') || '1'),
  }), [searchParams])

  const [filters, setFilters] = useState(getFilters)

  useEffect(() => {
    setFilters(getFilters())
  }, [getFilters])

  const hasActiveFilters = !!(
    filters.category || filters.search || filters.min_price ||
    filters.max_price || filters.in_stock || filters.is_featured
  )

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setIsEmpty(false)
      const params = {}
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
      try {
        const res = await api.get('/products/', { params })
        const data = res.data
        const results = data.results || []
        if (results.length > 0) {
          setProducts(results)
          setIsEmpty(false)
          setPagination({
            count: data.count,
            totalPages: Math.ceil(data.count / 12),
            currentPage: filters.page,
          })
        } else if (hasActiveFilters) {
          // Filtered query returned nothing — show empty state, never fake products
          setProducts([])
          setIsEmpty(true)
          setPagination({ count: 0, totalPages: 1, currentPage: 1 })
        } else {
          // No filters, no real products yet — show demo products as store preview
          setProducts(DEMO_PRODUCTS)
          setIsEmpty(false)
          setPagination({ count: DEMO_PRODUCTS.length, totalPages: 1, currentPage: 1 })
        }
      } catch {
        // API error — only show demo if no filters are active
        if (hasActiveFilters) {
          setProducts([])
          setIsEmpty(true)
        } else {
          setProducts(DEMO_PRODUCTS)
        }
        setPagination({ count: 0, totalPages: 1, currentPage: 1 })
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [filters]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    const params = {}
    Object.entries(newFilters).forEach(([k, v]) => { if (v && v !== '1') params[k] = v })
    if (newFilters.page > 1) params.page = newFilters.page
    setSearchParams(params)
  }

  const catName = filters.category ? filters.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : ''
  const pageTitle = filters.search
    ? `Search "${filters.search}" – Selections.pk`
    : catName
      ? `${catName} Clothing Online Pakistan – Selections.pk | Buy ${catName} Fashion`
      : 'Shop Abayas, Lawn Suits & Kameez Online – Selections.pk Pakistan'
  const pageDesc = filters.search
    ? `Search results for "${filters.search}" at Selections.pk. Free shipping over PKR 2,000. COD available.`
    : catName
      ? `Buy ${catName} clothing online at Selections.pk Pakistan. Huge collection, best prices, free shipping over PKR 2,000. Cash on delivery across Pakistan.`
      : 'Shop abayas, lawn suits, kameez, kurtas & accessories online at Selections.pk. Best prices in Pakistan. Free shipping over PKR 2,000. COD available. New arrivals daily!'
  const canonicalUrl = filters.category
    ? `https://selections.pk/products?category=${filters.category}`
    : 'https://selections.pk/products'

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={catName
          ? `${catName.toLowerCase()} pakistan, buy ${catName.toLowerCase()} online pakistan, ${catName.toLowerCase()} selections.pk, ${catName.toLowerCase()} clothing pakistan`
          : 'selections pk shop, selectionspk, buy abayas online pakistan, lawn suits 2026, kameez pakistan, shalwar kameez online, women clothing selections, selection online shopping pakistan, pakistani fashion store online'
        } />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": catName ? `${catName} – Selections.pk` : "Shop – Selections.pk",
          "description": pageDesc,
          "url": canonicalUrl,
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://selections.pk" },
              { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://selections.pk/products" },
              ...(catName ? [{ "@type": "ListItem", "position": 3, "name": catName, "item": canonicalUrl }] : [])
            ]
          }
        })}</script>
      </Helmet>

      <div className="page-container">
        {/* Header */}
        <div className="mb-6">
          <h1 className="section-title">
            {filters.category ? filters.category.replace(/-/g, ' ') : filters.search ? `Search: "${filters.search}"` : 'All Products'}
          </h1>
          {!isEmpty && <p className="text-gray-500 text-sm mt-1">{pagination.count} products found</p>}
        </div>

        <div className="flex gap-8">
          {/* Filters sidebar */}
          <ProductFilters filters={filters} onChange={handleFilterChange} />

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter + sort row */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <ProductFilters filters={filters} onChange={handleFilterChange} />
              <span className="text-sm text-gray-500">{pagination.count} items</span>
            </div>

            {!loading && isEmpty ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-5">
                  <svg className="w-10 h-10 text-[#f09c27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                  </svg>
                </div>

                {/* Heading */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {filters.search
                    ? `No results for "${filters.search}"`
                    : catName
                      ? `No ${catName} products right now`
                      : 'No products found'}
                </h3>

                {/* Trust message */}
                <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-1">
                  {filters.search
                    ? 'Try a different keyword or browse our full collection.'
                    : 'We\'re restocking this section soon. Our team is constantly adding new products — check back in a day or two!'}
                </p>
                <p className="text-xs text-gray-400 mb-7">
                  All our products are 100% genuine. We never list items we can\'t fulfill.
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    to="/products"
                    onClick={() => handleFilterChange({ ...filters, category: '', search: '', min_price: '', max_price: '', in_stock: '', is_featured: '', page: 1 })}
                    className="px-6 py-2.5 bg-[#f09c27] hover:bg-[#d4821a] text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Browse All Products
                  </Link>
                  <Link
                    to="/contact"
                    className="px-6 py-2.5 border-2 border-gray-200 hover:border-[#f09c27] text-gray-700 text-sm font-semibold rounded-lg transition-colors"
                  >
                    Notify Me When Available
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-gray-100 w-full">
                  {[
                    { icon: '✓', label: '100% Genuine Products' },
                    { icon: '✓', label: 'Cash on Delivery' },
                    { icon: '✓', label: '7-Day Easy Returns' },
                  ].map(({ icon, label }) => (
                    <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-[10px]">{icon}</span>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <ProductGrid products={products} loading={loading} />
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => handleFilterChange({ ...filters, page: p })}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
