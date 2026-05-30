"""
IndexNow integration — instantly notifies Bing and Yandex when a
product page is created or updated, without waiting for a recrawl.

Spec: https://www.indexnow.org/documentation
"""
import logging
import urllib.request
import json
from django.conf import settings

logger = logging.getLogger(__name__)

INDEXNOW_ENDPOINTS = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
]

SITE_BASE = 'https://selections.pk'


def ping_indexnow(urls: list[str]):
    """
    Submit one or more URLs to IndexNow endpoints.
    Called from signals — fires after product save, never blocks the request.
    """
    key = getattr(settings, 'INDEXNOW_KEY', '')
    if not key or getattr(settings, 'DEBUG', False):
        return

    payload = json.dumps({
        'host': 'selections.pk',
        'key': key,
        'keyLocation': f'{SITE_BASE}/{key}.txt',
        'urlList': urls,
    }).encode('utf-8')

    for endpoint in INDEXNOW_ENDPOINTS:
        try:
            req = urllib.request.Request(
                endpoint,
                data=payload,
                headers={'Content-Type': 'application/json; charset=utf-8'},
                method='POST',
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                logger.info('IndexNow %s → %s (status %s)', endpoint, urls, resp.status)
        except Exception as exc:
            logger.warning('IndexNow ping failed (%s): %s', endpoint, exc)


def ping_product(product):
    """Ping a single product's canonical URL."""
    if product.is_active and product.slug:
        ping_indexnow([f'{SITE_BASE}/products/{product.slug}'])
