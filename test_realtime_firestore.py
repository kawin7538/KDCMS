from dbHelper import db

# Create a callback on_snapshot function to capture changes
def on_snapshot(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        print(u'Received document snapshot: {}'.format(doc.id))
    print(change)

doc_ref = db.collection('song')

# Watch the document
doc_watch = doc_ref.on_snapshot(on_snapshot)