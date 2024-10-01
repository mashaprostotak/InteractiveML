# Dummy Backend

## Running it without docker container

### Installation

This project required python 3.11, you can use it through conda, pyenv, or you preferred solution.
For [pyenv](https://github.com/pyenv/pyenv) follow the installation instructions and run `pyenv init`, you can then run `pyenv install 3.11`.
Restarting the shell and running `python --version` should now show the correct version thanks to the `.python-version` file.

You can now create a virtual environment and install the requirements through [pip](https://pypi.org/project/pip/) as follows:

```
cd backend-project
python -m venv .venv
source .venv/bin/activate
python -m pip install .
```

If you want to make changes and test them in real time, you can install the package in editable mode (`-e`):

```
python -m pip install -e .
```

### How to run

Once the package has been installed, you can run the server by running the `start-server` command directly on your terminal, or by running `python -m dummy_server.router.app`.

## Running it with docker container locally

Follow the instructions present in the parent directory.

## Constructing the model

Simply run the following:

```bash
DATA_PATH=/path/to/data python -m dummy_server.models.gaussian_process
# or
docker compose exec -e DATA_PATH=/srv/backend-app/data backend python -m dummy_server.models.gaussian_process
```

If you want to train the model on all the available data use the flag `--full-train`.
