import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import style from './style';
import Map, { GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const { GOOGLE_API_KEY } = require('../../../config');

class SearchAutocomplete extends Component {

    constructor(props) {
      super(props);
      this.state = {
        lat: null,
        lng: null
      }
      this.geolocatonSuccess = this.geolocatonSuccess.bind(this);
      navigator.geolocation.getCurrentPosition(this.geolocatonSuccess);
      this.complete = null;
      this.autocomplete = this.autocomplete.bind(this);
    }

    geolocatonSuccess(position) {
      this.setState({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }

    autocomplete(mapProps, map) {
      const {google} = mapProps;
      console.log(mapProps);
      let defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(mapProps.center.lat, mapProps.center.lng),
        new google.maps.LatLng(mapProps.center.lat, mapProps.center.lng));
      let input = this._input;
      let options = {
        bounds: defaultBounds,
        types: ['(cities)']
      };
      this.complete = new google.maps.places.Autocomplete(input, options);
      this.complete.addListener('place_changed', () => {
        let place = this.complete.getPlace();
        console.log(place);
      })
    }
      
    render() {
      return (
        <div>
          <input class={style.search} ref={(c) => this._input = c}/>
          <div class={style.hide}>
            <Map   
              google={this.props.google}
              center={{
                lat: this.state.lat,
                lng: this.state.lng,
              }}
              onReady={this.autocomplete}>
            </Map>
          </div>
        </div>  
      );
    }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY,
})(SearchAutocomplete)