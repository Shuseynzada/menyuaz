import React, { useEffect, useState } from "react"
import { AnimatedRoutes } from "./components"
import { MainContext } from "./context"
import axios from "axios";

function App() {
  const [data, setData] = useState([])
  const [pos, setPos] = useState({ latitude: NaN, longitude: NaN })

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log("Geolocation not supported");
      }

      function success(position) {
        setPos({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      }

      function error() {
        console.log("Unable to retrieve your location");
      }
    }

    getLocation()

  }, [])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");

    if (id) {
      // Redirect to the hash route
      window.location.replace(`/restaurants/${id}`);

      // Optional: remove the query parameter from the URL
      const newUrl = window.location.href.split("?")[0];
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  useEffect(() => {
    function distance(lat1, lon1, lat2, lon2) {
      var R = 6371.0; // km (change this constant to get miles)
      var dLat = (lat2 - lat1) * Math.PI / 180;
      var dLon = (lon2 - lon1) * Math.PI / 180;
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_RESTS_API}/restaurants`
        );

        let dataArr = []
        response.data.forEach((e, i) => {
          dataArr.push({ ...e, dist: distance(pos.latitude, pos.longitude, e.latitude, e.longitude) })
        })
        setData(dataArr.sort((a, b) => {
          return a.dist - b.dist
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setTimeout(() => {
          fetchData()
        }, 5000);
      }
    };

    fetchData();
  }, [pos])



  return (
    <MainContext.Provider value={{ data }}>
      <AnimatedRoutes />
    </MainContext.Provider>
  )
}

export default App