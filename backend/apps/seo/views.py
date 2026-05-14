from django.http import HttpResponse
from django.utils import timezone
from apps.products.models import Product, Category, ProductImage


def sitemap_xml(request):
    base = 'https://selections.pk'
    today = timezone.now().date().isoformat()

    static_urls = [
        {'loc': f'{base}/',         'changefreq': 'daily',   'priority': '1.0', 'lastmod': today},
        {'loc': f'{base}/products', 'changefreq': 'daily',   'priority': '0.9', 'lastmod': today},
        {'loc': f'{base}/about',    'changefreq': 'monthly', 'priority': '0.7', 'lastmod': today},
        {'loc': f'{base}/contact',  'changefreq': 'monthly', 'priority': '0.7', 'lastmod': today},
    ]

    products = Product.objects.filter(is_active=True).prefetch_related('images').order_by('-updated_at')
    categories = Category.objects.filter(is_active=True).values('slug', 'created_at')

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
             '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']

    for u in static_urls:
        lines += [
            '  <url>',
            f'    <loc>{u["loc"]}</loc>',
            f'    <lastmod>{u["lastmod"]}</lastmod>',
            f'    <changefreq>{u["changefreq"]}</changefreq>',
            f'    <priority>{u["priority"]}</priority>',
            '  </url>',
        ]

    for cat in categories:
        lines += [
            '  <url>',
            f'    <loc>{base}/products?category={cat["slug"]}</loc>',
            f'    <lastmod>{cat["created_at"].date().isoformat()}</lastmod>',
            '    <changefreq>weekly</changefreq>',
            '    <priority>0.8</priority>',
            '  </url>',
        ]

    for product in products:
        lastmod = product.updated_at.date().isoformat() if product.updated_at else today
        primary = product.images.filter(is_primary=True).first() or product.images.first()
        img_tag = ''
        if primary and primary.image:
            img_url = request.build_absolute_uri(primary.image.url)
            img_tag = (
                f'\n    <image:image>'
                f'\n      <image:loc>{img_url}</image:loc>'
                f'\n      <image:title>{product.name}</image:title>'
                f'\n    </image:image>'
            )
        lines += [
            '  <url>',
            f'    <loc>{base}/products/{product.slug}</loc>',
            f'    <lastmod>{lastmod}</lastmod>',
            '    <changefreq>weekly</changefreq>',
            '    <priority>0.85</priority>',
            img_tag,
            '  </url>',
        ]

    lines.append('</urlset>')
    return HttpResponse('\n'.join(filter(None, lines)), content_type='application/xml; charset=utf-8')


def robots_txt(request):
    content = """User-agent: *
Allow: /

Sitemap: https://selections.pk/sitemap.xml

Disallow: /admin/
Disallow: /api/
Disallow: /django-admin/
Disallow: /cart
Disallow: /checkout
Disallow: /profile
Disallow: /orders
Disallow: /wishlist
Disallow: /order-success/
"""
    return HttpResponse(content, content_type='text/plain; charset=utf-8')
