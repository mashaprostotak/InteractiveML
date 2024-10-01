import os
from setuptools import setup, find_packages


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


setup(
    name="dummy_server",
    version="0.0.1",
    description="Backend for the dummy project of the XAI-IML 2023 course.",
    long_description=read("README.md"),
    classifiers=[
        "Intended Audience :: Developers",
        "Natural Language :: English",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.11",
        "Development Status :: 4 - Beta",
    ],
    entry_points={
        "console_scripts": [
            "start-server = dummy_server.router.app:start_server",
        ]
    },
    install_requires=[
        "Flask>=3.0.3",
        "flask-restful>=0.3.10,<0.4",
        "flask-cors>=4.0.0,<4.1",
        "pandas>=2.2.2",
        "scikit-learn>=1.4.2,<1.5",
    ],
    packages=find_packages(where="src", include=["dummy_server*"]),
    package_dir={"": "src"},
)
