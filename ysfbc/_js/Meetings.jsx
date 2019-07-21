fetch('/data/meetings.json')
    .then(response => response.json())
    .then((jsonData) => {
        const next_meeting = Object.keys(jsonData)[0];
        ReactDOM.render(
            (
                <div>
                    <h1 className="books">Meetings</h1>
                    {Object.entries(jsonData).map((entry) => {
                        var meeting = entry[1];
                        return (
                            <Meeting
                                key={meeting.name}
                                name={meeting.name}
                                where={meeting.where}
                                facebook={meeting.facebook}
                                date={meeting.date}
                                book={meeting.book}
                                short={meeting.short}
                                film={meeting.film}
                                isCurrent={(meeting.name == next_meeting)}
                            />
                        )
                    })}
                </div>
            ),
            document.getElementById('root')
        );
    })
    .catch((error) => {
        console.error(error);
    });
