import { useEffect, useState } from "react";
import Map from "./Components/googlemap";
import Chart from "./Components/chart";
import arabicLogo from "../assets/logos/arabicLogo.png";
import engLogo from "../assets/logos/engLogo.png";
import sate from "../assets/maptype/satellite.jpg";
import road from "../assets/maptype/road.jpg";
import About from "./Components/about";
import Modals from "./Modals/modals";
import GuageChart from "./Charts/guagechart";

function Index ()
{
	const [ aqiStatus, setAqiStatus ] = useState( null );
	const [ gasPollutant, setGasPollutant ] = useState( true );
	const [ pmPollutant, setPmPollutant ] = useState( false );
	const [ matPollutant, setMatPollutant ] = useState( false );
	const [ chartDiv, setChartDiv ] = useState( false );
	const [ mapRoadType, setMapRoadType ] = useState( true );
	const [ mapSatType, setMapSatType ] = useState( false );
	const [ about, setAbout ] = useState( false );
	const [ download, setDownload ] = useState( false );
	const [ selectedStation, setSelectedStation ] = useState( "" );
	const [ pollutant, setPollutant ] = useState( "gas" );
	const [ divBtn, setDivBtn ] = useState( false );
	const [ aqiTitle, setAqiTitle ] = useState( "" );
	const [ aqiColor, setAqiColor ] = useState( "" );
	const [ defaultStation, setDefaultStation ] = useState( "" );
	const [ guageChart, setGuageChart ] = useState( false );
	const [ lastUpdate, setLastUpdate ] = useState( "" );
	const [ mobileNav, setMobileNav ] = useState( false );
	const [ login, setLogin ] = useState( false );
	const [ log, setLog ] = useState( false );
	const userToken = sessionStorage.getItem( 'userToken' );
	const [ dropdownOpen, setDropdownOpen ] = useState( false );
	const [ area, setArea ] = useState( "all" );

	const handleDropdownOption = ( option ) =>
	{
		console.log( `Selected: ${ option }` );
		setArea( option );
	};
	useEffect( () =>
	{
		if ( userToken !== null )
		{
			setLog( true );
		} else
		{
			setLog( false );
		}
	}, [ userToken, login ] )


	const handleMouseEnter = ( index ) =>
	{
		setAqiStatus( index );
	};

	const handleMouseLeave = () =>
	{
		setAqiStatus( null );
	};

	const handlePollutant = ( p ) =>
	{
		if ( p === "gas" )
		{
			setGasPollutant( true );
			setPmPollutant( false );
			setPollutant( "gas" );
		} else if ( p === "pm" )
		{
			setPmPollutant( true );
			setGasPollutant( false );
			setPollutant( "pm" );
		} 
	};

	const handleMapType = ( p ) =>
	{
		if ( mapSatType === true )
		{
			setMapSatType( false );
			setMapRoadType( true );
		} else if ( mapRoadType === true )
		{
			setMapSatType( true );
			setMapRoadType( false );
		}
	};

	useEffect( () => { }, [ mapRoadType, mapSatType ] );

	return (
		<div className="relative" onClick={ () => setDropdownOpen( false ) }>
			<nav className="bg-primary sticky sl:top-0 sm:top-0 tab:top-0 lt:top-0 z-50 lt:h-[3.8vw] sl:h-[8vw] tab:h-[6rem] sm:h-[4rem] lm:h-[5.6rem] flex items-center">
				<div className="flex flex-wrap items-center justify-between flex-start w-[90%] mx-auto pt-[0.1vw]">
					<div className="flex">
						<span className="flex items-center me-[3vw]">
							<img
								src={ engLogo }
								alt="Logo"
								className="sl:w-[14vw] sl:h-[7vw] lt:w-[10.2vw] lt:h-[4.4vw] sm:w-[7.4rem] sm:h-[4rem] lm:w-[10.4rem] lm:h-[5rem] tab:w-[14rem] tab:h-[7rem]"
							/>
						</span>
						<button
							type="button"
							className=" sm:inline-flex lm:inline-flex mx-auto text-white bg-primary text-[1.2rem] z-[50] items-center w-8 h-8 justify-center rounded-lg sl:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 sm:mt-[0.8rem] lm:mt-[1.3rem] tab:mt-[2.4rem]"
							onClick={ () =>
							{
								setMobileNav( ( prev ) => !prev );
							} }
						>
							<span className="sr-only">Open main menu</span>
							<svg
								className="w-3 h-3 lm:w-8 lm:h-8 sm:h-6 sm:w-6 mx-auto"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 17 14"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M1 1h15M1 7h15M1 13h15"
								/>
							</svg>
						</button>
						<div className="block w-auto flex items-center" id="navbar-default">
							<ul className="font-[600] flex-row space-x-2 rtl:space-x-reverse mt-0 border-0 sm:hidden lm:hidden sl:flex">
								<li>
									<a
										href="#"
										className="anchor tracking-wide p-[0.2vw] ms-[1vw] me-[1vw] block text-white sl:text-[1.6vw] lt:text-[0.9vw] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
									>
										HOME
									</a>
								</li>
								<li>
									<a
										href="#"
										className="anchor tracking-wide p-[0.2vw] me-[1vw] block text-white sl:text-[1.6vw] lt:text-[0.9vw] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
										onClick={ () =>
										{
											setAbout( true );
											setChartDiv( false );
											setGuageChart( false );
										} }
									>
										ABOUT
									</a>
								</li>
								{ log === true && <li>
									<a
										href="#"
										className="anchor tracking-wide p-[0.2vw] me-[1vw] block text-white sl:text-[1.6vw] lt:text-[0.9vw] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
										onClick={ () =>
										{
											sessionStorage.removeItem( 'userToken' );
											setLog(false);
										} }
									>
										Logout
									</a>
								</li> }
								{ log === false && <li>
									<a
										href="#"
										className="anchor tracking-wide p-[0.2vw] me-[1vw] block text-white sl:text-[1.6vw] lt:text-[0.9vw] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
										onClick={ () =>
										{
											setLogin( true );
										} }
									>
										Login
									</a>
								</li> }
							</ul>
						</div>
					</div>
					{ mobileNav && (
						<ul className="z-50 absolute sm:flex flex-col lm:flex sm:top-[3.8rem] lm:top-[4.8rem] tab:top-[6rem] sl:hidden bg-primary hidden text-center font-[600] justify-center items-start p-[1.4rem] w-[100vw] left-0">
							<li>
								<a
									href="#"
									className="anchor tracking-wide p-[0.4rem] ms-[1vw] me-[1vw] block text-white sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
								>
									HOME
								</a>
							</li>
							<li>
								<a
									href="#"
									className="anchor tracking-wide p-[0.4rem] ms-[1vw] me-[1vw] block text-white sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
									onClick={ () =>
									{
										setAbout( true );
										setChartDiv( false );
										setGuageChart( false );
									} }
								>
									ABOUT
								</a>
							</li>
							{ log === true && <li>
								<a
									href="#"
									className="anchor tracking-wide p-[0.4rem] ms-[1vw] me-[1vw] block text-white sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
									onClick={ () =>
									{
										sessionStorage.removeItem( 'userToken' );
										setLog( false );
									} }
								>
									Logout
								</a>
							</li> }
							{ log === false && <li>
								<a
									href="#"
									className="anchor tracking-wide p-[0.4rem] ms-[1vw] me-[1vw] block text-white sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
									onClick={ () =>
									{
										setLogin( true );
									} }
								>
									Login
								</a>
							</li> }
						</ul>
					) }
					<span className="flex items-center">
						<img
							src={ arabicLogo }
							alt="Logo"
							className="sl:w-[14vw] sl:h-[7vw] lt:w-[10.2vw] lt:h-[4.4vw] sm:w-[7.4rem] sm:h-[4rem] lm:w-[10.4rem] lm:h-[5rem] tab:w-[14rem] tab:h-[7rem]"
						/>
					</span>
				</div>
			</nav>

			<Map
				showChart={ ( id ) =>
				{
					setSelectedStation( id );
					setChartDiv( true );
					setAbout( false );
					setGuageChart( false );
				} }
				pollutant={ pollutant }
				road={ mapRoadType }
				sate={ mapSatType }
				default={ ( id ) =>
				{
					setDefaultStation( id );
				} }
				area={ area }
			/>

			<div>
				<div className="absolute w-full sm:top-[4.4rem] lm:top-[6rem] tab:top-[6rem] sl:top-[8.4vw] lt:top-[3.5vw] flex justify-between">
					<div
						className={ `flex sm:flex-col  lm:flex-col sl:flex-row absolute left-[1vw] justify-start sm:w-[14rem] lm:w-[18rem] tab:w-[22rem] sl:w-[60vw] lt:w-[50vw] ${ chartDiv || divBtn || about
							? "sl:left-[75vw] lt:left-[48vw] lm:left-[16rem] sm:left-[6rem] sm:top-[9rem] lm:top-[14rem] lm:left-[26rem] tab:top-[14rem] tab:left-[46rem] sl:top-[12vw] lt:top-[0.1vw] lt:flex-row sl:flex-col sl:w-[24vw] lt:w-[50vw] "
							: ""
							} ${ guageChart
								? "sl:left-[75vw] lt:left-[34vw] sm:left-[16rem] sm:top-[9rem] lm:top-[14rem] lm:left-[24rem] sl:top-[12vw] tab:top-[14rem] tab:left-[46rem] lt:top-[0.1vw] lt:flex-row sl:flex-col sl:w-[24vw] lt:w-[50vw] "
								: ""
							}` }
					>
						<button
							type="button"
							className={ `rounded-[2vw] flex justify-center px-[1vw] items-center sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw] text-center boxs sm:h-[2.2rem] lm:h-[3rem] lt:h-[2.8vw] sl:h-[3vh] ms-[0.8vw] mt-[1vw] ${ gasPollutant
								? "text-white bg-secondary font-[600] "
								: "text-secondary bg-white font-[500] "
								}  ` }
							onClick={ () => handlePollutant( "gas" ) }
						>
							Gaseous Pollutants
						</button>
						<button
							type="button"
							className={ `rounded-[2vw] flex justify-center px-[1vw] items-center sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw] text-center boxs sm:h-[2.2rem] lm:h-[3rem] lt:h-[2.8vw] sl:h-[3vh] ms-[0.8vw] mt-[1vw] ${ pmPollutant
								? "text-white bg-secondary font-[600] "
								: "text-secondary bg-white font-[500] "
								}  ` }
							onClick={ () => handlePollutant( "pm" ) }
						>
							Particulate Matter
						</button>
						<button
							type="button"
							className={ `rounded-[2vw] flex justify-center px-[1vw] items-center sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw] text-center boxs sm:h-[2.2rem] lm:h-[3rem] lt:h-[2.8vw] sl:h-[3vh] ms-[0.8vw] mt-[1vw] text-secondary bg-white font-[500] ` }
							onClick={ () =>
							{
								setMatPollutant( true ); 
								setChartDiv(true);
								setAbout(false);
								setGuageChart(false);
							} }
						>
							Matrological
						</button>
						<div className="relative">
							<button
								type="button"
								className="rounded-[2vw] flex justify-center px-[2vw] items-center sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[1vw] text-center boxs sm:h-[2.2rem] lm:h-[3rem] lt:h-[2.8vw] sl:h-[3vh] ms-[0.8vw] mt-[1vw] w-[98%] sl:w-[10rem] text-primary bg-white font-[500]"
								onClick={(e) => {
									e.stopPropagation(); 
									setDropdownOpen(!dropdownOpen);
								}}
							>
								Area
							</button>
							{dropdownOpen && (
								<ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 sm:left-2 lt:left-[10%] sm:w-[94%] lm:w-[96%] tab:[100%] lt:w-[88%]">
									<li className={`px-4 py-2 cursor-pointer text-primary sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] lt:text-[1vw] font-medium ${area === "rsg" ? "bg-gray-300" : "hover:bg-gray-100"}`} onClick={() => handleDropdownOption("rsg")}>RSG</li>
									<li className={`px-4 py-2 cursor-pointer text-primary sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] lt:text-[1vw] font-medium ${area === "amaala" ? "bg-gray-300" : "hover:bg-gray-100"}`} onClick={() => handleDropdownOption("amaala")}>Amaala</li>
									<li className={`px-4 py-2 cursor-pointer text-primary sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] lt:text-[1vw] font-medium ${area === "all" ? "bg-gray-300" : "hover:bg-gray-100"}`} onClick={() => handleDropdownOption("all")}>All</li>
								</ul>
							)} 
						</div>
						
					</div>
					<div
						className={ `flex sm:flex-col lm:flex-col sl:flex-row absolute sm:right-[8rem] lm:right-[10rem] tab:right-[12rem] sl:right-[12vw] lt:right-[8vw] justify-end` }
					>
					<button
						type="button"
							className={ `pulse rounded-[2vw] flex justify-center px-[2vw] items-center sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw] text-center boxs sm:min-h-[2.2rem] sm:max-h-[4rem] lm:min-h-[3rem] lm:max-h-[4rem] lt:min-h-[2.8vw] lt:max-h-[2.8vw] sl:min-h-[3vh] sl:max-h-[3vh] ms-[0.8vw] mt-[1vw] text-white font-[600]` }
						style={ { background: aqiColor } }
						onClick={ () =>
						{
							setGuageChart( true );
							setAbout( false );
							setChartDiv( false );
						} }
					>
						AQI : { aqiTitle }
						</button>
					</div>
				</div>

				<div
					className="absolute border border-primary sm:h-[6rem] sm:w-[6rem] lm:h-[7rem] lm:w-[7rem] tab:h-[8rem] tab:w-[8rem] sl:h-[9vw] sl:w-[9vw] lt:h-[6vw] lt:w-[6vw] sm:top-[5rem] lm:top-[7rem] tab:top-[7rem] sl:top-[10vw] lt:top-[4.6vw] sm:right-[0.6rem] lm:right-[1rem] right-[1.4vw] rounded-md p-0.5 cursor-pointer"
					onClick={ handleMapType }
				>
					{ mapRoadType && (
						<img
							src={ road }
							className="rounded-md border border-primary-500 sm:h-[5.6rem] sm:w-[6rem] lm:h-[6.6rem] lm:w-[7rem] tab:h-[7.6rem] tab:w-[8rem] sl:h-[8.6vw] sl:w-[9vw] lt:h-[5.7vw] lt:w-[6vw]"
							alt=""
						/>
					) }
					{ mapSatType && (
						<img
							src={ sate }
							className="rounded-md border border-primary-500 sm:h-[5.6rem] sm:w-[6rem] lm:h-[6.6rem] lm:w-[7rem] tab:h-[7.6rem] tab:w-[8rem] sl:h-[8.6vw] sl:w-[9vw] lt:h-[5.7vw] lt:w-[6vw]"
							alt=""
						/>
					) }
				</div>

				{/* AQI Status Guide */ }
				<div className="absolute sm:top-[52%] lm:top-[60%] tab:top-[62%] sl:top-[66%] lt:top-[42%] sm:right-4 lm:right-4 tab:right-2 sl:right-6 lt:right-0 flex flex-col justify-end items-end">

					<div className="sm:w-[20vw] lm:w-[20vw] tab:w-[22vw] sl:w-[8vw] sm:h-[44vh] lm:h-[32rem] tab:h-[36vh] sl:h-[32vh] lt:h-[56vh] lm:right-[3rem] tab:right-[1rem] sl:right-14 lt:right-0 bottom-[14vh] flex flex-col items-end justify-between me-[0.8vw]">
						<div
							type="button"
							className="text-white bg-gradient-to-r from-[#92d050] to-[#559753] flex justify-center items-center sm:h-[2.2rem] sm:w-[10rem] lm:h-[3rem] lm:w-[16rem] sl:h-[4vw] sl:w-[14vw] lt:h-[2.6vw] lt:w-[6.8vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw] rounded-[0.8vw] text-center"
							onMouseEnter={ () => handleMouseEnter( 1 ) }
							onMouseLeave={ () => handleMouseLeave( 0 ) }
						>
							Good
						</div>
						<div
							type="button"
							className="text-white bg-gradient-to-r from-[#ff0] to-[#d6c20d] flex justify-center items-center sm:h-[2.2rem] sm:w-[10rem] lm:h-[3rem] lm:w-[16rem] sl:h-[4vw] sl:w-[14vw] lt:h-[2.6vw] lt:w-[6.8vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw]  rounded-[0.8vw] text-center"
							onMouseEnter={ () => handleMouseEnter( 2 ) }
							onMouseLeave={ () => handleMouseLeave( 0 ) }
						>
							Moderate
						</div>
						<div
							type="button"
							className="text-white bg-gradient-to-r from-[#ffc107] to-[#ff9800] flex justify-center items-center sm:h-[2.2rem] sm:w-[10rem] lm:h-[3rem] lm:w-[16rem] sl:h-[4vw] sl:w-[14vw] lt:h-[2.6vw] lt:w-[6.8vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw] rounded-[0.8vw] text-center"
							onMouseEnter={ () => handleMouseEnter( 3 ) }
							onMouseLeave={ () => handleMouseLeave( 0 ) }
						>
							USG
						</div>
						<div
							type="button"
							className="text-white bg-gradient-to-r from-[#f15913] to-[#cc0c0c] flex justify-center items-center sm:h-[2.2rem] sm:w-[10rem] lm:h-[3rem] lm:w-[16rem] sl:h-[4vw] sl:w-[14vw] lt:h-[2.6vw] lt:w-[6.8vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw] rounded-[0.8vw] text-center"
							onMouseEnter={ () => handleMouseEnter( 4 ) }
							onMouseLeave={ () => handleMouseLeave( 0 ) }
						>
							Unhealty
						</div>
						<div
							type="button"
							className="text-white bg-gradient-to-r from-[#d473e5] to-[#7b0090] flex justify-center items-center sm:h-[2.2rem] sm:w-[10rem] lm:h-[3rem] lm:w-[16rem] sl:h-[4vw] sl:w-[14vw] lt:h-[2.6vw] lt:w-[6.8vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw] rounded-[0.8vw] text-center"
							onMouseEnter={ () => handleMouseEnter( 5 ) }
							onMouseLeave={ () => handleMouseLeave( 0 ) }
						>
							Very Unhealthy
						</div>
						<div
							type="button"
							className="text-white bg-gradient-to-r from-[#b75481] to-[#420320] flex justify-center items-center sm:h-[2.2rem] sm:w-[10rem] lm:h-[3rem] lm:w-[16rem] sl:h-[4vw] sl:w-[14vw] lt:h-[2.6vw] lt:w-[6.8vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw] rounded-[0.8vw] text-center"
							onMouseEnter={ () => handleMouseEnter( 6 ) }
							onMouseLeave={ () => handleMouseLeave( 0 ) }
						>
							Hazardous
						</div>
						<button
							type="button"
							className="text-white bg-[#2196f3] sm:w-[10.2rem] lm:w-[16rem] sl:w-[14vw] lt:w-[6.6vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.7vw] rounded-[1.4vw] px-[1vw] py-[0.8vw] text-center"
							onClick={ () => setDownload( true ) }
						>
							Data Request
						</button>
						<div
							type="button"
							className="text-primary flex justify-center items-center mt-4 bg-[white] font-[600] rounded-[1.6vw] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw] text-center boxm sm:w-[22rem] lm:w-[30rem] tab:w-[34rem] sl:w-[29vw] lt:w-[15vw] sm:h-[2rem] lm:h-[3rem] lt:h-[4vw] sl:h-[3vh]"
						>
							Last Updated: { lastUpdate }
						</div>
					</div>

					<div className="absolute sm:w-[20vw] lm:w-[20vw] sl:w-[8vw] sm:h-[30vh] lm:h-[24rem] sl:h-[30vh] lt:h-[40vh] sm:right-[18rem] lm:right-[22rem] sl:right-[22vw] lt:right-[12.6vw] bottom-[12vh] flex flex-col items-center">
						<div
							type="button"
							className="relative sm:top-[0.6rem] lm:top-[0.2rem] tab:top-[0.2rem] sl:top-[1vh] lt:top-0 inline-block sm:leading-[1.4rem] lm:leading-[1.6rem] tab:leading-[1.8rem] sl:leading-[1.6vw] lt:leading-[1vw] exp-aqi exp-aqi1 text-white bg-gradient-to-r from-[#92d050] to-[#559753] sm:w-[18rem] lm:w-[18rem] tab:w-[20rem] sl:w-[18vw] lt:w-[13vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw]  py-[1.4vw] px-[1.8vw] text-center"
							style={ { display: aqiStatus === 1 ? "block" : "none" } }
						>
							AQI: Good (0 - 50)
							<br />
							Good air quality
						</div>
						<div
							type="button"
							className="relative sm:top-[4.6rem] lm:top-[5rem] tab:top-[5rem] sl:top-[6vh] lt:top-[6vh]  inline-block sm:leading-[1.4rem] lm:leading-[1.6rem] tab:leading-[1.8rem] sl:leading-[1.6vw] lt:leading-[1vw] exp-aqi exp-aqi2 text-white bg-gradient-to-r from-[#ff0] to-[#d6c20d] sm:w-[18rem] lm:w-[18rem] tab:w-[20rem] sl:w-[18vw] lt:w-[13vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw]  py-[1.4vw] px-[1.8vw] text-center"
							style={ { display: aqiStatus === 2 ? "block" : "none" } }
						>
							AQI: Moderate (51 - 100)
							<br />
							Moderate air quality
						</div>
						<div
							type="button"
							className="relative sm:top-[8.2rem] lm:top-[9rem] tab:top-[9rem] sl:top-[12vh] lt:top-[14vh] inline-block sm:leading-[1.4rem] lm:leading-[1.6rem] tab:leading-[1.8rem] sl:leading-[1.6vw] lt:leading-[1vw] exp-aqi exp-aqi3 text-white bg-gradient-to-r from-[#ffc107] to-[#ff9800] sm:w-[18rem] lm:w-[18rem] tab:w-[20rem] sl:w-[18vw] lt:w-[13vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw]  py-[1.4vw] px-[1.8vw] text-center"
							style={ { display: aqiStatus === 3 ? "block" : "none" } }
						>
							AQI: USG (101 - 150)
							<br />
							Unhealthy for Sensitive Groups
						</div>
						<div
							type="button"
							className="relative sm:top-[12.2rem] lm:top-[10rem] tab:top-[13rem] sl:top-[16vh] lt:top-[20.6vh] inline-block sm:leading-[1.4rem] lm:leading-[1.6rem]  tab:leading-[1.8rem] sl:leading-[1.6vw] lt:leading-[1vw] exp-aqi exp-aqi4 text-white bg-gradient-to-r from-[#f15913] to-[#cc0c0c] sm:w-[18rem] lm:w-[18rem] tab:w-[20rem] sl:w-[18vw] lt:w-[13vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw]  py-[1.4vw] px-[1.8vw] text-center"
							style={ { display: aqiStatus === 4 ? "block" : "none" } }
						>
							AQI: Unhealthy (151 - 200)
							<br />
							Health effects are experienced
						</div>
						<div
							type="button"
							className="relative sm:top-[16rem] lm:top-[18rem] tab:top-[18rem] sl:top-[21vh] lt:top-[26.6vh] inline-block sm:leading-[1.4rem] lm:leading-[1.6rem]  tab:leading-[1.8rem] sl:leading-[1.6vw] lt:leading-[1vw] exp-aqi exp-aqi5 text-white bg-gradient-to-r from-[#d473e5] to-[#7b0090] sm:w-[18rem] lm:w-[18rem] tab:w-[20rem] sl:w-[18vw] lt:w-[13vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw]  py-[1.4vw] px-[1.8vw] text-center"
							style={ { display: aqiStatus === 5 ? "block" : "none" } }
						>
							AQI: Very Unhealthy (201 - 300)
							<br />
							Serious health effects are experienced
						</div>
						<div
							type="button"
							className="relative sm:top-[20rem] lm:top-[22rem] tab:top-[22rem] sl:top-[27vh] lt:top-[32.8vh] inline-block sm:leading-[1.4rem] lm:leading-[1.6rem] tab:leading-[1.8rem] sl:leading-[1.6vw] lt:leading-[1vw] exp-aqi exp-aqi6 text-white bg-gradient-to-r from-[#b75481] to-[#420320] sm:w-[18rem] lm:w-[18rem] tab:w-[20rem] sl:w-[18vw] lt:w-[13vw] font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.8vw]  py-[1.4vw] px-[1.8vw] text-center"
							style={ { display: aqiStatus === 6 ? "block" : "none" } }
						>
							AQI: Hazardous (301 - 500)
							<br />
							Hazardous air quality
						</div>
					</div>
				</div>
			</div>

			<Chart
				show={ chartDiv }
				setDiv={ () => setDivBtn( true ) }
				close={ () =>
				{
					setChartDiv( false );
					setDivBtn( false );
				} }
				station={ selectedStation }
				pollutant={ pollutant }
				default={ ( id ) =>
				{
					setDefaultStation( id );
				} }
				mat={ matPollutant === true }
			/>
			<About show={ about } close={ () => setAbout( false ) } />
			<Modals showDownload={ download } hideDownload={ () => setDownload( false ) } />
			<Modals showLogin={ login } hideLogin={ () => setLogin( false ) } />

			<GuageChart
				show={ guageChart }
				legend={ false }
				station={ defaultStation }
				title={ ( titles ) =>
				{
					setAqiTitle( titles );
				} }
				color={ ( color ) =>
				{
					setAqiColor( color );
				} }
				pollutant={ pollutant }
				update={ ( update ) =>
				{
					setLastUpdate( update );
				} }
				close={ () =>
				{
					setGuageChart( false );
				} }
			/>
		</div>
	);
}

export default Index;
