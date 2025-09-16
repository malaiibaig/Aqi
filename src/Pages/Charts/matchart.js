import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { api_url, username, password } from "../../Variables";
import moment from 'moment';

export default function MatChart ( props )
{
	const [ chartOptions, setChartOptions ] = useState( {
		credits: {
			enabled: false,
		},
		title: {
			text: "Meteorological Data",
		},
		xAxis: {
			title: {
				enabled: true,
				text: "Time",
			},
		},
		yAxis: [
			{
				title: {
					enabled: true,
					text: "Concentrations",
					style: {
						fontWeight: "normal",
					},
				},
			},
			{
				title: {
					enabled: true,
					text: "Concentrations",
					style: {
						fontWeight: "normal",
					},
				},
				opposite: true,
			},
		],

		plotOptions: {
			series: {
				marker: {
					enabled: true,
					fillColor: "#FFFFFF",
					radius: 3.4,
					lineWidth: 1,
					lineColor: null,
				},
			},
		},
	} );

	const [ matData, setMatData ] = useState( "" );
	const [ matData2, setMatData2 ] = useState( "" );

	useEffect( () =>
	{
		selectedMatDataHandler();
	}, [ props.matStation, props.matStation2 ] );

	useEffect( () =>
	{
		if ( matData !== "" && props.matStats === "8hourly" )
		{
			GetChartMat8Hours();
		} else if ( matData !== "" && props.matStats === "daily" )
		{
			GetChartMatDaily();
		} else if ( matData !== "" && props.matStats === "monthly" )
		{
			GetChartMatMonthly();
		} else if ( matData !== "" && props.matStats === "yearly" )
		{
			GetChartMatYearly();
		}
	}, [
		props.checkedItems,
		matData,
		props.matStats,
		props.pollutant,
		matData2,
		props.stationName1,
		props.stationName2,
		props.matStation,
		props.matStation2,
	] );

	const selectedMatDataHandler = () =>
	{
		if ( props.matStation !== "" )
		{
			const requestOptions = {
				method: "GET",
				redirect: "follow",
				headers: {
					"Authorization": "Basic " + btoa( `${ username }:${ password }` ),
				},
			};

			fetch( api_url + `get_graphs?station=${ props.matStation }`, requestOptions )
				.then( ( response ) => response.json() )
				.then( ( result ) =>
				{
					if ( result )
					{
						setMatData( result );
					}
				} )
				.catch( ( error ) => console.error( error ) );
		} else if ( props.matStation === "" )
		{
			setMatData( "" );
		}

		if ( props.matStation2 !== "" )
		{
			const requestOptions = {
				method: "GET",
				redirect: "follow",
				headers: {
					"Authorization": "Basic " + btoa( `${ username }:${ password }` ),
				},
			};

			fetch( api_url + `get_graphs?station=${ props.matStation2 }`, requestOptions )
				.then( ( response ) => response.json() )
				.then( ( result ) =>
				{
					if ( result )
					{
						setMatData2( result );
					}
				} )
				.catch( ( error ) => console.error( error ) );
		} else if ( props.matStation2 === "" )
		{
			setMatData2( "" );
		}
	};

	const GetChartMat8Hours = () =>
	{
		if ( !matData || !matData.hourly_8 || !matData.hourly_8.matrological )
		{
			return;
		}

		const duration = matData && matData.hourly_8 && matData.hourly_8.duration;
		const duration2 =
			matData2 && matData2.hourly_8 && matData2.hourly_8.duration;

		const filteredMatData = props.checkedItems
			? props.checkedItems.filter(
				( data ) =>
					matData &&
					matData.hourly_8 &&
					matData.hourly_8.matrological.hasOwnProperty( data )
			)
			: [];

		const filteredMatData2 = props.checkedItems
			? props.checkedItems.filter(
				( data ) =>
					matData2 &&
					matData2.hourly_8 &&
					matData2.hourly_8.matrological.hasOwnProperty( data )
			)
			: [];

		const customSeriesNames = {
			sr: "Pressure",
			hum: "Humidity",
			rain: "Rain",
			temp: "Temperature",
		};

		const customSeriesColors = {
			sr: "#349bdb",
			hum: "#544fc5",
			rain: "#cb3e36",
			temp: "#0c9450",
		};

		const unit =
			filteredMatData &&
			filteredMatData.map( ( data ) => props.units[ data.toUpperCase() ] );

		const adjustOpacity = ( hexColor, opacity ) =>
		{
			const c = hexColor.substring( 1 );
			const rgb = parseInt( c, 16 );
			const r = ( rgb >> 16 ) & 0xff;
			const g = ( rgb >> 8 ) & 0xff;
			const b = ( rgb >> 0 ) & 0xff;
			return `rgba(${ r },${ g },${ b },${ opacity })`;
		};

		const timeOpacity = {
			"12:00 AM": 1.0,
			"08:00 AM": 0.7,
			"04:00 PM": 0.4,
		};

		const formatData = ( data ) =>
		{
			const formattedData = [];
			const currentYear = moment().year();

			for ( const date in data )
			{
				for ( const time in data[ date ] )
				{
					const datetimeString = `${ date } ${ currentYear } ${ time }`;
					const datetime = moment( datetimeString, 'MMM DD YYYY HH:mm' );
					const formattedDate = datetime.format( 'DD MMM' );
					const formattedTime = datetime.format( 'hh:mm A' );
					formattedData.push( [ formattedDate, formattedTime, parseFloat( data[ date ][ time ] ) ] );
				}
			}
			return formattedData;
		};

		const seriesData =
			filteredMatData &&
			filteredMatData.map( ( data ) =>
			{
				return {
					name: props.stationName2
						? `${ customSeriesNames[ data ] }; ${ props.stationName1 }`
						: customSeriesNames[ data ],
					data:
						matData &&
						matData.hourly_8 &&
						formatData( matData.hourly_8.matrological[ data ] ),
					color: customSeriesColors[ data ],
					stack: 'gas1',
					marker: {
						enabled: true,
						radius: 3.4,
						lineWidth: 1,
						fillColor: "#FFFFFF",
						symbol: "circle",
						lineColor: null,
					},
				};
			} );

		const seriesData2 =
			filteredMatData2 &&
			filteredMatData2.map( ( data ) =>
			{
				return {
					name: `${ customSeriesNames[ data ] }; ${ props.stationName2 }`,
					data:
						matData2 &&
						matData2.hourly_8 &&
						formatData( matData2.hourly_8.matrological[ data ] ),
					color: customSeriesColors[ data ],
					stack: 'gas2',
					marker: {
						enabled: true,
						radius: 3.4,
						lineWidth: 1,
						fillColor: customSeriesColors[ data ],
						symbol: "circle",
						lineColor: null,
					},
				};
			} );

		const dates = [ ...new Set( seriesData.flatMap( ( series ) => series.data.map( ( item ) => item[ 0 ] ) ) ) ];
		const dates2 = [ ...new Set( seriesData2.flatMap( ( series ) => series.data.map( ( item ) => item[ 0 ] ) ) ) ];

		const combinedSeriesData = [ ...seriesData ];
		const combinedSeriesData2 = [ ...seriesData2 ];

		const allSeries = [];

		combinedSeriesData.forEach( ( series ) =>
		{
			series.data.forEach( ( [ date, time, value ] ) =>
			{
				const seriesName = `${ series.name } - ${ time }`;
				let seriesIndex = allSeries.findIndex( ( s ) => s.name === seriesName );
				if ( seriesIndex === -1 )
				{
					allSeries.push( {
						name: seriesName,
						data: Array( dates.length ).fill( 0 ),
						color: adjustOpacity( series.color, timeOpacity[ time ] || 1.0 ),
						stack: 'gas1'
					} );
					seriesIndex = allSeries.length - 1;
				}
				const dateIndex = dates.indexOf( date );
				if ( dateIndex !== -1 )
				{
					allSeries[ seriesIndex ].data[ dateIndex ] += value;
				}
			} );
		} );

		combinedSeriesData2.forEach( ( series ) =>
		{
			series.data.forEach( ( [ date, time, value ] ) =>
			{
				const seriesName = `${ series.name } - ${ time }`;
				let seriesIndex = allSeries.findIndex( ( s ) => s.name === seriesName );
				if ( seriesIndex === -1 )
				{
					allSeries.push( {
						name: seriesName,
						data: Array( dates2.length ).fill( 0 ),
						color: adjustOpacity( series.color, timeOpacity[ time ] || 1.0 ),
						stack: 'gas2'
					} );
					seriesIndex = allSeries.length - 1;
				}
				const dateIndex = dates2.indexOf( date );
				if ( dateIndex !== -1 )
				{
					allSeries[ seriesIndex ].data[ dateIndex ] += value;
				}
			} );
		} );

		setChartOptions( ( prevOptions ) => ( {
			...prevOptions,
			series: allSeries,
			chart: {
				type: 'column',
			},
			title: {
				text: `Meteorological Data (${ duration })`,
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: true,
						formatter: function ()
						{
							return this.y;
						},
					},
				},
			},
			xAxis: {
				categories: dates,
				title: {
					text: 'Date',
				},
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Concentrations',
				},
				stackLabels: {
					enabled: false,
				},
			},
			tooltip: {
				headerFormat: '<b>{point.x}</b><br/>',
				pointFormat: '{series.name}: {point.y}<br/>',
			},
		} ) );
	};
	const GetChartMatDaily = () =>
	{
		if ( !matData || !matData.hourly || !matData.hourly.matrological )
		{
			return;
		}
		const duration = matData?.hourly?.duration;
		const duration2 = matData2?.hourly?.duration;

		const filteredMatData = props.checkedItems
			? props.checkedItems.filter(
				( data ) =>
					matData &&
					matData.hourly &&
					matData.hourly.matrological.hasOwnProperty( data )
			)
			: [];

		const filteredMatData2 = props.checkedItems
			? props.checkedItems.filter(
				( data ) =>
					matData2 &&
					matData2.hourly &&
					matData2.hourly.matrological.hasOwnProperty( data )
			)
			: [];

		const customSeriesNames = {
			sr: "Pressure",
			hum: "Humidity",
			rain: "Rain",
			temp: "Temperature",
		};

		const customSeriesColors = {
			sr: "#349bdb",
			hum: "#544fc5",
			rain: "#cb3e36",
			temp: "#0c9450",
		};

		const unit = filteredMatData.map( ( data ) => props.units[ data.toUpperCase() ] );

		const seriesData = filteredMatData.map( ( data ) => ( {
			name: props.stationName2
				? `${ customSeriesNames[ data ] }; ${ props.stationName1 }`
				: customSeriesNames[ data ],
			data: matData?.hourly?.matrological[ data ].map( ( [ time, value ] ) => [ time, value ] ),
			color: customSeriesColors[ data ],
			marker: {
				enabled: true,
				radius: 3.4,
				lineWidth: 1,
				fillColor: "#FFFFFF",
				symbol: "circle",
				lineColor: null,
			},
		} ) );

		const seriesData2 = filteredMatData2.map( ( data ) => ( {
			name: `${ customSeriesNames[ data ] }; ${ props.stationName2 }`,
			data: matData2?.hourly?.matrological[ data ].map( ( [ time, value ] ) => [ time, value ] ),
			color: customSeriesColors[ data ],
			marker: {
				enabled: true,
				radius: 3.4,
				lineWidth: 1,
				fillColor: customSeriesColors[ data ],
				symbol: "circle",
				lineColor: null,
			},
		} ) );

		const combinedSeriesData = [ ...seriesData, ...seriesData2 ];

		setChartOptions( ( prevOptions ) =>
		{
			const yAxis0 = ( prevOptions.yAxis && prevOptions.yAxis[ 0 ] ) || { title: {} };
			const yAxis1 = ( prevOptions.yAxis && prevOptions.yAxis[ 1 ] ) || { title: {} };

			return {
				...prevOptions,
				chart: {
					type: 'line',
				},
				series: combinedSeriesData,
				title: {
					text: `Meteorological Data (${ duration })`,
				},
				xAxis: {
					...prevOptions.xAxis,
					categories:
						filteredMatData.length > 0
							? matData.hourly.matrological[ filteredMatData[ 0 ] ].map( ( [ time ] ) => time )
							: [],
				},
				yAxis: [
					{
						...yAxis0,
						title: {
							...yAxis0.title,
							text: `Concentrations (${ unit[ 0 ] })`,
						},
					},
					{
						...yAxis1,
						title: {
							...yAxis1.title,
							text: `Concentrations (${ unit[ unit.length - 1 ] })`,
						},
						opposite: true,
					},
				],
			};
		} );
	};

	const GetChartMatMonthly = () =>
	{
		if ( !matData || !matData.matrological )
		{
			return;
		}

		const duration = matData && matData.duration;
		const duration2 = matData2 && matData2.duration;

		const filteredMatData = props.checkedItems
			? props.checkedItems.filter(
				( data ) => matData && matData.matrological.hasOwnProperty( data )
			)
			: [];

		const filteredMatData2 = props.checkedItems
			? props.checkedItems.filter(
				( data ) => matData2 && matData2.matrological.hasOwnProperty( data )
			)
			: [];

		const customSeriesNames = {
			sr: "Pressure",
			hum: "Humidity",
			rain: "Rain",
			temp: "Temperature",
		};

		const customSeriesColors = {
			sr: "#349bdb",
			hum: "#544fc5",
			rain: "#cb3e36",
			temp: "#0c9450",
		};

		const unit =
			filteredMatData &&
			filteredMatData.map( ( data ) => props.units[ data.toUpperCase() ] );

		const seriesData =
			filteredMatData &&
			filteredMatData.map( ( data ) =>
			{
				return {
					name: props.stationName2
						? `${ customSeriesNames[ data ] }; ${ props.stationName1 }`
						: customSeriesNames[ data ],
					data: matData.matrological[ data ].map( ( [ time, value ] ) => [
						time,
						value,
					] ),
					color: customSeriesColors[ data ],
					marker: {
						enabled: true,
						radius: 3.4,
						lineWidth: 1,
						fillColor: "#FFFFFF",
						symbol: "circle",
						lineColor: null,
					},
				};
			} );

		const seriesData2 =
			filteredMatData2 &&
			filteredMatData2.map( ( data ) =>
			{
				return {
					name: `${ customSeriesNames[ data ] }; ${ props.stationName2 }`,
					data: matData2.matrological[ data ].map( ( [ time, value ] ) => [
						time,
						value,
					] ),
					color: customSeriesColors[ data ],
					marker: {
						enabled: true,
						radius: 3.4,
						lineWidth: 1,
						fillColor: customSeriesColors[ data ],
						symbol: "circle",
						lineColor: null,
					},
				};
			} );

		const combinedSeriesData = [ ...seriesData, ...seriesData2 ];

		setChartOptions( ( prevOptions ) =>
		{
			const yAxis0 = ( prevOptions.yAxis && prevOptions.yAxis[ 0 ] ) || { title: {} };
			const yAxis1 = ( prevOptions.yAxis && prevOptions.yAxis[ 1 ] ) || { title: {} };

			return {
				...prevOptions,
				chart: {
					type: 'line',
				},
				series: combinedSeriesData,
				title: {
					text: `Meteorological Data (${ duration })`,
				},
				xAxis: {
					...prevOptions.xAxis,
					categories:
						filteredMatData.length > 0
							? matData.matrological[ filteredMatData[ 0 ] ].map( ( [ time ] ) => time )
							: [],
				},
				yAxis: [
					{
						...yAxis0,
						title: {
							...yAxis0.title,
							text: `Concentrations (${ unit[ 0 ] })`,
						},
					},
					{
						...yAxis1,
						title: {
							...yAxis1.title,
							text: `Concentrations (${ unit[ unit.length - 1 ] })`,
						},
						opposite: true,
					},
				],
			}
		} );
	};

	const GetChartMatYearly = () =>
	{
		if ( !matData || !matData.yearly || !matData.yearly.matrological )
		{
			return;
		}
		const duration = matData && matData.yearly && matData.yearly.duration;
		const duration2 = matData && matData2.yearly && matData2.yearly.duration;

		const filteredMatData = props.checkedItems
			? props.checkedItems.filter(
				( data ) =>
					matData &&
					matData.yearly &&
					matData.yearly.matrological.hasOwnProperty( data )
			)
			: [];

		const filteredMatData2 = props.checkedItems
			? props.checkedItems.filter(
				( data ) =>
					matData2 &&
					matData2.yearly &&
					matData2.yearly.matrological.hasOwnProperty( data )
			)
			: [];

		const customSeriesNames = {
			sr: "Pressure",
			hum: "Humidity",
			rain: "Rain",
			temp: "Temperature",
		};

		const customSeriesColors = {
			sr: "#349bdb",
			hum: "#544fc5",
			rain: "#cb3e36",
			temp: "#0c9450",
		};

		const unit =
			filteredMatData &&
			filteredMatData.map( ( data ) => props.units[ data.toUpperCase() ] );

		const seriesData =
			filteredMatData &&
			filteredMatData.map( ( data ) =>
			{
				return {
					name: props.stationName2
						? `${ customSeriesNames[ data ] }; ${ props.stationName1 }`
						: customSeriesNames[ data ],
					data:
						matData &&
						matData.yearly &&
						matData.yearly.matrological[ data ].map( ( [ time, value ] ) => [
							time,
							value,
						] ),
					color: customSeriesColors[ data ],
					marker: {
						enabled: true,
						radius: 3.4,
						lineWidth: 1,
						fillColor: "#FFFFFF",
						symbol: "circle",
						lineColor: null,
					},
				};
			} );

		const seriesData2 =
			filteredMatData2 &&
			filteredMatData2.map( ( data ) =>
			{
				return {
					name: `${ customSeriesNames[ data ] }; ${ props.stationName2 }`,
					data:
						matData2 &&
						matData2.yearly &&
						matData2.yearly.matrological[ data ].map( ( [ time, value ] ) => [
							time,
							value,
						] ),
					color: customSeriesColors[ data ],
					marker: {
						enabled: true,
						radius: 3.4,
						lineWidth: 1,
						fillColor: customSeriesColors[ data ],
						symbol: "circle",
						lineColor: null,
					},
				};
			} );

		const combinedSeriesData = [ ...seriesData, ...seriesData2 ];

		setChartOptions( ( prevOptions ) =>
		{
			const yAxis0 = ( prevOptions.yAxis && prevOptions.yAxis[ 0 ] ) || { title: {} };
			const yAxis1 = ( prevOptions.yAxis && prevOptions.yAxis[ 1 ] ) || { title: {} };

			return {
				...prevOptions,
				chart: {
					type: 'line',
				},
				series: combinedSeriesData,
				title: {
					text: `Meteorological Data (${ duration })`,
				},
				xAxis: {
					...prevOptions.xAxis,
					categories:
						filteredMatData.length > 0
							? matData.yearly.matrological[ filteredMatData[ 0 ] ].map(
								( [ time ] ) => time
							)
							: [],
				},
				yAxis: [
					{
						...yAxis0,
						title: {
							...yAxis0.title,
							text: `Concentrations (${ unit[ 0 ] })`,
						},
					},
					{
						...yAxis1,
						title: {
							...yAxis1.title,
							text: `Concentrations (${ unit[ unit.length - 1 ] })`,
						},
						opposite: true,
					},
				],
			}
		} );
	};

	return (
		<div id="mat-chart">
			<HighchartsReact highcharts={ Highcharts } options={ chartOptions } />
		</div>
	);
}
