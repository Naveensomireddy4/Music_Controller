import React, { useEffect, useState } from "react";
import {TextField,Button,Grid,Typography} from '@material-ui/core'
import {Link , useNavigate ,useParams } from "react-router-dom"

const Room = (props) => {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
  });

  
React.useEffect(() => {
    fetch(`/api/get-room?code=${roomCode}`)
        .then(response => {
            if (!response.ok) {
                props.leaveRoomCallback(); // clears roomCode state in HomePage
                navigate("/");
            } else {
                return response.json();
            }
        })
        .then(data => {
            setRoomDetails({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            });
        });
}, []);



  const leaveButtonPressed = ()=>{
    const requestOptions = {
    method:"POST",
    headers:{"Content-Type":"application/json"}
    };
     fetch('/api/leave-room',requestOptions).then((response)=>{
      props.leaveRoomCallback()
        navigate("/")
     })
  }

  return (
    
    <Grid container spacing={1}>
 
       <Grid item xs={12} align="center">
            <Typography variant="h4" component="h4">
              Code: {roomCode}
            </Typography>
       </Grid>


       <Grid item xs={12} align="center">
           <Typography variant="h6" component="h6">
              Votes: {roomDetails.votesToSkip}
            </Typography>
       </Grid>


       <Grid item xs={12} align="center">
           <Typography variant="h6" component="h6">
              Guest Can Pause: {roomDetails.guestCanPause.toString()}
            </Typography>
       </Grid>


       <Grid item xs={12} align="center">
           <Typography variant="h6" component="h6">
              Host: {roomDetails.isHost.toString()}
            </Typography>
       </Grid>

       <Grid item xs={12} align="center">
           <Button variant="contained" color="Secondary" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
       </Grid>

       

    </Grid>
  );
};

export default Room

/*
<div>
      <h3>{roomCode}</h3>
      <p>Votes: {roomDetails.votesToSkip}</p>
      <p>Guest Can Pause: {roomDetails.guestCanPause.toString()}</p>
      <p>Host: {roomDetails.isHost.toString()}</p>
    </div>
*/