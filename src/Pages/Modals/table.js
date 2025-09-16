import React, { useEffect, useState } from "react";

function Table ( props )
{
	const [ keys, setKeys ] = useState( "" );
	const [ stationNames, setStationNames ] = useState( [] );
	const [ clickedStation, setClickedStation ] = useState( "" );
	const [ filteredData, setFilteredData ] = useState( "" );

	useEffect( () =>
	{
		setStationNames( [] );
		if ( props.result && Array.isArray( props.result.data ) )
		{
			props.result.data.forEach( ( stations, index ) =>
			{
				const firstData = stations && stations[ 0 ];
				const stationName = firstData && firstData.station;

				if ( stationName !== undefined )
				{
					setStationNames( prevState => [ ...prevState, stationName ] );
				}

				if ( index === 0 && stationName !== undefined )
				{
					setClickedStation( stationName );
				}
			} );
		}
	}, [ props.result ] );

	useEffect( () =>
	{
		if ( props.result && Array.isArray( props.result.data ) )
		{
			const filteredData = props.result.data.filter( stations =>
			{
				const firstData = stations && stations[ 0 ];
				const stationName = firstData && firstData.station;
				return stationName === clickedStation;
			} );

			setFilteredData( filteredData );

			if ( filteredData && filteredData[ 0 ] && filteredData[ 0 ][ 0 ] )
			{
				const firstObject = filteredData[ 0 ][ 0 ];
				const keys = Object.keys( firstObject );
				setKeys( keys.slice( 1 ) );
			} else
			{
				setKeys( [] );
			}
		}
	}, [ clickedStation, props.result ] );

	function formatTime ( time )
	{
		const [ hours, minutes, seconds ] = time.split( ':' );
		let formattedHours = parseInt( hours );
		let period = 'AM';

		if ( formattedHours >= 12 )
		{
			formattedHours -= 12;
			period = 'PM';
		}

		if ( formattedHours === 0 )
		{
			formattedHours = 12;
		}

		return `${ formattedHours }:${ minutes } ${ period }`;
	}

	return (
		<div className="flex justify-center flex-col px-[0.2vw] py-[0.2vw] bg-white h-16">
			<div className="bg-white">
				<ul className="flex sl:flex-wrap font-medium text-center bg-white" id="station-data" data-tabs-toggle="#table-data" data-tabs-active-classes="text-purple-600 hover:text-purple-600 dark:text-purple-500 dark:hover:text-purple-500 border-purple-600 dark:border-purple-500" data-tabs-inactive-classes="dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300" role="tablist">
					{ stationNames && stationNames.map( ( stationName, index ) => (
						<li className={ `${ clickedStation === stationName ? 'bg-primary text-white' : 'bg-white text-primary' }` } role="presentation" key={ index }>
							<button onClick={ () =>
							{
								setClickedStation( stationName );
							} } className="sm:w-44 lm:w-52 tab:w-72 sl:w-auto sl:mx-2 inline-block p-2 rounded-t-lg border-b border-white lt:text-[1vw] sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[2rem]" id="profile-styled-tab" data-tabs-target="table" type="button" role="tab" aria-controls="profile" aria-selected="false">
								{ stationName }
							</button>
						</li>
					) ) }
				</ul>
			</div>
			<table className="border-collapse border border-gray-400 table-div w-full table-auto">
				<thead className="sticky top-0 bg-white z-50 shadow-md">
					<tr className="bg-primary text-white">
						{ keys &&
							keys.map( ( key, index ) => (
								<th
									className={ `${ index === 0 ? "sm:max-w-[10rem] sm:min-w-[10rem] tab:max-w-[12rem] tab:min-w-[12rem] lt:max-w-[4vw] lt:min-w-[4vw]" : ""
										} ${ index === 1 ? "sm:max-w-[8rem] sm:min-w-[8rem] tab:max-w-[9rem] tab:min-w-[9rem] lt:max-w-[4vw] lt:min-w-[4vw]" : ""
										} sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[0.6vw] p-1 border border-gray-400` }
									key={ index }
								>
									{ key.toUpperCase() }
								</th>
							) ) }
					</tr>
				</thead>
				<tbody>
					{ filteredData &&
						filteredData.map( ( itemArray, rowIndex ) => (
							itemArray.map( ( item, colIndex ) => (
								<tr key={ `${ rowIndex }-${ colIndex }` }>
									{ keys &&
										keys.map( ( key ) => (
											<td
												className={ `sm:text-[1.4rem] sm:p-1.5 lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[0.6vw] p-1 border border-gray-400 text-center` }
												key={ key }
											>
												{ key === "time" ? formatTime( item[ key ] ) : item[ key ] }
											</td>
										) ) }
								</tr>
							) )
						) ) }
				</tbody>
			</table>

		</div>
	);
}

export default Table;
