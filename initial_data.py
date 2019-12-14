from dbHelper import db

import pandas as pd

import time

# df=pd.read_csv("Data/song.csv")

# print(df.to_dict('record'))

def init(tableName):
    print("Start initial",tableName)
    start=time.time()
    df=pd.read_csv("Data/"+tableName+".csv")
    df=df.where((pd.notnull(df)),None)
    inputs=df.to_dict('record')

    print(tableName,"dict created",time.time()-start,"seconds")

    batch=db.batch()
    ref=db.collection(tableName)
    docs=ref.list_documents()

    print(tableName,"reference Created")
    howmany=0
    for doc in docs:
        # doc.reference.delete()
        batch.delete(doc)
        howmany+=1
        if howmany == 490:
            batch.commit()
            howmany=0
    print(tableName,"old data Deleted",time.time()-start,"seconds")
    for inputt in inputs:
        # ref.add(inputt)
        batch.set(ref.document(),inputt)
        howmany+=1
        if howmany == 490:
            batch.commit()
            howmany=0

    batch.commit()

    print(tableName,"Finished",time.time()-start,"seconds")

    del ref, docs, inputs, df

    return True

def edit_member():
    member_df=pd.read_csv("Data/member.csv")
    evaluate_member=pd.read_csv("Data/evaluate_member.csv")
    temp_member=member_df[['member_id']]
    temp_eva=evaluate_member[['member_id','has_come']]
    print(temp_member.head())
    print(temp_eva.head())
    # temp=temp_member.join(temp_eva.set_index('member_id'),on='member_id')
    temp=temp_member.merge(temp_eva,left_on='member_id',right_on='member_id',suffixes=('left','right'))
    temp=temp.groupby('member_id').agg(['sum','count'])
    member_df=member_df.merge(temp,left_on='member_id',right_on='member_id',suffixes=('left','right'))
    print(temp)
    print(member_df.head())
    member_df.to_csv("Data/member_Agg.csv",index=False)
    
if __name__ == "__main__":
    # init('criteria')
    # init('evaluate_main')
    # init('evaluate_member')
    # init('evaluate_score')
    # init('event_line_item')
    # init('event')
    # init('member')
    # init('song')
    # init('type_dance')
    # edit_member()