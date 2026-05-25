import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  MdLocationOn, MdPhone, MdEmail, MdAccessTime,
  MdSupportAgent, MdSend,
} from 'react-icons/md'
import {
  FaFacebookF, FaInstagram, FaYoutube, FaTiktok,
  FaArrowRight, FaChevronDown, FaChevronUp,
  FaBoxOpen, FaShippingFast,
} from 'react-icons/fa6'

const FAQS = [
  { q: 'How long does delivery take?',      a: 'We deliver within 3–5 business days across Pakistan. Major cities like Karachi, Lahore, and Islamabad are typically delivered in 2–3 days.' },
  { q: 'Can I pay on delivery?',             a: 'Yes! Cash on Delivery (COD) is our primary payment method. You only pay when your order arrives at your doorstep.' },
  { q: 'What is your return policy?',        a: "We offer a 7-day easy return policy. If you're not satisfied, contact us within 7 days of delivery and we'll arrange a pickup and full refund." },
  { q: 'How do I track my order?',           a: 'Once your order is shipped, you\'ll receive a tracking number via SMS and email. You can also check your order status in your account under "Orders".' },
  { q: 'Are your product sizes accurate?',   a: 'Yes, each product has a detailed size chart. We recommend checking measurements before ordering. If unsure, contact us for assistance.' },
  { q: 'Do you offer exchanges?',            a: 'Absolutely! We offer free size exchanges within 7 days. Contact our support team and we\'ll sort it out quickly.' },
]

const CONTACT_CARDS = [
  { Icon: MdLocationOn,  title: 'Visit Us',        lines: ['28 Davis Road', 'Garhi Shahu, Lahore', '54000, Pakistan'],   color: 'bg-blue-50 text-blue-600' },
  { Icon: MdPhone,       title: 'Call Us',          lines: ['+92 317 8968927', 'Mon–Sat, 10am–8pm'], color: 'bg-green-50 text-green-600' },
  { Icon: MdEmail,       title: 'Email Us',         lines: ['info@selections.pk', 'support@selections.pk', 'Response within 24 hrs'], color: 'bg-orange-50 text-orange-600' },
  { Icon: MdAccessTime,  title: 'Business Hours',   lines: ['Mon–Fri: 10am – 8pm', 'Saturday: 10am – 6pm', 'Sunday: Closed'],           color: 'bg-purple-50 text-purple-600' },
]

