## Subroker [![Build Status](https://travis-ci.com/swsnu/swpp2021-team8.svg?branch=master)](https://travis-ci.com/swsnu/swpp2021-team8) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2021-team8&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2021-team8) [![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2021-team8/badge.svg?branch=master&service=github)](https://coveralls.io/github/swsnu/swpp2021-team8?branch=master&service=github)

---

## How to Start

### Installation

```shell
source ~/virtualenv/python3.7/bin/activate
pip install -r backend/requirements.txt
cd frontend
yarn install
cd ..
```

### Frontend

```shell
cd frontend
yarn start
```

### Backend

```shell
cd backend/app
python manage.py migrate
python manage.py runserver
```

### Backend deployment

Should change `settings.py`'s ALLOWED_HOSTS

```shell
$ docker build -t backend .
$ docker -d -p 8000:8000 --rm --name backend_container backend:latest
```

### Frontend deployment

Should add the security group inbound rule to open port 80

```shell
$ docker build -t frontend .
$ docker run -d -p 80:80 --rm --name frontend_container frontend
```
