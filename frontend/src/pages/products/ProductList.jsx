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

  return (
    <>
      <Helmet>
        <title>Shop Abayas, Lawn Suits & Kameez Online – Selections.pk Pakistan</title>
        <meta name="description" content="Shop selections of abayas, lawn suits, kameez, kurtas & accessories online at Selections.pk. Best prices in Pakistan. Free shipping over PKR 2,000. COD available. New arrivals daily!" />
        <meta name="keywords" content="selections pk shop, selectionspk, buy abayas online pakistan, lawn suits 2026, kameez pakistan, shalwar kameez online, women clothing selections, selection online shopping pakistan, pakistani fashion store online" />
        <link rel="canonical" href="https://selections.pk/products" />
        <meta property="og:title" content="Shop Abayas, Lawn Suits & Kameez – Selections.pk" />
        <meta property="og:description" content="Best selection of abayas, lawn suits & kameez. Free shipping over PKR 2,000. COD available across Pakistan." />
        <meta property="og:url" content="https://selections.pk/products" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Shop – Selections.pk",
          "description": "Browse abayas, lawn suits, kameez and accessories at Selections.pk Pakistan",
          "url": "https://selections.pk/products",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://selections.pk" },
              { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://selections.pk/products" }
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
