import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('kdcms-4cb95-firebase-adminsdk-m8vz5-825e85eea2.json')
firebase_admin.initialize_app(cred)

db = firestore.client()