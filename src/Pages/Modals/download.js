import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api_url, username, password } from "../../Variables";
import { format } from "date-fns";

function Download ( props )
{
	const [ frommonth, setFromMonth ] = useState( "" );
	const [ frommonthSelected, setFromMonthSelected ] = useState( "" );
	const [ tomonth, setToMonth ] = useState( "" );
	const [ tomonthSelected, setToMonthSelected ] = useState( "" );
	const [ stations, setStations ] = useState( "" );
	const [ selectedStation, setSelectedStation ] = useState( [] );
	const [ selectedStationList, setSelectedStationList ] = useState( [] );
	const [ parameters, setParameters ] = useState( "" );
	const [ selectedParameters, setSelectedParameters ] = useState( [] );
	const [ selectedParametersList, setSelectedParametersList ] = useState( [] );
	const [ isloading, setIsloading ] = useState( false );
	const [ isloading2, setIsloading2 ] = useState( false );
	const [ isloading3, setIsloading3 ] = useState( false );
	const [ error, setError ] = useState( false );
	const [ errorMsg, setErrorMsg ] = useState( "" );
	const userToken = sessionStorage.getItem( 'userToken' );

	const reset = () =>
	{
		setSelectedStation( [] );
		setSelectedParameters( [] );
		setFromMonth( '' );
		setFromMonthSelected( '' );
		setToMonth( '' );
		setToMonthSelected( '' );
		setError( false );
		setErrorMsg( "" );
	};

	useEffect( () =>
	{
		if ( !props.isVisible )
		{
			reset();
		}
	}, [ props.isVisible ] );

	useEffect( () =>
	{
		setError( props.error );
		setErrorMsg( props.errorMsg );
	}, [ props.error, props.errorMsg  ] )

	useEffect( () =>
	{
		StationList();
	}, [] );

	useEffect( () =>
	{
		Parameters();
	}, [ selectedStation, selectedStationList ] );

	const Downloads = () =>
	{
		setIsloading( true );
		const myHeaders = new Headers();
		myHeaders.append( "Authorization", `Bearer ${ userToken }` );

		const formdata = new FormData();
		formdata.append( "from", frommonth );
		formdata.append( "to", tomonth );
		selectedStation.forEach( ( station ) =>
		{
			formdata.append( "station[]", station );
		} );
		selectedParameters.forEach( ( parameter ) =>
		{
			formdata.append( "parameter[]", parameter );
		} );

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: formdata,
			redirect: "follow",
		};

		fetch( api_url + "download", requestOptions )
			.then( ( response ) => response.json() )
			.then( ( result ) =>
			{
				if ( result.status === 1 && result.message )
				{
					fetch( result.message, {
						method: "GET",
						mode: "no-cors",
						headers: {
							Authorization: `Bearer ${ userToken }`,
						},
					} )
						.then( ( response ) => response.blob() )
						.then( ( blob ) =>
						{
							const url = window.URL.createObjectURL( blob );
							const link = document.createElement( "a" );
							link.href = result.message;
							link.download = result.message;
							document.body.appendChild( link );
							link.click();
							document.body.removeChild( link );
							window.URL.revokeObjectURL( url );
							setError( false );
							setErrorMsg( "" );
						} )
						.catch( ( error ) =>
						{
							console.error( "Error downloading the file:", error );
							setError( false );
							setErrorMsg( "Error in downloading the file, Please try again later." );
						}
						);
					setIsloading( false );
				} else
				{
					setError( true );
					setErrorMsg( "You don't have permission to download data." );
					setIsloading( false );
				}
			} )
			.catch( ( error ) =>
			{
				console.error( error );
				setIsloading( false );
			} );
	};

	const View = () =>
	{
		setIsloading2( true );
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append( "from", frommonth );
		formdata.append( "to", tomonth );
		selectedStation.forEach( ( station, index ) =>
		{
			formdata.append( "station[]", station );
		} );
		selectedParameters.forEach( ( parameter, index ) =>
		{
			formdata.append( "parameter[]", parameter );
		} );

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: formdata,
			redirect: "follow",
			headers: {
				"Authorization": "Basic " + btoa( `${ username }:${ password }` ),
			},
		};

		fetch( api_url + "data_view", requestOptions )
			.then( ( response ) => response.json() )
			.then( ( result ) =>
			{
				if ( result.status === 1 )
				{
					props.showTable( result, frommonth, tomonth, selectedStationList, selectedParametersList );
					setError( false );
					setErrorMsg( "" );
				} else
				{
					setError( true );
					setErrorMsg( "Something is wrong, Please try again later." );
				}
				setIsloading2( false );
			} )
			.catch( ( error ) =>
			{
				console.log( "View Data Error", error );
				setIsloading2( false );
			} );
	};

	const Reports = () =>
	{
		setIsloading3( true );
		if ( userToken === null )
		{
			props.showLogin( "report" );
			props.station( selectedStationList );
			props.frommonth( frommonth );
			props.tomonth( tomonth );
			props.param( selectedParametersList );
			setIsloading3( false );
		} else
		{
			setTimeout( () =>
			{
				if ( props.reportHide )
				{
					props.showReport( false );
					setError( true );
					setErrorMsg( "You don't have permission to view reports." );
					setIsloading3( false );
				} else
				{
					props.showReport( true );
					setIsloading3( false );
				}
			}, 1000 );
		}
	};

	const StationList = () =>
	{
		const myHeaders = new Headers();
		const requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
			headers: {
				"Authorization": "Basic " + btoa( `${ username }:${ password }` ),
			},
		};

		fetch( api_url + "stations_list", requestOptions )
			.then( ( response ) => response.json() )
			.then( ( result ) =>
			{
				setStations( result );
			} )
			.catch( ( error ) => console.error( error ) );
	};

	const Parameters = () =>
	{
		const requestOptions = {
			method: "GET",
			redirect: "follow",
			headers: {
				"Authorization": "Basic " + btoa( `${ username }:${ password }` ),
			},
		};

		const lastSelectedStation = selectedStation[ selectedStation.length - 1 ];

		fetch( api_url + `station-params?station=${ lastSelectedStation }`, requestOptions )
			.then( ( response ) => response.json() )
			.then( ( result ) =>
			{
				setParameters( result );
			} )
			.catch( ( error ) => console.error( error ) );
	};

	const handleFromMonthChange = ( date ) =>
	{
		if ( date )
		{
			const formattedDate1 = format( date, "yyyy-MM" );
			const formattedDate2 = format( date, "MM-yyyy" );
			setFromMonth( formattedDate2 );
			setFromMonthSelected( formattedDate1 );
		}
	};

	const handleToMonthChange = ( date ) =>
	{
		if ( date )
		{
			const formattedDate1 = format( date, "yyyy-MM" );
			const formattedDate2 = format( date, "MM-yyyy" );
			setToMonth( formattedDate2 );
			setToMonthSelected( formattedDate1 );
		}
	};

	const handleParaChange = ( selectedOptions ) =>
	{
		if ( selectedOptions.some( option => option.value === 'select_all' ) )
		{
			const allOptions = Array.isArray( parameters ) ? parameters.map( param => param.toLowerCase() ) : [];
			setSelectedParameters( allOptions );
			setSelectedParametersList( allOptions );
		} else
		{
			const selectedItems = selectedOptions.map( option =>
			{
				if ( typeof option.value === 'string' )
				{
					return option.value.toLowerCase();
				}
			} );
			setSelectedParameters( selectedItems );
			setSelectedParametersList( selectedItems );
		}
	};

	const handleStationChange = ( selectedOptions ) =>
	{
		if ( selectedOptions.some( option => option.value === 'select_all' ) )
		{
			const allOptions = Array.isArray( stations ) ? stations.map( station => station.id ) : [];
			setSelectedStation( allOptions );
			setSelectedStationList( allOptions );
		} else
		{
			const selectedItems = selectedOptions.map( option => option.value );
			setSelectedStation( selectedItems );
			setSelectedStationList( selectedItems );
		}
	};

	const selectParameters = [
		...( Array.isArray( parameters ) ? parameters.map( param => ( { value: param.toLowerCase(), label: param.toUpperCase() } ) ) : [] ),
		...( Array.isArray( parameters )
			? parameters
				.map( param => param.toLowerCase() )
				.filter( param => !selectedParameters.includes( param ) )
				.map( param => ( { value: param, label: param } ) )
			: [] )
	];

	const allSelected = Array.isArray( parameters ) && parameters.every( param => selectedParameters.includes( param.toLowerCase() ) );
	if ( !allSelected )
	{
		selectParameters.unshift( { value: 'select_all', label: 'Select All' } );
	}

	const selectStations = [
		...( Array.isArray( stations ) ? stations.map( station => ( { value: station.id, label: station.station_name } ) ) : [] ),
		...( Array.isArray( stations )
			? stations
				.map( station => station.id )
				.filter( stationId => !selectedStation.includes( stationId ) )
				.map( stationId =>
				{
					const station = stations.find( st => st.id === stationId );
					return { value: stationId, label: station.station_name };
				} )
			: [] )
	];

	const allSelected2 = Array.isArray( stations ) && stations.every( station => selectedStation.includes( station.id ) );
	if ( !allSelected2 )
	{
		selectStations.unshift( { value: 'select_all', label: 'Select All' } );
	}

	return (
		<div className="flex justify-center flex-col px-[2vw] py-[2vw]">
			<form
				onSubmit={ ( e ) =>
				{
					e.preventDefault();
					if ( userToken === null )
					{
						props.showLogin( "download" );
						props.station( selectedStationList );
						props.frommonth( frommonth );
						props.tomonth( tomonth );
						props.param( selectedParametersList );
					} else
					{
						Downloads();
					}
				} }
			>
				{ " " }
				<Select
					isMulti
					options={ selectStations }
					placeholder={ "Select Stations" }
					className="lt:text-[1.2vw] lm:text-[1.6rem] sm:text-[1.4rem] sl:text-[1.6rem]"
					onChange={ handleStationChange }
					closeMenuOnSelect={ true }
					value={ selectedStation.map( value => ( { value, label: selectStations.find( station => station.value === value ).label } ) ) }
					required
				/>
				<br />
				<Select
					isMulti
					options={ selectParameters }
					className="basic-multi-select sl:text-[1.6rem] lt:text-[1.2vw] lm:text-[1.6rem] sm:text-[1.4rem]"
					classNamePrefix="select"
					placeholder={ "Select Parameters" }
					onChange={ handleParaChange }
					closeMenuOnSelect={ true }
					value={ selectedParameters.map( ( value ) => ( {
						value,
						label: value,
					} ) ) }
					required
				/>
				<br />
				<div className="flex items-center justify-between">
					<div className="w-[49%]">
						<DatePicker
							showIcon
							selected={ frommonthSelected }
							className="sl:text-[1.6rem] lt:text-[1.2vw] lm:text-[1.6rem] sm:text-[1.4rem]"
							onChange={ handleFromMonthChange }
							dateFormat="MMMM yyyy"
							showMonthYearPicker
							placeholderText="From"
							required
						/>
					</div>
					<div className="w-[49%]">
						<DatePicker
							showIcon
							selected={ tomonthSelected }
							className="sl:text-[1.6rem] lt:text-[1.2vw] lm:text-[1.6rem] sm:text-[1.4rem]"
							onChange={ handleToMonthChange }
							dateFormat="MMMM yyyy"
							showMonthYearPicker
							placeholderText="To"
							required
						/>
					</div>
				</div>
				<br />
				{ error && (
					<p className="text-[1.4vw] sm:text-base lm:text-base tab:text-base sl:text-lg text-[red]">
						{ errorMsg }
					</p>
				) }
				<br />
				<div className="flex">
					<button
						type="button"
						disabled={ isloading2 }
						onClick={ () =>
						{
							if ( frommonth == "" || tomonth == "" || stations == "" || parameters == "" )
							{
								setError( true );
								setErrorMsg( "Please fill out all required fields." );
							} else
							{
								View();
								setError( false );
								setErrorMsg( "" );
							}
						} }
						className="bg-secondary border-2 sm:my-[0.6rem] lt:mt-2 border-secondary mx-auto sm:text-[1.6rem] lm:text-[1.8rem] sl:text-[2rem] lt:text-[1.4vw] p-[0.4vw] sm:p-[0.2vw] lt:h-[3vw] w-[32%] text-white rounded"
					>
						{ isloading2 ? (
							<div role="status">
								<svg
									aria-hidden="true"
									className="w-8 h-8 text-gray-200 animate-spin fill-gray-600 lt:h-[2vw] lt:w-[2vw] sl:h-[3vw] sl:w-[3vw] sm:h-[2rem] sm:w-[2rem] mx-auto"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/>
								</svg>
							</div>
						) : (
							<div className="flex justify-center items-center sm:text-lg lm:text-2xl tab:text-2xl sl:text-2xl">
								<svg
									fill="white"
									className="bi bi-trash3 sm:w-[2rem] sm:h-[2rem] lm:w-[3.4rem] lm:h-[3.4rem] tab:w-[3.8rem] tab:h-[3.8rem] sl:w-[4.2vw] sl:h-[4.2vw] lt:w-[2vw] lt:h-[2vw]"
									version="1.1"
									id="Capa_1"
									viewBox="0 0 80.794 80.794"
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
											<g>
												{ " " }
												<path d="M79.351,38.549c-0.706-0.903-17.529-22.119-38.953-22.119c-21.426,0-38.249,21.216-38.955,22.119L0,40.396l1.443,1.847 c0.706,0.903,17.529,22.12,38.955,22.12c21.424,0,38.247-21.217,38.953-22.12l1.443-1.847L79.351,38.549z M40.398,58.364 c-15.068,0-28.22-13.046-32.643-17.967c4.425-4.922,17.576-17.966,32.643-17.966c15.066,0,28.218,13.045,32.642,17.966 C68.614,45.319,55.463,58.364,40.398,58.364z"></path>{ " " }
												<path d="M40.397,23.983c-9.052,0-16.416,7.363-16.416,16.414c0,9.053,7.364,16.417,16.416,16.417s16.416-7.364,16.416-16.417 C56.813,31.346,49.449,23.983,40.397,23.983z M40.397,50.813c-5.744,0-10.416-4.673-10.416-10.417 c0-5.742,4.672-10.414,10.416-10.414c5.743,0,10.416,4.672,10.416,10.414C50.813,46.14,46.14,50.813,40.397,50.813z"></path>{ " " }
											</g>{ " " }
										</g>{ " " }
									</g>
								</svg>
								&nbsp; View
							</div>
						) }
					</button>

					<button
						type="submit"
						disabled={ isloading }
						className="bg-secondary border-2 sm:my-[0.6rem] lt:mt-2 border-secondary mx-auto sm:text-[1.6rem] lm:text-[1.8rem] sl:text-[2rem] lt:text-[1.4vw] sm:p-[0.2vw] p-[0.4vw] lt:h-[3vw] w-[32%] text-white rounded"
					>
						{ isloading ? (
							<div role="status">
								<svg
									aria-hidden="true"
									className="w-8 h-8 text-gray-200 animate-spin fill-gray-600 lt:h-[2vw] lt:w-[2vw] sl:h-[3vw] sl:w-[3vw] sm:h-[2rem] sm:w-[2rem] mx-auto"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/>
								</svg>
							</div>
						) : (
							<div className="flex justify-center items-center sm:text-base lm:text-2xl tab:text-2xl sl:text-2xl">
								<svg
									fill="white"
									className="bi bi-trash3 sm:w-[2rem] sm:h-[2rem] lm:w-[3.4rem] lm:h-[3.4rem] tab:w-[3.8rem] tab:h-[3.8rem] sl:w-[4.2vw] sl:h-[4.2vw] lt:w-[2.2vw] lt:h-[2.2vw]"
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
								&nbsp; Download
							</div>
						) }
					</button>

					<button
						type="button"
						disabled={ isloading3 }
						onClick={ () =>
						{
							Reports();
						} }
						className="bg-secondary border-2 sm:my-[0.6rem] lt:mt-2 border-secondary mx-auto sm:text-[1.6rem] lm:text-[1.8rem] sl:text-[2rem] lt:text-[1.4vw] p-[0.4vw] lt:h-[3vw] w-[32%] text-white rounded"
					>
						{ isloading3 ? (
							<div role="status">
								<svg
									aria-hidden="true"
									className="w-8 h-8 text-gray-200 animate-spin fill-gray-600 lt:h-[2vw] lt:w-[2vw] sl:h-[3vw] sl:w-[3vw] sm:h-[2rem] sm:w-[2rem] mx-auto"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/>
								</svg>
							</div>
						) : (
							<div className="flex justify-center items-center sm:text-base lm:text-2xl tab:text-2xl sl:text-2xl">
								<svg
									fill="white"
									className="bi bi-trash3 sm:w-[2rem] sm:h-[2rem] lm:w-[3.4rem] lm:h-[3.4rem] tab:w-[3.8rem] tab:h-[3.8rem] sl:w-[4.2vw] sl:h-[4.2vw] lt:w-[2vw] lt:h-[2vw]"
									version="1.1"
									id="Layer_1"
									viewBox="0 0 184.153 184.153"
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
											<g>
												{ " " }
												<g>
													{ " " }
													<path d="M129.318,0H26.06c-1.919,0-3.475,1.554-3.475,3.475v177.203c0,1.92,1.556,3.475,3.475,3.475h132.034 c1.919,0,3.475-1.554,3.475-3.475V34.131C161.568,22.011,140.771,0,129.318,0z M154.62,177.203H29.535V6.949h99.784 c7.803,0,25.301,18.798,25.301,27.182V177.203z"></path>{ " " }
													<path d="M71.23,76.441c15.327,0,27.797-12.47,27.797-27.797c0-15.327-12.47-27.797-27.797-27.797 c-15.327,0-27.797,12.47-27.797,27.797C43.433,63.971,55.902,76.441,71.23,76.441z M71.229,27.797 c11.497,0,20.848,9.351,20.848,20.847c0,0.888-0.074,1.758-0.183,2.617l-18.071-2.708L62.505,29.735 C65.162,28.503,68.112,27.797,71.229,27.797z M56.761,33.668l11.951,19.869c0.534,0.889,1.437,1.49,2.462,1.646l18.669,2.799 c-3.433,6.814-10.477,11.51-18.613,11.51c-11.496,0-20.847-9.351-20.847-20.847C50.381,42.767,52.836,37.461,56.761,33.668z"></path>{ " " }
													<rect
														x="46.907"
														y="90.339"
														width="73.058"
														height="6.949"
													></rect>{ " " }
													<rect
														x="46.907"
														y="107.712"
														width="48.644"
														height="6.949"
													></rect>{ " " }
													<rect
														x="46.907"
														y="125.085"
														width="62.542"
														height="6.949"
													></rect>{ " " }
												</g>{ " " }
											</g>{ " " }
										</g>{ " " }
									</g>
								</svg>
								&nbsp;Reports
							</div>
						) }
					</button>
				</div>
			</form>
		</div>
	);
}

export default Download;
