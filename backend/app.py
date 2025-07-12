# coding: utf-8

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier 
from sklearn import metrics
from flask import Flask, request, render_template
import pickle
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = "model/Churn_predictor.sav"
COLUMNS_PATH = "model/Churn_model_columns.pkl"

# Load model columns at startup
if os.path.exists(COLUMNS_PATH):
    with open(COLUMNS_PATH, 'rb') as f:
        MODEL_COLUMNS = pickle.load(f)
else:
    MODEL_COLUMNS = None

df_1=pd.read_csv("Data_analysis/first_telc.csv")

q = ""

@app.route("/")
def index():
    return {"message": "Churn Prediction API is running!"}

@app.route("/predict", methods=['POST'])
def api_predict():
    data = request.get_json()
    # Extract all 19 fields from JSON
    try:
        input_data = [
            data['SeniorCitizen'],
            data['MonthlyCharges'],
            data['TotalCharges'],
            data['gender'],
            data['Partner'],
            data['Dependents'],
            data['PhoneService'],
            data['MultipleLines'],
            data['InternetService'],
            data['OnlineSecurity'],
            data['OnlineBackup'],
            data['DeviceProtection'],
            data['TechSupport'],
            data['StreamingTV'],
            data['StreamingMovies'],
            data['Contract'],
            data['PaperlessBilling'],
            data['PaymentMethod'],
            data['tenure']
        ]
    except Exception as e:
        return {"error": f"Missing or invalid input: {str(e)}"}, 400

    model = pickle.load(open(MODEL_PATH, "rb"))
    new_df = pd.DataFrame([input_data], columns = ['SeniorCitizen', 'MonthlyCharges', 'TotalCharges', 'gender', 
                                           'Partner', 'Dependents', 'PhoneService', 'MultipleLines', 'InternetService',
                                           'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport',
                                           'StreamingTV', 'StreamingMovies', 'Contract', 'PaperlessBilling',
                                           'PaymentMethod', 'tenure'])
    df_2 = pd.concat([df_1, new_df], ignore_index = True)
    labels = ["{0} - {1}".format(i, i + 11) for i in range(1, 72, 12)]
    df_2['tenure_group'] = pd.cut(df_2.tenure.astype(int), range(1, 80, 12), right=False, labels=labels)
    df_2.drop(columns= ['tenure'], axis=1, inplace=True)
    new_df__dummies = pd.get_dummies(df_2[['gender', 'SeniorCitizen', 'Partner', 'Dependents', 'PhoneService',
           'MultipleLines', 'InternetService', 'OnlineSecurity', 'OnlineBackup',
           'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies',
           'Contract', 'PaperlessBilling', 'PaymentMethod','tenure_group']])
    # Remove duplicate columns if any
    new_df__dummies = new_df__dummies.loc[:, ~new_df__dummies.columns.duplicated()]
    if MODEL_COLUMNS is not None:
        new_df__dummies = new_df__dummies.reindex(columns=MODEL_COLUMNS, fill_value=0)
    single = model.predict(new_df__dummies.tail(1))
    probablity = model.predict_proba(new_df__dummies.tail(1))[:,1]
    if single==1:
        o1 = "This customer is likely to be churned!!"
        o2 = f"Confidence: {probablity[0]*100:.2f}"
    else:
        o1 = "This customer is likely to continue!!"
        o2 = f"Confidence: {probablity[0]*100:.2f}"
    return {"success":True,"result": o1, "confidence": o2}

handler = app
# app.run()