FROM python:3.11-slim as dev

WORKDIR /srv/backend-app

COPY pyproject.toml setup.py README.md ./
COPY src/dummy_server/__init__.py ./src/dummy_server/

RUN python -m pip install --no-cache-dir -e .

CMD [ "python", "-m", "dummy_server.router.app", "--host", "0.0.0.0", "--debug"]

FROM dev as prod

COPY . .

RUN python -m pip install --no-cache-dir .

CMD ["python", "-m", "dummy_server.router.app", "--host", "0.0.0.0"]
