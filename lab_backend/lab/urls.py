from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    LabTestViewSet,
    LabOrderViewSet,
    test_catalog_list,
    lab_order_events_list,
)

router = DefaultRouter()
router.register(r"lab-tests", LabTestViewSet, basename="lab-tests")
router.register(r"lab-orders", LabOrderViewSet, basename="lab-orders")

urlpatterns = [
    path("test-catalog/", test_catalog_list),
    path("lab-order-events/", lab_order_events_list),
] + router.urls
