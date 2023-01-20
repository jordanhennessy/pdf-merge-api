#!/bin/bash

docker run -p 8501:8501 --name frontend --net pdf-net -d pdf-merge-frontend  
