import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link } from "react-router-dom";

//for popouts
import { Collapse } from "@material-ui/core";

function CreateRoomPage(props) {

  //const defaultVotes = props.votesToSkip;
  const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause);
  const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("")
  const navigate = useNavigate();

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  //for creating a new room data should be posted to backend
  //on clicking create room button this funciton loads

  const handleRoomButtonPressed = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    try {
      const response = await fetch("/api/create-room", requestOptions);
      const data = await response.json();
      navigate("/room/" + data.code);
    } catch (e) {
      console.error(e);
    }
  };

  //onclicking update button this function loads for update roon

  const handleUpdateButtonPressed = async () => {
     const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code:props.roomCode

        
      }),
    };
    try {
      console.log(votesToSkip,guestCanPause,props.roomCode)
      const response = await fetch("/api/update-room", requestOptions);
      if(response.ok)
        {
          setSuccess(
            "Room updated successfully"
          )
              
        }
      else{
        setError("Error in updating room")

        
      }
      //this fucntion updates the parameters in our room page
      props.updateCallback()
    
    } catch (e) {
      console.error(e);
    }

  }





  // This function is written for dynamically load 
  //create and back button for create a room
  

  const renderCreateButton = ()=>{
    return (
      <Grid container spacing={1}>
         
        <Grid item xs={12} align="center">
        <Button
          color="secondary"
          variant="contained"
          onClick={handleRoomButtonPressed}
        >
          Create A Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="primary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>


      </Grid>
    )
  }

//this function is created dynamically
// for close button in update room settings
  const renderUpdateButton = ()=>{
    return (
      <Grid container spacing={1}>
         
        <Grid item xs={12} align="center">
        <Button
          color="Primary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
      </Grid>
    )
  }

  const title = props.update ? "Update Room" : "Create a Room"

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse 
        in={error!="" || success!=""}
        >
         {success}
         {error}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
         {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={props.guestCanPause.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            defaultValue={props.votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {
        props.update ? renderUpdateButton() : renderCreateButton()
      }
    </Grid>
  );
}

//defining default props
 CreateRoomPage.defaultProps={
      votesToSkip:2,
      guestCanPause:true,
      update:false,
      roomCode:null,
      updateCallback: ()=>{},

  }
export default CreateRoomPage;
