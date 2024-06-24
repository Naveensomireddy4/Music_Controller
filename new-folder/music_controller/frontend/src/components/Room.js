import React, { useState ,useEffect} from "react";
import { TextField, Button, Grid, Typography } from '@material-ui/core';
import { Link, useNavigate, useParams } from "react-router-dom";

import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

const Room = (props) => {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false,
  });
  const [song,setSong] = useState({})
  const [loaded, setLoaded] = useState(false);


//we need to reload our website every time to see the changes
//inorder to overcomes this we can go for websocketing
//we will pull an endpoint here .bUT SPOTIFY doesnt allow
//websocketing
//so now we need to dosomething other than websocket .There
//comes polling






  const getRoomDetails = async () => {
    try {
      const response = await fetch(`/api/get-room?code=${roomCode}`);
      if (!response.ok) {
        props.leaveRoomCallback(); // clears roomCode state in HomePage
        navigate("/");
      } else {
        const data = await response.json();
        setRoomDetails((x) => ({
          ...x,
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        }));
        // after setting all room states we will call authenticateSpotify
        //console.log("This is host ",roomDetails.isHost)
        if(roomDetails.isHost  && !roomDetails.spotifyAuthenticated)
        {authenticateSpotify();
        }
      }
    } catch (error) {
      console.error("Failed to fetch room details:", error);
    } finally {
      setLoaded(true);
    }
  };

  // as soon as the room is created the host should be authenticated with spotify
  // this function will call our backend for authentication
  const authenticateSpotify = async () => {
    try {
      const response = await fetch('/spotify/is-authenticated');
      const data = await response.json();
      setRoomDetails((x) => ({
        ...x,
        spotifyAuthenticated: true,
      }));
      console.log("Authentication not completed")
      // if user is not authenticated then we have to authenticate
      if (!data.status) {
        console.log("Authentication completed")
        const authResponse = await fetch('/spotify/get-auth-url');
      
        const authData = await authResponse.json();
        console.log(authResponse)
        // here the data is url we will visit that url
        window.location.replace(authData.url);
      }
    } catch (error) {
      console.error("Failed to authenticate with Spotify:", error);
    }
  };

  if (!loaded) {
    getRoomDetails();
    
  }


  //here we will call the spotify to get 
  //details of the current playing song
  const getCurrentSong = async () => {
   fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok || response == null) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setSong(data);
    console.log(data.time);
      });
  };


//poling for getcurrentSong
     useEffect(() => {
    getCurrentSong(); // Fetch song immediately on mount

    const intervalId = setInterval(() => {
      getCurrentSong();
    }, 1000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  const leaveButtonPressed = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    };
    try {
      await fetch('/api/leave-room', requestOptions);
      props.leaveRoomCallback();
      navigate("/");
    } catch (error) {
      console.error("Failed to leave room:", error);
    }
  };

  // this gets displayed when settings button is clicked
  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={roomDetails.votesToSkip}
            guestCanPause={roomDetails.guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  // this is used when we want to edit the room and come back
  // from that page
  // false means then we will come back to room
  // true mean we will get displayed the edit page
  const updateShowSettings = (value) => {
    setRoomDetails(prevState => ({
      ...prevState,
      showSettings: value,
    }));
  };

  // if the user is host then this function should be called
  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button variant="contained" color="Primary" onClick={() => updateShowSettings(true)}>
          Settings
        </Button>
      </Grid>
    );
  };
//console.log(roomDetails.spotifyAuthenticated)
  if (roomDetails.showSettings) {
    return renderSettings();
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
        
        
       <MusicPlayer {...song}/>

      </Grid>
      
      
      
      {
        roomDetails.isHost ? renderSettingsButton() : null
      }
      <Grid item xs={12} align="center">
        <Button variant="contained" color="Secondary" onClick={leaveButtonPressed}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};

export default Room;

// import React, { useState, useEffect } from "react";
// import { TextField, Button, Grid, Typography } from '@material-ui/core';
// import { Link, useNavigate, useParams } from "react-router-dom";
// import CreateRoomPage from "./CreateRoomPage";
// import MusicPlayer from "./MusicPlayer";

