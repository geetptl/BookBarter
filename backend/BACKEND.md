# BookBarter

### Backend
We have used an sqlite database. A `.db` file will be generated in the backend folder when you start the server. 
DDLs and DMLs can be found in the [`scripts`](./scripts) folder. database will be populated automatically on server start.

## How to Run

Before anything else, you'll need a `backend/.env` file that looks like the following:

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
2. Make your code changes and write appropriate tests
    i. Keep your test files in `spec` directory as `spec/<filename>Spec.js` (check [`spec/userSpec.js`](./spec/userSpec.js) for template)
    ii. To run a specific test file, use `npm test spec/<filename>.js`
    iii. Validate all tests using `npm test`
3. Run `npm run pretty` to automatically format the code
4. At this point, your docker should be running.
5. Run `npm start` to start the server at [`localhost:8000`](http://localhost:8000). Test server setup by accessing [`localhost:8000/status`](http://localhost:8000/status)
