import { h, Component } from 'preact';
import style from './style';

import Map, { GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
const { GOOGLE_API_KEY } = require('../../../config');

class PlacesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      places: [],
      lat: null,
      lng: null
    }
    this.geolocatonSuccess = this.geolocatonSuccess.bind(this);
    navigator.geolocation.getCurrentPosition(this.geolocatonSuccess);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
    this.fetchPlaces = this.fetchPlaces.bind(this);
    this.update = this.update.bind(this);
  }

  geolocatonSuccess(position) {
    this.setState({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  fetchPlaces(mapProps, map) {
    const {google} = mapProps;
    console.log(mapProps);
    let curr = new google.maps.LatLng(mapProps.center.lat,mapProps.center.lng);
    let request = {
      location: curr,
      radius: '2000',
      type: ['food']
    }
    let service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results, status, res) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          addToArr(place);
          // console.log(place);
        }
      }
    });
    const addToArr = (place) => this.update(place);
  }

  update(place) {
    var arrayvar = this.state.places.slice();
    arrayvar.push(place);
    this.setState({ places: arrayvar })
  }

  render() {
    const markers = this.state.places.map(place => 
      <Marker 
        name={place.name}
        position={{
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }}
        onClick={this.onMarkerClick}
      />
    );

    return (
      <Map
        google={this.props.google}
        zoom={14}
        center={{
          lat: this.state.lat,
          lng: this.state.lng,
        }}
        onClick={this.fetchPlaces}
      >
        {markers}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          >
          <h1>
            {this.state.selectedPlace.name}
          </h1>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY,
})(PlacesContainer)