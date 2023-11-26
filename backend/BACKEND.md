# BookBarter

### Backend

## How to Run

Before anything else, you'll need a `backend/.env` file that looks like following:

```
POSTGRES_USER=bookbarter_user
POSTGRES_PASSWORD=bookbarter_pass
POSTGRES_DB=bookbarter_db
```

Optionally, you can add `VERBOSE=1` to enable database query logging for debugging.
Commenting this variable with a `#` or setting it to zero will stop the logging.

### Docker compose up

This deploys a multi-container application, made of a `postgres` database and an `adminer` database moniter.

```bash
docker compose up -d
```

You can now use `adminer` running at [`localhost:8001`](http://localhost:8001) to interact with the database.

### Docker compose down

```bash
docker compose down --rmi local -v
```

This takes down all the containers, and removes the attached volumes, networks etc. for a complete cleanup.

## Contributing Guide

1. Run `npm install`
1. Make your code changes and write appropriate tests
    1. Keep your test files in `spec` directory as `spec/<filename>Spec.js` (check [`spec/userSpec.js`](./spec/userSpec.js) for template)
    1. To run a specific test file, use `npm test spec/<filename>.js`
    1. Validate all tests using `npm test`
1. Run `npm run pretty` to automatically format the code
1. At this point, your docker should be running.
1. Run `npm start` to start the server at [`localhost:8000`](http://localhost:8000). Check database connectivity by accessing [`localhost:8000/status/postgres`](http://localhost:8000/status/postgres)
