import React,{useState} from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import {Grid,Button,ButtonGroup,Typography} from "@material-ui/core"
import { BrowserRouter as Router, Routes, Route, Link,Navigate } from "react-router-dom";



const HomePage = () => {


  const [roomCode,SetroomCode]=useState(null)

  const  componentDidMount = async ()=>{

 
  fetch('/api/user-in-room').then((response)=>
    response.json()).then((data)=>
      {
        SetroomCode(data.code)}
)

}
componentDidMount()
console.log(roomCode)



const renderHomePage=() =>{
/*if already he is in a room then navigate to that room*/ 
//   if(roomCode)
//     return(
//   <Navigate to={`/room/${roomCode}`}></Navigate>
// )
/*else navigate to homepage*/ 
return (
  <Grid container spacing={3}>

    <Grid item xs={12} align ="center">
          <Typography component="h3" variant="h3">
            House Party
          </Typography>
    </Grid>

    <Grid item xs={12} align ="center">
          <ButtonGroup disableElevation
           variant="contained"
           color="primary">
              <Button color="primary" 
              to='/join' component={Link}>
                Join a Room
              </Button>

           </ButtonGroup>

           <ButtonGroup disableElevation
           variant="contained"
           color="secondary">
              <Button color="secondary" 
              to='/create' component={Link}>
                Create a Room
              </Button>

           </ButtonGroup>
    </Grid>

    

  </Grid>
);
}


const clearRoomCode=()=>{
  SetroomCode(null)
}






  return (
     <Router>
      <Routes>
        <Route exact path="/" element={
          
            renderHomePage()
          
        }
        
        />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room  leaveRoomCallback={clearRoomCode}/>} />
      </Routes>
    </Router>
  );
};

export default HomePage;
