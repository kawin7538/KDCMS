from django.shortcuts import render
from django.http import HttpResponse

from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse

from dbHelper import firestore,db,member_ref

# Create your views here.
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