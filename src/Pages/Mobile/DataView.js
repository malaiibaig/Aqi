import React, { useEffect, useState } from "react";
import { api_url, username, password } from "../../Variables";
import { useLocation } from 'react-router-dom';
import Table from "../Modals/table";

export default function DataView ()
{
    const location = useLocation();
    const searchParams = new URLSearchParams( location.search );
    const stationid = searchParams.get( 'stationid' );
    const parameter = searchParams.get( 'parameter' );
    const frommonth = searchParams.get( 'frommonth' )
    const tomonth = searchParams.get( 'tomonth' )
    const [ data, setData ] = useState( "" );
    const stationIdsArray = stationid && stationid.split( ',' ).map( id => parseInt( id ) );
    const parametersArray = parameter && parameter.split( ',' );

    const formatDate = ( dateString ) =>
    {
        const [ year, month ] = dateString.split( '-' );
        const date = new Date( year, parseInt( month ) - 1 );
        const formattedDate = date.toLocaleDateString( 'en-US', { month: 'short', year: 'numeric' } );
        return formattedDate;
    };

    const View = () =>
    {
        const formdata = new FormData();
        formdata.append( "from", frommonth );
        formdata.append( "to", tomonth );
        stationIdsArray.forEach( ( station, index ) =>
        {
            formdata.append( "station[]", station );
        } );
        parametersArray.forEach( ( parameter, index ) =>
        {
            formdata.append( "parameter[]", parameter );
        } );

        const requestOptions = {
            method: "POST",
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
                console.log(result);
                if ( result.status === 1 )
                {
                    setData( result ); 
                } else
                {
                    setData("");
                }
            } )
            .catch( ( error ) =>
            {
                console.error( error );
            } );
    };

    useEffect( () =>
    {
        console.log( stationIdsArray );
        View();
    }, [] )

    return (
        <div className="relative bg-white rounded-md shadow">
            <div className="p-0 border-b rounded-t sticky top-0 bg-white">
                <div className="flex justify-center items-end mx-auto">
                    <h3 className="flex sm:text-[2rem] lm:text-[2.8rem] sl:text-[3rem] lt:text-[1.8vw] font-semibold text-[#70747c]">
                        Data { formatDate( frommonth ) } to { formatDate( tomonth ) }
                    </h3>
                </div>
            </div>
            <div className="max-h-[92vh] overflow-x-auto overflow-y-auto">
                <Table
                    result={ data }
                    station={ stationIdsArray }
                    frommonth={ frommonth }
                    tomonth={ tomonth }
                    param={ parametersArray }
                />
            </div>
        </div>

    )
}