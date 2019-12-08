#https://pypi.org/project/firestore-orm/
try:
    import firebase_admin
except:
    import os
    installScript='pip install firebase-admin'
    os.system('start cmd /k '+installScript)
    import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import time

# Use a service account
cred = credentials.Certificate('kdcms-4cb95-firebase-adminsdk-m8vz5-825e85eea2.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def main():

    # use db.collection to access to 'collection' (look like table name in Postgresql)
    test_user_ref=db.collection('testUser')

    temp_time=time.time()
    print("[START] Adding some data")

    # use ref.document() to access to to new row (if contain some sting that not contain it, it'll be create automatically)
    # use ref.document().set() to insert new row with column that perform using dictionary type
    test_user_ref.add({
        'id':1,
        'firstname':'Kawin',
        'lastname':'Chinpong'
    })
    test_user_ref.add({
        'id':2,
        'firstname':'Kaewklao',
        'lastname':'Thawornwattana'
    })
    test_user_ref.add({
        'id':3,
        'firstname':'Nattanon',
        'lastname':'Theptakop'
    })
    test_user_ref.add({
        'id':4,
        'firstname':'Peerawit',
        'lastname':'Amartmontri'
    })

    print("[STOP] Adding complete,",time.time()-temp_time)

    temp_time=time.time()
    print("[START] Reading some data")

    # use ref.stream() to pull all data from db
    docs=test_user_ref.stream()
    for doc in docs:
        print("{} : {}".format(doc.id,doc.to_dict()))

    print("[STOP] Reading complete,",time.time()-temp_time)

    temp_time=time.time()
    print("[START] Reading some data")

    query=test_user_ref.where('id','==',2)
    docs=query.stream()
    for doc in docs:
        test_user_ref.document(doc.id).update({
            'firstname':'Kittapat'
        })

    print("[STOP] Updating complete,",time.time()-temp_time)

    temp_time=time.time()
    print("[START] Reading name DESC sorted data")

    # define query to run sorting using order by
    query=test_user_ref.order_by('firstname',direction=firestore.Query.DESCENDING)
    docs=query.stream()
    for doc in docs:
        print("{} : {}".format(doc.id,doc.to_dict()))

    print("[STOP] Reading complete,",time.time()-temp_time)

    temp_time=time.time()
    print("[START] Reading id sorted data")

    query=test_user_ref.order_by('id')
    docs=query.stream()
    for doc in docs:
        print("{} : {}".format(doc.id,doc.to_dict()))

    print("[STOP] Reading complete,",time.time()-temp_time)

    temp_time=time.time()
    print("[START] Deleting some data")

    # looping for deleting all element in test_user_ref
    docs=test_user_ref.stream()
    for doc in docs:
        doc.reference.delete()

    print("[STOP] Deleting complete,",time.time()-temp_time)

if __name__ == "__main__":
    main()