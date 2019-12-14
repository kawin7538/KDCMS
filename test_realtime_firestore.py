from dbHelper import db

# Create a callback on_snapshot function to capture changes
def on_snapshot(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        print('Received document snapshot: {}'.format(doc.id,doc.to_dict()))
    print(changes,read_time)

doc_ref = db.collection('song')

# Watch the document
doc_ref.on_snapshot(on_snapshot)