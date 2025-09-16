import React, { useEffect, useState } from "react";
import { api_url, username, password } from "../../Variables";
import { useParams, useLocation } from 'react-router-dom';
import Highcharts from "highcharts/highstock";
import HcMore from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
HcMore( Highcharts );

export default function WindChart (  )
{
    const location = useLocation();
    const searchParams = new URLSearchParams( location.search );
    const station1 = searchParams.get( 'station1' );
    const station2 = searchParams.get( 'station2' );
    const [ wind, setWind ] = useState( "" );
    const [ wind2, setWind2 ] = useState( "" );
    const [ stationData, setStationData ] = useState( "" );
    const [ stationData2, setStationData2 ] = useState( "" );
    const [ units, setUnits ] = useState( "" );
    const [ stationName1, setStationName1 ] = useState( "" );
    const [ stationName2, setStationName2 ] = useState( "" );
    const [ windCheckedItems, setWindCheckedItems ] = useState( ["ws"] );
    const [ stats, setStats ] = useState( "daily" );

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

        subtitle: {
            // text: "Source: or.water.usgs.gov",
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

    function getTime ( hour )
    {
        return hour >= 12 ? "PM" : "AM";
    }

    useEffect( () =>
    {
        selectedWindHandler();
        StationData();
        GasesData();
    }, [ station1, station2] );

    useEffect( () =>
    {
        if ( wind !== "" && stats === "8hourly")
        {
            GetChartWind8Hours();
        } else if ( wind !== "" && stats === "daily" )
        {
            GetChartWindDaily();
        } else if ( wind !== "" && stats === "monthly" )
        {
            GetChartWindMonthly();
        }
    }, [
        wind,
        wind2,
        stats,
        station1,
        station2,
        stationName1,
        stationName2,
        windCheckedItems
    ] );

    const handleWindCheckboxChange = ( event ) =>
    {
        const value = event.target.value;
        if ( event.target.checked )
        {
            setWindCheckedItems( [ ...windCheckedItems, value ] );
        } else
        {
            setWindCheckedItems( windCheckedItems.filter( ( item ) => item !== value ) );
        }
    };

    const GasesData = async () =>
    {
        if ( station1 )
        {
            const requestOptions = {
                method: "GET",
                redirect: "follow",
                headers: {
                    "Authorization": "Basic " + btoa( `${ username }:${ password }` ),
                },
            };

            fetch( api_url + `gases-new?station=${ station1 }`, requestOptions )
                .then( ( response ) => response.json() )
                .then( ( result ) =>
                {
                    const list = Object.keys( result ).filter(
                        ( key ) =>
                            !key.startsWith( "PM" ) &&
                            key !== "hourly" &&
                            key !== "units" &&
                            key !== "hourly_8"
                    );
                    setUnits( result.units );
                } )
                .catch( ( error ) => console.error( error ) );
        }
        if ( station2 )
        {
            const requestOptions = {
                method: "GET",
                redirect: "follow",
                headers: {
                    "Authorization": "Basic " + btoa( `${ username }:${ password }` ),
                },
            };

            fetch( api_url + `gases-new?station=${ station2 }`, requestOptions )
                .then( ( response ) => response.json() )
                .then( ( result ) =>
                {
                    const list = Object.keys( result ).filter(
                        ( key ) =>
                            !key.startsWith( "PM" ) &&
                            key !== "hourly" &&
                            key !== "units" &&
                            key !== "hourly_8"
                    );
                    setUnits( result.units );
                } )
                .catch( ( error ) => console.error( error ) );
        }

    };

    const StationData = () =>
    {
        if ( station1 )
        {
            const formdata = new FormData();
            formdata.append( "station_id", station1 );

            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow",
                headers: {
                    "Authorization": "Basic " + btoa( `${ username }:${ password }` ),
                },
            };

            fetch( api_url + "get_station_data", requestOptions )
                .then( ( response ) => response.json() )
                .then( ( result ) =>
                {
                    setStationData( result );
                    setStationName1( result.station_name );
                } )
                .catch( ( error ) => console.error( error ) );
        }
        if ( station2 )
        {
            const formdata = new FormData();
            formdata.append( "station_id", station2 );

            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow",
                headers: {
                    "Authorization": "Basic " + btoa( `${ username }:${ password }` ),
                },
            };

            fetch( api_url + "get_station_data", requestOptions )
                .then( ( response ) => response.json() )
                .then( ( result ) =>
                {
                    setStationData2( result );
                    setStationName2( result.station_name );
                } )
                .catch( ( error ) => console.error( error ) );
        }
    };

    const selectedWindHandler = () =>
    {
        if ( station1 !== "" )
        {
            const requestOptions = {
                method: "GET",
                redirect: "follow",
                headers: {
                    "Authorization": "Basic " + btoa( `${ username }:${ password }` ),
                },
            };

            fetch( api_url + `get_graphs?station=${ station1 }`, requestOptions )
                .then( ( response ) => response.json() )
                .then( ( result ) =>
                {
                    setWind( result );
                    console.log(result);
                } )
                .catch( ( error ) => console.error( error ) );
        } else if ( station1 === "" )
        {
            setWind( "" );
        }

        if ( station2 !== "" )
        {
            const requestOptions = {
                method: "GET",
                redirect: "follow",
                headers: {
                    "Authorization": "Basic " + btoa( `${ username }:${ password }` ),
                },
            };

            fetch( api_url + `get_graphs?station=${ station2 }`, requestOptions )
                .then( ( response ) => response.json() )
                .then( ( result ) =>
                {
                    setWind2( result );
                } )
                .catch( ( error ) => console.error( error ) );
        } else if ( station2 === "" )
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

        const filteredWind = windCheckedItems
            ? windCheckedItems.filter(
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
                    wind.hourly_8 &&
                    wind.hourly_8.matrological[ data ].reduce( ( acc, [ time, speed ] ) =>
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
                        name: station2
                            ? `${ customSeriesNames[ data ] }: ${ stationName1 }`
                            : customSeriesNames[ data ],
                        data: groupedData[ speed ].map( ( hour24 ) => ( {
                            x: parseInt( speed ),
                            y: hour24,
                        } ) ),
                        color: customSeriesColors[ data ],
                    } );
                } );
                if ( wind2 && wind2.hourly_8 )
                {
                    const groupedData2 =
                        wind2 &&
                        wind2.hourly_8 &&
                        wind2.hourly_8.matrological[ data ].reduce( ( acc, [ time, speed ] ) =>
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
                            name: `${ customSeriesNames[ data ] }: ${ stationName2 }`,
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

                const speedData =
                    wind && wind.hourly_8 && wind.hourly_8.matrological[ data ];
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
                                this.y.toFixed( 2 ) +
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
                    wind.hourly_8 &&
                    wind.hourly_8.matrological[ data ].reduce( ( acc, [ time, direction ] ) =>
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
                    wind2.hourly_8 &&
                    wind2.hourly_8.matrological[ data ].reduce( ( acc, [ time, direction ] ) =>
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
                        name: station2
                            ? `${ customSeriesNames[ data ] }: ${ stationName1 }`
                            : direction,
                        data: groupedData[ direction ].map( ( hour24 ) => [
                            directions.indexOf( direction ),
                            hour24,
                        ] ),
                        color: customSeriesColors[ data ],
                    } );
                } );

                if ( wind2 && wind2.hourly_8 )
                {
                    Object.keys( groupedData2 ).forEach( ( direction ) =>
                    {
                        wdSeriesData2.push( {
                            name: `${ customSeriesNames[ data ] }: ${ stationName2 }`,
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

    const GetChartWindDaily = () =>
    {
        if ( !wind || !wind.hourly || !wind.hourly.matrological )
        {
            return;
        }

        const duration = wind && wind.hourly && wind.hourly.duration;

        const filteredWind = windCheckedItems
            ? windCheckedItems.filter( ( data ) =>
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
                        name: station2
                            ? `${ customSeriesNames[ data ] }: ${stationName1 }`
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
                            name: `${ customSeriesNames[ data ] }: ${ stationName2 }`,
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
                        name: station2
                            ? `${ customSeriesNames[ data ] }: ${ stationName1 }`
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
                            name: `${ customSeriesNames[ data ] }: ${ stationName2 }`,
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

        const filteredWind = windCheckedItems
            ? windCheckedItems.filter(
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
            return Date.UTC( 2023, monthIndex, parseInt( day ) ); // Convert to UTC timestamp
        };

        filteredWind.forEach( ( data ) =>
        {
            if ( data === "ws" )
            {
                wsSeriesData1.push( {
                    name: station2
                        ? `${ customSeriesNames[ data ] }: ${ stationName1 }`
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
                        name: `${ customSeriesNames[ data ] }: ${ stationName2 }`,
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
                        acc[ direction ].push( [ timestamp, date ] ); // Store both timestamp and original date
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
                        acc[ direction ].push( [ timestamp, date ] ); // Store both timestamp and original date
                        return acc;
                    }, {} );

                Object.keys( groupedData ).forEach( ( direction ) =>
                {
                    wdSeriesData1.push( {
                        name: station2
                            ? `${ customSeriesNames[ data ] }: ${ stationName1 }`
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
                            name: `${ customSeriesNames[ data ] }: ${ stationName2 }`,
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

    const directions = Object.keys( directionToDegrees );

    return (
        <>
            <h1 className="text-primary text-center font-[600] sm:my-3 tab:my-6 sm:text-[1.6rem] sl:text-[4vw] lt:text-[1.6vw] lm:text-[2.8rem] tab:text-[3.4rem] py-[0.2vw] px-[1.2vw]">
                { stationData.station_name } ({ stationData.station_city })  { stationData2 && (
                    <>
                        {`& ${ stationData2.station_name }`}
                        { stationData2.station_city && ` (${ stationData2.station_city })` }
                    </>
                ) }
            </h1>
            <br />
            <div className="h-[3vw] w-full flex justify-around items-center sm:w-[80%] sl:w-[80%] sm:mx-auto lm:mx-auto tab:mx-auto">
                <button
                    onClick={ () =>
                    {
                        setStats( "daily" );
                    } }
                    className={ `inline-block relative sm:text-[1.2rem] lm:text-[2rem] tab:text-[2.2rem] sl:text-[2.2vw] lt:text-[0.9vw] bg-white text-primary border border-primary border-[0.12vw] sm:w-[32%] lm:w-[32%] tab:w-[32%] sl:w-[32%] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
                                ${ stats === "daily" ? "btn-bg text-white" : "" }` }
                >
                    Daily
                </button>
                <button
                    onClick={ () =>
                    {
                        setStats( "monthly" );
                    } }
                    className={ `inline-block relative sm:text-[1.2rem] lm:text-[2rem] tab:text-[2.2rem] sl:text-[2.2vw] lt:text-[0.9vw] bg-white text-primary border border-primary border-[0.12vw] sm:w-[32%] lm:w-[32%] tab:w-[32%] sl:w-[32%] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
                                ${ stats === "monthly" ? "btn-bg text-white" : "" }` }
                >
                    Monthly
                </button>
                <button
                    onClick={ () =>
                    {
                        setStats( "8hourly" );
                    } }
                    className={ `inline-block relative sm:text-[1.2rem] lm:text-[2rem] tab:text-[2.2rem] sl:text-[2.2vw] lt:text-[0.9vw] bg-white text-primary border border-primary border-[0.12vw] sm:w-[32%] lm:w-[32%] tab:w-[32%] sl:w-[32%] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
                                ${ stats === "8hourly" ? "btn-bg text-white" : "" }` }
                >
                    8 Hours
                </button>
            </div>
            <br />
            <table className="w-[70%] mx-auto">
                <tr>
                    <td>
                        <h5 className="font-[600] sm:text-[1.4rem] lm:text-[2rem] tab:text-[2.2rem] sl:text-[2.6vw] lt:text-[0.9vw]">
                            Wind Speed
                        </h5>
                    </td>
                    <td>
                        <h4 className="font-[600] sm:text-[1.4rem] lm:text-[2rem] tab:text-[2.2rem] sl:text-[2.6vw] lt:text-[0.8vw]">
                            { stationData.windspeed } { units && units.WS }
                        </h4>
                    </td>
                    <td>
                        <label className="inline-flex items-center cursor-pointer justify-center m-[0.2vw] my-[0.1vw] w-[100%] rounded">
                            <input
                                type="checkbox"
                                onChange={ handleWindCheckboxChange }
                                value="ws"
                                checked={
                                    windCheckedItems ? windCheckedItems.includes( "ws" ) : false
                                }
                                className="sr-only peer"
                            />
                            <div className="relative mt-[0.2vw] absolute left-[0.2vw] sm:w-[3rem] lm:w-[4rem] tab:w-[4rem] sl:w-[5vw] lt:w-[2.4vw] sm:h-[1.6rem] lm:h-[2rem] tab:h-[2.2rem] sl:h-[2.4vw] lt:h-[1vw] bg-gray-300 rounded-full peer sm:peer-checked:after:translate-x-[1.28rem] lm:peer-checked:after:translate-x-[2rem] tab:peer-checked:after:translate-x-[1.8rem] sl:peer-checked:after:translate-x-[2.2vw] lt:peer-checked:after:translate-x-[0.9vw] peer-checked:after:border-white after:content-[''] after:absolute sm:after:top-[0.06rem] lm:after:top-[0.3rem] tab:after:top-[0.24rem] sl:after:top-[0.2vw] after:start-[0.3vw] after:bg-white after:border-gray-300 after:border after:rounded-full sl:after:w-[2vw] sl:after:h-[2vw] lt:after:w-[0.8vw] lt:after:h-[0.8vw] sm:after:w-[1.4rem] sm:after:h-[1.4rem] tab:after:w-[1.6rem] tab:after:h-[1.6rem] after:transition-all peer-checked:bg-[#e7711b]"></div>
                        </label>
                    </td>
                </tr>
                <tr>
                    <td className="bg-white">
                        <h5 className="font-[600] sm:text-[1.4rem] lm:text-[2rem] tab:text-[2.2rem] sl:text-[2.6vw] lt:text-[0.9vw]">
                            Wind Dir
                        </h5>
                    </td>
                    <td className="bg-white">
                        <h4 className="font-[600] sm:text-[1.4rem] lm:text-[2rem] tab:text-[2.2rem] sl:text-[2.6vw] lt:text-[0.8vw]">
                            { stationData.winddirection } { units && units.WD }
                        </h4>
                    </td>
                    <td className="bg-white">
                        <label className="inline-flex items-center cursor-pointer justify-center m-[0.2vw] my-[0.1vw] w-[100%] rounded">
                            <input
                                type="checkbox"
                                onChange={ handleWindCheckboxChange }
                                value="wd"
                                checked={
                                    windCheckedItems ? windCheckedItems.includes( "wd" ) : false
                                }
                                className="sr-only peer"
                            />
                            <div className="relative mt-[0.2vw] absolute left-[0.2vw] sm:w-[3rem] lm:w-[4rem] tab:w-[4rem] sl:w-[5vw] lt:w-[2.4vw] sm:h-[1.6rem] lm:h-[2rem] tab:h-[2.2rem] sl:h-[2.4vw] lt:h-[1vw] bg-gray-300 rounded-full peer sm:peer-checked:after:translate-x-[1.28rem] lm:peer-checked:after:translate-x-[2rem] tab:peer-checked:after:translate-x-[1.8rem] sl:peer-checked:after:translate-x-[2.2vw] lt:peer-checked:after:translate-x-[0.9vw] peer-checked:after:border-white after:content-[''] after:absolute sm:after:top-[0.06rem] lm:after:top-[0.3rem] tab:after:top-[0.24rem] sl:after:top-[0.2vw] after:start-[0.3vw] after:bg-white after:border-gray-300 after:border after:rounded-full sl:after:w-[2vw] sl:after:h-[2vw] lt:after:w-[0.8vw] lt:after:h-[0.8vw] sm:after:w-[1.4rem] sm:after:h-[1.4rem] tab:after:w-[1.6rem] tab:after:h-[1.6rem] after:transition-all peer-checked:bg-[#6f42c1]"></div>
                        </label>
                    </td>
                </tr>
            </table>
            { windCheckedItems.length > 0 &&
            <>
                <div id="windChartMob">
                    <HighchartsReact highcharts={ Highcharts } options={ chartOptions } />
                </div>
            </>
            }
        </>
    );
}
