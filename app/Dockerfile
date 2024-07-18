# syntax=docker/dockerfile:1

FROM python:3.12.4-bookworm

RUN mkdir /opt/maierbox

RUN apt update
RUN apt install -y nginx

COPY requirements.txt /opt/maierbox/requirements.txt
RUN python -m pip install -r /opt/maierbox/requirements.txt
RUN python -m pip install gunicorn==22.0.0

COPY albums /opt/maierbox/albums
COPY categories /opt/maierbox/categories
COPY comments /opt/maierbox/comments
COPY images /opt/maierbox/images
COPY maierbox /opt/maierbox/maierbox
COPY posts /opt/maierbox/posts
COPY tags /opt/maierbox/tags
COPY watermarks /opt/maierbox/watermarks
COPY manage.py /opt/maierbox/manage.py

RUN head /dev/random | head -c512 > /opt/maierbox/secret.key

EXPOSE 8000
WORKDIR /opt/maierbox
CMD ["gunicorn", "maierbox.wsgi:application", "--bind", "0.0.0.0:8000"]
