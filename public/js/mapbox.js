/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoia2hhbGlkbmF3YWIiLCJhIjoiY2swejV6N2JqMDd1NzNubjlpMWRkYTd5YiJ9.7X11RgEInBTOY_oLIP2tqA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/khalidnawab/ck0z6ccr6084s1cnpfspplf7t',
    zoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    //Create marker

    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      right: 100,
      left: 100
    }
  });
};
