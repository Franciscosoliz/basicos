from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="LabTest",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("test_name", models.CharField(max_length=150)),
                ("sample_type", models.CharField(max_length=60)),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("is_available", models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name="LabOrder",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("patient_name", models.CharField(max_length=120)),
                ("status", models.CharField(max_length=20)),
                ("result_summary", models.CharField(blank=True, max_length=300, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("test", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="orders", to="lab.labtest")),
            ],
        ),
    ]
