import React from "react";
import Card from "./RestaurantCard";
import data from "../data/maitrebib.json";

class Cards extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurants: data,
      filtered_restaurants: data
    };
  }

  componentWillMount = () => {};

  filterRestaurants = filter => {
    console.log("Filter call");
    console.log("filter : " + filter);
    let filtered_restaurants = this.state.restaurants;
    filtered_restaurants = filtered_restaurants.filter(restaurant => {
      return restaurant.name.includes(filter);
    });
    console.log(filtered_restaurants);
    this.setState({
      restaurants: this.props,
      filtered_restaurants
    });
  };

  render() {
    return (
      <div className="container-fluid d-flex justify-content-center">
        <div className="row">
          {this.state.restaurants.map(restaurant => {
            return <div className="col-md-4">{Card(restaurant)}</div>;
          })}
        </div>
      </div>
    );
  }
}

export default Cards;
