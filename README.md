# Backend for Software Engineering - Fall 2023 project

## How to Run

### Docker Compose Up

```bash
docker compose up -d
```

### Test it out

```bash
curl -i localhost:3000
```

### Stop Docker Image

```bash
docker compose down --rmi local -v
```

## Contributing Guide

1. Fork this repository
1. Clone the forked repository onto your computer
1. Run
    ```bash
    npm install
    ```
1. Make your code changes and write appropriate tests
    1. Keep your test files in `spec` directory as `spec/<filename>Spec.js` (check [`spec/userSpec.js`](./spec/userSpec.js) for template)
    1. To run a specific test file, use `npm test spec/<filename>.js`
    1. Validate all tests using `npm test`
1. Use docker to run the project locally as described in [`README.md`](./README.md).
1. After satisfaction, commit and push your changes.
1. Submit a pull request (PR)
1. Follow the comments on your PR