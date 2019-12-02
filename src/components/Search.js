import React, { Component } from "react";
import { AutoComplete, Icon } from "antd";
import "../style/Search.css";
import get from "lodash/get";
import { createSelector } from "reselect";
import { connect } from "react-redux";
import { weatherSelector } from "../data/modules/weather/weather.selectors";
import { getLocationKeyByCityNameAction } from "../data/modules/weather/weather.actions";
var debounce = require("debounce");
const tempApiKey = "IAauRqa8Bxf9yBAxchkGcvLr0aj6BDos";
const d = "GqyBoSIAIF3DOeqGW6w1wJcT9SZJ6fAF";
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      citiesName: []
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.getLocationKeyByCityName = this.getLocationKeyByCityName.bind(this);
    this.handelSelect = this.handelSelect.bind(this);
  }

  handelSelect = selectedCity => {
    const city = Object.values(this.state.dataSource).filter(
      city => get(city, "locationName") === selectedCity
    )[0];
    if (city) {
      this.props.setTodayCityWeatherByLocationKey(city.locationName);
    }
  };

  handleSearch = debounce(city => {
    this.getLocationKeyByCityName(city);
  }, 1000);

  getLocationKeyByCityName = async cityName => {
    await this.props.getLocationKeyByCityNameAction(cityName);
    const citiesName = [];
    const dataSource = [];
    Object.values(get(this.props, "weather.locationKeyResult", [])).forEach(
      (location, idx) => {
        dataSource.push({
          locationName: location.LocalizedName,
          locationKey: location.Key
        });
        citiesName.push(location.LocalizedName);
      }
    );

    this.setState({
      dataSource: dataSource,
      citiesName: citiesName
    });
  };

  render() {
    const { citiesName } = this.state;
    return (
      <div className={"search"}>
        <AutoComplete
          dataSource={citiesName}
          placeholder="Enter your city"
          prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />}
          onChange={this.handleSearch}
          onSelect={this.handelSelect}
        />
      </div>
    );
  }
}
const finalSelector = createSelector(
  weatherSelector,
  weatherSelector => {
    return {
      weather: weatherSelector
    };
  }
);

const mapDispatchToProps = {
  getLocationKeyByCityNameAction
};
export default connect(
  finalSelector,
  mapDispatchToProps
)(Search);
