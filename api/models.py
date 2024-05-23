from django.db import models


import string
import random
# Create your models here.


#fat models thin views

def generate_unique_code():
    length=6
    
    while True:
        # generates a  code of length=length
        code=''.join(random.choices(string.ascii_uppercase,k=length))
        #breakes if the generated code is unique
        if Room.objects.filter(code=code).count()==0:
            break
        
    return code

class Room(models.Model):
    #host,roomcode,
    # to uniquly identify room :roomcode
    code=models.CharField(max_length=8,default=generate_unique_code,unique=True)
    #only 1 host can create 1 room at a time
    host=models.CharField(max_length=50,unique=True)
    # null=False measns it must be filled 
    guest_can_pause=models.BooleanField(null=False, default=False)
    
    votes_to_skip=models.IntegerField(null=False, default=1)
    
    created_at=models.DateTimeField(auto_now_add=True)
    
    
    #methods
