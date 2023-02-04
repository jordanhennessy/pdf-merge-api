# PDF Merge Application

## Summary
This application can be used for merging PDFs and returning the resulting file. Within this repo there are two options
that can be used for this operation. These are:
- **Frontend:** This solution uses the _streamlit_ Python package which creates a web application 
- **API:** This is an API created using the Python _FastAPI_ package

Both of these solutions have Dockerfiles and scripts included that allow their containerization.
Further information on both solutions, including their usage can be found below

## Frontend Solution:
### Starting as development environment
- Ensure the _streamlit_ Python package is installed: `pip show streamlit`, if not then install using `pip install streamlit`
- Start local dev server by running `streamlit run frontend.py` in the frontend directory
- The application should now be visible in the browser at `localhost:8501`

### Building and running Docker image
- In the frontend directory, run `./build-frontend.sh`
- Run `./launch-frontend.sh`
- The application should now be visible in the browser at `localhost:8501`

