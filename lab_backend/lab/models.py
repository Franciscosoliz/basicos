from django.db import models


class LabTest(models.Model):
    test_name = models.CharField(max_length=150)
    sample_type = models.CharField(max_length=60)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)

    class Meta:
        verbose_name = "prueba de laboratorio"
        verbose_name_plural = "pruebas de laboratorio"

    def __str__(self):
        return self.test_name


class LabOrder(models.Model):
    STATUS_CHOICES = [
        ("CREATED", "CREATED"),
        ("PROCESSING", "PROCESSING"),
        ("COMPLETED", "COMPLETED"),
        ("CANCELLED", "CANCELLED"),
    ]
    test = models.ForeignKey(LabTest, on_delete=models.PROTECT, related_name="orders")
    patient_name = models.CharField(max_length=120)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    result_summary = models.CharField(max_length=300, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "orden de laboratorio"
        verbose_name_plural = "órdenes de laboratorio"

    def __str__(self):
        return f"Orden #{self.id} {self.patient_name}"
