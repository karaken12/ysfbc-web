fetch('/data/meetings.json')
    .then(response => response.json())
    .then((jsonData) => {
        const next_meeting = Object.keys(jsonData)[0];
        ReactDOM.render(
            (
                <div className="books">
                    {Object.entries(jsonData).map((entry) => {
                        var meeting = entry[1];
                        return (meeting[type] === undefined) ? null : (
                            <Book {...(meeting[type])} type={type} key={meeting.name}/>
                        );
                    })}
                </div>
            ),
            document.getElementById('root')
        );
    })
    .catch((error) => {
        console.error(error);
    });
