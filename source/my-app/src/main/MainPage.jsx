import React from "react";
import SearchBar from "../search/SearchBar";
import Cards from "../cards/Cards";

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.cards = new Cards();
    this.searchBar = new SearchBar({ cards: this.cards });
  }

  render() {
    return (
      <div className="main">
        {this.searchBar.render()}
        {this.cards.render()}
      </div>
    );
  }
}

export default MainPage;
