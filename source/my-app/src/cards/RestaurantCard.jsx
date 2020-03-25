import React from "react";

const RestaurantCard = restaurant => {
  return (
    <div className="card text-center mt-4">
      <div className="embed-responsive embed-responsive-16by9">
        <img
          src={restaurant.image}
          alt="Card image cap"
          class="card-img-top embed-responsive-item"
        />
      </div>
      <div className="card-body text-dark">
        <h4 className="card-title">{restaurant.name}</h4>
        <p className="card-text text-secondary">
          {restaurant.address.street}, {restaurant.address.city}
        </p>
        <p className="card-text text-secondary">
          {restaurant.location[0]} - {restaurant.location[1]}
        </p>
        <a
          href={"https://" + restaurant.website}
          className="btn btn-outline-success"
        >
          Visit them !
        </a>
      </div>
    </div>
  );
};

export default RestaurantCard;
