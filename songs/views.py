from django.shortcuts import render, redirect
from django.http import HttpResponse

from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.http import JsonResponse

from dbHelper import db

# Create your views here.
def index(request):
    data=dict()
    data['song']=get_song()
    # print(data)
    return render(request,'index.html',data)

def get_song():
    song_ref=db.collection('song').order_by('song_name')
    docs=song_ref.stream()
    ans=[]
    for doc in docs:
        temp=doc.to_dict()
        if temp['song_ytlink']!=None:
            temp['song_ytlink']=temp['song_ytlink'].split('/')[-1]
            temp['song_ytlink']=temp['song_ytlink'][8:]
        # print(temp)
        ans.append(temp)
    return ans
    # return JsonResponse(data)
    # return render(request,'index.html',data)