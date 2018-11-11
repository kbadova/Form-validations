import React from 'react';
import axios from 'axios';

import './styles.css';

class BookingRequests extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bookingRequests: []
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:8000/booking/booking-requests/')
      .then(response => {
        this.setState({bookingRequests: response.data});
      });
  }

  filterBookingRequestsByName = event => {
    const name = event.target.value;
    axios
      .get(`http://localhost:8000/booking/booking-requests/?name=${name}`)
      .then(response => {
        this.setState({bookingRequests: response.data});
      });
  };

  filterBookingRequestsByDate = event => {
    const end = event.target.value;

    axios
      .get(`http://localhost:8000/booking/booking-requests/?end=${end}&&start=`)
      .then(response => {
        this.setState({bookingRequests: response.data});
      });
  };

  render() {
    const {bookingRequests} = this.state;
    return (
      <div className="BookingRequests">
        <div>
          <input
            type="text"
            placeholder="Type a name here"
            onChange={this.filterBookingRequestsByName}
          />
        </div>

        <div>
          <label>start</label>
          <input type="date" />

          <label>end</label>
          <input type="date" onChange={this.filterBookingRequestsByDate} />
        </div>
        <div>
          <p>Booking requests</p>
          <table>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Start</th>
              <th>End</th>
            </tr>
            {bookingRequests.map(request => (
              <tr key={request.id}>
                <td>{request.name}</td>
                <td>{request.email}</td>
                <td>{request.start}</td>
                <td>{request.end}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    );
  }
}

export default BookingRequests;
