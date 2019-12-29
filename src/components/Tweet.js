import React from "react";

function Tweet(props) {
  const meeting = props.meeting;

  return (
    <div className="meeting">
      <div className="book">
        <p>{meeting.name}<br/>
          &#x1F4C6; {meeting.date}
          {/*| date: '%I:%M %p on %A %B %d, %Y'}}*/}
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
