# backend/Dockerfile
FROM python:3.7

VOLUME /app
WORKDIR /app

COPY requirements.txt .
COPY . .

RUN pip install -r requirements.txt
RUN pip install uwsgi

CMD uwsgi --wsgi-file backend/wsgi.py --env DJANGO_SETTINGS_MODULE=backend.settings.production --http :8000