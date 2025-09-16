import React, { useEffect, useState } from "react";
import { api_url, usernameAuth, passwordAuth } from "../../Variables";

function Forgot ( props )
{
    const [ email, setEmail ] = useState( "" );
    const [ isloading, setIsloading ] = useState( false );
    const [ isloading2, setIsloading2 ] = useState( false );
    const [ enable, setEnable ] = useState( false );
    const [ otp, setOtp ] = useState( "" );
    const [ userId, setUserId ] = useState( "" );
    const [ error, setError ] = useState( false );
    const [ error2, setError2 ] = useState( false );
    const [ errorMessage, setErrorMessage ] = useState( false );

    const reset = () =>
    {
        setEmail( "" );
        setOtp( "" );
        setError( false );
        setEnable( false );
        setErrorMessage( false );
    };

    useEffect( () =>
    {
        if ( !props.isVisible )
        {
            reset();
        }
    }, [ props.isVisible ] );

    const HandleOtp = ( e ) =>
    {
        e.preventDefault();
        setIsloading( true );
        const formdata = new FormData();
        formdata.append( "user_id", userId );
        formdata.append( "email", email );
        formdata.append( "otp", otp );

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
            headers: {
                "Authorization": "Basic " + btoa( `${ usernameAuth }:${ passwordAuth }` ),
            },
        };

        fetch( api_url + "verify_otp", requestOptions )
            .then( ( response ) => response.json() )
            .then( ( result ) =>
            {
                if ( result.status === 1 )
                {
                    props.setId( result.user_id );
                    props.email( email );
                    props.otp( otp );
                    props.password();
                    props.hide();
                    setEmail( "" );
                    setOtp( "" );
                    setError2( false );
                    setEnable( false );
                    setErrorMessage( false );
                } else
                {
                    setError2( true );
                    setErrorMessage( result.message );
                }
                setIsloading( false );
            } )
            .catch( ( error ) =>
            {
                console.error( error );
                setIsloading( false );
            } );
    }

    const GetOTP = () =>
    {
        setIsloading2( true );
        const formdata = new FormData();
        formdata.append( "email", email );

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
            headers: {
                "Authorization": "Basic " + btoa( `${ usernameAuth }:${ passwordAuth }` ),
            },
        };

        fetch( api_url + "forget_password", requestOptions )
            .then( ( response ) => response.json() )
            .then( ( result ) =>
            {
                console.log( result );
                if ( result.status === 1 && result.user_id )
                {
                    setUserId( result.user_id );
                    setEnable( true );
                    setError( false );
                } else
                {
                    setError( true );
                    setErrorMessage( result.message );
                }
                setIsloading2( false );
            } )
            .catch( ( error ) =>
            {
                console.error( error );
                setIsloading2( false );
            } );
    }
    return (
        <div className="flex justify-center flex-col px-[2vw] py-[2vw]">
            <form onSubmit={ HandleOtp }>
                <div className="relative mb-3">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg
                            className="w-6 h-6 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 16"
                        >
                            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                            <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                        </svg>
                    </div>
                    <input
                        type="email"
                        value={ email }
                        className="bg-gray-50 sm:ml-[0.6rem] sm:text-[1.4rem] lm:ml-[0.6rem] tab:ml-[0.4rem] lm:text-[1.6rem] sl:text-[1.6rem] lt:text-[1.2vw] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-none focus:border-none block w-full ps-10 p-2.5"
                        placeholder="Enter your email"
                        onChange={ ( e ) =>
                        {
                            setEmail( e.target.value );
                        } }
                    />
                    <div className="sm:text-[1.2rem] text-[1.2vw] mx-2 flex justify-end mb-4 absolute top-3.5 right-0">
                        <span disabled={ isloading2 } onClick={ () =>
                        {
                            if ( email !== "" )
                            {
                                setError( false );
                                GetOTP();
                            } else
                            {
                                setError( true );
                                setErrorMessage( "Email is required." );
                            }

                        } }
                            className={ `ms-2 text-secondary font-medium ${ isloading2 ? 'cursor-default' : 'cursor-pointer' }` }>
                            { isloading2 ? (
                                <div role="status">
                                    <svg
                                        aria-hidden="true"
                                        className="w-8 h-8 text-gray-200 animate-spin fill-secondary lt:h-[1.4vw] lt:w-[1.4vw] sl:h-[3vw] sl:w-[3vw] sm:h-[2rem] sm:w-[2rem] mx-auto"
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
                                "Send OTP"
                            ) }</span>
                    </div>
                </div>
                { error && (
                    <p className="sm:text-[1.2rem] text-[1vw] text-[red] mb-3">
                        { errorMessage }
                    </p>
                ) }

                { enable &&
                    <div className="relative mb-3">
                        <input
                            type="text"
                            value={ otp }
                            className="bg-gray-50 sm:ml-[0.6rem] sm:text-[1.4rem] lm:ml-[0.6rem] tab:ml-[0.4rem] lm:text-[1.6rem] sl:text-[1.6rem] lt:text-[1.2vw] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-[30%] p-2.5 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            placeholder="Enter OTP"
                            onChange={ ( e ) =>
                            {
                                setOtp( e.target.value );
                            } }
                            required
                        />
                    </div> }
                
                { error2 && (
                    <p className="sm:text-[1.2rem] text-[1vw] text-[red] mb-3">
                        { errorMessage }
                    </p>
                ) }

                <br />
                <button
                    type="submit"
                    className="bg-secondary mx-auto sm:text-[1.4rem] sm:my-[0.8rem] lm:text-[1.8rem] sl:text-[2rem] lt:text-[1.4vw] w-[100%] p-[0.4vw] text-white rounded disabled:bg-gray-400"
                    disabled={ !enable }
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
                        "Submit"
                    ) }
                </button>
            </form>
        </div>
    );
}

export default Forgot;
