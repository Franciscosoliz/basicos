from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


MENSAJES_ES = {
    "Not found.": "No encontrado.",
    "No LabTest matches the given query.": "No existe ninguna prueba de laboratorio con ese id.",
    "No LabOrder matches the given query.": "No existe ninguna orden de laboratorio con ese id.",
}


def traducir_detalle(detail):
    if isinstance(detail, str) and detail in MENSAJES_ES:
        return MENSAJES_ES[detail]
    if isinstance(detail, str) and "LabTest" in detail and "query" in detail:
        return "No existe ninguna prueba de laboratorio con ese id."
    if isinstance(detail, str) and "LabOrder" in detail and "query" in detail:
        return "No existe ninguna orden de laboratorio con ese id."
    if isinstance(detail, list):
        return [traducir_detalle(d) for d in detail]
    if isinstance(detail, dict):
        return {k: traducir_detalle(v) for k, v in detail.items()}
    return detail


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None and hasattr(response, "data") and "detail" in response.data:
        response.data["detail"] = traducir_detalle(response.data["detail"])
    return response
