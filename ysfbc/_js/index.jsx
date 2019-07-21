fetch('/data/next_meeting.json')
    .then(response => response.json())
    .then((jsonData) => {
        var meeting = jsonData;
        ReactDOM.render(
            (
                <Meeting
                    key={meeting.name}
                    name={meeting.name}
                    where={meeting.where}
                    facebook={meeting.facebook}
                    date={meeting.date}
                    book={meeting.book}
                    short={meeting.short}
                    film={meeting.film}
                    isCurrent={true}
                />
            ),
            document.getElementById('root')
        );
    })
    .catch((error) => {
        console.error(error);
    });
