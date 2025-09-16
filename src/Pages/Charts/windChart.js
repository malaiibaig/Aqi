import React, { useEffect, useState } from "react";
import { api_url, username, password } from "../../Variables";
import Highcharts from "highcharts/highstock";
import HcMore from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import moment from 'moment';
HcMore( Highcharts );

export default function WindChart ( props )
{
	function getTime ( hour )
	{
		return hour >= 12 ? "PM" : "AM";
	}

	const directionToDegrees = {
		N: 0,
		NE: 45,
		E: 90,
		SE: 135,
		S: 180,
		SW: 225,
		W: 270,
		NW: 315,
	};

	const directions = Object.keys( directionToDegrees );

	const [ chartOptions, setChartOptions ] = useState( {
		credits: {
			enabled: false,
		},
		series: [],
		data: {
			table: "freq",
			startRow: 1,
			endRow: 10,
			endColumn: 2,
		},

		chart: {
			polar: true,
			type: "column",
		},

		title: {
			text: "Wind Direction / Wind Speed",
		},

		pane: {
			size: "85%",
		},

		legend: {
			align: "left",
			verticalAlign: "top",
			y: 100,
			layout: "vertical",
		},

		xAxis: {
			tickmarkPlacement: "on",
			title: {
				text: "Direction",
			},
			min: 0,
		},

		yAxis: {
			min: 0,
			endOnTick: false,
			showLastLabel: true,
			title: {
				text: "Time",
			},
			reversedStacks: false,
		},

		tooltip: {
			formatter: function ()
			{
				const time = this.point.y;
				const hour = parseInt( time );
				const period = hour >= 12 ? "PM" : "AM";
				const hour12 = hour % 12 || 12;

				return (
					this.series.name +
					": <b>" +
					this.series.name +
					" " +
					hour12 +
					period +
					"</b><br/>"
				);
			},
		},

		plotOptions: {
			series: {
				stacking: null,
				shadow: false,
				groupPadding: 0,
				pointPlacement: "on",
			},
		},
	} );

	const [ wind, setWind ] = useState( "" );
	const [ wind2, setWind2 ] = useState( "" );

	useEffect( () =>
	{
		selectedWindHandler();
	}, [ props.station, props.station2 ] );

	useEffect( () =>
	{
		if ( wind !== "" && props.stats === "8hourly" )
		{
			GetChartWind8Hours();
		} else if ( wind !== "" && props.stats === "daily" )
		{
			GetChartWindDaily();
		} else if ( wind !== "" && props.stats === "monthly" )
		{
			GetChartWindMonthly();
		} else if ( wind !== "" && props.stats === "yearly" )
		{
			GetChartWindYearly();
		}
	}, [
		props,
		wind,
		wind2,
		props.stats,
		props.pollutant,
		props.station,
		props.station2,
		props.stationName1,
		props.stationName2,
	] );

	const selectedWindHandler = () =>
	{
		if ( props.station !== "" )
		{
			const requestOptions = {
				method: "GET",
				redirect: "follow",
				headers: {
					"Authorization": "Basic " + btoa( `${ username }:${ password }` ),
				},
			};

			fetch( api_url + `get_graphs?station=${ props.station }`, requestOptions )
				.then( ( response ) => response.json() )
				.then( ( result ) =>
				{
					if ( result )
					{
						setWind( result );
					}
				} )
				.catch( ( error ) => console.error( error ) );
		} else if ( props.station === "" )
		{
			setWind( "" );
		}

		if ( props.station2 !== "" )
		{
			const requestOptions = {
				method: "GET",
				redirect: "follow",
				headers: {
					"Authorization": "Basic " + btoa( `${ username }:${ password }` ),
				},
			};

			fetch( api_url + `get_graphs?station=${ props.station2 }`, requestOptions )
				.then( ( response ) => response.json() )
				.then( ( result ) =>
				{
					if ( result )
					{
						setWind2( result );
					}
				} )
				.catch( ( error ) => console.error( error ) );
		} else if ( props.station2 === "" )
		{
			setWind2( "" );
		}
	};

	const GetChartWind8Hours = () =>
	{
		if ( !wind || !wind.hourly_8 || !wind.hourly_8.matrological )
		{
			return;
		}

		const duration = wind && wind.hourly_8 && wind.hourly_8.duration;

		const filteredWind = props.checkedItems
			? props.checkedItems.filter(
				( data ) =>
					wind &&
					wind.hourly_8 &&
					wind.hourly_8.matrological.hasOwnProperty( data )
			)
			: [];

		const customSeriesColors = {
			ws: "#e7711b",
			wd: "#6f42c1",
		};

		const customSeriesColors2 = {
			ws: "#eaa675",
			wd: "#b08fef",
		};

		const customSeriesNames = {
			ws: "Wind Speed",
			wd: "Wind Direction",
		};

		const formatDataWD = ( data ) =>
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
					const direction = data[ date ][ time ];

					formattedData.push( [ formattedDate, formattedTime, direction ] );
				}
			}
			return formattedData;
		};
		const formatDataWS = ( data ) =>
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
					const speed = data[ date ][ time ]; // Access speed instead of direction

					formattedData.push( [ formattedDate, formattedTime, speed ] );
				}
			}
			return formattedData;
		};

		let wsSeriesData1 = [];
		let wsSeriesData2 = [];
		let wdSeriesData1 = [];
		let wdSeriesData2 = [];

		filteredWind.forEach( ( data ) =>
		{
			if ( data === "ws" )
			{
				const formattedWindData = formatDataWS( wind?.hourly_8?.matrological[ data ] || {} );
				const formattedWind2Data = formatDataWS( wind2?.hourly_8?.matrological[ data ] || {} );
				console.log( "formattedWindData", formattedWindData )
				const groupedData = formattedWindData.reduce( ( acc, [ formattedDate, formattedTime, speed ] ) =>
				{
					const hour24 = moment( formattedTime, 'hh:mm A' ).hour(); // Get 24-hour format
					if ( !acc[ speed ] )
					{
						acc[ speed ] = [];
					}
					acc[ speed ].push( { hour24, date: formattedDate } ); // Save date here
					return acc;
				}, {} );

				Object.keys( groupedData ).forEach( ( speed ) =>
				{
					wsSeriesData1.push( {
						name: props.station2
							? `${ customSeriesNames[ data ] }: ${ props.stationName1 }`
							: customSeriesNames[ data ],
						data: groupedData[ speed ].map( ( { hour24, date } ) => ( {
							x: parseInt( speed ),
							y: hour24,
							z: date 
						} ) ),
						color: customSeriesColors[ data ],
					} );
				} );

				if ( wind2 && wind2.hourly_8 )
				{
					const groupedData2 = formattedWind2Data.reduce( ( acc, [ formattedDate, formattedTime, speed ] ) =>
						{
						const hour24 = moment( formattedTime, 'hh:mm A' ).hour();
							if ( !acc[ speed ] )
							{
								acc[ speed ] = [];
							}
						acc[ speed ].push( { hour24, date: formattedDate } );
							return acc;
						}, {} );

					Object.keys( groupedData2 ).forEach( ( speed ) =>
					{
						wsSeriesData2.push( {
							name: `${ customSeriesNames[ data ] }: ${ props.stationName2 }`,
							data: groupedData2[ speed ].map( ( { hour24, date } ) => ( {
								x: parseInt( speed ),
								y: hour24,
								z: date 
							} ) ),
							color: customSeriesColors2[ data ],
						} );
					} );
				} else
				{
					wsSeriesData2.pop();
				}

				const combinedSeries = [
					...wsSeriesData1,
					...wsSeriesData2,
					...wdSeriesData1,
					...wdSeriesData2,
				];

				console.log( "wind", groupedData )
				const speedCategories = formattedWindData
					.map( ( [ date, time, speed ] ) => speed ) 
					.sort( ( a, b ) => a - b ); 

				const maxSpeedValue = Math.max( ...speedCategories );
				const dynamicArray = Array.from( { length: maxSpeedValue + 1 }, ( _, i ) => i );

				setChartOptions( ( prevOptions ) => ( {
					...prevOptions,
					series: combinedSeries,
					title: {
						text: `Wind Speed (${ duration })`,
					},
					xAxis: {
						tickmarkPlacement: "on",
						categories: dynamicArray,
						title: {
							text: "Speed",
						},
						min: 0,
						showLastLabel: true,
						max: Math.floor( maxSpeedValue ) + 1,
						labels: {
							formatter: function ()
							{
								return this.value + "m/s";
							},
						},
					},
					yAxis: {
						min: 0,
						endOnTick: false,
						showLastLabel: true,
						title: {
							text: "Time",
						},
						labels: {
							formatter: function ()
							{
								return " ";
							},
						},
						reversedStacks: false,
					},
					tooltip: {
						formatter: function ()
						{
							const time = this.point.y;
							const hour = parseInt( time );
							const period = hour >= 12 ? "PM" : "AM";
							const hour12 = hour % 12 || 12;
							const date = this.point.z;

							console.log( "tooltip", this.point )
							return (
								'<span style="color:' +
								this.point.color +
								'">\u25CF</span> ' +
								this.series.name +
								": <b>" +
								this.x.toFixed( 2 ) +
								"m/s" +
								" " +
								hour12 +
								period +
								"</b><br/>" +
								"Date: " + date
							);
						},
					},
					plotOptions: {
						series: {
							stacking: "normal",
							shadow: false,
							groupPadding: 0,
							pointPlacement: "on",
							showInLegend: false,
						},
					},
				} ) );
			} else if ( data === "wd" )
			{
				const formattedWindData = formatDataWD( wind?.hourly_8?.matrological[ data ] || {} );
				const formattedWind2Data = formatDataWD( wind2?.hourly_8?.matrological[ data ] || {} );

				const groupedData = formattedWindData.reduce( ( acc, [ formattedDate, formattedTime, direction ] ) =>
				{
					const hour24 = moment( formattedTime, 'hh:mm A' ).hour(); // Get 24-hour format
					if ( !acc[ direction ] )
					{
						acc[ direction ] = [];
					}
					acc[ direction ].push( { hour24, date: formattedDate } ); // Save date here
					return acc;
				}, {} );

				const groupedData2 = formattedWind2Data.reduce( ( acc, [ formattedDate, formattedTime, direction ] ) =>
				{
					const hour24 = moment( formattedTime, 'hh:mm A' ).hour(); // Get 24-hour format
					if ( !acc[ direction ] )
					{
						acc[ direction ] = [];
					}
					acc[ direction ].push( { hour24, date: formattedDate } ); // Save date here
					return acc;
				}, {} );

				Object.keys( groupedData ).forEach( ( direction ) =>
				{
					wdSeriesData1.push( {
						name: props.station2
							? `${ customSeriesNames[ data ] }: ${ props.stationName1 }`
							: direction,
						data: groupedData[ direction ].map( ( { hour24, date } ) => ( {
							x: directions.indexOf( direction ),
							y: hour24,
							z: date
						} )
						),
						color: customSeriesColors[ data ],
					} );
				} );

				if ( wind2 && wind2.hourly_8 )
				{
					Object.keys( groupedData2 ).forEach( ( direction ) =>
					{
						wdSeriesData2.push( {
							name: `${ customSeriesNames[ data ] }: ${ props.stationName2 }`,
							data: groupedData2[ direction ].map( ( { hour24, date } ) => ( {
								x: directions.indexOf( direction ),
								y: hour24,
								z: date
							} ) ),
							color: customSeriesColors2[ data ],
						} );
					} );
				} else
				{
					wdSeriesData2.pop();
				}

				const combinedSeries = [
					...wsSeriesData1,
					...wsSeriesData2,
					...wdSeriesData1,
					...wdSeriesData2,
				];

				console.log( "combinedSeries", combinedSeries )

				setChartOptions( ( prevOptions ) => ( {
					...prevOptions,
					series: combinedSeries,
					title: {
						text: `Wind Direction (${ duration })`,
					},
					xAxis: {
						tickmarkPlacement: "on",
						categories: directions,
						title: {
							text: "Direction",
						},
						min: 0,
						max: directions.length,
						labels: {
							formatter: function ()
							{
								return this.value;
							},
						},
					},
					yAxis: {
						min: 0,
						endOnTick: false,
						showLastLabel: true,
						title: {
							text: "Time",
						},
						labels: {
							formatter: function ()
							{
								const hour = parseInt( this.value ) % 24;
								if ( hour === 0 )
								{
									return "12AM";
								} else if ( hour === 12 )
								{
									return "12PM";
								} else
								{
									return ( hour <= 12 ? hour : hour - 12 ) + getTime( hour );
								}
							},
						},
						reversedStacks: false,
					},
					tooltip: {
						formatter: function ()
						{
							const time = this.point.y;
							const hour = parseInt( time );
							const period = hour >= 12 ? "PM" : "AM";
							const hour12 = hour % 12 || 12;
							const date = this.point.z;
							return (
								this.series.name +
								": <b>" +
								this.point.category +
								" " +
								hour12 +
								period +
								"</b><br/>" +
								"Date: " + date
							);
						},
					},
					plotOptions: {
						series: {
							stacking: "normal",
							shadow: false,
							groupPadding: 0,
							pointPlacement: "on",
							showInLegend: false,
						},
					},
				} ) );
			}
		} );
	};


	const GetChartWindDaily = () =>
	{
		if ( !wind || !wind.hourly || !wind.hourly.matrological )
		{
			return;
		}

		const duration = wind && wind.hourly && wind.hourly.duration;

		const filteredWind = props.checkedItems
			? props.checkedItems.filter( ( data ) =>
				wind.hourly.matrological.hasOwnProperty( data )
			)
			: [];

		const customSeriesColors = {
			ws: "#e7711b",
			wd: "#6f42c1",
		};

		const customSeriesColors2 = {
			ws: "#eaa675",
			wd: "#b08fef",
		};

		const customSeriesNames = {
			ws: "Wind Speed",
			wd: "Wind Direction",
		};

		let wsSeriesData1 = [];
		let wsSeriesData2 = [];
		let wdSeriesData1 = [];
		let wdSeriesData2 = [];

		filteredWind.forEach( ( data ) =>
		{
			if ( data === "ws" )
			{
				const groupedData =
					wind &&
					wind.hourly &&
					wind.hourly.matrological[ data ].reduce( ( acc, [ time, speed ] ) =>
					{
						const [ hour, period ] = time.split( /(?=[AP]M)/ );
						let hour24 = parseInt( hour, 10 );
						if ( period === "PM" && hour24 !== 12 )
						{
							hour24 += 12;
						} else if ( period === "AM" && hour24 === 12 )
						{
							hour24 = 0;
						}
						if ( !acc[ speed ] )
						{
							acc[ speed ] = [];
						}
						acc[ speed ].push( hour24 );
						return acc;
					}, {} );
				Object.keys( groupedData ).forEach( ( speed ) =>
				{
					wsSeriesData1.push( {
						name: props.station2
							? `${ customSeriesNames[ data ] }: ${ props.stationName1 }`
							: customSeriesNames[ data ],
						data: groupedData[ speed ].map( ( hour24 ) => ( {
							x: parseInt( speed ),
							y: hour24,
						} ) ),
						color: customSeriesColors[ data ],
					} );
				} );
				if ( wind2 && wind2.hourly )
				{
					const groupedData2 =
						wind2 &&
						wind2.hourly &&
						wind2.hourly.matrological[ data ].reduce( ( acc, [ time, speed ] ) =>
						{
							const [ hour, period ] = time.split( /(?=[AP]M)/ );
							let hour24 = parseInt( hour, 10 );
							if ( period === "PM" && hour24 !== 12 )
							{
								hour24 += 12;
							} else if ( period === "AM" && hour24 === 12 )
							{
								hour24 = 0;
							}
							if ( !acc[ speed ] )
							{
								acc[ speed ] = [];
							}
							acc[ speed ].push( hour24 );
							return acc;
						}, {} );

					Object.keys( groupedData2 ).forEach( ( speed ) =>
					{
						wsSeriesData2.push( {
							name: `${ customSeriesNames[ data ] }: ${ props.stationName2 }`,
							data: groupedData2[ speed ].map( ( hour24 ) => ( {
								x: parseInt( speed ),
								y: hour24,
							} ) ),
							color: customSeriesColors2[ data ],
						} );
					} );
				} else
				{
					wsSeriesData2.pop();
				}

				const combinedSeries = [
					...wsSeriesData1,
					...wsSeriesData2,
					...wdSeriesData1,
					...wdSeriesData2,
				];

				const speedData = wind && wind.hourly && wind.hourly.matrological[ data ];
				const speedCategories = speedData
					.map( ( [ time, speed ], index ) => speed )
					.sort( ( a, b ) => a - b );
				const maxSpeedValue = Math.max( ...speedCategories );

				const dynamicArray = [ 0 ];
				for ( let i = 1; i <= maxSpeedValue; i++ )
				{
					dynamicArray.push( i );
				}

				setChartOptions( ( prevOptions ) => ( {
					...prevOptions,
					series: combinedSeries,
					title: {
						text: `Wind Speed (${ duration })`,
					},
					xAxis: {
						tickmarkPlacement: "on",
						categories: dynamicArray,
						title: {
							text: "Speed",
						},
						min: 0,
						showLastLabel: true,
						max: Math.floor( maxSpeedValue ) + 1,
						labels: {
							formatter: function ()
							{
								return this.value + "m/s";
							},
						},
					},
					yAxis: {
						min: 0,
						endOnTick: false,
						showLastLabel: true,
						title: {
							text: "Time",
						},
						labels: {
							formatter: function ()
							{
								return " ";
							},
						},
						reversedStacks: false,
					},
					tooltip: {
						formatter: function ()
						{
							const time = this.point.y;
							const hour = parseInt( time );
							const period = time >= 12 ? "PM" : "AM";
							const hour12 = hour % 12 || 12;
							return (
								'<span style="color:' +
								this.point.color +
								'">\u25CF</span> ' +
								this.series.name +
								": <b>" +
								this.x +
								"m/s" +
								" " +
								hour12 +
								period +
								"</b><br/>"
							);
						},
					},
					plotOptions: {
						series: {
							stacking: "normal",
							shadow: false,
							groupPadding: 0,
							pointPlacement: "on",
							showInLegend: false,
						},
					},
				} ) );
			} else if ( data === "wd" )
			{
				const groupedData =
					wind &&
					wind.hourly &&
					wind.hourly.matrological[ data ].reduce( ( acc, [ time, direction ] ) =>
					{
						const [ hour, period ] = time.split( /(?=[AP]M)/ );
						let hour24 = parseInt( hour );
						if ( period === "PM" && hour24 !== 12 )
						{
							hour24 += 12;
						} else if ( period === "AM" && hour24 === 12 )
						{
							hour24 = 0;
						}
						if ( !acc[ direction ] )
						{
							acc[ direction ] = [];
						}
						acc[ direction ].push( hour24 );
						return acc;
					}, {} );

				const groupedData2 =
					wind2 &&
					wind2.hourly &&
					wind2.hourly.matrological[ data ].reduce( ( acc, [ time, direction ] ) =>
					{
						const [ hour, period ] = time.split( /(?=[AP]M)/ );
						let hour24 = parseInt( hour );
						if ( period === "PM" && hour24 !== 12 )
						{
							hour24 += 12;
						} else if ( period === "AM" && hour24 === 12 )
						{
							hour24 = 0;
						}
						if ( !acc[ direction ] )
						{
							acc[ direction ] = [];
						}
						acc[ direction ].push( hour24 );
						return acc;
					}, {} );

				Object.keys( groupedData ).forEach( ( direction ) =>
				{
					wdSeriesData1.push( {
						name: props.station2
							? `${ customSeriesNames[ data ] }: ${ props.stationName1 }`
							: direction,
						data: groupedData[ direction ].map( ( hour24 ) => [
							directions.indexOf( direction ),
							hour24,
						] ),
						color: customSeriesColors[ data ],
					} );
				} );

				if ( wind2 && wind2.hourly )
				{
					Object.keys( groupedData2 ).forEach( ( direction ) =>
					{
						wdSeriesData2.push( {
							name: `${ customSeriesNames[ data ] }: ${ props.stationName2 }`,
							data: groupedData2[ direction ].map( ( hour24 ) => [
								directions.indexOf( direction ),
								hour24,
							] ),
							color: customSeriesColors2[ data ],
						} );
					} );
				} else
				{
					wdSeriesData2.pop();
				}

				const combinedSeries = [
					...wsSeriesData1,
					...wsSeriesData2,
					...wdSeriesData1,
					...wdSeriesData2,
				];
				setChartOptions( ( prevOptions ) => ( {
					...prevOptions,
					series: combinedSeries,
					title: {
						text: `Wind Direction  (${ duration })`,
					},
					xAxis: {
						tickmarkPlacement: "on",
						categories: directions,
						title: {
							text: "Direction",
						},
						min: 0,
						max: directions.length,
						labels: {
							formatter: function ()
							{
								return this.value;
							},
						},
					},
					yAxis: {
						min: 0,
						endOnTick: false,
						showLastLabel: true,
						title: {
							text: "Time",
						},
						labels: {
							formatter: function ()
							{
								const hour = parseInt( this.value ) % 24;
								if ( hour === 0 )
								{
									return "12AM";
								} else if ( hour === 12 )
								{
									return "12PM";
								} else
								{
									return ( hour <= 12 ? hour : hour - 12 ) + getTime( hour );
								}
							},
						},
						reversedStacks: false,
					},
					tooltip: {
						formatter: function ()
						{
							const time = this.point.y;
							const hour = parseInt( time );
							const period = hour >= 12 ? "PM" : "AM";
							const hour12 = hour % 12 || 12;
							return (
								this.series.name +
								": <b>" +
								this.point.category +
								" " +
								hour12 +
								period +
								"</b><br/>"
							);
						},
					},
					plotOptions: {
						series: {
							stacking: "normal",
							shadow: false,
							groupPadding: 0,
							pointPlacement: "on",
							showInLegend: false,
						},
					},
				} ) );
			}
		} );
	};

	const GetChartWindMonthly = () =>
	{
		if ( !wind || !wind.matrological )
		{
			return;
		}

		const duration = wind && wind.duration;

		const filteredWind = props.checkedItems
			? props.checkedItems.filter(
				( data ) => wind && wind.matrological.hasOwnProperty( data )
			)
			: [];

		const customSeriesColors = {
			ws: "#e7711b",
			wd: "#6f42c1",
		};

		const customSeriesColors2 = {
			ws: "#eaa675",
			wd: "#b08fef",
		};

		const customSeriesNames = {
			ws: "Wind Speed",
			wd: "Wind Direction",
		};

		let wsSeriesData1 = [];
		let wsSeriesData2 = [];
		let wdSeriesData1 = [];
		let wdSeriesData2 = [];

		const parseDate = ( dateStr ) =>
		{
			const [ day, month ] = dateStr.match( /\d+|\D+/g );
			const monthIndex = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			].indexOf( month );
			return Date.UTC( 2023, monthIndex, parseInt( day ) );
		};

		filteredWind.forEach( ( data ) =>
		{
			if ( data === "ws" )
			{
				wsSeriesData1.push( {
					name: props.station2
						? `${ customSeriesNames[ data ] }: ${ props.stationName1 }`
						: customSeriesNames[ data ],
					data:
						wind &&
						wind.matrological[ data ].map( ( [ date, speed ] ) => ( {
							x: speed,
							y: parseDate( date ),
							date: date,
						} ) ),
					color: customSeriesColors[ data ],
				} );
				if ( wind2 )
				{
					wsSeriesData2.push( {
						name: `${ customSeriesNames[ data ] }: ${ props.stationName2 }`,
						data:
							wind2 &&
							wind2.matrological[ data ].map( ( [ date, speed ] ) => ( {
								x: speed,
								y: parseDate( date ),
								date: date,
							} ) ),
						color: customSeriesColors2[ data ],
					} );
				} else
				{
					wsSeriesData2.pop();
				}
				const combinedSeries = [
					...wsSeriesData1,
					...wsSeriesData2,
					...wdSeriesData1,
					...wdSeriesData2,
				];

				let uniqueDates = [];
				const dates =
					wind && wind.matrological[ data ].map( ( [ date ] ) => parseDate( date ) );
				uniqueDates = [ ...uniqueDates, ...dates ];
				uniqueDates = [ ...new Set( uniqueDates ) ].sort( ( a, b ) => a - b );

				const speedData = wind.matrological[ data ];
				const speedCategories = speedData
					.map( ( [ date, speed ], index ) => speed )
					.sort( ( a, b ) => a - b );
				const maxSpeedValue = Math.max( ...speedCategories );

				const dynamicArray = [ 0 ];
				for ( let i = 1; i <= maxSpeedValue; i++ )
				{
					dynamicArray.push( i );
				}

				setChartOptions( ( prevOptions ) => ( {
					...prevOptions,
					series: combinedSeries,
					title: {
						text: `Wind Speed (${ duration })`,
					},
					xAxis: {
						tickmarkPlacement: "on",
						categories: dynamicArray,
						title: {
							text: "Speed",
						},
						min: 0,
						labels: {
							formatter: function ()
							{
								return this.value + "m/s";
							},
						},
						showLastLabel: true,
						max: Math.floor( maxSpeedValue ) + 1,
					},
					yAxis: {
						type: "datetime",
						title: {
							text: "Date",
						},
						dateTimeLabelFormats: {
							day: "%e %b",
						},
						tickInterval: 24 * 3600 * 1000,
						reversedStacks: false,
						labels: {
							formatter: function ()
							{
								return " ";
							},
						},
					},
					tooltip: {
						formatter: function ()
						{
							return (
								'<span style="color:' +
								this.point.color +
								'">\u25CF</span> ' +
								this.series.name +
								": <b>" +
								this.x +
								"m/s" +
								" " +
								Highcharts.dateFormat( "%e %b", this.y ) +
								"</b><br/>"
							);
						},
					},
					plotOptions: {
						series: {
							stacking: "normal",
							shadow: false,
							groupPadding: 0,
							pointPlacement: "on",
							showInLegend: false,
						},
					},
				} ) );
			} else if ( data === "wd" )
			{
				const groupedData =
					wind &&
					wind.matrological[ data ].reduce( ( acc, [ date, direction ] ) =>
					{
						const timestamp = parseDate( date );
						if ( !acc[ direction ] )
						{
							acc[ direction ] = [];
						}
						acc[ direction ].push( [ timestamp, date ] );
						return acc;
					}, {} );

				const groupedData2 =
					wind2 &&
					wind2.matrological[ data ].reduce( ( acc, [ date, direction ] ) =>
					{
						const timestamp = parseDate( date );
						if ( !acc[ direction ] )
						{
							acc[ direction ] = [];
						}
						acc[ direction ].push( [ timestamp, date ] );
						return acc;
					}, {} );

				Object.keys( groupedData ).forEach( ( direction ) =>
				{
					wdSeriesData1.push( {
						name: props.station2
							? `${ customSeriesNames[ data ] }: ${ props.stationName1 }`
							: direction,
						data: groupedData[ direction ].map( ( [ timestamp, date ] ) => [
							directions.indexOf( direction ),
							timestamp,
						] ),
						color: customSeriesColors[ data ],
					} );
				} );

				if ( wind2 )
				{
					Object.keys( groupedData2 ).forEach( ( direction ) =>
					{
						wdSeriesData2.push( {
							name: `${ customSeriesNames[ data ] }: ${ props.stationName2 }`,
							data: groupedData2[ direction ].map( ( [ timestamp, date ] ) => [
								directions.indexOf( direction ),
								timestamp,
							] ),
							color: customSeriesColors2[ data ],
						} );
					} );
				} else
				{
					wdSeriesData2.pop();
				}
				const combinedSeries = [
					...wsSeriesData1,
					...wsSeriesData2,
					...wdSeriesData1,
					...wdSeriesData2,
				];

				let uniqueDates = [];
				const dates =
					wind && wind.matrological[ data ].map( ( [ date ] ) => parseDate( date ) );
				uniqueDates = [ ...uniqueDates, ...dates ];

				uniqueDates = [ ...new Set( uniqueDates ) ].sort( ( a, b ) => a - b );

				setChartOptions( ( prevOptions ) => ( {
					...prevOptions,
					series: combinedSeries,
					title: {
						text: `Wind Direction(${ duration })`,
					},
					xAxis: {
						tickmarkPlacement: "on",
						categories: directions,
						title: {
							text: "Direction",
						},
						min: 0,
						labels: {
							formatter: function ()
							{
								return this.value;
							},
						},
						max: directions.length,
					},
					yAxis: {
						type: "datetime",
						title: {
							text: "Date",
						},
						dateTimeLabelFormats: {
							day: "%e %b",
						},
						tickInterval: 24 * 3600 * 1000,
						reversedStacks: false,
						labels: {
							formatter: function ()
							{
								return " ";
							},
						},
					},
					tooltip: {
						formatter: function ()
						{
							return (
								this.series.name +
								": <b>" +
								this.point.category +
								" " +
								Highcharts.dateFormat( "%e %b", this.y ) +
								"</b><br/>"
							);
						},
					},
					plotOptions: {
						series: {
							stacking: "normal",
							shadow: false,
							groupPadding: 0,
							pointPlacement: "on",
							showInLegend: false,
						},
					},
				} ) );
			}
		} );
	};

	const GetChartWindYearly = () =>
	{
		if ( !wind || !wind.yearly.matrological )
		{
			return;
		}

		const duration = wind && wind.duration;

		const filteredWind = props.checkedItems
			? props.checkedItems.filter(
				( data ) => wind && wind.yearly.matrological.hasOwnProperty( data )
			)
			: [];

		const customSeriesColors = {
			ws: "#e7711b",
			wd: "#6f42c1",
		};

		const customSeriesColors2 = {
			ws: "#eaa675",
			wd: "#b08fef",
		};

		const customSeriesNames = {
			ws: "Wind Speed",
			wd: "Wind Direction",
		};

		let wsSeriesData1 = [];
		let wsSeriesData2 = [];
		let wdSeriesData1 = [];
		let wdSeriesData2 = [];

		const parseDate = ( dateStr ) =>
		{
			const [ month, day ] = dateStr.split( ' ' );
			const monthIndex = [
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
				"Sep", "Oct", "Nov", "Dec"
			].indexOf( month );
			return Date.UTC( 2023, monthIndex, parseInt( day, 10 ) );
		};

		filteredWind.forEach( ( data ) =>
		{
			if ( data === "ws" )
			{
				wsSeriesData1.push( {
					name: props.station2
						? `${ customSeriesNames[ data ] }: ${ props.stationName1 }`
						: customSeriesNames[ data ],
					data:
						wind &&
						wind.yearly.matrological[ data ].map( ( [ date, speed ] ) => ( {
							x: speed,
							y: parseDate( date ),
							date: date,
						} ) ),
					color: customSeriesColors[ data ],
				} );

				if ( wind2 )
				{
					wsSeriesData2.push( {
						name: `${ customSeriesNames[ data ] }: ${ props.stationName2 }`,
						data:
							wind2 &&
							wind2.yearly.matrological[ data ].map( ( [ date, speed ] ) => ( {
								x: speed,
								y: parseDate( date ),
								date: date,
							} ) ),
						color: customSeriesColors2[ data ],
					} );
				} else
				{
					wsSeriesData2.pop();
				}
				const combinedSeries = [
					...wsSeriesData1,
					...wsSeriesData2,
					...wdSeriesData1,
					...wdSeriesData2,
				];

				let uniqueDates = [];
				const dates =
					wind && wind.yearly.matrological[ data ].map( ( [ date ] ) => parseDate( date ) );
				uniqueDates = [ ...uniqueDates, ...dates ];
				uniqueDates = [ ...new Set( uniqueDates ) ].sort( ( a, b ) => a - b );

				const speedData = wind.yearly.matrological[ data ];
				const speedCategories = speedData
					.map( ( [ date, speed ], index ) => speed )
					.sort( ( a, b ) => a - b );
				const maxSpeedValue = Math.max( ...speedCategories );

				const dynamicArray = [ 0 ];
				for ( let i = 1; i <= maxSpeedValue; i++ )
				{
					dynamicArray.push( i );
				}
				console.log( "combined series", combinedSeries )

				setChartOptions( ( prevOptions ) => ( {
					...prevOptions,
					series: combinedSeries,
					title: {
						text: `Wind Speed (${ duration })`,
					},
					xAxis: {
						tickmarkPlacement: "on",
						categories: dynamicArray,
						title: {
							text: "Speed",
						},
						min: 0,
						labels: {
							formatter: function ()
							{
								return this.value + "m/s";
							},
						},
						showLastLabel: true,
						max: Math.floor( maxSpeedValue ) + 1,
					},
					yAxis: {
						type: "datetime",
						title: {
							text: "Date",
						},
						dateTimeLabelFormats: {
							day: "%e %b",
						},
						tickInterval: 24 * 3600 * 1000,
						reversedStacks: false,
						labels: {
							formatter: function ()
							{
								return " ";
							},
						},
					},
					tooltip: {
						formatter: function ()
						{
							return (
								'<span style="color:' +
								this.point.color +
								'">\u25CF</span> ' +
								this.series.name +
								": <b>" +
								this.x +
								"m/s" +
								" " +
								Highcharts.dateFormat( "%e %b", this.y ) +
								"</b><br/>"
							);
						},
					},
					plotOptions: {
						series: {
							stacking: "normal",
							shadow: false,
							groupPadding: 0,
							pointPlacement: "on",
							showInLegend: false,
						},
					},
				} ) );
			} else if ( data === "wd" )
			{
				const groupedData =
					wind &&
					wind.yearly.matrological[ data ].reduce( ( acc, [ date, direction ] ) =>
					{
						const timestamp = parseDate( date );
						if ( !acc[ direction ] )
						{
							acc[ direction ] = [];
						}
						acc[ direction ].push( [ timestamp, date ] );
						return acc;
					}, {} );

				const groupedData2 =
					wind2 &&
					wind2.yearly.matrological[ data ].reduce( ( acc, [ date, direction ] ) =>
					{
						const timestamp = parseDate( date );
						if ( !acc[ direction ] )
						{
							acc[ direction ] = [];
						}
						acc[ direction ].push( [ timestamp, date ] );
						return acc;
					}, {} );

				Object.keys( groupedData ).forEach( ( direction ) =>
				{
					wdSeriesData1.push( {
						name: props.station2
							? `${ customSeriesNames[ data ] }: ${ props.stationName1 }`
							: direction,
						data: groupedData[ direction ].map( ( [ timestamp, date ] ) => [
							directions.indexOf( direction ),
							timestamp,
						] ),
						color: customSeriesColors[ data ],
					} );
				} );

				if ( wind2 )
				{
					Object.keys( groupedData2 ).forEach( ( direction ) =>
					{
						wdSeriesData2.push( {
							name: `${ customSeriesNames[ data ] }: ${ props.stationName2 }`,
							data: groupedData2[ direction ].map( ( [ timestamp, date ] ) => [
								directions.indexOf( direction ),
								timestamp,
							] ),
							color: customSeriesColors2[ data ],
						} );
					} );
				} else
				{
					wdSeriesData2.pop();
				}
				const combinedSeries = [
					...wsSeriesData1,
					...wsSeriesData2,
					...wdSeriesData1,
					...wdSeriesData2,
				];

				let uniqueDates = [];
				const dates =
					wind && wind.yearly.matrological[ data ].map( ( [ date ] ) => parseDate( date ) );
				uniqueDates = [ ...uniqueDates, ...dates ];

				uniqueDates = [ ...new Set( uniqueDates ) ].sort( ( a, b ) => a - b );

				setChartOptions( ( prevOptions ) => ( {
					...prevOptions,
					series: combinedSeries,
					title: {
						text: `Wind Direction(${ duration })`,
					},
					xAxis: {
						tickmarkPlacement: "on",
						categories: directions,
						title: {
							text: "Direction",
						},
						min: 0,
						labels: {
							formatter: function ()
							{
								return this.value;
							},
						},
						max: directions.length,
					},
					yAxis: {
						type: "datetime",
						title: {
							text: "Date",
						},
						dateTimeLabelFormats: {
							day: "%e %b",
						},
						tickInterval: 24 * 3600 * 1000,
						reversedStacks: false,
						labels: {
							formatter: function ()
							{
								return " ";
							},
						},
					},
					tooltip: {
						formatter: function ()
						{
							return (
								this.series.name +
								": <b>" +
								this.point.category +
								" " +
								Highcharts.dateFormat( "%e %b", this.y ) +
								"</b><br/>"
							);
						},
					},
					plotOptions: {
						series: {
							stacking: "normal",
							shadow: false,
							groupPadding: 0,
							pointPlacement: "on",
							showInLegend: false,
						},
					},
				} ) );
			}
		} );
	};

	return (
		<div id="windChart">
			<HighchartsReact highcharts={ Highcharts } options={ chartOptions } />
		</div>
	);
}
