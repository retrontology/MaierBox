FROM python:3.12.4-bookworm

RUN mkdir /opt/maierbox
COPY requirements.txt /opt/maierbox/requirements.txt
RUN python -m pip install -r /opt/maierbox/requirements.txt
RUN python -m pip install gunicorn==22.0.0
RUN apt update
RUN apt install nginx
COPY albums /opt/maierbox/albums
COPY categories /opt/maierbox/categories
COPY comments /opt/maierbox/comments
COPY images /opt/maierbox/images
COPY maierbox /opt/maierbox/maierbox
COPY posts /opt/maierbox/posts
COPY tags /opt/maierbox/tags
COPY watermarks /opt/maierbox/watermarks
