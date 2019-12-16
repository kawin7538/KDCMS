from django.shortcuts import render

from django.http import HttpResponse

from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse

from dbHelper import firestore,db

import collections, functools, operator 

# Create your views here.
class event_list(View):
    def get(self,request):
        data=dict()
        event_list=db.collection('event').order_by('date_time',direction=firestore.Query.DESCENDING)
        temp=[]
        for doc in event_list.stream():
            temp.append(doc.to_dict())
        data['event_list']=temp        
        return JsonResponse(data)

class event_detail(View):
    def get(self,request,pk):
        data=dict()
        event=db.collection('event').where('event_id','==',int(pk))
        event=[i.to_dict() for i in event.stream()][0]
        temp=dict()
        for i in ['date_time','location','event_name','event_id']:
            temp[i]=event[i]
        # data['header']=temp
        # temp_type_dance=set()
        # temp_member=[]
        # temp_song=set()
        # for k,v in event['line_item'].items():
        #     temp_type_dance.add(v['type_dance'])
        #     temp_member.extend(v['member'])
        #     temp_song.add(v['song_id'])
        # temp_type_dance=list(temp_type_dance)
        # temp_member=list(set(temp_member))
        # temp_song=list(temp_song)
        # song_ref=db.collection('song').where('song_id','in',temp_song)
        # member_ref=db.collection('member').where('member_id','in',temp_member)
        # type_ref=db.collection('type_dance').where('type_id','in',temp_type_dance)
        # for k,v in event['line_item'].items():
        #     event['line_item'][k]['song']=
        # temp_song=[[i,[j.to_dict()['song_name'] for j in song_ref.stream() if j.to_dict()['song_id']==i][0]] for i in temp_song]
        # # data['lineitem']=event['line_item']
        # data['lineitem']=temp_song
        data=event
        return JsonResponse(data)