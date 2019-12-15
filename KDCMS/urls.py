"""KDCMS URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from songs import views as song_view
from members import views as member_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',song_view.index,name='index'),
    path('song/list',song_view.song_list.as_view(),name='song_list'),
    path('song/create',song_view.song_create.as_view(),name='song_create'),
    path('song/update',song_view.song_update.as_view(),name='song_update'),
    path('song/delete/<pk>',song_view.song_delete.as_view(),name='song_delete'),
    path('member/list',member_view.member_list.as_view(),name='member_list'),
    path('member/<pk>',member_view.index,name='member'),
]