const SOCIAL = [
  { Icon: FaFacebookF, label: 'Facebook',  handle: '@selections.official', href: 'https://www.facebook.com/selections.official', bg: 'bg-blue-600' },
  { Icon: FaInstagram, label: 'Instagram', handle: '@selections.pk',       href: 'https://www.instagram.com/selections.pk/',    bg: 'bg-pink-600' },
  { Icon: FaYoutube,   label: 'YouTube',   handle: '@Selections.Offical',  href: 'https://www.youtube.com/@Selections.Offical', bg: 'bg-red-600' },
  { Icon: FaTiktok,    label: 'TikTok',    handle: '@selections.official', href: 'https://www.tiktok.com/@selections.official', bg: 'bg-gray-800' },
]

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true) }

  return (
    <>
      <Helmet>
        <title>Contact Us – Selections.pk | Call +92 317 8968927 | Lahore Fashion Store</title>
        <meta name="description" content="Contact Selections.pk for orders, returns or product questions. Call +92 317 8968927 or WhatsApp us. Visit us at 28 Davis Road, Garhi Shahu, Lahore. Mon–Sat 10am–8pm." />
        <meta name="keywords" content="contact selections.pk, selections.pk phone number, selections.pk customer support, selections pk lahore, fashion store lahore contact" />
        <link rel="canonical" href="https://selections.pk/contact" />
        <meta property="og:title" content="Contact Selections.pk – Call +92 317 8968927" />
        <meta property="og:description" content="Contact Selections.pk for orders or returns. Call or WhatsApp +92 317 8968927. Mon–Sat 10am–8pm. Based in Lahore, Pakistan." />
        <meta property="og:url" content="https://selections.pk/contact" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LocalBusiness",
              "name": "Selections.pk",
              "url": "https://selections.pk",
              "telephone": "+92-317-8968927",
              "email": "info@selections.pk",
              "description": "Pakistan's premium online fashion store. Shop abayas, lawn suits, kameez and accessories with nationwide delivery.",
              "priceRange": "PKR 500–PKR 10,000",
              "currenciesAccepted": "PKR",
              "paymentAccepted": "Cash on Delivery",
              "openingHoursSpecification": [
                { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "10:00", "closes": "20:00" },
                { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "18:00" }
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "28 Davis Road, Garhi Shahu",
                "addressLocality": "Lahore",
                "addressRegion": "Punjab",
                "postalCode": "54000",
                "addressCountry": "PK"
              },
              "sameAs": [
                "https://www.facebook.com/selections.official",
                "https://www.instagram.com/selections.pk/",
                "https://www.youtube.com/@Selections.Offical",
                "https://www.tiktok.com/@selections.official"
              ]
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "How long does delivery take?", "acceptedAnswer": { "@type": "Answer", "text": "We deliver within 3–5 business days across Pakistan. Major cities like Karachi, Lahore, and Islamabad are typically delivered in 2–3 days." } },
                { "@type": "Question", "name": "Can I pay on delivery?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Cash on Delivery (COD) is our primary payment method. You only pay when your order arrives at your doorstep." } },
                { "@type": "Question", "name": "What is your return policy?", "acceptedAnswer": { "@type": "Answer", "text": "We offer a 7-day easy return policy. If you're not satisfied, contact us within 7 days of delivery and we'll arrange a pickup and full refund." } },
                { "@type": "Question", "name": "How do I track my order?", "acceptedAnswer": { "@type": "Answer", "text": "Once your order is shipped, you'll receive a tracking number via SMS and email. You can also check your order status in your account under Orders." } },
                { "@type": "Question", "name": "Do you offer exchanges?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely! We offer free size exchanges within 7 days. Contact our support team and we'll sort it out quickly." } }
              ]
            }
          ]
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden text-white py-24" style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 35%, #7b2d8b 65%, #c0392b 100%)',
      }}>
        {/* Animated mesh blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #f09c27 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', filter: 'blur(50px)' }} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', filter: 'blur(45px)' }} />
        </div>
        {/* Dot mesh pattern */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 0)', backgroundSize: '28px 28px' }} />
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <MdSupportAgent className="w-5 h-5 text-[#f09c27]" />
            We're Here to Help
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-5 leading-tight"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-xl mx-auto leading-relaxed">
            Have a question, concern or just want to say hello?<br className="hidden md:block" />
            Our team is always ready to assist you.
          </p>
          {/* Quick contact pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a href="tel:+923178968927"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ background: '#f09c27', color: '#1a1a2e' }}>
              📞 +92 317 8968927
            </a>
            <a href="mailto:info@selections.pk"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all">
              ✉️ info@selections.pk
            </a>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONTACT_CARDS.map(({ Icon, title, lines, color }) => (
              <div key={title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-3">{title}</h3>
                {lines.map((line, i) => (
                  <p key={i} className={`text-sm ${i === 2 ? 'text-gray-400 mt-1' : 'text-gray-600'}`}>{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Form */}
            <div className="lg:col-span-2">
              <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-3">Send a Message</p>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-6">We'd Love to Hear From You</h2>

              {submitted ? (
                <div className="p-8 rounded-2xl text-center border-2 border-[#f09c27]/30 bg-[#f09c27]/5">
                  <MdSend className="w-14 h-14 mx-auto mb-4 text-[#f09c27]" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-4">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                    style={{ background: '#f09c27' }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50 focus:border-[#f09c27] text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50 focus:border-[#f09c27] text-sm transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+92 300 1234567"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50 focus:border-[#f09c27] text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                      <select name="subject" value={form.subject} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50 focus:border-[#f09c27] text-sm transition-all bg-white">
                        <option value="">Select a topic</option>
                        <option value="order">Order Inquiry</option>
                        <option value="return">Return / Exchange</option>
                        <option value="product">Product Question</option>
                        <option value="delivery">Delivery Issue</option>
                        <option value="payment">Payment Issue</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50 focus:border-[#f09c27] text-sm transition-all resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full py-4 rounded-xl font-bold text-base text-white transition-all hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #f09c27, #e07b00)' }}>
                    <MdSend className="w-5 h-5" /> Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Social */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-heading font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="space-y-3">
                  {SOCIAL.map(({ Icon, label, handle, href, bg }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-[#f09c27]/30 hover:shadow-sm transition-all group">
                      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#f09c27] transition-colors">{label}</p>
                        <p className="text-xs text-gray-400">{handle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick help */}
              <div className="p-6 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}>
                <h3 className="font-heading font-bold mb-4">Quick Help</h3>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-start gap-2.5">
                    <FaBoxOpen className="w-4 h-4 text-[#f09c27] mt-0.5 flex-shrink-0" />
                    <p><strong className="text-white">Track your order</strong> in your account dashboard under "Orders"</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <FaArrowRight className="w-4 h-4 text-[#f09c27] mt-0.5 flex-shrink-0" />
                    <p><strong className="text-white">Return/Exchange</strong> within 7 days of delivery</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <FaShippingFast className="w-4 h-4 text-[#f09c27] mt-0.5 flex-shrink-0" />
                    <p><strong className="text-white">Live Chat</strong> available Mon–Sat, 10am–8pm</p>
                  </div>
                </div>
                <Link to="/orders"
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold w-full justify-center transition-all hover:scale-105"
                  style={{ background: '#f09c27', color: '#1a1a2e' }}>
                  <FaBoxOpen className="w-4 h-4" /> Track My Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-2">Common Questions</p>
            <h2 className="text-3xl font-heading font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <FaChevronUp className="w-3.5 h-3.5 text-[#f09c27] flex-shrink-0" />
                    : <FaChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-3 text-gray-400"
            style={{ height: '300px', background: 'linear-gradient(135deg, #f0f4f8, #e2e8f0)' }}>
            <MdLocationOn className="w-14 h-14 text-[#f09c27]" />
            <p className="font-semibold text-gray-600">28 Davis Road, Garhi Shahu, Lahore 54000</p>
            <a href="https://maps.google.com/?q=28+Davis+Road+Garhi+Shahu+Lahore+Pakistan" target="_blank" rel="noopener noreferrer" className="text-sm text-[#f09c27] hover:underline">Open in Google Maps</a>
          </div>
        </div>
      </section>
    </>
  )
}
