#!/bin/bash

cd ..

docker build -f frontend/Dockerfile-frontend -t pdf-merge-frontend .
