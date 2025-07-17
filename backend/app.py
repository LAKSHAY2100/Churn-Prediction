import boto3
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn import metrics
from flask import Flask, request
import pickle
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)


sagemaker_runtime = boto3.client('sagemaker-runtime', region_name='ap-south-1')
endpoint_name = 'Custom-sklearn-model-2025-07-17-07-33-48'

# Load model columns at startup
MODEL_COLUMNS = ['SeniorCitizen', 'MonthlyCharges', 'TotalCharges', 'gender_Female',
       'gender_Male', 'Partner_No', 'Partner_Yes', 'Dependents_No',
       'Dependents_Yes', 'PhoneService_No', 'PhoneService_Yes',
       'MultipleLines_No', 'MultipleLines_No phone service',
       'MultipleLines_Yes', 'InternetService_DSL',
       'InternetService_Fiber optic', 'InternetService_No',
       'OnlineSecurity_No', 'OnlineSecurity_No internet service',
       'OnlineSecurity_Yes', 'OnlineBackup_No',
       'OnlineBackup_No internet service', 'OnlineBackup_Yes',
       'DeviceProtection_No', 'DeviceProtection_No internet service',
       'DeviceProtection_Yes', 'TechSupport_No',
       'TechSupport_No internet service', 'TechSupport_Yes', 'StreamingTV_No',
       'StreamingTV_No internet service', 'StreamingTV_Yes',
       'StreamingMovies_No', 'StreamingMovies_No internet service',
       'StreamingMovies_Yes', 'Contract_Month-to-month', 'Contract_One year',
       'Contract_Two year', 'PaperlessBilling_No', 'PaperlessBilling_Yes',
       'PaymentMethod_Bank transfer (automatic)',
       'PaymentMethod_Credit card (automatic)',
       'PaymentMethod_Electronic check', 'PaymentMethod_Mailed check',
       'tenure_group_1 - 12', 'tenure_group_13 - 24', 'tenure_group_25 - 36',
       'tenure_group_37 - 48', 'tenure_group_49 - 60', 'tenure_group_61 - 72']


@app.route("/")
def index():
    return {"message": "Churn Prediction API is running!"}


@app.route("/predict", methods=['POST'])
def api_predict():
    data = request.get_json()
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

    print(input_data)
    new_df = pd.DataFrame([input_data], columns=['SeniorCitizen', 'MonthlyCharges', 'TotalCharges', 'gender',
                                                 'Partner', 'Dependents', 'PhoneService', 'MultipleLines', 'InternetService',
                                                 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport',
                                                 'StreamingTV', 'StreamingMovies', 'Contract', 'PaperlessBilling',
                                                 'PaymentMethod', 'tenure'])
    df_2=new_df
    labels = ["{0} - {1}".format(i, i + 11) for i in range(1, 72, 12)]

    df_2['tenure_group'] = pd.cut(df_2.tenure.astype(int), range(1, 80, 12), right=False, labels=labels)

    df_2.drop(columns=['tenure'], axis=1, inplace=True)

    new_df__dummies = pd.get_dummies(df_2[['gender', 'Partner', 'Dependents', 'PhoneService',
                                           'MultipleLines', 'InternetService', 'OnlineSecurity', 'OnlineBackup',
                                           'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies',
                                           'Contract', 'PaperlessBilling', 'PaymentMethod', 'tenure_group']])
    # Remove duplicate columns if any
    new_df__dummies = new_df__dummies.loc[:,~new_df__dummies.columns.duplicated()]
    new_df__dummies = new_df__dummies.reindex(columns=MODEL_COLUMNS, fill_value=0)
    
    # vvv impp
    new_df__dummies['SeniorCitizen'] = int(input_data[0])
    new_df__dummies['MonthlyCharges'] = float(input_data[1])
    new_df__dummies['TotalCharges'] = float(input_data[2])

    input_features_as_list = new_df__dummies.tail(1).values.tolist()
    input_features_as_list=[
        [int(x) if isinstance(x,bool) else x for x in row]
        for row in input_features_as_list
    ]
    
    payload = json.dumps(input_features_as_list)
    response = sagemaker_runtime.invoke_endpoint(
        EndpointName=endpoint_name,
        ContentType='application/json',
        Body=payload
    )
    result = json.loads(response['Body'].read().decode())
    prediction = result[0]
    print(prediction)
    if prediction == 1:
        o1 = "This customer is likely to be churned!!"
    else:
        o1 = "This customer is likely to continue!!"
    return {"success": True, "result": o1, "confidence": "ok"}

app.run()
