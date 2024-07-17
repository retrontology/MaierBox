FROM python:3.12.4-bookworm

RUN mkdir /opt/maierbox
COPY requirements.txt /opt/maierbox/requirements.txt
RUN python -m pip install -r /opt/maierbox/requirements.txt
RUN python -m pip install gunicorn==22.0.0
RUN apt update
RUN apt install nginx
COPY albums /opt/maierbox/albums
COPY categories /opt/maierbox/categories
COPY categories /opt/maierbox/comments
COPY categories /opt/maierbox/images
COPY categories /opt/maierbox/maierbox
COPY categories /opt/maierbox/posts
COPY categories /opt/maierbox/tags
COPY categories /opt/maierbox/watermarks
