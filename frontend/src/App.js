import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import StarRateIcon from "@mui/icons-material/StarRate";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myLocalStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(
    myLocalStorage.getItem("user")
  );
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 22,
    longitude: 80,
    zoom: 4,
  });

  // console.log(title, desc, rating);

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
        console.log(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, latitude, longitude) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: latitude, longitude: longitude });
  };
  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    // console.log(long, lat);
    setNewPlace({ long, lat });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title: title, //title; will also work
      desc,
      rating,
      latitude: newPlace.lat,
      longitude: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    myLocalStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        onDblClick={handleAddClick}
      >
        {pins.map((pin) => (
          <>
            <Marker
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-viewport.zoom * 3}
              offsetTop={-viewport.zoom * 6}
              onClick={() =>
                handleMarkerClick(pin._id, pin.latitude, pin.longitude)
              }
            >
              <RoomIcon
                style={{
                  fontSize: viewport.zoom * 6,
                  color: currentUser === pin.username ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
              />
            </Marker>

            {currentPlaceId === pin._id && (
              <Popup
                latitude={pin.latitude}
                longitude={pin.longitude}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(pin.rating).fill(<StarRateIcon className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.username}</b>
                  </span>
                  <span className="date">{format(pin.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {/* Add new pin */}
        {(newPlace && currentUser) && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Write something about this place"
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}

        {currentUser ? (
          <div className="usernameAndLogoutDiv">
            <span className="topUsername">
              Signed in as <b>{myLocalStorage.getItem("user")}</b>
            </span>
            <button className="button logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="buttons">
            <button
              className="button login"
              onClick={() => (setShowRegister(false), setShowLogin(true))}
            >
              Login
            </button>
            <button
              className="button register"
              onClick={() => (setShowLogin(false), setShowRegister(true))}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myLocalStorage={myLocalStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
