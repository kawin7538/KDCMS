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
def index(request,pk1,pk2):
    data={
        'pk1':pk1,
        'pk2':pk2,
    }
    # event_ref=db.collection('event').document(pk1)
    # event_data=event_ref.get().to_dict()
    # data['event_name']=event_data['event_name']
    # event_data['line_item']=event_data['line_item'][pk2]
    # song_ref=db.collection('song').where('song_id','==',event_data['line_item']['song_id'])
    # for doc in song_ref.stream():
    #     data['song_name']=(doc.to_dict())['song_name']
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
        #Score From Criteria and Score Overall
        eva_ref=db.collection('evaluate').where('event_id','==',int(pk1)).where('team_id','==',int(pk2))
        criteria_ref=db.collection('criteria')
        data['list_evaluation']=[]
        temp_list_score=[]
        for doc in eva_ref.stream():
            temp_dict=dict()
            temp_doc=doc.to_dict()
            temp_dict['eva_id']=temp_doc['eva_id']
            temp_dict['eva_date']=temp_doc['eva_date']
            temp_dict['mean_score']=temp_doc['mean_score']
            temp_dict['criteria_score']=temp_doc['score_lineitem']
            temp_list_score.append(temp_doc['member_lineitem'])
            for cri_doc in criteria_ref.stream():
                temp=cri_doc.to_dict()
                # print(temp['criteria_id'],temp['criteria_name'])
                # print(temp_dict['criteria_score'][str(temp['criteria_id'])])
                # print(temp_dict['criteria_score'])
                try:
                    temp_dict['criteria_score'][str(temp['criteria_id'])]=[temp_dict['criteria_score'][str(temp['criteria_id'])],temp['criteria_name']]
                except:
                    print()
            data['list_evaluation'].append(temp_dict)
        data['list_evaluation'].sort(key=lambda i:i['eva_date'])
        #member Part
        member_result = dict(functools.reduce(operator.add, map(collections.Counter, temp_list_score)))
        member_ref=db.collection('member').where('member_id','in',event_data['line_item']['member'])
        for doc in member_ref.stream():
            temp_doc=doc.to_dict()
            member_result[str(temp_doc['member_id'])]=[member_result[str(temp_doc['member_id'])],temp_doc['nickname']]
        data['list_member']=member_result
        # print(data)
        return JsonResponse(data)

class evaluation_detail(View):
    def get(self,request,pk):
        print("Hello")
        docs = db.collection('evaluate').where('eva_id','==',int(pk)).stream()
        data=[i.to_dict() for i in docs][0]
        # data=dict()
        print(data)
        print("***")
        return JsonResponse(data)

class criteria_list(View):
    def get(self,request):
        cri_ref=db.collection('criteria')
        data=dict()
        temp=[]
        for doc in cri_ref.stream():
            temp.append(doc.to_dict())
        data['criteria']=temp
        return JsonResponse(data)

@method_decorator(csrf_exempt, name='dispatch')
class evaluation_create(View):
    def post(self,request):
        data=dict()
        request.POST=request.POST.copy()
        # print(request.POST)
        query=db.collection('evaluate').order_by('eva_id',direction=firestore.Query.DESCENDING).limit(1)
        max_num=[i.to_dict() for i in query.stream()][0]['eva_id']
        request.POST['eva_id']=(max_num+1)
        data=request.POST
        del data['csrfmiddlewaretoken']
        data['member_lineitem']=eval(data['member_lineitem'])['member_lineitem']
        data['event_id']=int(data['event_id'])
        data['team_id']=int(data['team_id'])
        # data['member_lineitem']=[i[0] for i in data['member_lineitem']]
        temp={}
        for d in data['member_lineitem']:
            for k,v in d.items():
                temp[k]=v
                member_ref=db.collection('member').where('member_id','==',int(k))
                data_member=dict()
                doc_id=""
                for doc in member_ref.stream():
                    data_member=doc.to_dict()
                    doc_id=doc.id
                    if v==1:
                        data_member['sum_rehearsal']+=1
                    data_member['count_rehearsal']+=1
                db.collection('member').document(doc_id).update(data_member)
        # print(temp)
        data['member_lineitem']=temp
        data['score_lineitem']=eval(data['score_lineitem'])['score_lineitem']
        # data['score_lineitem']=[i[0] for i in data['score_lineitem']]
        temp={}
        for d in data['score_lineitem']:
            for k,v in d.items():
                temp[k]=int(v)
        data['score_lineitem']=temp
        data['mean_score']=sum(list(data['score_lineitem'].values()))/len(list(data['score_lineitem'].values()))
        # print(data)
        db.collection('evaluate').add(data)

        return JsonResponse(data)

