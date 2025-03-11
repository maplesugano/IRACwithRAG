# IRAC with RAG backend

Welcome to the IRAC with RAG API documentation. This API provides tools and endpoints for managing and analyzing UK constitution data using Pinecone, a vector RAG toolkit.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Endpoints](#endpoints)
- [Deploy](#deploy)

## Introduction

This project aims to provide a robust backend for managing and analyzing UK constitution data. By leveraging Pinecone and a vector RAG toolkit, it offers efficient and scalable solutions for data retrieval and analysis.

## Getting Started

To get started with the IRAC with RAG API, follow these steps:

1. Run the following command:
```bash
# Install environment
poetry install

# Run
poetry run python src/main.py
```

## Endpoints

heroku endpoints: `https://irac-backend-dd689875432c.herokuapp.com/docs`

## Deploy

In the project root, run:
```bash
docker build -f backend/Dockerfile -t registry.heroku.com/irac-backend/web .
docker tag registry.heroku.com/irac-backend/web registry.heroku.com/irac-backend/web
docker push registry.heroku.com/irac-backend/web
heroku stack:set container -a irac-backend
heroku container:release web -a irac-backend
```