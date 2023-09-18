# Backend for Software Engineering - Fall 2023 project

## How to Run

### Build Docker Image

```
docker build -t backend .
```

### Run Docker Image

```
docker run -itd --rm -p 3000:3000 backend
```

### Test it out

```
curl -i localhost:3000
```

### How to stop Docker Image

```
docker stop <container-id>
```

## Contribute

1. Fork this repository
2. Clone the forked repository onto your computer
3. Make changes, write tests, commit, and push
4. Make a pull request
5. Follow the comments on your PR
