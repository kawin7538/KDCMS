from django.shortcuts import render, redirect
from django.http import HttpResponse

from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse

from dbHelper import firestore,db,song_ref

# Create your views here.
def index(request):
    data=dict()
    # data['song']=song_list.get()
    # print(data)
    return render(request,'index.html',data)

# def get_song():
#     song_ref=db.collection('song').order_by('song_name')
#     docs=song_ref.stream()
#     ans=[]
#     for doc in docs:
#         temp=doc.to_dict()
#         if temp['song_ytlink']!=None:
#             temp['song_ytlink']=temp['song_ytlink'].split('/')[-1]
#             temp['song_ytlink']=temp['song_ytlink'][8:]
#         # print(temp)
#         ans.append(temp)
#     return ans
    # return JsonResponse(data)
    # return render(request,'index.html',data)

class song_list(View):
    def get(self,request):
        song_ref=db.collection('song').order_by('song_name')
        docs=song_ref.stream()
        song=[]
        data=dict()
        for doc in docs:
            temp=doc.to_dict()
            if temp['song_ytlink']!=None:
                temp['song_ytlink']=temp['song_ytlink'].split('/')[-1]
                temp['song_ytlink']=temp['song_ytlink'][8:]
            # print(temp)
            song.append(temp)
        data['songs']=song
        return JsonResponse(data)

@method_decorator(csrf_exempt, name='dispatch')
class song_create(View):
    def post(self,request):
        data=dict()
        request.POST=request.POST.copy()
        # if Receipt.objects.count() != 0:
        #     receipt_no_max = Receipt.objects.aggregate(Max('receipt_no'))['receipt_no__max']
        #     next_receipt_no = receipt_no_max[0:3] + str(int(receipt_no_max[3:7])+1) + "/" + receipt_no_max[8:10]
        # else:
        #     next_receipt_no = "RCT1000/19"
        query=song_ref.order_by('song_id',direction=firestore.Query.DESCENDING).limit(1)
        max_num=[i.to_dict() for i in query.stream()][0]['song_id']
        request.POST['song_id']=(max_num+1)
        data=request.POST
        del data['csrfmiddlewaretoken']
        for key in data:
            if data[key]=='':
                data[key]=None
            # print(data[key])
        print(data)
        try:
            song_ref.add(data)
        except:
            data['error'] = 'form not valid!'

        return JsonResponse(data)