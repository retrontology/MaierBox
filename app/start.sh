python3 manage.py collectstatic --noinput --clear;
python3 manage.py migrate;
gunicorn maierbox.wsgi:application --bind unix:/opt/maierbox/socket/gunicorn.sock; #--bind 0.0.0.0:8000
