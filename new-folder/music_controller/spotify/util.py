from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta,datetime
from .credentials import CLIENT_ID,CLIENT_SECRET
from requests import post, put, get

BASE_URL = 'https://api.spotify.com/v1/me/'

def get_user_tokens(session_id):
    user_tokens=SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    return None



def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    
    # Calculate expiry time in seconds if expires_in is a datetime object
    
    
    # Calculate the actual expiry time
    expires_at = timezone.now() + timedelta(seconds=expires_in)
    
    if tokens:
        tokens.access_token = access_token
        tokens.token_type = token_type
        tokens.expires_in = expires_at  # Store the expiry time
        tokens.refresh_token = refresh_token
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token, token_type=token_type,
                              expires_in=expires_at, refresh_token=refresh_token)
        tokens.save()

        

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id) 
    
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():   
            # this means the token is about to expire or expires
            # we have to refresh the token
            refresh_spotify_token(tokens)
            
        return True
                
                
                
    return False  




def refresh_spotify_token(tokens):
     
     refresh_token= tokens.refresh_token
     
     response = post('https://api.spotify.com/',data={
         'grant_type':'refresh_token',# what do we want
         'refresh_token':refresh_token,
         'client_id':CLIENT_ID,
         'client_secret':CLIENT_SECRET       
     }).json()
     
     access_token = response.get('access_token')
     token_type = response.get('token_type')
     expires_in = response.get('expires_in')
     
     update_or_create_user_tokens(tokens.user,access_token,token_type,expires_in, refresh_token)
        
        
def execute_spotify_api_request(session_id,endpoint,post_=False,put_=False):  
    tokens = get_user_tokens(session_id)
    headers = {'Content-Type': 'application/json',
               'Authorization': "Bearer " + tokens.access_token}

    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}

    
    
    
    
def play_song(session_id):
        return execute_spotify_api_request(session_id, "player/play",put_=True)

def pause_song(session_id):
        return execute_spotify_api_request(session_id, "player/pause",put_=True)    
    
def skip_song(session_id):
    return execute_spotify_api_request(session_id, "player/next",post_=True)    

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import  SpotifyToken
# from django.utils import timezone
# from datetime import timedelta
# from .credentials import CLIENT_ID, CLIENT_SECRET
# from requests import post, put, get
# from api.models import Room

# BASE_URL = 'https://api.spotify.com/v1/me/'

# def get_user_tokens(session_id):
#     user_tokens = SpotifyToken.objects.filter(user=session_id)
#     if user_tokens.exists():
#         return user_tokens[0]
#     return None

# def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
#     tokens = get_user_tokens(session_id)
#     expires_at = timezone.now() + timedelta(seconds=expires_in)
    
#     if tokens:
#         tokens.access_token = access_token
#         tokens.token_type = token_type
#         tokens.expires_in = expires_at
#         if refresh_token:
#             tokens.refresh_token = refresh_token
#         tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
#     else:
#         tokens = SpotifyToken(
#             user=session_id, 
#             access_token=access_token, 
#             token_type=token_type,
#             expires_in=expires_at, 
#             refresh_token=refresh_token
#         )
#         tokens.save()

# def refresh_spotify_token(tokens):
#     refresh_token = tokens.refresh_token
    
#     response = post('https://accounts.spotify.com/api/token', data={
#         'grant_type': 'refresh_token',
#         'refresh_token': refresh_token,
#         'client_id': CLIENT_ID,
#         'client_secret': CLIENT_SECRET       
#     }).json()
    
#     access_token = response.get('access_token')
#     token_type = response.get('token_type')
#     expires_in = response.get('expires_in')
#     refresh_token = response.get('refresh_token', tokens.refresh_token)  # Use existing refresh token if not provided
    
#     update_or_create_user_tokens(tokens.user, access_token, token_type, expires_in, refresh_token)

# def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):  
#     tokens = get_user_tokens(session_id)
#     if not tokens:
#         return {"Error": "Invalid session or user not authenticated"}

#     headers = {'Content-Type': 'application/json', 'Authorization': "Bearer " + tokens.access_token}
    
#     print("Making Spotify API request...")
#     print(f"Endpoint: {endpoint}")
#     print(f"Headers: {headers}")
    
#     if post_:
#         response = post(BASE_URL + endpoint, headers=headers)
#     elif put_:
#         response = put(BASE_URL + endpoint, headers=headers)
#     else:
#         response = get(BASE_URL + endpoint, headers=headers)
    
#     print(f"Response Status Code: {response.status_code}")
#     print(f"Response Content: {response.content}")
    
#     try:
#         return response.json()
#     except Exception as e:
#         print(f"Error parsing response: {e}")
#         return {"Error": "Issue with Get Request for getting details from Spotify"}

