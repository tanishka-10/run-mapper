import { useState, useEffect, useRef } from 'react';
import { Platform, Text, View, StyleSheet, Button, TouchableOpacity, Dimensions, Image, Modal } from 'react-native';
import * as Device from 'expo-device';
import MapView, { Marker, Polyline } from 'react-native-maps';
import getDistance from 'geolib/es/getDistance';
/* @end */
import * as Location from 'expo-location';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


function WelcomeScreen() {
  const navigation = useNavigation();
  
  return (
     <View style={styles.container}>
      <View style = {styles.hlBox}>
      
        <Text style ={styles.heading}>
          Run Mapper

        </Text>
      </View>

      <View style={styles.picS}>
      <Image style={styles.showI} source={require('./running-man--removebg-preview.png')}/>

     </View>
     <TouchableOpacity 
          style = {styles.butS}
         
          
          onPress={() => { navigation.navigate('Run')}}> 

          <Text style = {styles.butT}> 
                Start Run!
          </Text>

        </TouchableOpacity>
     </View>

    
  );
}

function RunScreen() {
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [tracking, setTracking] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]);
  const [startCoord, setStartCoord] = useState(null);
  const [endCoord, setEndCoord] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const[dis, setDis] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [distance, setDistance] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);

const watcher = useRef(null);

   const[time, setTime] = useState(0);
  const[running, setRunning] = useState(false);
  const intervalref = useRef(null);

  
  const stopTimer = () => {
       setRunning(false);
       clearInterval(intervalref.current);
    }

  const reset = () => {
      stop();
      setLaps([]);
      setTime(0);
    }


    const format = (t) =>{
      let min = Math.floor(t/60000);
      let sec = Math.floor((t % 60000)/1000);
      let mili = Math.floor((t%1000)/10);

      return( zeros(min) + ':' + zeros(sec) + ':' + zeros(mili));

    }
    const zeros = (num) =>{
      let t = String(num);
      if(num == 0){
        return '00';
      }
      else if(t.length < 2){
        t = '0' + t;
      }
      return t;
    }


function calculateDistance(coords) {
  let total = 0;

  for (let i = 1; i < coords.length; i++) {
    const d = getDistance(coords[i - 1], coords[i]);

    if (d > 5) { // ignore GPS noise under 5 meters
      total += d;
    }
  }

  return total; // meters
}


useEffect(() => {

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
  }

  getLocation();

}, []);

useEffect(() => {
  if (routeCoords.length > 1 && mapRef.current) {
    mapRef.current.fitToCoordinates(routeCoords, {
      edgePadding: {
        top: 100,
        right: 50,
        bottom: 100,
        left: 50,
      },
      animated: true,
    });
  }
}, [routeCoords]);

  async function startRun() {

    
    setRunning(true);
    let startT = Date.now() - time;
    intervalref.current = setInterval(() => {
      setTime(Date.now() - startT);
    }, 50)
  setDis(!dis);
  
  if (!location) return;

  const start = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  };

  setStartCoord(start);
  setRouteCoords([start]);
  setTracking(true);
  setSeconds(0);

  watcher.current = await Location.watchPositionAsync(
  {
    accuracy: Location.Accuracy.High,
    timeInterval: 2000,
  },
  (loc) => {
    const newPoint = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude
    };

    setRouteCoords((prev) => [...prev, newPoint]);
  }
);

}
function endRun() {
  setRunning(false);
  clearInterval(intervalref.current);
  setDis(!dis);
  setTracking(false);

  if (watcher.current) {
    watcher.current.remove();
  }

  if (routeCoords.length > 0) {
    setEndCoord(routeCoords[routeCoords.length - 1]);
  }

  const totalDistance = calculateDistance(routeCoords);
  setDistance(totalDistance);

  const timeInSeconds = time > 0 ? time / 1000 : 1;

  const speed =
    totalDistance < 5 ? 0 : totalDistance / timeInSeconds; // m/s

  setAvgSpeed(speed);

  setShowModal(true);
}