@method_decorator(csrf_exempt, name='dispatch')
class evaluation_update(View):
    def post(self,request):
        data=dict()
        request.POST=request.POST.copy()
        data=request.POST
        del data['csrfmiddlewaretoken']
        data['member_lineitem']=eval(data['member_lineitem'])['member_lineitem']
        eva_data=[i.to_dict() for i in db.collection('evaluate').where('eva_id','==',int(data['eva_id'])).stream()][0]
        doc_ans_id=[i.id for i in db.collection('evaluate').where('eva_id','==',int(data['eva_id'])).stream()][0]
        data['event_id']=int(data['event_id'])
        data['team_id']=int(data['team_id'])
        data['eva_id']=int(data['eva_id'])
        print(eva_data)
        temp={}
        for d in data['member_lineitem']:
            for k,v in d.items():
                temp[k]=v
                member_ref=db.collection('member').where('member_id','==',int(k))
                data_member=dict()
                doc_id=""
                for doc in member_ref.stream():
                    data_member=doc.to_dict()
                    doc_id=doc.id
                    if v>eva_data['member_lineitem'][k]:
                        data_member['sum_rehearsal']+=1
                    elif v<eva_data['member_lineitem'][k]:
                        data_member['sum_rehearsal']-=1
                    # data_member['count_rehearsal']+=1
                db.collection('member').document(doc_id).update(data_member)
        data['member_lineitem']=temp
        data['score_lineitem']=eval(data['score_lineitem'])['score_lineitem']
        temp={}
        for d in data['score_lineitem']:
            for k,v in d.items():
                temp[k]=int(v)
        data['score_lineitem']=temp
        data['mean_score']=sum(list(data['score_lineitem'].values()))/len(list(data['score_lineitem'].values()))
        db.collection('evaluate').document(doc_ans_id).update(data)

        return JsonResponse(data)

@method_decorator(csrf_exempt, name='dispatch')
class evaluation_delete(View):
    def post(self,request):
        request.POST=request.POST.copy()
        # print(request.POST)
        data=dict()
        eva_id=int(request.POST['pk'])
        temp_eva_ref=db.collection('evaluate').where('eva_id','==',eva_id)
        temp_eva_data=[i.to_dict() for i in temp_eva_ref.stream()][0]
        # member_ref=db.collection('member').where('member_id','in',[int(i) for i in temp_eva_data['member_lineitem'].keys()])
        # member_data=[(i.to_dict())['member_id'] for i in member_ref.stream()]
        for k,v in temp_eva_data['member_lineitem'].items():
            temp={}
            member_ref=db.collection('member').where('member_id','==',int(k))
            member_data=[i.to_dict() for i in member_ref.stream()][0]
            member_doc_id=[i.id for i in member_ref.stream()][0]
            if v==1:
                temp['sum_rehearsal']=member_data['sum_rehearsal']-1
            temp['count_rehearsal']=member_data['count_rehearsal']-1
            db.collection('member').document(member_doc_id).update(temp)
            # for doc in member_ref.stream():
                # doc.update(temp)
                # member_ref.document(doc.id).update(temp)

        for doc in temp_eva_ref.stream():
            doc.reference.delete()
            
        # print(temp_eva_data)
        # print(member_data)
        return JsonResponse(data)