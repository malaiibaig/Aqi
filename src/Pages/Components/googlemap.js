import
	{
		GoogleMap,
		InfoWindowF,
		MarkerF,
		useLoadScript,
		PolygonF,
		InfoBoxF
	} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { home, username, password } from "../../Variables";
import { get_home_data } from "../../lib/constants";

const Map = ( props ) =>
{
	const { isLoaded } = useLoadScript( {
		googleMapsApiKey: "AIzaSyAKQgrWGX0ewu6mhEKcfBxL-voV3vh7Jbo",
	} );
	const [ mapType, setMapType ] = useState( "" );
	const [ mapRef, setMapRef ] = useState();
	const [ isOpen, setIsOpen ] = useState( false );
	const [ infoWindowData, setInfoWindowData ] = useState();
	const [ markers, setMarkers ] = useState( [] );
	const [ copied, setCopied ] = useState( false );
	const [ copiedData, setCopiedData ] = useState( "" );

	const Rsg = [
		{ lng: 37.39676306172987, lat: 26.18953717501603 },
		{ lng: 37.40044657305821, lat: 26.19273353667615 },
		{ lng: 37.40107055704726, lat: 26.19312827747013 },
		{ lng: 37.40311567756318, lat: 26.1944220423224 },
		{ lng: 37.40790691085729, lat: 26.19971907098233 },
		{ lng: 37.40936164222227, lat: 26.20269816273421 },
		{ lng: 37.41052300739007, lat: 26.20888660072892 },
		{ lng: 37.41163090267213, lat: 26.21189663370779 },
		{ lng: 37.41497450934499, lat: 26.21686641595683 },
		{ lng: 37.41685794312674, lat: 26.2185051889501 },
		{ lng: 37.41875009091315, lat: 26.22143930372254 },
		{ lng: 37.42265522845139, lat: 26.2257864400291 },
		{ lng: 37.424542477666, lat: 26.22788729481663 },
		{ lng: 37.43176388404108, lat: 26.23674877628394 },
		{ lng: 37.42817208667606, lat: 26.24269232318377 },
		{ lng: 37.41417396989682, lat: 26.25957518748723 },
		{ lng: 37.41124724903609, lat: 26.26377987402724 },
		{ lng: 37.4072713607412, lat: 26.26853646787286 },
		{ lng: 37.40107500778736, lat: 26.28065651301087 },
		{ lng: 37.39703843737026, lat: 26.29008922364117 },
		{ lng: 37.39375428401095, lat: 26.29573363973749 },
		{ lng: 37.3885229257269, lat: 26.30121196349795 },
		{ lng: 37.38503270012864, lat: 26.30674141008157 },
		{ lng: 37.38180049821405, lat: 26.31088254544275 },
		{ lng: 37.38027355416421, lat: 26.31356478118952 },
		{ lng: 37.37827243818487, lat: 26.31611066340236 },
		{ lng: 37.37194033000384, lat: 26.32416656959427 },
		{ lng: 37.37092293976063, lat: 26.3268628404764 },
		{ lng: 37.368186708005, lat: 26.33411436052097 },
		{ lng: 37.36435449735328, lat: 26.34030693687475 },
		{ lng: 37.3635396368734, lat: 26.34162369306341 },
		{ lng: 37.35886324822297, lat: 26.34918039855698 },
		{ lng: 37.35653954607528, lat: 26.35155708884126 },
		{ lng: 37.34030750450688, lat: 26.36515110057645 },
		{ lng: 37.32971340848633, lat: 26.37166567115534 },
		{ lng: 37.29447129779809, lat: 26.39025823489358 },
		{ lng: 37.26787054751474, lat: 26.40227229639983 },
		{ lng: 37.25437799572422, lat: 26.40986867707367 },
		{ lng: 37.23963639605694, lat: 26.41753667596405 },
		{ lng: 37.21793746503987, lat: 26.43111549397705 },
		{ lng: 37.19645600535184, lat: 26.45359281432734 },
		{ lng: 37.16973225798328, lat: 26.48155253385212 },
		{ lng: 37.16070813774311, lat: 26.50149609637035 },
		{ lng: 37.15202483080277, lat: 26.51956974310224 },
		{ lng: 37.151360887712, lat: 26.51922375940667 },
		{ lng: 37.10734036451109, lat: 26.49627323664281 },
		{ lng: 37.06651621253837, lat: 26.47498932796451 },
		{ lng: 37.05261655613118, lat: 26.46774266172936 },
		{ lng: 37.0011839997937, lat: 26.44092799984471 },
		{ lng: 36.80585899985048, lat: 26.38642700059334 },
		{ lng: 36.72756099994794, lat: 26.35671199968098 },
		{ lng: 36.60887819165537, lat: 26.28373154495105 },
		{ lng: 36.52316200010728, lat: 26.23090899941666 },
		{ lng: 36.53675430159469, lat: 26.21170985289875 },
		{ lng: 36.54123999932723, lat: 26.20537200019565 },
		{ lng: 36.48353699960415, lat: 26.1711970002755 },
		{ lng: 36.45376900017468, lat: 26.23123400072691 },
		{ lng: 36.42456911996242, lat: 26.23137951662317 },
		{ lng: 36.33424699995007, lat: 26.23179199982424 },
		{ lng: 36.33264799916021, lat: 25.5024560006672 },
		{ lng: 36.63500023145914, lat: 25.31507524959279 },
		{ lng: 36.93973349040595, lat: 25.12468770812374 },
		{ lng: 37.06458900018038, lat: 25.04668200008569 },
		{ lng: 37.25094899996084, lat: 25.16787099957304 },
		{ lng: 37.26473716328146, lat: 25.1735420216396 },
		{ lng: 37.27730899814903, lat: 25.17871122729515 },
		{ lng: 37.29547500055627, lat: 25.18617800024685 },
		{ lng: 37.29613028667605, lat: 25.17681927053892 },
		{ lng: 37.30085000025673, lat: 25.10935100016349 },
		{ lng: 37.32465113315982, lat: 25.10367807423011 },
		{ lng: 37.36049700000577, lat: 25.09512600070857 },
		{ lng: 37.36076811638998, lat: 25.09012896148561 },
		{ lng: 37.36354800026001, lat: 25.03885499987222 },
		{ lng: 37.32766500012051, lat: 25.03074299985814 },
		{ lng: 37.28551599960944, lat: 24.98540899992386 },
		{ lng: 37.28316937625621, lat: 24.98015338453587 },
		{ lng: 37.25798496574897, lat: 24.92372081954007 },
		{ lng: 37.249470000083, lat: 24.90462899988723 },
		{ lng: 37.2658392062201, lat: 24.88953580341988 },
		{ lng: 37.26893900034575, lat: 24.88667699924915 },
		{ lng: 37.33001886449919, lat: 24.76874414929995 },
		{ lng: 37.34323000006125, lat: 24.74320100013598 },
		{ lng: 37.34357183917026, lat: 24.73283126662333 },
		{ lng: 37.34466806867789, lat: 24.69954479151728 },
		{ lng: 37.3452630003682, lat: 24.68147999964708 },
		{ lng: 37.364167111425, lat: 24.64432540270407 },
		{ lng: 37.39473199949274, lat: 24.58419699997435 },
		{ lng: 37.5175040005092, lat: 24.63277500023767 },
		{ lng: 37.56039700019466, lat: 24.67561599984351 },
		{ lng: 37.60371399967043, lat: 24.6801229995955 },
		{ lng: 37.81638700082612, lat: 24.66762200028771 },
		{ lng: 38.51816200029177, lat: 24.6689979998226 },
		{ lng: 38.48514013257131, lat: 25.24403459298675 },
		{ lng: 38.4839870938077, lat: 25.26411340244783 },
		{ lng: 38.46138500033278, lat: 25.6577019997077 },
		{ lng: 38.36490136884575, lat: 25.78119994910426 },
		{ lng: 38.36488077510189, lat: 25.78122627404195 },
		{ lng: 38.30537685038951, lat: 25.73449100837745 },
		{ lng: 38.29485608461829, lat: 25.74387179328831 },
		{ lng: 38.27930572026835, lat: 25.75441754120688 },
		{ lng: 38.27885290956179, lat: 25.75472462210535 },
		{ lng: 38.26899977425526, lat: 25.76229452161007 },
		{ lng: 38.24482222738146, lat: 25.78536226861631 },
		{ lng: 37.90449995943104, lat: 25.79916665589845 },
		{ lng: 37.91766665072008, lat: 25.76722225422911 },
		{ lng: 37.86725597923074, lat: 25.74933890847737 },
		{ lng: 37.84091460644714, lat: 25.74000089331564 },
		{ lng: 37.84088367805579, lat: 25.73998704314527 },
		{ lng: 37.828141080885, lat: 25.73546402283942 },
		{ lng: 37.75732314499768, lat: 25.71031825259583 },
		{ lng: 37.72124857410029, lat: 25.74522366459461 },
		{ lng: 37.66429844896543, lat: 25.79933427627849 },
		{ lng: 37.66126439967564, lat: 25.8021224345226 },
		{ lng: 37.57760164361955, lat: 25.87900483096782 },
		{ lng: 37.52537947068918, lat: 25.92591563331834 },
		{ lng: 37.4907426699729, lat: 25.95907416462807 },
		{ lng: 37.49060461630876, lat: 25.95920632646531 },
		{ lng: 37.48675887744316, lat: 25.9628876436351 },
		{ lng: 37.44549456901815, lat: 26.00590188692781 },
		{ lng: 37.42930122461483, lat: 26.02948401900894 },
		{ lng: 37.41938877106397, lat: 26.04392009262428 },
		{ lng: 37.39371282194926, lat: 26.08131249013468 },
		{ lng: 37.36420012209373, lat: 26.1360555003901 },
		{ lng: 37.36603197058269, lat: 26.13833501830971 },
		{ lng: 37.36544369348597, lat: 26.14275735705301 },
		{ lng: 37.36891159400394, lat: 26.15055102886697 },
		{ lng: 37.37511701023242, lat: 26.15919139915962 },
		{ lng: 37.38077236196322, lat: 26.16568811387038 },
		{ lng: 37.38617010272993, lat: 26.17124769948147 },
		{ lng: 37.39676306172987, lat: 26.18953717501603 }
	];

	const Amaala = [
		{ lng: 35.80565700000005, lat: 27.54792500000002 },
		{ lng: 35.68382200000002, lat: 27.48343199999999 },
		{ lng: 35.79764, lat: 27.3277480000001 },
		{ lng: 35.755067, lat: 27.30235400000004 },
		{ lng: 35.59629100000006, lat: 27.20976300000012 },
		{ lng: 35.792305, lat: 26.9384070000001 },
		{ lng: 35.99521400000009, lat: 26.65832600000009 },
		{ lng: 36.154312, lat: 26.43903100000011 },
		{ lng: 36.318286, lat: 26.53446800000001 },
		{ lng: 36.47378799999996, lat: 26.62465100000003 },
		{ lng: 36.1847600000001, lat: 27.02646400000004 },
		{ lng: 36.0805390000001, lat: 27.17042900000007 },
		{ lng: 35.80565700000005, lat: 27.54792500000002 } 
	];

	useEffect( () =>
	{
		GetStations();
		const intervalId = setInterval( GetStations, 15000 );
		return () => clearInterval( intervalId );
	}, [ props.pollutant ] );

	const GetStations = async () =>
	{
		const apiStations = get_home_data.stations_array.map( ( station ) => ( {
			address: station.title,
			lat: parseFloat( station.lat ),
			lng: parseFloat( station.long ),
			lngPos: station.lat - 12,
			color: props.pollutant === "gas" ? station.fillColour : station.pfillColour,
			id: station.id,
			aqi: props.pollutant === "gas" ? station.aqi : station.paqi,
			bgColor: props.pollutant === "gas" ? station.fillColour : station.pfillColour,
			aqiTitle: props.pollutant === "gas" ? station.aqi_title : station.paqi_title,
		} ) );
		setMarkers( apiStations );
	};

	useEffect( () =>
	{
		console.log( "markers", markers );
	}, [ markers ] );

	useEffect( () =>
	{
		if ( props.sate === false )
		{
			setMapType( "satellite" );
		} else if ( props.road === false )
		{
			setMapType( "roadmap" );
		}
	}, [ props.sate, props.road, mapType ] );
	
	const onMapLoad = ( map ) =>
	{
		setMapRef( map );
		map.setCenter({ lat: 26.058694, lng: 36.615694 });
		map.setZoom(7.6);
	};

	const handleMarkerClick = ( id, lat, lng, address, aqi, bgColor, aqiTitle ) =>
	{
		setInfoWindowData( { id, address, aqi, bgColor, aqiTitle } );
		setIsOpen( true );
	};

	const handleMarkerRightClick = ( event, lat, lng ) =>
	{
		const coords = `${ lat },${ lng }`;
		navigator.clipboard.writeText( coords );
		setCopied( true );
		setIsOpen( false );
		setCopiedData( `Lat: ${ lat }, Long: ${ lng }` );
		setTimeout( () => setCopied( false ), 2000 );
		return false;
	};

	const loadMap = markers.length > 0;

	useEffect(() => {
		if (mapRef) {
			if (props.area === "amaala") {
				mapRef.setCenter({ lat: 27.08646400000004, lng: 36.1847600000001 });
				mapRef.setZoom(9);
			} else if (props.area === "rsg") {
				mapRef.setCenter({ lat: 25.66153717501603, lng: 37.39676306172987 });
				mapRef.setZoom(8.4);
			}
			else if ( props.area === "all" )
			{
				mapRef.setCenter( { lat: 26.058694, lng: 36.615694 } );
				mapRef.setZoom( 7.6 );
			}
		}
	}, [ mapRef, props.area ] );


	return (
		<div className="App">
			{ !isLoaded ? (
				<h1>Loading...</h1>
			) : (
				loadMap && (
					<GoogleMap
						mapContainerClassName="map-container -mt-[3.8vw] sm:h-[98dvh] lm:h-[98vh] tab:h-[99vh] sl:h-[99vh] lt:h-[100vh]"
						onLoad={ onMapLoad }
						// zoom={ 8 }
						mapTypeId={ mapType }
					>
							{ ( props.area === "amaala" || props.area === "all" ) && (
							<PolygonF
								paths={ Amaala }
								options={ {
									strokeColor: "#04253c",
									strokeOpacity: 0.8,
									strokeWeight: 3,
									fillColor: "#04253c",
									fillOpacity: 0.35,
								} }
							/>
						) }
							{ ( props.area === "rsg" || props.area === "all" ) && (
							<PolygonF
								paths={ Rsg }
								options={ {
									strokeColor: "#04253c",
									strokeOpacity: 0.8,
									strokeWeight: 3,
									fillColor: "#04253c",
									fillOpacity: 0.35,
								} }
							/>
						) }
						{ markers.map( ( { address, lat, lng, color, id, aqi, bgColor, aqiTitle, lngPos }, ind ) => (
							<MarkerF
								key={ ind }
								position={ { lat, lng } }
								onMouseOver={ () =>
								{
									handleMarkerClick( ind, lat, lng, address, aqi, bgColor, aqiTitle );
									setCopied( false );
								} }
								onMouseOut={ () => setIsOpen( false ) }
								onClick={ () =>
								{
									props.showChart( id );
									props.default( id );
								} }
								onRightClick={ ( event ) => handleMarkerRightClick( event, lat, lng ) }
								icon={ {
									url: `data:image/svg+xml;charset=UTF-8,${ encodeURIComponent(
										`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${ color }" width="40" height="40"><path d="M12 2c-4.42 0-8 3.58-8 8 0 5.25 8 14 8 14s8-8.75 8-14c0-4.42-3.58-8-8-8zm0 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`
									) }`,
									anchor: new window.google.maps.Point( 4, 4 ),
									scaledSize: new window.google.maps.Size( 40, 40 ),
								} }
								zIndex={ 9999 }
							>
								<InfoBoxF
									position={ { lat, lng } }
									options={ { closeBoxURL: ``, enableEventPropagation: true } }
								>
									<div className="w-max mt-[3.6rem] text-start">
										<div className="z-[-6] text-sm text-center text-white mx-auto drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">
											<span>{ address }</span>
											<br />
											<span>AQI { aqi }</span>
										</div>
									</div>
								</InfoBoxF>
								{ isOpen && infoWindowData?.id === ind && (
									<InfoWindowF>
										<div>
											<h2
												className={ `text-white font-[500] text-[1vw] w-[100%] h-[40%] px-[0.6vw] py-[0.4vw]` }
												style={ { background: bgColor } }
											>
												{ infoWindowData.address + " " + `(${ aqiTitle })` }
											</h2>
											<h3 className="font-[500] text-[1.06vw] w-[100%] h-[40%] px-[0.6vw] py-[1vw]">
												AQI: { aqi }
											</h3>
										</div>
									</InfoWindowF>
								) }

								{ copied && infoWindowData?.id === ind && (
									<InfoWindowF>
										<div>
											<h3 className="text-center font-[500] text-[0.9vw] px-[0.2vw] py-[0.6vw] w-[100%] h-[40%]">
												{ copiedData }
											</h3>
										</div>
									</InfoWindowF>
								) }
							</MarkerF>
						) ) }
					</GoogleMap>
				)
			) }
		</div>
	);
};

export default Map;
