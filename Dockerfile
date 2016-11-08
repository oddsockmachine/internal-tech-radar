FROM python:2-onbuild

CMD ["gunicorn", "--config=docker_config.py", "wsgi:app"]
