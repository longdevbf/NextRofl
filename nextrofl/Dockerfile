FROM python:3.11-slim

WORKDIR /app

# Install curl for ROFL API calls
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY app.py /app/

RUN chmod +x /app/app.py

EXPOSE 8080

CMD ["python3", "/app/app.py"]