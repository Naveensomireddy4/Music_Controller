from django.shortcuts import render
from rest_framework import generics,status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
#models
from .models import Room

#serializers
from .serializers import RoomSerializer,CreateRoomSerializer

# Create your views here.

class RoomView(generics.ListAPIView):
    # queryset contains all room
    queryset = Room.objects.all()
    # The Room in python are converted into Json through serializer
    serializer_class = RoomSerializer


    
class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'roomcode'
     
    def post(self,request,format=None):
        #check if the current user have as seesion or not
        #if not then create a new seesion
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        code=request.data.get(self.lookup_url_kwarg)
        if code!= None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0 :
                room = room_result[0]
                #we will add a room_code to the session telling that 
                #the particular user is present in this room and we can know 
                #which user is in which room
                self.request.session['room_code'] = code
                return Response({'message' : 'Room Joined!'},status=status.HTTP_200_OK)
            
                        
            return Response({'Bad Request' : 'Inbvalid Room Code,Did not find a room'},status=status.HTTP_400_BAD_REQUEST)
            
        return Response({'Bad Request' : 'Invalid post data,did not find code key'},status=status.HTTP_400_BAD_REQUEST)    
                
            
            
            
    
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer
    
    def post(self,request,format=None):
        #check if the current user have as seesion or not
        #if not then create a new seesion
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        
        serializer = self.serializer_class(data=request.data)
        # this will take data and give us python representation of data
        
        if serializer.is_valid():
            #this means data is valid
            # then we have to post in database
            guest_can_pause=serializer.data.get('guest_can_pause')
            votes_to_skip=serializer.data.get('votes_to_skip')
            host=self.request.session.session_key
            
            #first we will check if the current user have created any existing 
            #room or not .If created then we will update the create room setting
            # else we will create a new room
            
            query_set=Room.objects.filter(host=host)
            
            if query_set.exists():
                room = query_set[0]
                room.guest_can_pause=guest_can_pause
                room.votes_to_skip=votes_to_skip
                self.request.session['room_code'] = room.code
                room.save(update_fields=['guest_can_pause','votes_to_skip'])
                return Response(RoomSerializer(room).data,status=status.HTTP_200_OK)
            
            else:
                room = Room(host=host,guest_can_pause=guest_can_pause,votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data,status=status.HTTP_201_CREATED)
            
            
        return Response({'BAd Request' : 'Invalid Data'},status=status.HTTP_400_BAD_REQUEST)    
            
        
        
class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        room_code = request.session.get('room_code')

        data = {
            'code': room_code
        }
        return JsonResponse(data, status=status.HTTP_200_OK)
    
    
class LeaveRoom(APIView):
    def post(self, request, format=None):
           if 'room_code' in self.request.session:
               self.request.session.pop('room_code')
               host_id=self.request.session.session_key
               room_results = Room.objects.filter(host=host_id)
               if len(room_results) > 0:
                   room = room_results[0]
                   room.delete()
           
           return Response({'Message' : 'Success'},status=status.HTTP_200_OK)
               