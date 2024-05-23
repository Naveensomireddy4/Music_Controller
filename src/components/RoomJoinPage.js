import React,{useState} from 'react';
import {TextField,Button,Grid,Typography} from '@material-ui/core'
import {Link , useNavigate } from "react-router-dom"

const RoomJoinPage = (props) => {
    const [parameters,SetParameters] = useState({
        roomcode:"",
        error:""
    })

    const navigate = useNavigate();

    const handleTextFieldChange= (e)=>{
        let updates={};
        updates={roomcode:e.target.value}
        SetParameters(x=> ({
            ...x,
           ...updates
        })
            
        )
    }
    const roomButtonPresses=()=>{

        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                roomcode:parameters.roomcode
            })
        };
        fetch('/api/join-room',requestOptions).then((response) => {
            if(response.ok){
              navigate("/room/"+ parameters.roomcode)
            }
            else{
                parameters.error="Room not found"
                SetParameters(x=> ({
                   ...x,
                   ...parameters
                }))
             
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    return (
        <Grid container spacing={1}>

            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Join A Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField 
                placeholder='Enter the room code'
                label="Room Code"
                error={parameters.error} 
                value={parameters.roomcode}
                helperText={parameters.error}
                 variant="outlined"
                 onChange={handleTextFieldChange} />
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={roomButtonPresses}>
                    Join Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Link to="/">
                    <Button variant="contained" color="secondary">
                        Back
                    </Button>
                </Link>
            </Grid>

        </Grid>
    );
}



export default RoomJoinPage;
