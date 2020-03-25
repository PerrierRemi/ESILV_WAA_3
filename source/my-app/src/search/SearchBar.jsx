import React from "react";
import { MDBCol, MDBFormInline } from "mdbreact";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: ""
    };
  }

  handleChange = event => {
    this.setState({
      filter: event.target.value
    });
    this.props.cards.filterRestaurants(event.target.value);
  };

  componentWillMount = () => {};

  render() {
    return (
      <MDBCol md="12">
        <MDBFormInline className="md-form mr-auto mb-4">
          <div className="col-lg-4">
            <input
              class="form-control mr-sm-2"
              type="text"
              placeholder="Search"
              aria-label="Search"
              onChange={this.handleChange}
            />
            <button
              className="btn btn-outline-success btn-rounded btn-sm my-0 waves-effect waves-light"
              type="submit"
            >
              Search
            </button>
          </div>
        </MDBFormInline>
      </MDBCol>
    );
  }
}

export default SearchBar;
