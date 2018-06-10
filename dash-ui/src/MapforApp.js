import React, { Component } from 'react';
import {geolocated,geoPropTypes} from 'react-geolocated';
import './App.css';
import axios from 'axios';
import { Button, Input } from 'antd';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"


export class MapforApp extends Component {

    constructor(props){
        super(props);
        /*this.props.dataArray = {
            lat : 0,
            long : 0,
            smLat: 0,
            smLong: 0,
            smQues: String,
            smClue: String,
            smAns: String,
            markers: [],
            mainMarker: [],
            rad : 5,
        };*/
    }

    

    clickHandle(){
        if(!this.props.isGeolocationAvailable){
            console.log("No geolocation support");
        }
        else if(!this.props.isGeolocationEnabled){
            console.log("Geolocation not enabled");
        }
        else{
            this.postReq(this.props.coords.latitude, this.props.coords.longitude);

        }
    }

    createGeofence(){
        axios.post('http://fb5d869f.ngrok.io/putGeofence', {
            lat : this.state.setglat,
            lng : this.state.setglng,
            radius : this.state.rad
        }).then(function (res) {
            console.log(res)
        }).catch(function (res) {
            console.log(res)
        })
    }

  render() {
        let initlat = 0;
        let initlong = 0;
      if(this.props.coords)
      {
           initlat = this.props.coords.latitude;
           initlong = this.props.coords.longitude;
      }
      const MyMapComponent = withScriptjs(withGoogleMap((props) =>
          <GoogleMap
              defaultZoom={18}
              defaultCenter={{ lat: initlat, lng: initlong }}
          >
              {props.isMarkerShown}
              {props.markers}
              {props.enableFence && <Polygon paths={props.geoArray} />}
          </GoogleMap>
      ));

      return (
      <div>
                  <MyMapComponent
                      isMarkerShown
                      googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCTGVQvCbfPRpAXdUlxquPMO-Ok9DebSmg"
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `480px` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                      markers = {this.props.markers}
                      geoArray = {this.props.geoArray}
                      enableFence = {this.props.enableFence}
                  />
      </div>

    );
  }
}

MapforApp.propTypes = {...geoPropTypes};

export default geolocated({
    positionOptions : {
        enableHighAccuracy : true,
    },
    userDecisionTimeout : null,
})(MapforApp);
