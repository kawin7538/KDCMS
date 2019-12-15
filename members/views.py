from django.shortcuts import render
from django.http import HttpResponse

from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse

from dbHelper import firestore,db,member_ref

# Create your views here.

def index(request,pk):
    print(pk)
    data={'member_id':pk}
    # data=JsonResponse(data)
    return render(request,'members/member_form.html',data)

class member_list(View):
    def get(self,request):
        member_ref=db.collection('member').order_by('nickname')
        docs=member_ref.stream()
        member=[]
        data=dict()
        for doc in docs:
            temp=doc.to_dict()
            temp['name']=temp['firstname']+" "+temp['lastname']
            del temp['firstname'], temp['lastname']
            member.append(temp)
        print("{} member loaded".format(len(member)))
        data['member']=member
        return JsonResponse(data)

class member_detail(View):
    def get(self,request,pk):
        member_ref=db.collection('member').where('member_id','==',int(pk))
        data=dict()
        for doc in member_ref.stream():
            data['member_detail']=doc.to_dict()
        event_ref=db.collection('event')
        list_event=[]
        for doc in event_ref.stream():
            temp=doc.to_dict()
            temp2=temp['line_item']
            temp2=list(temp2.values())
            temp2=any(int(pk) in i['member'] for i in temp2)
            if temp2:
                temp_dict={}
                temp_dict['event_name']=temp['event_name']
                temp_dict['date_time']=temp['date_time']
                list_event.append(temp_dict)
        data['list_event']=list_event
        # print(data)
        return JsonResponse(data)