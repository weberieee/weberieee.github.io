//string date to start the list range.
//recommend using Date.now() to filter out past events
var startDate = Date.now();
var items = [];
$.getJSON(
    "https://www.googleapis.com/calendar/v3/calendars/c_tavsahovtdark6lu9khban4qek@group.calendar.google.com/events?key=AIzaSyCrPzedxOXMEoXd5dzdF9hDOAkjcb3lsL0&singleEvents=true&orderBy=starttime&maxResults=12&timeMin=" + new Date(startDate).toISOString(),
    // console.log(data)
    function (data) {


        var counter = 0
        $.each(data["items"], function (key, val) {
            if (items.includes(startDate(val["start"])) === false) {
                //		console.log(val);
                counter++;
                if (counter > 3) {
                    return false;
                }
                items.push(startDate(val["start"]));

                // console.log(counter);
            }
            // console.log(items);
        });
        items = items.slice().sort();
        var counter = 0;

        for (var i = 0; i < items.length - 1; i++) {
            if (items[i + 1] == items[i]) {
                items.splice(i, 1);
            }

        }

        var markup = "";

        var events = {};
        items.forEach(function (item) {
            $.each(data["items"], function (key, val) {
                if (item == startDate(val["start"])) {
                    //          console.log(val);
                    if (events[item] === undefined) {
                        events[item] = new Array();
                    }

                    events[item].push({
                        'eventTitle': val["summary"],
                        'eventDescr': val["description"] === undefined ? "<i>No Event Description</i>" : val["description"],
                        'startTime': startTime(val["start"]),
                        'endDate': moment(startDate(val["end"])).format('l'),
                        'endTime': startTime(val["end"]),
                        'htmlLink': val["htmlLink"],
                        'location': val["location"] === undefined ? "TBD" : val["location"]
                    });
                    //		    console.log(events);
                    //console.log(val);
                }

            });
        });
        //	console.log(items)
        var markup = "";


        items.forEach(function (eventDate) {

            var dateRender = moment(eventDate).format("MMMM Do YYYY");

            events[eventDate].forEach(function (event) {
                //        console.log(event);
                markup += "<h4>" + event["eventTitle"] + "</h4>";
                markup += "<p>Date: " + dateRender + "<br/>";
                markup += "Time: " + event["startTime"] + " - " + event["endTime"] + "<br/>";
                markup += "Location: " + event["location"] + "<br/>";
                if (event["eventDescr"] !== "<i>No Event Description</i>") {
                    markup += "<br/>";
                    markup += "Event Description:";
                    markup += "<br/>";
                    markup += event["eventDescr"] + "<br/>";
                }
                markup += "</br><a href='" + event["htmlLink"] + "'>View this Event in Google Calendar</a><br/><br/></p>";
            });
            console.log(markup);
        });

        const eventsContainer = document.getElementById('events-container');
        eventsContainer.innerHTML = markup;


        function startDate(d) {
            if (d["dateTime"] === undefined) return d["date"];
            else {
                var formatted = new Date(d["dateTime"]);
                var day = formatted.getDate();
                var month = formatted.getMonth() + 1;
                var year = formatted.getFullYear();
                return year + "-" + pad(month) + "-" + pad(day);
            }
        }

        function startTime(d) {
            if (d["dateTime"] === undefined) return "All Day";
            else {
                var formatted = new Date(d["dateTime"]);
                return moment(d["dateTime"]).format('LT');
            }
        }


        function pad(n) {
            return n < 10 ? "0" + n : n;
        }

        $(".events").click(function (e) {
            $(e.target)
                .next("div")
                .siblings("div")
                .slideUp();
            $(e.target)
                .next("div")
                .slideToggle();
        });
    }
);


// // js/calendar.js
// const apiKey = 'AIzaSyCrPzedxOXMEoXd5dzdF9hDOAkjcb3lsL0';
// const calendarId = 'c_tavsahovtdark6lu9khban4qek';
// const maxResults = 10;

// async function fetchEvents() {
//     const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&maxResults=${maxResults}`);
//     const data = await response.json();
//     console.log('Events fetched:', data);
//     return data.items;
// }

// function renderEvents(events) {
//     const eventsContainer = document.getElementById('events-container');
//     eventsContainer.innerHTML = '';

//     events.forEach(event => {
//         const eventElement = document.createElement('div');
//         eventElement.className = 'event';

//         const title = document.createElement('h3');
//         title.textContent = event.summary;
//         eventElement.appendChild(title);

//         const date = document.createElement('p');
//         date.textContent = new Date(event.start.dateTime || event.start.date).toLocaleString();
//         eventElement.appendChild(date);

//         eventsContainer.appendChild(eventElement);
//     });
// }

// document.addEventListener('DOMContentLoaded', async () => {
//     const events = await fetchEvents();
//     renderEvents(events);
// });