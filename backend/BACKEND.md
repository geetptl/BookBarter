# BookBarter

### Backend

## How to Run

Before anything else, you'll need a `backend/.env` file that looks like following:

```
SQLITE_DB_PATH=.db
SQLITE_DB_INIT_FILES=scripts/01-ddl.sql,scripts/02a-book.sql,scripts/02b-genre.sql,scripts/02c-book_genre_mapping.sql
JWT_KEY=seproject
JWT_EXPIRESIN=1h
GOOGLE_MAPS_API_KEY=AIzaSyBYwdUEdkF574H969pPecpkd8J3qO3ZP94
```

Optionally, you can add `VERBOSE=1` to enable database query logging for debugging.
Commenting this variable with a `#` or setting it to zero will stop the logging.

## Contributing Guide

1. Run `npm install`
1. Make your code changes and write appropriate tests
    1. Keep your test files in `spec` directory as `spec/<filename>Spec.js` (check [`spec/userSpec.js`](./spec/userSpec.js) for template)
    1. To run a specific test file, use `npm test spec/<filename>.js`
    1. Validate all tests using `npm test`
1. Run `npm run pretty` to automatically format the code
1. At this point, your docker should be running.
1. Run `npm start` to start the server at [`localhost:8000`](http://localhost:8000). Check database connectivity by accessing [`localhost:8000/status/postgres`](http://localhost:8000/status/postgres)
