# Lab Backend

En cada máquina, crear el entorno virtual con el Python de esa PC:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
```

La carpeta `.venv` no se sube a Git; cada quien la genera en su equipo.
