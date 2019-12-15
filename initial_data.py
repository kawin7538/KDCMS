from dbHelper import db

import pandas as pd

import time

import datetime

from google.cloud.firestore_v1 import ArrayUnion

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

# def edit_event_line_item():
#     event_df=pd.read_csv("Data/event.csv")
#     event_line_item_df=pd.read_csv("Data/event_line_item.csv")
#     evaluate_main_df=pd.read_csv("Data/evaluate_main.csv")
#     evaluate_score_df=pd.read_csv("Data/evaluate_score.csv")
#     for index, row in event_df.iterrows():
#         # print(row[['event_id','date_time']])
#         temp=evaluate_main_df[evaluate_main_df['event_id']==row['event_id']]
#         print(temp)

def create_new_event():
    event_df=pd.read_csv("Data/event.csv")
    event_line_item_df=pd.read_csv("Data/event_line_item.csv")
    ref=db.collection('event')
    for index, row in event_df.iterrows():
        ans=row.to_dict()
        temp=event_line_item_df[event_line_item_df['event_id']==row['event_id']]
        team_lineitem={}
        for i in temp['team_id'].unique():
            # print(int(i),type(int(i)))
            temp2=temp[temp['team_id']==i]
            temp_lineitem=dict()
            temp_lineitem['type_dance']=int(temp2['type_id'].unique()[0])
            temp_lineitem['song_id']=int(temp2['song_id'].unique()[0])
            temp_lineitem['member']=[int(i) for i in temp2['member_id'].unique()]
            team_lineitem[str(int(i))]=temp_lineitem
        ans['line_item']=team_lineitem
        print(ans)
        ref.document(str(row['event_id'])).set(ans)

def create_new_eva():
    eva_main_df=pd.read_csv("Data/evaluate_main.csv")
    eva_member_df=pd.read_csv("Data/evaluate_member.csv")
    eva_score_df=pd.read_csv("Data/evaluate_score.csv")
    ref=db.collection("evaluate")
    for index,row in eva_main_df.iterrows():
        ans=row.to_dict()
        temp_member=eva_member_df[eva_member_df['eva_id']==row['eva_id']]
        member_lineitem={}
        for index2,row2 in temp_member.iterrows():
            # temp_lineitem=dict()
            # temp_lineitem['member_id']=row2['member_id']
            # temp_lineitem['has_come']=row2['has_come']
            member_lineitem[str(int(row2['member_id']))]=int(row2['has_come'])
        ans['member_lineitem']=member_lineitem
        score_lineitem={}
        temp_score=eva_score_df[eva_score_df['eva_id']==row['eva_id']]
        for index2,row2 in temp_score.iterrows():
            score_lineitem[str(int(row2['criteria_id']))]=int(row2['eva_score'])
        ans['score_lineitem']=score_lineitem
        # print(sum(ans['score_lineitem'].values())/len(ans['score_lineitem'].values()))
        if len(ans['score_lineitem'].values()) == 0:
            ans['mean_score']=None
        else:
            ans['mean_score']=sum(ans['score_lineitem'].values())/len(ans['score_lineitem'].values())
        print(ans)
        ref.document().set(ans)
        # break
    
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
    # edit_event_line_item()
    # create_new_event()
    create_new_eva()