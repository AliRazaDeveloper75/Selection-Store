import threading
from django.db.models.signals import post_save
from django.dispatch import receiver


def _ping_async(product):
    """Ping IndexNow in a background thread so it never delays the API response."""
    from apps.seo.indexnow import ping_product
    ping_product(product)


@receiver(post_save, sender='products.Product')
def product_saved(sender, instance, **kwargs):
    """Fire IndexNow whenever an active product is created or updated."""
    if instance.is_active:
        t = threading.Thread(target=_ping_async, args=(instance,), daemon=True)
        t.start()
