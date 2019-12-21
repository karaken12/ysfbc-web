import React, {Component} from "react";
import Meeting from "./Meeting";

const NEXT_MEETING_SERVICE_URL = '/data/next_meeting.json';

export class CurrentMeeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      meeting: {}
    };
  }

  render() {
    return <Meeting
      key={this.state.meeting.name}
      name={this.state.meeting.name}
      where={this.state.meeting.where}
      facebook={this.state.meeting.facebook}
      date={this.state.meeting.date}
      book={this.state.meeting.book}
      short={this.state.meeting.short}
      film={this.state.meeting.film}
      isCurrent={true}
    />;
  }

  componentDidMount() {
    this.fetchCurrentMeeting();
  }

  fetchCurrentMeetingWithFetchAPI = () => {
    this.setState({...this.state, isFetching: true});
    fetch(NEXT_MEETING_SERVICE_URL)
      .then(response => response.json())
      .then(result => {
        this.setState({meeting: result, isFetching: false})
      })
      .catch(e => {
        console.log(e);
        this.setState({...this.state, isFetching: false});
      });
  };

  fetchCurrentMeeting = this.fetchCurrentMeetingWithFetchAPI;
}
