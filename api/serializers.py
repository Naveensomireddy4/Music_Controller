#take the python code and turns them into json 

from rest_framework import serializers

#model
from .models import Room
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields=('id','code','host','guest_can_pause',
                'votes_to_skip','created_at',)
        
# when ever your are handling 
# a request its better if you write
# serializers for the either incoming to handlr
#the request or outgoing to handle the response


#this will have a payload that contains the post request
class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')        