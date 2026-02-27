from django.contrib import admin
from .models import LabTest, LabOrder


@admin.register(LabTest)
class LabTestAdmin(admin.ModelAdmin):
    list_display = ["id", "test_name", "sample_type", "price", "is_available"]


@admin.register(LabOrder)
class LabOrderAdmin(admin.ModelAdmin):
    list_display = ["id", "test", "patient_name", "status", "created_at"]
    list_filter = ["status"]
