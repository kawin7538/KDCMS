from django.shortcuts import render
from django.http import HttpResponse

from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse

from dbHelper import firestore,db

# Create your views here.
def index(request,pk1,pk2):
    data={
        'pk1':pk1,
        'pk2':pk2,
    }
    event_ref=db.collection('event').document(pk1)
    event_data=event_ref.get().to_dict()
    data['event_name']=event_data['event_name']
    event_data['line_item']=event_data['line_item'][pk2]
    song_ref=db.collection('song').where('song_id','==',event_data['line_item']['song_id'])
    for doc in song_ref.stream():
        data['song_name']=(doc.to_dict())['song_name']
    # member_ref=db.collection('member').where('member_id','in',event_data['line_item']['member'])
    # print(event_data)
    # for doc in member_ref.stream():
    #     print(doc.to_dict())
    return render(request,'evaluation/evaluation.html',data)

class evaluation_list(View):
    def get(self,request,pk1,pk2):
        data=dict()
        # Get heaer Data
        event_ref=db.collection('event').document(pk1)
        event_data=event_ref.get().to_dict()
        data['event_name']=event_data['event_name']
        event_data['line_item']=event_data['line_item'][pk2]
        song_ref=db.collection('song').where('song_id','==',event_data['line_item']['song_id'])
        for doc in song_ref.stream():
            data['song_name']=(doc.to_dict())['song_name']

        eva_ref=db.collection('evaluation').where('event_id','==',int(pk1)).where('team_id','==',int(pk2))
        data['list_evaluation']=[]
        for doc in eva_ref.stream():
            temp_dict=dict()
            temp_dict['eva_date']=doc['eva_date']
            temp_dict['mean_score']=doc['mean_score']

            data['list_evaluation'].append(temp_dict)

        print(data)
        return JsonResponse(data)
