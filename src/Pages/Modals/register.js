import React, { useEffect, useState } from "react";
import { api_url, recaptcha, usernameAuth, passwordAuth } from "../../Variables";
import ReCAPTCHA from 'react-google-recaptcha';

function Register (props)
{
    const [ name, setName ] = useState( "" );
    const [ email, setEmail ] = useState( "" );
    const [ designation, setDesignation ] = useState( "" );
    const [ isloading, setIsloading ] = useState( false );
    const [ error, setError ] = useState( false );
    const [ errorMsg, setErrorMsg ] = useState( false );
    const [ recaptchaToken, setRecaptchaToken ] = useState( null );

    const handleRecaptchaChange = ( token ) =>
    {
        console.log("recaptcha token",token)
        setRecaptchaToken( token );
    };

    const reset = () =>
    {
        setName( "" );
        setEmail( "" );
        setDesignation( "" );
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

    const HandleSignUp = ( e ) =>
    {
        e.preventDefault();
        
        if ( recaptchaToken )
        {
            setIsloading( true );
            
            const formdata = new FormData();
            formdata.append( "name", name );
            formdata.append( "email", email );
            formdata.append( "designation", designation );
            formdata.append( "g-recaptcha-response", recaptchaToken );

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
            headers: {
                "Authorization": "Basic " + btoa( `${ usernameAuth }:${ passwordAuth }` ),
            },
        };

        fetch( api_url + "signup", requestOptions )
            .then( ( response ) => response.json() )
            .then( ( result ) =>
            {
                if ( result.status === 1 )
                {
                    props.hide();
                    setName( "" );
                    setEmail( "" );
                    setDesignation( "" );
                    setError( false );
                    setErrorMsg( "" );
                } else
                {
                    setError( true );
                    if(result.errors){
                        setErrorMsg( result.errors );
                    } else if (result.error)
                    {
                        setErrorMsg( result.error );
                    }else{
                        setErrorMsg( result.message );
                    }
                }
                setIsloading(false);
                console.log( "SignUp",result ); 
            })
                .catch( ( error ) => console.error( error ) );
        } else
        {
            setError( true );
            setErrorMsg( "Please complete the captcha." );
        }
    };

    return (
        <div className="flex justify-center flex-col px-[2vw] py-[2vw]">
            <form onSubmit={ HandleSignUp }>
                <div className="relative mb-3">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg
                            className="w-6 h-6 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={ name }
                        className="bg-gray-50 sm:ml-[0.6rem] sm:text-[1.4rem] lm:ml-[0.6rem] tab:ml-[0.4rem] lm:text-[1.6rem] sl:text-[1.6rem] lt:text-[1.2vw] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full ps-10 p-2.5"
                        placeholder="Enter your name"
                        onChange={ ( e ) =>
                        {
                            setName( e.target.value );
                        } }
                        required
                    />
                </div>
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
                        value={email}
                        className="bg-gray-50 sm:ml-[0.6rem] sm:text-[1.4rem] lm:ml-[0.6rem] tab:ml-[0.4rem] lm:text-[1.6rem] sl:text-[1.6rem] lt:text-[1.2vw] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full ps-10 p-2.5"
                        placeholder="Enter your email"
                        onChange={ ( e ) =>
                        {
                            setEmail( e.target.value );
                        } }
                        required
                    />
                </div>
                <div className="relative mb-3">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg
                            className="w-6 h-6 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" stroke-width="2" />
                            <path d="M7 8h6M7 12h4" stroke-width="2" stroke-linecap="round" />
                            <circle cx="17" cy="10" r="3" stroke-width="2" />
                            <path d="M17 13v5l-1.5-1.5L14 18v-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={ designation }
                        className="bg-gray-50 sm:ml-[0.6rem] sm:text-[1.4rem] lm:ml-[0.6rem] tab:ml-[0.4rem] lm:text-[1.6rem] sl:text-[1.6rem] lt:text-[1.2vw] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full ps-10 p-2.5"
                        placeholder="Enter your designation"
                        onChange={ ( e ) =>
                        {
                            setDesignation( e.target.value );
                        } }
                        required
                    />
                </div>

                <br />
                { error && errorMsg && (
                    <div className="sm:text-[1.2rem] text-[1vw] text-[red]">
                        {typeof errorMsg === 'object' && errorMsg !== null ? (
                            // Handle structured error objects
                            Object.keys(errorMsg).map((key) => (
                                <div key={key}>
                                    {Array.isArray(errorMsg[key]) ? (
                                        errorMsg[key].map((msg, index) => (
                                            <p key={index}>{msg}</p>
                                        ))
                                    ) : (
                                        <p>{errorMsg[key]}</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>{errorMsg}</p>
                        )}
                    </div>
                )}

                <div className="mx-auto w-[70%] my-4">
                    <ReCAPTCHA
                        sitekey={ recaptcha }
                        onChange={ handleRecaptchaChange }
                    />
                </div>
                <button
                    type="submit"
                    disabled={ isloading }
                    className="bg-secondary mx-auto sm:text-[1.4rem] sm:my-[0.8rem] lm:text-[1.8rem] sl:text-[2rem] lt:text-[1.4vw] w-[100%] p-[0.4vw] text-white rounded"
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
                        "Register"
                    ) }
                </button>
            
            </form>

        
        </div>
    );
}

export default Register;
