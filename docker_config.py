
__author__    =	"Ashwini Chandrasekar(@sriniash)"
__email__     =	"ASHWINI_CHANDRASEKAR@homedepot.com"
__version__   =	"1.0"
__doc__       = "Gunicorn setup for Dockerfile"


# docker_config.py
bind = '0.0.0.0:8080'
workers = '10'
errorlog = '/usr/src/app/gunicorn.log'
timeout = '240'
