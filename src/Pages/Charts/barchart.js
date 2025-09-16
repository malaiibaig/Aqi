import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { api_url, username, password } from "../../Variables";
import moment from 'moment';

export default function BarChart ( props )
{
	const [ options, setOptions ] = useState( {
		colors: [ "#04253c", "#9F8B66" ],
		credits: {
			enabled: false,
		},
		chart: {
			alignTicks: false,
		},
		rangeSelector: {
			selected: 1,
		},
		title: {
			text: "Air Quality Index",
		},
		series: [
			{
				showInLegend: true,
				type: "column",
				name: "Air Quality Index",
				data: [],
				marker: {
					fillColor: "#FFFFFF",
					radius: 5,
					lineWidth: 2,
					lineColor: null,
				},
			},
		],
		xAxis: {
			categories: [],
			title: {
				enabled: true,
				text: "Hours",
				style: {
					fontWeight: "normal",
				},
			},
		},
		yAxis: [
			{
				title: {
					enabled: true,
					text: "AQI",
					style: {
						fontWeight: "normal",
					},
				},
			},
		],
	} );

	const [ aqi, setAqi ] = useState( "" );
	const [ aqi2, setAqi2 ] = useState( "" );

	useEffect( () =>
	{
		GetAQI();
	}, [ props.station, props.station2 ] );

	const GetAQI = () =>
	{
		if ( props.station )
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
					if ( result)
					{
						setAqi( result );
					}
				} )
				.catch( ( error ) => console.error( error ) );
		}

		if ( props.station2 )
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
						setAqi2( result );
					}
				} )
				.catch( ( error ) => console.error( error ) );
		}
	};

	useEffect( () =>
	{
		if ( props.pollutant === "gas" )
		{
			if ( aqi !== "" && props.stats === "8hourly" )
			{
				GasesAQI8Hours();
			} else if ( aqi !== "" && props.stats === "daily" )
			{
				GasesAQIHourly();
			} else if ( aqi !== "" && props.stats === "monthly" )
			{
				GasesMonthly();
			}
			else if ( aqi !== "" && props.stats === "yearly" )
			{
				GasesAQIYearly();
			}
		} else if ( props.pollutant === "pm" )
		{
			if ( aqi !== "" && props.stats === "8hourly" )
			{
				PMAQI8Hours();
			} else if ( aqi !== "" && props.stats === "daily" )
			{
				PMAQIHourly();
			} else if ( aqi !== "" && props.stats === "monthly" )
			{
				PMMonthly();
			} else if ( aqi !== "" && props.stats === "yearly" )
			{
				PMAQIYearly();
			}
		}
	}, [
		props.stats,
		aqi,
		props.pollutant,
		aqi2,
		props.stationName1,
		props.stationName2,
	] );

	const GasesAQIHourly = () =>
	{
		if ( !aqi || !aqi.hourly || !aqi.hourly.gacious )
		{
			return;
		}
		const hourlyData = aqi && aqi.hourly && aqi.hourly.gacious;
		const duration = aqi && aqi.hourly && aqi.hourly.duration;
		const categories = hourlyData && hourlyData.map( ( entry ) => entry[ 0 ] );
		const values = hourlyData && hourlyData.map( ( entry ) => entry[ 1 ] );
		const paqiColors = aqi && aqi.hourly && aqi.hourly.aqi_colors;

		const hourlyData2 = aqi2 && aqi2.hourly && aqi2.hourly.gacious;
		const duration2 = aqi2 && aqi2.hourly && aqi2.hourly.duration;
		const categories2 = hourlyData2 && hourlyData2.map( ( entry ) => entry[ 0 ] );
		const values2 = hourlyData2 && hourlyData2.map( ( entry ) => entry[ 1 ] );
		const paqiColors2 = aqi2 && aqi2.hourly && aqi2.hourly.aqi_colors;

		const seriesData =
			values &&
			values.map( ( value, index ) => ( {
				y: value,
				color: paqiColors[ index ],
			} ) );

		const seriesData2 =
			values2 &&
			values2.map( ( value, index ) => ( {
				y: value,
				color: paqiColors2[ index ],
			} ) );

		const seriesArray = [
			{
				name: props.stationName1,
				data: seriesData,
				showInLegend: true,
				type: "column",
			},
		];

		if ( props.station2 && props.stationName2 )
		{
			seriesArray.push( {
				name: props.stationName2,
				data: seriesData2,
				showInLegend: true,
				type: "column",
			} );
		}

		const updatedOptions = {
			...options,
			colors: [ "#04253c", "#9F8B66" ],
			xAxis: {
				...options.xAxis,
				categories: categories,
				text: "Hours",
			},
			series: seriesArray,
			title: {
				text: `Air Quality Index (${ duration })`,
			},
		};

		setOptions( updatedOptions );
	};

	const GasesAQI8Hours = () =>
	{
		if ( !aqi || !aqi.hourly_8 || !aqi.hourly_8.gacious )
		{
			return;
		}

		const adjustOpacity = ( hexColor, opacity ) =>
		{
			if ( hexColor.length === 7 )
			{
				const rgb = parseInt( hexColor.substring( 1 ), 16 );
				const r = ( rgb >> 16 ) & 0xff;
				const g = ( rgb >> 8 ) & 0xff;
				const b = ( rgb >> 0 ) & 0xff;
				return `rgba(${ r },${ g },${ b },${ opacity })`;
			} else if ( hexColor.length === 9 )
			{
				const c = hexColor.substring( 1, 7 );
				const alphaHex = hexColor.substring( 7, 9 );
				const rgb = parseInt( c, 16 );
				const r = ( rgb >> 16 ) & 0xff;
				const g = ( rgb >> 8 ) & 0xff;
				const b = ( rgb >> 0 ) & 0xff;
				const alpha = parseInt( alphaHex, 16 ) / 255;
				return `rgba(${ r },${ g },${ b },${ opacity * alpha })`;
			}
			return hexColor;
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

		const extractColors = ( colors ) =>
		{
			const colorData = {};
			for ( const date in colors )
			{
				for ( const time in colors[ date ] )
				{
					const datetimeString = `${ date } ${ moment().year() } ${ time }`;
					const datetime = moment( datetimeString, 'MMM DD YYYY HH:mm' );
					const formattedDate = datetime.format( 'DD MMM' );
					const formattedTime = datetime.format( 'hh:mm A' );
					if ( !colorData[ formattedDate ] )
					{
						colorData[ formattedDate ] = {};
					}
					colorData[ formattedDate ][ formattedTime ] = colors[ date ][ time ];
				}
			}
			return colorData;
		};

		const hourlyData = aqi && aqi.hourly_8 && formatData( aqi.hourly_8.gacious ) || [];
		const hourlyData2 = aqi2 && aqi2.hourly_8 && formatData( aqi2.hourly_8.gacious ) || [];
		const aqiColors = aqi && aqi.hourly_8 && extractColors( aqi.hourly_8.aqi_colors ) || {};
		const aqiColors2 = aqi2 && aqi2.hourly_8 && extractColors( aqi2.hourly_8.aqi_colors ) || {};
		const duration = aqi && aqi.hourly_8 && aqi.hourly_8.duration;
		const duration2 = aqi2 && aqi2.hourly_8 && aqi.hourly_8.duration;

		const dates = [ ...new Set( hourlyData.map( ( item ) => item[ 0 ] ) ) ];
		const dates2 = [ ...new Set( hourlyData2.map( ( item ) => item[ 0 ] ) ) ];

		const combinedSeriesData = [ ...hourlyData ];
		const combinedSeriesData2 = [ ...hourlyData2 ];

		const allSeries = [];

		combinedSeriesData.forEach( ( [ date, time, value ] ) =>
		{
			const seriesName = `${ time } - ${ props.stationName2 && props.stationName1 }`;
			let seriesIndex = allSeries.findIndex( ( s ) => s.name === seriesName );

			if ( seriesIndex === -1 )
			{
				allSeries.push( {
					name: seriesName,
					data: Array( dates.length ).fill( 0 ),
					color: adjustOpacity( aqiColors[ date ][ time ], timeOpacity[ time ] || 1.0 ),
					stack: 'gas1'
				} );
				seriesIndex = allSeries.length - 1;
			}
			const dateIndex = dates.indexOf( date );
			if ( dateIndex !== -1 )
			{
				allSeries[ seriesIndex ].data[ dateIndex ] = value;
			}
		} );

		combinedSeriesData2.forEach( ( [ date, time, value ] ) =>
		{
			const seriesName = `${ time } - ${ props.stationName2 }`;
			let seriesIndex = allSeries.findIndex( ( s ) => s.name === seriesName );

			if ( seriesIndex === -1 )
			{
				allSeries.push( {
					name: seriesName,
					data: Array( dates2.length ).fill( 0 ),
					color: adjustOpacity( aqiColors2[ date ][ time ], timeOpacity[ time ] || 1.0 ),
					stack: 'gas2'
				} );
				seriesIndex = allSeries.length - 1;
			}
			const dateIndex = dates2.indexOf( date );
			if ( dateIndex !== -1 )
			{
				allSeries[ seriesIndex ].data[ dateIndex ] = value;
			}
		} );

		const updatedOptions = {
			...options,
			xAxis: {
				categories: [ ...new Set( [ ...dates, ...dates2 ] ) ],
				title: {
					text: 'Date',
				},
			},
			chart: {
				type: 'column',
			},
			series: allSeries,
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
			title: {
				text: `Air Quality Index (${ duration })`,
			},
		};

		setOptions( updatedOptions );
	};

	const GasesMonthly = () =>
	{
		if ( !aqi || !aqi.gacious )
		{
			return;
		}
		const hourlyData = aqi && aqi.gacious;
		const duration = aqi && aqi.duration;
		const categories = hourlyData && hourlyData.map( ( entry ) => entry[ 0 ] );
		const values = hourlyData && hourlyData.map( ( entry ) => entry[ 1 ] );
		const paqiColors = aqi && aqi.aqi_colors;

		const hourlyData2 = aqi2 && aqi2.gacious;
		const duration2 = aqi2 && aqi2.duration;
		const categories2 = hourlyData2 && hourlyData2.map( ( entry ) => entry[ 0 ] );
		const values2 = hourlyData2 && hourlyData2.map( ( entry ) => entry[ 1 ] );
		const paqiColors2 = aqi2 && aqi2.aqi_colors;

		const seriesData = values && values.map( ( value, index ) => ( {
			y: value,
			color: paqiColors[ index ],
		} ) );

		const seriesData2 =
			values2 &&
			values2.map( ( value, index ) => ( {
				y: value,
				color: paqiColors2[ index ],
			} ) );

		const seriesArray = [
			{
				name: props.stationName1,
				data: seriesData,
				showInLegend: true,
				type: "column",
			},
		];

		if ( props.station2 && props.stationName2 )
		{
			seriesArray.push( {
				name: props.stationName2,
				data: seriesData2,
				showInLegend: true,
				type: "column",
			} );
		}

		const updatedOptions = {
			...options,
			xAxis: {
				...options.xAxis,
				categories: categories,
				text: "Date",
			},
			series: seriesArray,
			title: {
				text: `Air Quality Index (${ duration })`,
			},
		};
		setOptions( updatedOptions );
	};

	const GasesAQIYearly = () =>
	{
		if ( !aqi || !aqi.yearly || !aqi.yearly.gacious )
		{
			return;
		}
		const yearlyData = aqi && aqi.yearly && aqi.yearly.gacious;
		const duration = aqi && aqi.yearly && aqi.yearly.duration;
		const categories = yearlyData && yearlyData.map( ( entry ) => entry[ 0 ] );
		const values = yearlyData && yearlyData.map( ( entry ) => entry[ 1 ] );
		const paqiColors = aqi && aqi.yearly && aqi.yearly.aqi_colors;

		const yearlyData2 = aqi2 && aqi2.yearly && aqi2.yearly.gacious;
		const duration2 = aqi2 && aqi2.yearly && aqi2.yearly.duration;
		const categories2 = yearlyData2 && yearlyData2.map( ( entry ) => entry[ 0 ] );
		const values2 = yearlyData2 && yearlyData2.map( ( entry ) => entry[ 1 ] );
		const paqiColors2 = aqi2 && aqi2.yearly && aqi2.yearly.aqi_colors;

		const seriesData =
			values &&
			values.map( ( value, index ) => ( {
				y: value,
				color: paqiColors[ index ],
			} ) );

		const seriesData2 =
			values2 &&
			values2.map( ( value, index ) => ( {
				y: value,
				color: paqiColors2[ index ],
			} ) );

		const seriesArray = [
			{
				name: props.stationName1,
				data: seriesData,
				showInLegend: true,
				type: "column",
			},
		];

		if ( props.station2 && props.stationName2 )
		{
			seriesArray.push( {
				name: props.stationName2,
				data: seriesData2,
				showInLegend: true,
				type: "column",
			} );
		}

		const updatedOptions = {
			...options,
			xAxis: {
				...options.xAxis,
				categories: categories,
			},
			series: seriesArray,
			title: {
				text: `Air Quality Index (${ duration })`,
			},
		};

		setOptions( updatedOptions );
	};

	const PMAQIHourly = () =>
	{
		if ( !aqi || !aqi.hourly || !aqi.hourly.particulate )
		{
			return;
		}
		const hourlyData = aqi && aqi.hourly && aqi.hourly.particulate;
		const categories = hourlyData && hourlyData.map( ( entry ) => entry[ 0 ] );
		const values = hourlyData && hourlyData.map( ( entry ) => entry[ 1 ] );
		const paqiColors = aqi && aqi.hourly && aqi.hourly.paqi_colors;
		const duration = aqi && aqi.hourly && aqi.hourly.duration;

		const hourlyData2 = aqi2 && aqi2.hourly && aqi2.hourly.particulate;
		const categories2 = hourlyData2 && hourlyData2.map( ( entry ) => entry[ 0 ] );
		const values2 = hourlyData2 && hourlyData2.map( ( entry ) => entry[ 1 ] );
		const paqiColors2 = aqi2 && aqi2.hourly && aqi2.hourly.paqi_colors;
		const duration2 = aqi2 && aqi2.hourly && aqi2.hourly.duration;

		const seriesData =
			values &&
			values.map( ( value, index ) => ( {
				y: value,
				color: paqiColors[ index ],
			} ) );

		const seriesData2 =
			values2 &&
			values2.map( ( value, index ) => ( {
				y: value,
				color: paqiColors2[ index ],
			} ) );

		const seriesArray = [
			{
				name: props.stationName1,
				data: seriesData,
				showInLegend: true,
				type: "column",
			},
		];

		if ( props.station2 && props.stationName2 )
		{
			seriesArray.push( {
				name: props.stationName2,
				data: seriesData2,
				showInLegend: true,
				type: "column",
			} );
		}

		const updatedOptions = {
			...options,
			xAxis: {
				...options.xAxis,
				categories: categories,
			},
			series: seriesArray,
			title: {
				text: `Air Quality Index (${ duration })`,
			},
		};

		setOptions( updatedOptions );
	};

	const PMAQI8Hours = () =>
	{
		if ( !aqi || !aqi.hourly_8 || !aqi.hourly_8.particulate )
		{
			return;
		}

		const adjustOpacity = ( hexColor, opacity ) =>
		{
			if ( hexColor.length === 7 )
			{
				const rgb = parseInt( hexColor.substring( 1 ), 16 );
				const r = ( rgb >> 16 ) & 0xff;
				const g = ( rgb >> 8 ) & 0xff;
				const b = ( rgb >> 0 ) & 0xff;
				return `rgba(${ r },${ g },${ b },${ opacity })`;
			} else if ( hexColor.length === 9 )
			{
				const c = hexColor.substring( 1, 7 );
				const alphaHex = hexColor.substring( 7, 9 );
				const rgb = parseInt( c, 16 );
				const r = ( rgb >> 16 ) & 0xff;
				const g = ( rgb >> 8 ) & 0xff;
				const b = ( rgb >> 0 ) & 0xff;
				const alpha = parseInt( alphaHex, 16 ) / 255;
				return `rgba(${ r },${ g },${ b },${ opacity * alpha })`;
			}
			return hexColor;
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

		const extractColors = ( colors ) =>
		{
			const colorData = {};
			for ( const date in colors )
			{
				for ( const time in colors[ date ] )
				{
					const datetimeString = `${ date } ${ moment().year() } ${ time }`;
					const datetime = moment( datetimeString, 'MMM DD YYYY HH:mm' );
					const formattedDate = datetime.format( 'DD MMM' );
					const formattedTime = datetime.format( 'hh:mm A' );
					if ( !colorData[ formattedDate ] )
					{
						colorData[ formattedDate ] = {};
					}
					colorData[ formattedDate ][ formattedTime ] = colors[ date ][ time ];
				}
			}
			return colorData;
		};

		const hourlyData = aqi && aqi.hourly_8 && formatData( aqi.hourly_8.particulate ) || [];
		const hourlyData2 = aqi2 && aqi2.hourly_8 && formatData( aqi2.hourly_8.particulate ) || [];
		const aqiColors = aqi && aqi.hourly_8 && extractColors( aqi.hourly_8.paqi_colors ) || {};
		const aqiColors2 = aqi2 && aqi2.hourly_8 && extractColors( aqi2.hourly_8.paqi_colors ) || {};
		const duration = aqi && aqi.hourly_8 && aqi.hourly_8.duration;
		const duration2 = aqi2 && aqi2.hourly_8 && aqi.hourly_8.duration;

		const dates = [ ...new Set( hourlyData.map( ( item ) => item[ 0 ] ) ) ];
		const dates2 = [ ...new Set( hourlyData2.map( ( item ) => item[ 0 ] ) ) ];

		const combinedSeriesData = [ ...hourlyData ];
		const combinedSeriesData2 = [ ...hourlyData2 ];

		const allSeries = [];

		combinedSeriesData.forEach( ( [ date, time, value ] ) =>
		{
			const seriesName = `${ time } - ${ props.stationName2 && props.stationName1 }`;
			let seriesIndex = allSeries.findIndex( ( s ) => s.name === seriesName );

			if ( seriesIndex === -1 )
			{
				allSeries.push( {
					name: seriesName,
					data: Array( dates.length ).fill( 0 ),
					color: adjustOpacity( aqiColors[ date ][ time ], timeOpacity[ time ] || 1.0 ),
					stack: 'gas1'
				} );
				seriesIndex = allSeries.length - 1;
			}
			const dateIndex = dates.indexOf( date );
			if ( dateIndex !== -1 )
			{
				allSeries[ seriesIndex ].data[ dateIndex ] = value;
			}
		} );

		combinedSeriesData2.forEach( ( [ date, time, value ] ) =>
		{
			const seriesName = `${ time } - ${ props.stationName2 }`;
			let seriesIndex = allSeries.findIndex( ( s ) => s.name === seriesName );

			if ( seriesIndex === -1 )
			{
				allSeries.push( {
					name: seriesName,
					data: Array( dates2.length ).fill( 0 ),
					color: adjustOpacity( aqiColors2[ date ][ time ], timeOpacity[ time ] || 1.0 ),
					stack: 'gas2'
				} );
				seriesIndex = allSeries.length - 1;
			}
			const dateIndex = dates2.indexOf( date );
			if ( dateIndex !== -1 )
			{
				allSeries[ seriesIndex ].data[ dateIndex ] = value;
			}
		} );

		const updatedOptions = {
			...options,
			xAxis: {
				categories: [ ...new Set( [ ...dates, ...dates2 ] ) ],
				title: {
					text: 'Date',
				},
			},
			chart: {
				type: 'column',
			},
			series: allSeries,
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
			title: {
				text: `Air Quality Index (${ duration })`,
			},
		};

		setOptions( updatedOptions );
	};

	const PMMonthly = () =>
	{
		if ( !aqi || !aqi.particulate )
		{
			return;
		}
		const hourlyData = aqi && aqi.particulate;
		const duration = aqi && aqi.duration;
		const categories = hourlyData && hourlyData.map( ( entry ) => entry[ 0 ] );
		const values = hourlyData && hourlyData.map( ( entry ) => entry[ 1 ] );
		const paqiColors = aqi && aqi.paqi_colors;

		const hourlyData2 = aqi2 && aqi2.particulate;
		const duration2 = aqi2 && aqi2.duration;
		const categories2 = hourlyData2 && hourlyData2.map( ( entry ) => entry[ 0 ] );
		const values2 = hourlyData2 && hourlyData2.map( ( entry ) => entry[ 1 ] );
		const paqiColors2 = aqi2 && aqi2.paqi_colors;

		const seriesData =
			values &&
			values.map( ( value, index ) => ( {
				y: value,
				color: paqiColors[ index ],
			} ) );

		const seriesData2 =
			values2 &&
			values2.map( ( value, index ) => ( {
				y: value,
				color: paqiColors2[ index ],
			} ) );

		const seriesArray = [
			{
				name: props.stationName1,
				data: seriesData,
				showInLegend: true,
				type: "column",
			},
		];

		if ( props.station2 && props.stationName2 )
		{
			seriesArray.push( {
				name: props.stationName2,
				data: seriesData2,
				showInLegend: true,
				type: "column",
			} );
		}

		const updatedOptions = {
			...options,
			xAxis: {
				...options.xAxis,
				categories: categories,
			},
			series: seriesArray,
			title: {
				text: `Air Quality Index (${ duration })`,
			},
		};
		setOptions( updatedOptions );
	};

	const PMAQIYearly = () =>
	{
		if ( !aqi || !aqi.yearly || !aqi.yearly.particulate )
		{
			return;
		}
		const yearlyData = aqi && aqi.yearly && aqi.yearly.particulate;
		const categories = yearlyData && yearlyData.map( ( entry ) => entry[ 0 ] );
		const values = yearlyData && yearlyData.map( ( entry ) => entry[ 1 ] );
		const duration = aqi && aqi.yearly && aqi.yearly.duration;
		const paqiColors = aqi && aqi.yearly && aqi.yearly.paqi_colors;

		const yearlyData2 = aqi2 && aqi2.yearly && aqi2.yearly.particulate;
		const categories2 = yearlyData2 && yearlyData2.map( ( entry ) => entry[ 0 ] );
		const values2 = yearlyData2 && yearlyData2.map( ( entry ) => entry[ 1 ] );
		const duration2 = aqi2 && aqi2.yearly && aqi2.yearly.duration;
		const paqiColors2 = aqi2 && aqi2.yearly && aqi2.yearly.paqi_colors;

		const seriesData =
			values &&
			values.map( ( value, index ) => ( {
				y: value,
				color: paqiColors[ index ],
			} ) );

		const seriesData2 =
			values2 &&
			values2.map( ( value, index ) => ( {
				y: value,
				color: paqiColors2[ index ],
			} ) );

		const seriesArray = [
			{
				name: props.stationName1,
				data: seriesData,
				showInLegend: true,
				type: "column",
			},
		];

		if ( props.station2 && props.stationName2 )
		{
			seriesArray.push( {
				name: props.stationName2,
				data: seriesData2,
				showInLegend: true,
				type: "column",
			} );
		}

		const updatedOptions = {
			...options,
			xAxis: {
				...options.xAxis,
				categories: categories,
			},
			series: seriesArray,
			title: {
				text: `Air Quality Index (${ duration })`,
			},
		};

		setOptions( updatedOptions );
	};

	return (
		<div id="barChart">
			<HighchartsReact highcharts={ Highcharts } options={ options } />
		</div>
	);
}
