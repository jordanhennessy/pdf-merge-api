#!/bin/bash

docker run -p 8000:8000 --name api --net pdf-net -d pdf-merge-api
