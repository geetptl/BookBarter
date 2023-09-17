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