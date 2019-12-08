from django.shortcuts import render, redirect
from django.http import HttpResponse

from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.http import JsonResponse

from dbHelper import db

# Create your views here.
def index(request):
    response = redirect('/songs')
    return response

def song_index(request):
    song_ref=db.collection('song')
    docs=song_ref.stream()
    data=dict()
    for doc in docs:
        data[doc.id]=doc.to_dict()
    # return JsonResponse(data)
    return render(request,'songs/index.html',data)