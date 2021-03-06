## Description
TUI test project.

## Running the app
App running on Docker.

### Steps to run:
1. Create `docker-compose.yml` and `.env` files.
```bash
# For creating docker-compose:
$ cp docker-compose.example.yml docker-compose.yml

# For creating .env:
$ cp .env.example .env
```

2. [Get](https://github.com/settings/tokens) your GitHub Api key.
3. Insert the key into `GIT_HUB_API_KEY` constant in `.env`.
4. To run the app in `development` mode:

```bash
$ docker compose build
$ docker compose up
```
5. To run app in `production` mode:  
Change `NODE_ENV` constant in `.env` file.  
Run commands from step above.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```
