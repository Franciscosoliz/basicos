from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import LabTest, LabOrder
from .serializers import LabTestSerializer, LabOrderSerializer
from .permissions import IsAdminOrReadOnly
from .mongo import log_lab_order_event


class LabTestViewSet(viewsets.ModelViewSet):
    queryset = LabTest.objects.all().order_by("id")
    serializer_class = LabTestSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["test_name", "sample_type"]
    ordering_fields = ["id", "test_name", "price", "is_available"]


class LabOrderViewSet(viewsets.ModelViewSet):
    queryset = LabOrder.objects.select_related("test").all().order_by("-id")
    serializer_class = LabOrderSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["test", "status"]
    search_fields = ["patient_name", "result_summary", "test__test_name"]
    ordering_fields = ["id", "patient_name", "status", "created_at"]

    def get_permissions(self):
        if self.action in ("list", "retrieve", "create"):
            return [AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        order = serializer.save(status="CREATED")
        source = self.request.data.get("source", "WEB")
        if source not in ("WEB", "MOBILE", "SYSTEM"):
            source = "WEB"
        log_lab_order_event(
            lab_order_id=order.id,
            event_type="CREATED",
            source=source,
            note=self.request.data.get("note"),
        )


@api_view(["GET"])
@permission_classes([AllowAny])
def test_catalog_list(request):
    from .mongo import test_catalog
    cursor = test_catalog.find({}).sort("test_name", 1)
    items = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        if "created_at" in doc and hasattr(doc["created_at"], "isoformat"):
            doc["created_at"] = doc["created_at"].isoformat()
        items.append(doc)
    return Response(items)


@api_view(["GET"])
@permission_classes([AllowAny])
def lab_order_events_list(request):
    from .mongo import lab_order_events
    lab_order_id = request.query_params.get("lab_order_id")
    query = {}
    if lab_order_id is not None:
        try:
            query["lab_order_id"] = int(lab_order_id)
        except ValueError:
            pass
    cursor = lab_order_events.find(query).sort("created_at", -1)
    items = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        if "created_at" in doc and hasattr(doc["created_at"], "isoformat"):
            doc["created_at"] = doc["created_at"].isoformat()
        items.append(doc)
    return Response(items)
