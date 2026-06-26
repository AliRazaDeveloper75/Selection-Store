import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import {
  FaFacebookF, FaInstagram, FaYoutube,
  FaTruck, FaUndo, FaArrowRight, FaWhatsapp,
} from 'react-icons/fa'
import { FaTiktok } from 'react-icons/fa6'
import { MdLock, MdLocationOn, MdPhone, MdEmail, MdAccessTime } from 'react-icons/md'

const SHOP_LINKS = [
  ['/products',                     'All Products'],
  ['/products?is_featured=true',    'Featured Items'],
  ['/products?has_discount=true',   'Sale & Offers'],
  ['/products?ordering=-created_at','New Arrivals'],
  ['/products?category=men',        "Men's Collection"],
  ['/products?category=women',      "Women's Collection"],
]

const COMPANY_LINKS = [
  ['/about',    'About Us'],
  ['/contact',  'Contact Us'],
  ['/',         'Home'],
  ['/register', 'Create Account'],
  ['/login',    'Sign In'],
]

const SOCIAL = [
  { Icon: FaFacebookF, name: 'Facebook',  href: 'https://www.facebook.com/selections.official', hoverBg: 'hover:bg-blue-600' },
  { Icon: FaInstagram, name: 'Instagram', href: 'https://www.instagram.com/selections.pk/',     hoverBg: 'hover:bg-pink-600' },
  { Icon: FaYoutube,   name: 'YouTube',   href: 'https://www.youtube.com/@Selections.Offical',  hoverBg: 'hover:bg-red-600' },
  { Icon: FaTiktok,    name: 'TikTok',    href: 'https://www.tiktok.com/@selections.official',  hoverBg: 'hover:bg-gray-700' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a' }} className="text-gray-400">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #f09c27, #e07b00, #f09c27)' }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-12 pb-8">

        {/* ── Brand + Social (full width on mobile) ── */}
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <img src={logo} alt="Selections.pk" className="h-12 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 0 6px rgba(240,156,39,0.4)) brightness(1.1)' }}
              onError={e => { e.currentTarget.style.display = 'none' }} />
          </Link>
          <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
            Premium Pakistani fashion for everyone. From classic kameez to modern abayas — quality clothing delivered nationwide.
          </p>

          {/* Social icons */}
          <div className="flex gap-3 mt-5">
            {SOCIAL.map(({ Icon, name, href, hoverBg }) => (
              <a key={name} href={href} title={name} target="_blank" rel="noopener noreferrer"
                className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white transition-all hover:scale-110 ${hoverBg}`}>
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">
              <MdLock className="w-3.5 h-3.5 text-[#f09c27]" /> Secure Payments
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">
              <FaTruck className="w-3.5 h-3.5 text-[#f09c27]" /> COD Available
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">
              <FaUndo className="w-3 h-3 text-[#f09c27]" /> 7-Day Returns
            </span>
          </div>
        </div>

        {/* ── Links grid: 2-col on mobile, 4-col on desktop ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest border-b border-white/10 pb-2">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {SHOP_LINKS.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-[#f09c27] transition-colors flex items-center gap-1 group">
                    <FaArrowRight className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#f09c27] flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest border-b border-white/10 pb-2">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {COMPANY_LINKS.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-[#f09c27] transition-colors flex items-center gap-1 group">
                    <FaArrowRight className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#f09c27] flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — spans 2 cols on mobile so it gets full width feel */}
          <div className="col-span-2 md:col-span-2">
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest border-b border-white/10 pb-2">Contact</h4>

            {/* 2-col contact grid on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <a href="tel:+923178968927"
                className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-colors">
                <MdPhone className="w-4 h-4 text-[#f09c27] flex-shrink-0" />
                <span className="text-gray-300">+92 317 8968927</span>
              </a>

              <a href="https://wa.me/923178968927" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-colors">
                <FaWhatsapp className="w-4 h-4 flex-shrink-0" style={{ color: '#25D366' }} />
                <span className="text-gray-300">WhatsApp Us</span>
              </a>

              <a href="mailto:selectionspk.official@gmail.com"
                className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-colors sm:col-span-2">
                <MdEmail className="w-4 h-4 text-[#f09c27] flex-shrink-0" />
                <span className="text-gray-300 break-all">selectionspk.official@gmail.com</span>
              </a>

              <div className="flex items-start gap-2.5 bg-white/5 rounded-xl px-3 py-2.5">
                <MdLocationOn className="w-4 h-4 text-[#f09c27] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-xs leading-snug">28 Davis Road, Garhi Shahu, Lahore, Pakistan</span>
              </div>

              <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3 py-2.5">
                <MdAccessTime className="w-4 h-4 text-[#f09c27] flex-shrink-0" />
                <span className="text-gray-400 text-xs">Mon–Sat: 10am – 8pm</span>
              </div>
            </div>

            <Link to="/contact"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 w-full sm:w-auto justify-center sm:justify-start"
              style={{ background: '#f09c27', color: '#1a1a2e' }}>
              Get in Touch <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>

        {/* ── Newsletter ── */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold text-sm">Subscribe to our newsletter</p>
              <p className="text-gray-400 text-xs mt-0.5">Get exclusive deals and new arrival alerts</p>
            </div>
            <form className="flex gap-2 w-full sm:w-auto" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Your email address"
                className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]" />
              <button type="submit"
                className="px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all hover:scale-105"
                style={{ background: '#f09c27', color: '#1a1a2e' }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/10 pt-6 flex flex-col items-center gap-3 text-xs text-gray-500">
          <p className="text-center">© {new Date().getFullYear()} Selections.pk. All rights reserved. Made with love in Pakistan.</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link to="/about"   className="hover:text-[#f09c27] transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-[#f09c27] transition-colors">Contact</Link>
            <a href="#" className="hover:text-[#f09c27] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#f09c27] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#f09c27] transition-colors">Returns Policy</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
