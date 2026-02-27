from rest_framework import serializers
from .models import LabTest, LabOrder


class LabTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTest
        fields = ["id", "test_name", "sample_type", "price", "is_available"]


class LabOrderSerializer(serializers.ModelSerializer):
    test_name = serializers.CharField(source="test.test_name", read_only=True)

    class Meta:
        model = LabOrder
        fields = ["id", "test", "test_name", "patient_name", "status", "result_summary", "created_at"]
