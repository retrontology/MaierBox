python3 manage.py collectstatic --noinput --clear
python3 manage.py migrate
gunicorn maierbox.wsgi:application --bind 0.0.0.0:8000
