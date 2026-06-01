# URL Legitimacy Detection System

## Overview

The URL Legitimacy Detection System is a machine learning-powered web application designed to identify whether a given URL is legitimate or malicious. The system helps users detect phishing websites by analyzing URL patterns and predicting their legitimacy using a trained Logistic Regression model.

The project combines Machine Learning, Backend Development, Database Management, and Frontend Development to provide real-time URL classification through an intuitive web interface.

---

## Problem Statement

Phishing attacks are among the most common cybersecurity threats on the internet. Attackers create fraudulent websites that closely resemble legitimate platforms to steal sensitive user information such as passwords, banking credentials, and personal data.

Manually identifying malicious URLs is difficult for users, making an automated detection system necessary. This project aims to provide a fast and reliable solution for detecting potentially harmful URLs using machine learning techniques.

---

## Features

* Real-time URL legitimacy detection
* Machine Learning-based classification
* User-friendly web interface
* Fast prediction response
* Full-stack application architecture
* Secure API communication
* PostgreSQL database integration
* Prediction history storage
* Scalable backend design

---

## Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Machine Learning

* Python
* Scikit-learn
* Logistic Regression

### Database

* PostgreSQL
* NeonDB

### Model Storage

* Pickle (.pkl)

---

## System Architecture

User
↓
React Frontend
↓
Node.js Backend
↓
Python ML Service
↓
Logistic Regression Model
↓
Prediction Result
↓
Frontend Display

---

## Machine Learning Workflow

### 1. Dataset Collection

A phishing URL dataset was collected from Kaggle containing both legitimate and malicious URLs.

### 2. Data Preprocessing

The dataset was cleaned by:

* Removing duplicate records
* Handling missing values
* Standardizing input format
* Preparing data for feature extraction

### 3. Feature Extraction

URLs were transformed into machine-readable features using text vectorization techniques.

### 4. Model Training

A Logistic Regression model from Scikit-learn was trained using the processed dataset.

```python
from sklearn.linear_model import LogisticRegression
```

### 5. Model Evaluation

The trained model was evaluated using:

* Accuracy
* Precision
* Recall
* F1 Score
* Confusion Matrix

### 6. Model Serialization

The trained model and vectorizer were saved using Pickle for deployment.

```python
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))
```

---

## Project Workflow

1. User enters a URL through the frontend.
2. Frontend sends a request to the Node.js backend.
3. Backend forwards the URL to the Python prediction service.
4. The machine learning model processes the URL.
5. Prediction is generated.
6. Result is returned to the backend.
7. Backend sends the response to the frontend.
8. User receives the prediction instantly.

---

## Folder Structure

```plaintext
project-root/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   └── server.js
│
├── ml-model/
│   ├── train_model.ipynb
│   ├── model.pkl
│   ├── vectorizer.pkl
│   └── predictor.py
│
├── screenshots/
│
├── README.md
│
└── package.json
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd project-name
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Python Dependencies

```bash
cd backend/microservices
pip install -r requirements.txt
```

---

## Running the Application

### Start Backend

```bash
npm run dev
```

### Start Frontend

```bash
npm start
```

### Start Python Prediction Service

```bash
uvicorn ml_api:app --reload --port 8000
```

---

## API Endpoint

### Predict URL

```http
POST /api/predict?url=your_url
```

Response

```json
{
    "probability": 2.3341497263915417e-05,
    "is_phishing": false
}
```

---

## Future Enhancements

* Deep Learning-based classification
* Browser extension integration
* Real-time threat intelligence integration
* Improved feature engineering
* Cloud deployment
* URL reputation analysis
* Domain age verification

---

## Learning Outcomes

Through this project, I gained practical experience in:

* Machine Learning model development
* Data preprocessing and feature extraction
* Scikit-learn model training
* Node.js backend development
* REST API development
* PostgreSQL database integration
* Frontend-backend communication
* Cybersecurity-focused application development

---

## Conclusion

The URL Legitimacy Detection System demonstrates how machine learning can be effectively applied to cybersecurity challenges. By integrating a Logistic Regression model with a full-stack web application, the system provides real-time phishing URL detection and helps users make safer browsing decisions.

---

## Author

Ashim Debnath

Computer Science & Engineering Student

Passionate about Machine Learning, Full Stack Development, and Cybersecurity.
