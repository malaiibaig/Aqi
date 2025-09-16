import BarChart from "../Charts/barchart";
import LineChart from "../Charts/linechart";
import React, { createRef, useState } from "react";
import MatChart from "../Charts/matchart";
import WindChart from "../Charts/windChart";
import Download from "../Modals/download";
import Login from "../Modals/login";
import Table from "../Modals/table";
import Reports from "./reports";
import Register from "./register";
import Password from "./password";
import Forgot from "./forgot";

function Modals ( props )
{
	const [ login, setLogin ] = useState( false );
	const [ register, setRegister ] = useState( false );
	const [ table, setTable ] = useState( false );
	const [ reports, setReports ] = useState( false );
	const [ download, setDownload ] = useState( false );
	const [ data, setData ] = useState( "" );
	const [ station, setStation ] = useState( [] );
	const [ frommonth, setFromMonth ] = useState( "" );
	const [ tomonth, setToMonth ] = useState( "" );
	const [ param, setParam ] = useState( [] );
	const [ down, setDown ] = useState( false );
	const [ rep, setRep ] = useState( false );
	const [ showModal, setShowModal ] = useState( false );
	const [ showPassword, setShowPassword ] = useState( false );
	const [ userId, setUserId ] = useState( "" );
	const [ showForgot, setShowForgot ] = useState( false );
	const [ error, setError ] = useState( false );
	const [ errorMsg, setErrorMsg ] = useState( "" );
	const [ email, setEmail ] = useState( "" );
	const [ otp, setOtp ] = useState( "" );
	const downloadRef = createRef();
	const loginRef = createRef();
	const registerRef = createRef();
	const forgetRef = createRef();
	const passwordRef = createRef();

	const formatDate = ( dateString ) =>
	{
		const [ month, year ] = dateString.split( '-' );
		const date = new Date( parseInt( year ), parseInt( month ) - 1 );
		const formattedDate = date.toLocaleDateString( 'en-US', { month: 'short', year: 'numeric' } );
		return formattedDate;
	};

	return (
		<div>
			{/* Line Chart Modal */ }
			<div
				id="lineChart-modal"
				tabIndex="-1"
				aria-hidden="true"
				className={ `overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 z-[99] justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full ${ props.showLine ? " visible" : "hidden"
					}` }
			>
				<div className="relative p-4 w-full mx-auto custom-width mt-[3vw]">
					<div className="relative bg-white rounded-md shadow custom-height">
						<div className="flex items-center justify-between p-3 border-b rounded-t ">
							<h3 className="sm:text-[1.6rem] lm:text-[1.8rem] sl:text-[1.8vw] lt:text-[2vw] font-semibold text-secondary">
								Pollutant Concentration
							</h3>
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
								onClick={ props.hideLine }
							>
								<svg
									className="w-5 h-5"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<LineChart
							legend={ true }
							checkedItems={ props.checkedItems }
							gasesStation={ props.gasesStation }
							gasesStation2={ props.gasesStation2 }
							station1={ props.station1 }
							station2={ props.station2 }
							gasStats={ props.gasStats }
							pollutant={ props.pollutant }
						/>
					</div>
				</div>
			</div>

			{/* Bar Chart Modal */ }
			<div
				id="barChart-modal"
				tabIndex="-1"
				aria-hidden="true"
				className={ `overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 z-[99] justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full ${ props.showBar ? " visible" : "hidden"
					}` }
			>
				<div className="relative p-4 w-full mx-auto custom-width mt-[3vw]">
					<div className="relative bg-white rounded-md shadow custom-height">
						<div className="flex items-center justify-between p-3 border-b rounded-t ">
							<h3 className="sm:text-[1.6rem] lm:text-[1.8rem] sl:text-[1.8vw] lt:text-[2vw] font-semibold text-secondary">
								Air Quality Index
							</h3>
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
								onClick={ props.hideBar }
							>
								<svg
									className="w-5 h-5"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<BarChart
							legend={ false }
							station={ props.station }
							station2={ props.station2 }
							stationName1={ props.stationName1 }
							stationName2={ props.stationName2 }
							stats={ props.stats }
							pollutant={ props.pollutant }
						/>
					</div>
				</div>
			</div>

			{/* Mat Chart Modal */ }
			<div
				id="matChart-modal"
				tabIndex="-1"
				aria-hidden="true"
				className={ `overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 z-[99] justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-[full] ${ props.showMat ? " visible" : "hidden"
					}` }
			>
				<div className="relative p-4 w-full mx-auto custom-width mt-[3vw]">
					<div className="relative bg-white rounded-md shadow custom-height">
						<div className="flex items-center justify-between p-3 border-b rounded-t ">
							<h3 className="sm:text-[1.6rem] lm:text-[1.8rem] sl:text-[1.8vw] lt:text-[2vw] font-semibold text-secondary">
								Meteorological Data
							</h3>
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
								onClick={ props.hideMat }
							>
								<svg
									className="w-5 h-5"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<MatChart
							legend={ false }
							checkedItems={ props.checkedItems }
							matStation={ props.matStation }
							matStation2={ props.matStation2 }
							stationName1={ props.stationName1 }
							stationName2={ props.stationName2 }
							matStats={ props.matStats }
							pollutant={ props.pollutant }
							units={ props.units }
						/>
					</div>
				</div>
			</div>

			{/* Wind Chart Modal */ }
			<div
				id="windChart-modal"
				tabIndex="-1"
				aria-hidden="true"
				className={ `overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 z-[99] justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-[full] ${ props.showWind ? " visible" : "hidden"
					}` }
			>
				<div className="relative p-4 w-full mx-auto custom-width mt-[3vw]">
					<div className="relative bg-white rounded-md shadow custom-height">
						<div className="flex items-center justify-between p-3 border-b rounded-t ">
							<h3 className="sm:text-[1.6rem] lm:text-[1.8rem] sl:text-[1.8vw] lt:text-[2vw] font-semibold text-secondary">
								Wind Speed / Wind Direction
							</h3>
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
								onClick={ props.hideWind }
							>
								<svg
									className="w-5 h-5"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<WindChart
							legend={ false }
							checkedItems={ props.checkedItems }
							station={ props.station }
							station2={ props.station2 }
							stationName1={ props.stationName1 }
							stationName2={ props.stationName2 }
							stats={ props.stats }
						/>
					</div>
				</div>
			</div>

			{/* Download Modal */ }
			<div
				id="downloadChart-modal"
				tabIndex="-1"
				aria-hidden="true"
				className={ `overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 z-[99] justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full ${ props.showDownload || download ? " visible" : "hidden"
					}` }
			>
				<div className="relative p-4 w-full mx-auto custom-width2 mt-[5vw]">
					<div className="relative bg-white rounded-md shadow custom-height2">
						<div className="flex items-center justify-center p-3 border-b rounded-t ">
							<h3 className="sm:text-[2rem] lm:text-[2.8rem] sl:text-[3rem] lt:text-[2vw] mx-auto font-semibold text-secondary">
								Download
							</h3>
							<button
								type="button"
								className="absolute sm:top-[0.6rem] sm:right-[0.6rem] lt:top-[1vw] lt:right-[0.4vw] text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
								onClick={ () =>
								{
									if ( downloadRef.current )
									{
										downloadRef.current.reset();
									}
									if ( props.hideDownload )
									{
										props.hideDownload();
									} else
									{
										setDownload( false );
									}
								} }
							>
								<svg
									className="w-5 h-5"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<Download
							ref={ downloadRef }
							showLogin={ ( e ) =>
							{
								if ( e === "download" )
								{
									setLogin( true );
									setDown( true );
									setRep( false );
								} else if ( e === "report" )
								{
									setLogin( true );
									setDown( false );
									setRep( true );
								}
							} }
							reportHide={ error }
							showReport={ ( e ) =>
							{
								setReports( e );
							} }
							station={ ( s ) =>
							{
								setStation( s );
							} }
							frommonth={ ( m ) =>
							{
								setFromMonth( m );
							} }
							error={ error }
							errorMsg={ errorMsg }
							tomonth={ ( n ) =>
							{
								setToMonth( n );
							} }
							param={ ( p ) =>
							{
								setParam( p );
							} }
							showTable={ ( result, f, t, s, p ) =>
							{
								setTable( true );
								setData( result );
								setStation( s );
								setFromMonth( f );
								setToMonth( t );
								setParam( p );
							} }
							hideDownload={ () =>
							{
								setDownload( false );
								props.hideDownload();
							} }
							isVisible={ download || props.showDownload }
						/>
					</div>
				</div>
			</div>

			{/* Login Modal */ }
			<div
				id="login-modal"
				tabIndex="-1"
				aria-hidden="true"
				className={ `z-[999] overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full ${ props.showLogin || login ? " visible" : "hidden"
					}` }
			>
				<div className="relative p-4 w-full mx-auto custom-width3 mt-[5vw]">
					<div className="relative bg-white rounded-md shadow custom-height3">
						<div className="flex items-center justify-center p-3 border-b rounded-t ">
							<h3 className="sm:text-[2rem] lm:text-[2.8rem] sl:text-[3rem] lt:text-[2vw] mx-auto font-semibold text-secondary">
								Login
							</h3>
							<button
								type="button"
								className="absolute sm:top-[0.6rem] sm:right-[0.6rem] lt:top-[1vw] lt:right-[0.4vw] text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
								onClick={ () =>
								{
									if ( loginRef.current )
									{
										loginRef.current.reset();
									}
									if ( props.hideLogin )
									{
										props.hideLogin();
									} else
									{
										setLogin( false );
									}
								} }
							>
								<svg
									className="w-5 h-5"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<Login
							ref={ loginRef }
							hide={ () =>
							{
								setLogin( false );
								if ( props.hideLogin )
								{
									props.hideLogin();
								}
							} }
							setId={ ( id ) =>
							{
								setUserId( id );
							} }
							error={ () =>
							{
								setError( true );
								setErrorMsg( "You don't have permission to download data." );
							} }
							error2={ () =>
							{
								setError( true );
								setErrorMsg( "You don't have permission to view reports." );
							} }
							reportHide={ error }
							shide={ () =>
							{
								setLogin( false );
								setDownload( false );
							} }
							signUp={ () =>
							{
								setRegister( true );
								setLogin( false );
							} }
							forgot={ () =>
							{
								setShowForgot( true );
							} }
							password={ () =>
							{
								setShowPassword( true );
							} }
							station={ station }
							frommonth={ frommonth }
							tomonth={ tomonth }
							param={ param }
							rep={ rep }
							down={ down }
							setReport={ ( e ) =>
							{
								setReports( e );
							} }
							isVisible={ login || props.showLogin }
						/>
					</div>
				</div>
			</div>

			{/* Register Modal */ }
			<div
				id="register-modal"
				tabIndex="-1"
				aria-hidden="true"
				className={ `z-[999] overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full ${ register ? " visible" : "hidden"
					}` }
			>
				<div className="relative p-4 w-full mx-auto custom-width3 mt-[5vw]">
					<div className="relative bg-white rounded-md shadow custom-height3">
						<div className="flex items-center justify-center p-3 border-b rounded-t ">
							<h3 className="sm:text-[2rem] lm:text-[2.8rem] sl:text-[3rem] lt:text-[2vw] mx-auto font-semibold text-secondary">
								Sign Up
							</h3>
							<button
								type="button"
								className="absolute sm:top-[0.6rem] sm:right-[0.6rem] lt:top-[1vw] lt:right-[0.4vw] text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
								onClick={ () =>
								{
									if ( registerRef.current )
									{
										registerRef.current.reset();
									}
									setRegister( false );
								} }
							>
								<svg
									className="w-5 h-5"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<Register
							ref={ registerRef }
							hide={ () =>
							{
								setRegister( false );
								setShowModal( true );
							} }
							isVisible={ register } />
					</div>
				</div>
			</div>

			{/* Table Modal */ }
			<div
				id="downloadChart-modal"
				tabIndex="-1"
				aria-hidden="true"
				className={ `overflow-y-hidden overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 z-[99] justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full ${ props.showTable || table ? " visible" : "hidden"
					}` }
			>
				<div className="relative p-4 w-full mx-auto custom-width4 mt-[4vw]">
					<div className="relative bg-white rounded-md shadow custom-height4">
						<div className="p-0 border-b rounded-t sticky top-0 bg-white">
							<div className="flex justify-center items-end mx-auto">
								<h3 className="flex sm:text-[2rem] lm:text-[2.8rem] sl:text-[3rem] lt:text-[1.8vw] font-semibold text-secondary">
									Data { formatDate( frommonth ) } to { formatDate( tomonth ) }
								</h3>
								&nbsp;&nbsp;
								<span
									onClick={ () =>
									{
										setDown( true );
										setLogin( true );
									} }
									className="cursor-pointer"
								>
									<svg
										fill="green"
										className="bi bi-trash3 sm:w-[3rem] sm:h-[3rem] lm:w-[3.4rem] lm:h-[3.4rem] tab:w-[3.8rem] tab:h-[3.8rem] sl:w-[4.2vw] sl:h-[4.2vw] lt:w-[2.8vw] lt:h-[2.8vw]"
										version="1.1"
										id="Layer_1"
										viewBox="0 0 100 100"
										enableBackground="new 0 0 100 100"
									>
										<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
										<g
											id="SVGRepo_tracerCarrier"
											strokeLinecap="round"
											strokeLinejoin="round"
										></g>
										<g id="SVGRepo_iconCarrier">
											{ " " }
											<g>
												{ " " }
												<path d="M58.741,55.019L52.5,61.01V39.881c0-1.104-0.896-2-2-2s-2,0.896-2,2v21.908l-6.52-6.771c-0.78-0.781-1.922-0.781-2.703,0 s-0.719,2.047,0.062,2.828l9.825,9.795c0.375,0.375,0.899,0.586,1.43,0.586s1.047-0.211,1.422-0.586l0.147-0.143 c0.173-0.126,0.326-0.277,0.451-0.451l9.203-9.201c0.781-0.781,0.656-2.047-0.125-2.828C60.914,54.237,59.521,54.237,58.741,55.019 z"></path>{ " " }
												<path d="M76.791,37.795c-1.252,0-2.365,0.347-3.347,0.652c-0.246,0.076-0.487,0.151-0.722,0.217 c-4.002-9.179-13.133-15.237-23.221-15.237c-12.673,0-23.236,9.248-25.049,21.467c-1.082-0.213-2.162-0.32-3.228-0.32 c-9.694,0-17.287,7.136-17.287,16.488c0,9.324,7.593,16.438,17.287,16.438h55.566c11.562,0,20.621-8.554,20.621-19.716 C97.412,46.469,88.354,37.795,76.791,37.795z M76.791,73.5H21.225c-7.575,0-13.287-5.239-13.287-12.438 c0-7.229,5.712-12.583,13.287-12.583c1.289,0,2.616,0.257,3.886,0.651l0.443,0.177c0.593,0.204,1.251,0.13,1.772-0.22 c0.521-0.353,0.847-0.923,0.879-1.552c0.569-11.278,9.924-20.11,21.296-20.11c8.961,0,17.025,5.68,20.068,14.133 c0.285,0.793,1.113,1.323,1.957,1.323c1.131,0,2.18-0.326,3.105-0.614c0.779-0.243,1.514-0.471,2.158-0.471 c9.32,0,16.621,6.917,16.621,15.989C93.412,66.703,86.111,73.5,76.791,73.5z"></path>{ " " }
											</g>{ " " }
										</g>
									</svg>
								</span>
							</div>
							<button
								type="button"
								className="absolute top-[1vw] right-[0.4vw] text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
								onClick={ () =>
								{
									if ( props.hideTable )
									{
										props.hideTable();
									} else
									{
										setTable( false );
									}
								} }
							>
								<svg
									className="w-5 h-5"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<div className="sl:max-h-[70vh] sm:max-h-full overflow-x-auto overflow-y-auto">
							<Table
								result={ data }
								station={ station }
								frommonth={ frommonth }
								tomonth={ tomonth }
								param={ param }
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Report Modal */ }
			<div
				id="report-modal"
				tabIndex="-1"
				aria-hidden="true"
				className={ `overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 z-[99] justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full ${ reports ? " visible" : "hidden"
					}` }
			>
				<div className="relative p-4 w-full mx-auto custom-width4 mt-[4vw]">
					<div className="relative bg-white rounded-md shadow custom-height4">
						<div className="flex items-center justify-center p-3 border-b rounded-t sticky top-0 bg-white">
							<h3 className="sm:text-[2rem] lm:text-[2.8rem] sl:text-[3rem] lt:text-[2vw] mx-auto font-semibold text-secondary">
								Reports
							</h3>
							<button
								type="button"
								className="absolute top-[1vw] right-[0.4vw] text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
								onClick={ () =>
								{
									setReports( false );
								} }
							>
								<svg
									className="w-5 h-5"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>

						<Reports
							error3={ () =>
							{
								setError( true );
							} } />
					</div>
				</div>
			</div>

			{/* Response Modal */ }
			<div
				id="response-modal"
				tabIndex="-1"
				aria-hidden="true"
				className={ `z-[999] overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full ${ showModal ? " visible" : "hidden"
					}` }
			>
				<div className="relative p-4 w-full mx-auto custom-width3 mt-[12vw]">
					<div className="relative bg-white rounded-md shadow custom-height8 flex flex-col items-center justify-center">
						<h1 className="text-3xl w-[80%] mx-auto text-center">Thank you for signing up, we will review and respond to your given email address</h1>
						<br />
						<button
							type="button"
							className="bg-secondary mx-auto sm:text-[1.4rem] sm:my-[0.8rem] lm:text-[1.8rem] sl:text-[2rem] lt:text-[1.4vw] w-[80%] p-[0.4vw] text-white rounded"
							onClick={ () => setShowModal( false ) }
						>
							OK
						</button>
					</div>
				</div>
			</div>

			{/* Change Password Modal */ }
			<div
				id="password-modal"
				tabIndex="-1"
				aria-hidden="true"
				className={ `z-[999] overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full ${ showPassword ? " visible" : "hidden"
					}` }
			>
				<div className="relative p-4 w-full mx-auto custom-width3 mt-[5vw]">
					<div className="relative bg-white rounded-md shadow custom-height3">
						<div className="flex items-center justify-center p-3 border-b rounded-t ">
							<h3 className="sm:text-[2rem] lm:text-[2.8rem] sl:text-[3rem] lt:text-[2vw] mx-auto font-semibold text-secondary">
								Change Password
							</h3>
							<button
								type="button"
								className="absolute sm:top-[0.6rem] sm:right-[0.6rem] lt:top-[1vw] lt:right-[0.4vw] text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
								onClick={ () =>
								{
									setShowPassword( false );
									if ( passwordRef.current )
									{
										passwordRef.current.reset();
									}
								} }
							>
								<svg
									className="w-5 h-5"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<Password
							ref={ passwordRef }
							userId={ userId }
							email={ email }
							otp={ otp }
							hide={ () =>
							{
								setShowPassword( false );
							} }
							isVisible={ showPassword } />
					</div>
				</div>
			</div>

			{/* Forgot Password Modal */ }
			<div
				id="forget-modal"
				tabIndex="-1"
				aria-hidden="true"
				className={ `z-[999] overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full ${ showForgot ? " visible" : "hidden"
					}` }
			>
				<div className="relative p-4 w-full mx-auto custom-width3 mt-[5vw]">
					<div className="relative bg-white rounded-md shadow custom-height13">
						<div className="flex items-center justify-center p-3 border-b rounded-t ">
							<h3 className="sm:text-[2rem] lm:text-[2.8rem] sl:text-[3rem] lt:text-[2vw] mx-auto font-semibold text-secondary">
								Change Password
							</h3>
							<button
								type="button"
								className="absolute sm:top-[0.6rem] sm:right-[0.6rem] lt:top-[1vw] lt:right-[0.4vw] text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
								onClick={ () =>
								{
									if ( forgetRef.current )
									{
										forgetRef.current.reset();
									}
									setShowForgot( false );
								} }
							>
								<svg
									className="w-5 h-5"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<Forgot
							ref={ forgetRef }
							setId={ ( id ) =>
							{
								setUserId( id );
							} }
							password={ () =>
							{
								setShowPassword( true );
							} }
							email={ ( email ) =>
							{
								setEmail( email );
							} }
							otp={ ( otp ) =>
							{
								setOtp( otp );
							} }
							hide={ () =>
							{
								setShowForgot( false );
							} }
							isVisible={ showForgot }
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Modals;
