import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa'
import { FaTiktok } from 'react-icons/fa6'
import api from '@/services/api'

const STORAGE_KEY = 'selections_welcome_v2'

const SOCIAL = [
  {
    Icon: FaFacebookF,
    href: 'https://www.facebook.com/selections.official',
    label: 'Facebook',
    color: 'hover:bg-blue-600',
  },
  {
    Icon: FaInstagram,
    href: 'https://www.instagram.com/selections.pk/',
    label: 'Instagram',
    color: 'hover:bg-pink-500',
  },
  {
    Icon: FaTiktok,
    href: 'https://www.tiktok.com/@selections.official',
    label: 'TikTok',
    color: 'hover:bg-black',
  },
  {
    Icon: FaYoutube,
    href: 'https://www.youtube.com/@Selections.Offical',
    label: 'YouTube',
    color: 'hover:bg-red-600',
  },
  {
    Icon: FaWhatsapp,
    href: 'https://wa.me/923178968927',
    label: 'WhatsApp',
    color: 'hover:bg-green-500',
  },
]

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible) return
    api.get('/products/categories/')
      .then(r => setCategories((r.data?.results ?? r.data ?? []).slice(0, 6)))
      .catch(() => {})
  }, [visible])

  const close = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-popup-in">

        {/* Top gradient bar */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #f09c27, #e07b00, #f09c27)' }} />

        {/* Close button */}
        <button onClick={close}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors z-10">
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
          <p className="text-xs font-bold tracking-[3px] uppercase text-[#f09c27] mb-1">Welcome to</p>
          <h2 className="text-2xl font-extrabold text-white mb-1">Selections Scents</h2>
          <p className="text-slate-400 text-sm">Premium Perfumes & Pakistani Fashion</p>
        </div>

        <div className="px-6 py-5">

          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Shop by Category</p>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(cat => (
                  <Link key={cat.id} to={`/products?category=${cat.slug}`} onClick={close}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-gray-100
                               hover:border-[#f09c27] hover:bg-orange-50 transition-all text-center group">
                    {cat.image
                      ? <img src={cat.image} alt={cat.name}
                          className="w-10 h-10 object-cover rounded-lg" />
                      : <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-[#f09c27] text-lg">🛍️</div>
                    }
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-[#f09c27] line-clamp-2 leading-tight">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Social follow */}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm font-bold text-gray-800 mb-0.5">Follow Us for Latest Updates</p>
            <p className="text-xs text-gray-400 mb-3">New arrivals, offers & exclusive scents — first on social!</p>
            <div className="flex items-center justify-center gap-2">
              {SOCIAL.map(({ Icon, href, label, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  title={label}
                  className={`w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center
                              text-gray-600 hover:text-white transition-all ${color}`}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 mt-4">
            <Link to="/products" onClick={close}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white text-center transition-all"
              style={{ background: 'linear-gradient(135deg, #f09c27, #e07b00)' }}>
              Shop Now →
            </Link>
            <button onClick={close}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 border-gray-200
                         hover:border-[#f09c27] text-gray-600 hover:text-[#f09c27] transition-all">
              Explore First
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-3">
            Free delivery on orders <strong className="text-[#f09c27]">PKR 2,500+</strong> · Cash on Delivery
          </p>
        </div>
      </div>
    </div>
  )
}
