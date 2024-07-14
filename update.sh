git pull &&\
source bin/activate &&\
pip install -r requirements.txt &&\
python3 manage.py collectstatic --noinput &&\
sudo systemctl restart apache2