// const Room = (props) => {
//   const navigate = useNavigate();
//   const { roomCode } = useParams();
//   const [roomDetails, setRoomDetails] = useState({
//     votesToSkip: 2,
//     guestCanPause: false,
//     isHost: false,
//     showSettings: false,
//     spotifyAuthenticated: false,
//   });
//   const [song, setSong] = useState({
//     title: "",
//     artist: "",
//     album: "",
//     duration: 0,
//     time: 0,
//     is_playing: false,
//     image_url: "",
//   });
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const getRoomDetails = async () => {
//       try {
//         const response = await fetch(`/api/get-room?code=${roomCode}`);
//         if (!response.ok) {
//           props.leaveRoomCallback(); // clears roomCode state in HomePage
//           navigate("/");
//         } else {
//           const data = await response.json();
//           setRoomDetails((x) => ({
//             ...x,
//             votesToSkip: data.votes_to_skip,
//             guestCanPause: data.guest_can_pause,
//             isHost: data.is_host,
//           }));
//           if (data.is_host && !roomDetails.spotifyAuthenticated) {
//             authenticateSpotify();
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch room details:", error);
//       } finally {
//         setLoaded(true);
//       }
//     };

//     getRoomDetails();
//   }, [roomCode, props, navigate, roomDetails.spotifyAuthenticated]);

//   const authenticateSpotify = async () => {
//     try {
//       const response = await fetch('/spotify/is-authenticated');
//       const data = await response.json();
//       setRoomDetails((x) => ({
//         ...x,
//         spotifyAuthenticated: data.status,
//       }));
//       if (!data.status) {
//         const authResponse = await fetch('/spotify/get-auth-url');
//         const authData = await authResponse.json();
//         window.location.replace(authData.url);
//       }
//     } catch (error) {
//       console.error("Failed to authenticate with Spotify:", error);
//     }
//   };

//   const getCurrentSong = async () => {
//     fetch("/spotify/current-song")
//       .then((response) => {
//         if (!response.ok) {
//           return {};
//         } else {
//           return response.json();
//         }
//       })
//       .then((data) => {
//         setSong(data);
//       });
//   };

//   useEffect(() => {
//     getCurrentSong();
//     const intervalId = setInterval(() => {
//       getCurrentSong();
//     }, 1000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const leaveButtonPressed = async () => {
//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" }
//     };
//     try {
//       await fetch('/api/leave-room', requestOptions);
//       props.leaveRoomCallback();
//       navigate("/");
//     } catch (error) {
//       console.error("Failed to leave room:", error);
//     }
//   };

//   const renderSettings = () => {
//     return (
//       <Grid container spacing={1}>
//         <Grid item xs={12} align="center">
//           <CreateRoomPage
//             update={true}
//             votesToSkip={roomDetails.votesToSkip}
//             guestCanPause={roomDetails.guestCanPause}
//             roomCode={roomCode}
//             updateCallback={getRoomDetails}
//           />
//         </Grid>
//         <Grid item xs={12} align="center">
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={() => updateShowSettings(false)}
//           >
//             Close
//           </Button>
//         </Grid>
//       </Grid>
//     );
//   };

//   const updateShowSettings = (value) => {
//     setRoomDetails(prevState => ({
//       ...prevState,
//       showSettings: value,
//     }));
//   };

//   const renderSettingsButton = () => {
//     return (
//       <Grid item xs={12} align="center">
//         <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
//           Settings
//         </Button>
//       </Grid>
//     );
//   };

//   if (roomDetails.showSettings) {
//     return renderSettings();
//   }

//   return (
//     <Grid container spacing={1}>
//       <Grid item xs={12} align="center">
//         <Typography variant="h4" component="h4">
//           Code: {roomCode}
//         </Typography>
//       </Grid>
//       <Grid item xs={12} align="center">
//         <MusicPlayer {...song} />
//       </Grid>
//       {roomDetails.isHost ? renderSettingsButton() : null}
//       <Grid item xs={12} align="center">
//         <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
//           Leave Room
//         </Button>
//       </Grid>
//     </Grid>
//   );
// };

// export default Room;
