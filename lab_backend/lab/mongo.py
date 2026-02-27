from django.conf import settings
from pymongo import MongoClient
from datetime import datetime

_client = MongoClient(settings.MONGO_URI)
db = _client[settings.MONGO_DB]
test_catalog = db["test_catalog"]
lab_order_events = db["lab_order_events"]


def log_lab_order_event(lab_order_id, event_type, source="WEB", note=None):
    lab_order_events.insert_one({
        "lab_order_id": lab_order_id,
        "event_type": event_type,
        "source": source,
        "note": note or "",
        "created_at": datetime.utcnow(),
    })
