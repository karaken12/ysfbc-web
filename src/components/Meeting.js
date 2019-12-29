import React from 'react';
import Book from "./Book";

function Meeting(props) {
    const meeting = props.meeting;
    const isCurrent = props.isCurrent;
    const meetingName = (isCurrent ? "Next Meeting - " : '') + meeting.name;

    return (
        <div className="meeting">
            <div className="next-meeting">
                <h1>{meetingName}</h1>
                <p>
                    {meeting.date}
                    {meeting.where != null && (<span> at {meeting.where}. </span>)}
                    {meeting.facebook && (
                        <a href={"https://www.facebook.com/events/" + meeting.facebook.event_id + "/"}>
                            <img src="../images/facebook-icon.png" alt="Facebook Event"
                                 style={{verticalAlign: 'text-top'}}/>
                        </a>
                    )}
                </p>
            </div>
            <div className="books">
                {meeting.book && <Book meeting={meeting} type="book" isCurrent={isCurrent}/>}
                {meeting.short && <Book meeting={meeting} type="short" isCurrent={isCurrent}/>}
                {meeting.film && <Book meeting={meeting} type="film" isCurrent={isCurrent}/>}
            </div>
        </div>
    );
}

Meeting.defaultProps = {
  isCurrent: false,
};

export default Meeting;