function resetRun() {
  setRouteCoords([]);
  setStartCoord(null);
  setEndCoord(null);
  setTime(0);
  setSeconds(0);
  setShowModal(false);
}


  return (
     <View style={styles.container}>
     
      
       {location && (
  <MapView
    ref={mapRef}
    style={styles.map}
    showsUserLocation={true}
    initialRegion={{
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }}
  >

    {startCoord && (
      <Marker coordinate={startCoord} title="Start" pinColor="green" />
    )}

    {endCoord && (
      <Marker coordinate={endCoord} title="End" pinColor="red" />
    )}

    {routeCoords.length > 1 && (
      <Polyline
        coordinates={routeCoords}
        strokeColor="blue"
        strokeWidth={4}
      />
    )}

  </MapView>
)}
       

       <View style ={styles.butRow}>
        <TouchableOpacity 
          style = {styles.butRun}
          disabled = {dis}
          onPress={() => { startRun()}}> 
          <Text style = {styles.butT}> 
                Start
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style = {styles.butRun}
          disabled = {!dis}
          onPress={() => { endRun()}}> 
          <Text style = {styles.butT}> 
                Stop
          </Text>
        </TouchableOpacity>

       </View>

       <View style ={styles.butRow}>

       <Text style = {styles.timeT}>
       {format(time)}
       </Text>
       



       </View>
       <Modal
  visible={showModal}
  transparent={true}
  animationType="slide"
>
  <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }}>

    <View style={{
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 20,
      alignItems: 'center'
    }}>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Run Summary
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Time: {format(time)}
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Distance: {(distance / 1000).toFixed(2)} km
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Avg Speed: {(avgSpeed * 3.6).toFixed(2)} km/h
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: 'midnightblue',
          padding: 10,
          borderRadius: 10
        }}
        onPress={resetRun}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>
          Done
        </Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>
   
     </View>

    
  );
  
}




const wW = Dimensions.get('window').width;
const wH = Dimensions.get('window').height;
let font = wW*0.15;
let bw = (wW/50)*50;
let bh = (wH/2)*0.3;
let bd = bw*0.2;
let marg = wW*0.04;

const MyStack = createNativeStackNavigator({
  screens: {
    Welcome: WelcomeScreen,
    Run: RunScreen,
  },
});

const Navigation = createStaticNavigation(MyStack);

export default function App() {

   
  return <Navigation />;
  
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'lightsteelblue',
  },
  hlBox:{
    flexDirection: 'row',
    flex: 0.2,
    justifyContent: 'center',
    backgroundColor: 'lightsteelblue',
  },

  picS:{
    margin: marg,
    //flexDirection: 'center',
    flex: 0.5,
    justifyContent: 'center',
    backgroundColor: 'lightsteelblue',

  },
   heading: {
    margin: 2,
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'midnightblue',
  },
   map: {
    //flex: 0.5,
    width: '100%',
    height: '70%',
    borderWidth: bd/30,
     borderColor: 'midnightblue'
  },

  butRow:{
    margin: marg/2,
    flexDirection: 'row',
    //flex: 0.16,
    justifyContent: 'center',
    backgroundColor: 'lightsteelblue',

  },

  butS:{
    margin:marg,
    justifyContent: 'center',
    borderWidth: bd/25,
    width: bw/1.4,
    height: bh/1.6,
    borderRadius: bd,
    backgroundColor: "midnightblue",
    

  },
  butRun:{
    margin:marg,
    //padding: 20,

    justifyContent: 'center',

    borderWidth: bd/30,
    width: bw/2.5,
    height: bh/1.6,
    borderRadius: bd,
    backgroundColor: "midnightblue"

  },
   butT:{
    //margin:marg,
    fontSize: font/2.2,
    fontWeight: 'normal',
    textAlign: 'center',
    color: 'white',
    justifyContent: 'center',

  },
  timeT:{
    fontSize: font/1.5,
    fontWeight: 'normal',
    textAlign: 'center',
    color: 'white',

  },
  showI:{
    width:bw*4,
    height: bh*3,

    resizeMode: "contain",

  },
});