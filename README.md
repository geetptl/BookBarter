# BookBarter
### Backend for Software Engineering - Fall 2023 project

## How to Run

Before anything else, you'll need a `.env` file that looks like following:

```
POSTGRES_USER=bookbarter_user
POSTGRES_PASSWORD=bookbarter_pass
POSTGRES_DB=bookbarter_db
```

### Docker compose up

This deploys a multi-container application (a `node.js` application, a `postgres` database and an `adminer` database moniter)

```bash
docker compose up -d
```

### Test it out

```bash
curl -i localhost:8000/status
```

If you recieve a `node.js server is running` response, you can go ahead and open [`localhost:8000`](http://localhost:8000) in the browser to open the application. More info is on the application is available in [`docs`](./docs/).

You can also use `adminer` running at [`localhost:8001`](http://localhost:8001) to interact with the database. The database is not accesible via CLI from the hosting environment.

### Docker compose down

```bash
docker compose down --rmi local -v
```

This takes down all the containers running the application, and removes the attached volumes, networks etc. for a complete cleanup.

## Contributing Guide

_I'll be making some updates soon. Hang on!_

1. Fork this repository
1. Clone the forked repository onto your computer
1. Run `npm install`
1. Make your code changes and write appropriate tests
    1. Keep your test files in `spec` directory as `spec/<filename>Spec.js` (check [`spec/userSpec.js`](./spec/userSpec.js) for template)
    1. To run a specific test file, use `npm test spec/<filename>.js`
    1. Validate all tests using `npm test`
1. Use docker to run the project locally as described above.
1. After satisfaction, commit and push your changes.
1. Submit a pull request (PR)
1. Follow the comments on your PR