# IRAC with RAG frontend

Typescript + React web based application for visualising and querying vector database for UK constitution

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

To setup the minimum environment:

```bash
# Navigate to the project directory
cd IRACwithRAG/frontend

# Install dependencies
npm install
```

Place the vectordb .csv files in `public/`.

## Usage

To access to the website:

```bash
# Run
npm start
```

## Docker

```bash
docker build -f frontend/Dockerfile -t registry.heroku.com/frontend/web .
docker tag registry.heroku.com/frontend/web registry.heroku.com/irac-frontend/web
docker push registry.heroku.com/irac-frontend/web
heroku stack:set container -a irac-frontend
heroku container:release web -a irac-frontend
```