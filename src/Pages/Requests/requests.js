import { useEffect, useState } from "react";
import { api_url } from "../../Variables";
import Nav from "../Admin/nav";
import { useNavigate } from "react-router-dom";
import Accept from "./accept";

function Requests ()
{
    const [ requests, setRequests ] = useState( "" );
    const authenticate = localStorage.getItem( "authenticate" );
    const token = localStorage.getItem( "token" );
    const [ id, setId ] = useState( "" );
    const [ accept, setAccept ] = useState( false );
    const navigate = useNavigate();
    const [ currentPage, setCurrentPage ] = useState( 1 );
    const [ initialItemsPerPage ] = useState( 10 );
    const [ itemsPerPage, setItemsPerPage ] = useState( initialItemsPerPage );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = requests.slice( indexOfFirstItem, indexOfLastItem );
    const paginate = ( pageNumber ) => setCurrentPage( pageNumber );
    const totalPages = Math.ceil( requests.length / itemsPerPage );

    useEffect( () =>
    {
        if ( !token && !authenticate )
        {
            navigate( "/rsg-air-quality/admin" );
        } else
        {
            navigate( "/rsg-air-quality/admin/requests" );
            GetAllRequests();
        }
    }, [ token ] );

    const GetAllRequests = () =>
    {
        const myHeaders = new Headers();
        myHeaders.append( "Authorization", `Bearer ${ token }` );

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch( api_url + "admin/get_pending_signup_request_list", requestOptions )
            .then( ( response ) => response.json() )
            .then( ( result ) =>
            {
                if ( result.status === 1 )
                {
                    console.log( "requests", result.data );
                    setRequests( result.data )
                }
            } )
            .catch( ( error ) => console.error( error ) );
    }


    return (
        <div>
            <Nav />
            <h1 className="sm:text-[2.4rem] lm:text-[2.8rem] tab:text-[3rem] sl:text-[3.6vw] lt:text-[3vw] font-[600] text-primary text-center sm:mt-[0.4rem] sl:mt-[1vw]">
                Signup Requests
            </h1>
            <br />{ " " }
            <div className="sm:overflow-scroll sl:min-h-[40rem] sl:max-h-auto sl:w-[90%] sm:w-[90%] border border-[#c7c7c7] mx-auto rounded sm:p-[1rem] sl:p-[1.4vw]">
                <table className="w-full border border-[#c7c7c7] border-collapse">
                    <thead className="bg-primary text-white font-[700]">
                        <tr>
                            <td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem]  sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
                                Id
                            </td>
                            <td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
                                Name
                            </td>
                            <td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
                                Email
                            </td>
                            <td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
                                Designation
                            </td>
                            <td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
                                Action
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        { currentItems && currentItems.length > 0 && currentItems.map( ( n, index ) =>
                        (
                            <tr>
                                <td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
                                    { index + 1 }
                                </td>
                                <td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
                                    { n.name }
                                </td>
                                <td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
                                    { n.email }
                                </td>
                                <td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
                                    { n.designation }
                                </td>
                                <td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
                                    <button onClick={ () =>
                                    {
                                        setId( n.id );
                                        setAccept( true );
                                    } } type="button" class="px-3 py-1 text-lg m-1 font-medium text-center inline-flex items-center text-white bg-green-500 hover:bg-green-500 rounded-lg hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Accept
                                    </button>
                                    <button type="button" class="px-3 py-1 text-lg m-1 font-medium text-center inline-flex items-center text-white bg-red-600 hover:bg-red-600 rounded-lg hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
                <br />
                <div className="flex justify-between">
                    <div className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem]  sl:text-[1.8vw] lt:text-[1vw]">
                        Showing { indexOfFirstItem + 1 } to { Math.min( indexOfLastItem, requests.length ) } of { requests.length } entries
                    </div>
                    <div className="flex">
                        <button
                            className={ `bg-secondary text-white sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[2vw] lt:text-[1.2vw] sl:p-[0.2vw] sm:w-[6rem] lm:w-[10rem] tab:w-[8rem] sl:w-[7vw] rounded mx-1 ${ currentPage === 1 ? 'hidden' : '' }` }
                            onClick={ () => currentPage > 1 && paginate( currentPage - 1 ) }
                            disabled={ currentPage === 1 }
                        >
                            Prev
                        </button>

                        { currentPage > 2 && (
                            <button
                                className="bg-secondary text-white sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[2vw] lt:text-[1.2vw] rounded mx-1 px-4"
                                onClick={ () => paginate( 1 ) }
                            >
                                1
                            </button>
                        ) }

                        { currentPage > 3 && <span className="px-2">...</span> }

                        { currentPage > 1 && (
                            <button
                                className="bg-secondary text-white sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[2vw] lt:text-[1.2vw] rounded mx-1 px-4"
                                onClick={ () => paginate( currentPage - 1 ) }
                            >
                                { currentPage - 1 }
                            </button>
                        ) }

                        <button
                            className="bg-primary text-white sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[2vw] lt:text-[1.2vw] rounded mx-1 px-4"
                            disabled
                        >
                            { currentPage }
                        </button>

                        { currentPage < totalPages && (
                            <button
                                className="bg-secondary text-white sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[2vw] lt:text-[1.2vw] rounded mx-1 px-4"
                                onClick={ () => paginate( currentPage + 1 ) }
                            >
                                { currentPage + 1 }
                            </button>
                        ) }

                        { currentPage < totalPages - 2 && <span className="px-2">...</span> }

                        { currentPage < totalPages - 1 && (
                            <button
                                className="bg-secondary text-white sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[2vw] lt:text-[1.2vw] rounded mx-1 px-4"
                                onClick={ () => paginate( totalPages ) }
                            >
                                { totalPages }
                            </button>
                        ) }

                        <button
                            className={ `bg-secondary text-white sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[2vw] lt:text-[1.2vw] sl:p-[0.2vw] sm:w-[6rem] lm:w-[10rem] tab:w-[8rem] sl:w-[7vw] rounded mx-1 ${ currentPage === totalPages ? 'hidden' : '' }` }
                            onClick={ () => currentPage < totalPages && paginate( currentPage + 1 ) }
                            disabled={ currentPage === totalPages }
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <Accept show={ accept } id={ id } hide={ () =>
            {
                setAccept( false );
                GetAllRequests();
            } } />
        </div>
    );
}

export default Requests;
