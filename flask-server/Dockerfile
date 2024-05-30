FROM python:3.10 as build
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5000
ENV FLASK_APP=server.py
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5000", "server:app"]