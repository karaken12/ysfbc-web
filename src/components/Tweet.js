import React from "react";
import Moment from 'react-moment';
import * as moment from "moment";

function Tweet(props) {
  const meeting = props.meeting;

  return (
    <div className="meeting">
      <div className="book">
        <p>{meeting.name} details:<br/>
          &#x1F4C6; <Moment format="kk:mm, dddd MMMM Do">{moment.utc(meeting.date)}</Moment>

          {meeting.where != null && (<><br/>&#x1F4CD; {meeting.where}</>)}

          {meeting.book && (<>
            <br/>&#x1F4DA; "{meeting.book.title}"
            {meeting.book.author && <> by {meeting.book.author}</>}
          </>)}

          {meeting.short && (<>
            <br/>&#x1F4C3; "{meeting.short.title}"
            {meeting.short.author && <> by {meeting.short.author}</>}
          </>)}

          {meeting.film && (<>
            <br/>&#x1F39E;&#xFE0F; "{meeting.film.title}"
          </>)}

        </p>
      </div>
    </div>
  );
}

export default Tweet;
