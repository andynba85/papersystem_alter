/*
function staticLoadPlaces() {
    return [
        {
            name: "Your place name",
            location: {
                lat: 0, // add here latitude if using static data
                lng: 0, // add here longitude if using static data
            }
        },
        {
            name: 'Another place name',
            location: {
                lat: 0,
                lng: 0,
            }
        }
    ];
}
*/
/*
function placedetail(id){
    let params = {
        radius: 10,    // search places not farther than this value (in meters)
        clientId: 'GOIC5ZWTKLUIBESV5FKIHXESOVPY2KFV2TS42LMFJT152TVB',
        clientSecret: '2QS2BGWHO2FEQZV1PKCRDVGBCYHJN31KV11ZKTCQ4FMMFB0Y',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };
    let corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    let endpoint = `https://api.foursquare.com/v2/venues/${id}?client_id=${params.clientId}
        &client_secret=${params.clientSecret}&v=${params.version}`;
    console.log(endpoint)
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    console.log(resp)
                    return resp.response;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};
*/


window.onload = () => {
    let method = 'dynamic';

    // if you want to statically add places, de-comment following line
    //method = 'static';

    if (method === 'static') {
        let places = staticLoadPlaces();
        renderPlaces(places);
    }

    if (method !== 'static') {
        
        // first get current user location
        return navigator.geolocation.getCurrentPosition(function (position) {

            // than use it to load from remote APIs some places nearby
            dynamicLoadPlaces(position.coords)
                .then((places) => {
                    renderPlaces(places);
                })
        },
            (err) => console.error('Error in retrieving position', err),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
    }
};
// getting places from REST APIs
function dynamicLoadPlaces(position) {
    let params = {
        radius: 50,    // search places not farther than this value (in meters)
        clientId: 'GOIC5ZWTKLUIBESV5FKIHXESOVPY2KFV2TS42LMFJT152TVB',
        clientSecret: '2QS2BGWHO2FEQZV1PKCRDVGBCYHJN31KV11ZKTCQ4FMMFB0Y',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    let corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    let endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    console.log(resp)
                    console.log(resp.response.venues)
                    console.log(resp.response.venues.categories)
                    console.log(resp.response.tips)
                    console.log(resp.response.lists)
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        //let gps = document.createAttribute('gps-entity-place')
        const latitude = place.location.lat;
        console.log(latitude)
        const longitude = place.location.lng;
        console.log(longitude)
        //gps.value=`latitude: ${latitude}; longitude: ${longitude};`
        //console.log(placedetail(place.id))
        console.log(place.id)
        // add place icon
        const icon = document.createElement('a-image');
        icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        //icon.setAttributeNode('gps');
        icon.setAttribute('name', place.name);
        icon.setAttribute('scale','15,15');
        icon.setAttribute('src', 'map-marker.png');
        //icon.setAttribute('src', '../assets/map-marker.png');

        // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
        //icon.setAttribute('scale', '20, 20');
        scene.insertAdjacentHTML('afterbegin',`<a-image gps-entity-place="latitude: ${latitude}; longitude: ${longitude};" name="${place.name}" scale="0.5,0.5" rotation="0 180 0" src="./map-marker.png"></a-image>`);

        icon.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });

        const clickListener = function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            const name = ev.target.getAttribute('name');

            const el = ev.detail.intersection && ev.detail.intersection.object.el;

            if (el && el === ev.target) {
                const label = document.createElement('span');
                const container = document.createElement('div');
                container.setAttribute('id', 'place-label');
                label.innerText = name;
                container.appendChild(label);
                document.body.appendChild(container);

                setTimeout(() => {
                    container.parentElement.removeChild(container);
                }, 1500);
            }
        };

        icon.addEventListener('click', clickListener);
        //scene.appendChild(icon);
        
    });
}


