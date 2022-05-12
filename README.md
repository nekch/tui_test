## Description
TUI test project.

## Running the app
App running on Docker.

### Steps to run:
1. Create docker-compose.yml.
```bash
$ cp docker-compose.example.yml docker-compose.yml
```

2. [Get](https://github.com/settings/tokens) your GitHub Api key.
3. Insert the key into GIT_HUB_API_KEY constant in `docker-compose.yml`.
4. To run the app in `development` mode:

```bash
$ docker compose build
$ docker compose up
```
5. To run app in `production` run:
```bash
$ sed -i 's/development/production/gI' docker-compose.yml
$ docker compose build
$ docker compose up
```

## Test

```bash
# unit tests
$ npm run test
```
