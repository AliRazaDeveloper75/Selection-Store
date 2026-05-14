import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const params = {}
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
      try {
        const res = await api.get('/products/', { params })
        const data = res.data
        const results = data.results || []
        setProducts(results.length ? results : DEMO_PRODUCTS)
        setPagination({
          count: results.length ? data.count : DEMO_PRODUCTS.length,
          totalPages: results.length ? Math.ceil(data.count / 12) : 1,
          currentPage: filters.page,
        })
      } catch {
        setProducts(DEMO_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [filters])

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
          <p className="text-gray-500 text-sm mt-1">{pagination.count} products found</p>
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

            <ProductGrid products={products} loading={loading} />
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(p) => handleFilterChange({ ...filters, page: p })}
            />
          </div>
        </div>
      </div>
    </>
  )
}
