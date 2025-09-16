import React, { useEffect, useState } from "react";
import { api_url, usernameAuth, passwordAuth } from "../../Variables";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

function Password ( props )
{
    const [ confPassword, setConfPassword ] = useState( "" );
    const [ password, setPassword ] = useState( "" );
    const [ success, setSuccess ] = useState( false );
    const [ successMsg, setSuccessMsg ] = useState( "" );
    const [ error, setError ] = useState( false );
    const [ errorMsg, setErrorMsg ] = useState( "" );
    const [ isloading, setIsloading ] = useState( false );
    const [ type1, setType1 ] = useState( 'password' );
    const [ type2, setType2 ] = useState( 'password' );
    const [ icon1, setIcon1 ] = useState( eyeOff );
    const [ icon2, setIcon2 ] = useState( eyeOff );

    const reset = () =>
    {
        setPassword( "" );
        setConfPassword( "" );
        setSuccess( false );
        setSuccessMsg( "" );
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

    const handleToggle1 = () =>
    {
        if ( type1 === 'password' )
        {
            setIcon1( eye );
            setType1( 'text' )
        } else
        {
            setIcon1( eyeOff )
            setType1( 'password' )
        }
    }

    const handleToggle2 = () =>
    {
        if ( type2 === 'password' )
        {
            setIcon2( eye );
            setType2( 'text' )
        } else
        {
            setIcon2( eyeOff )
            setType2( 'password' )
        }
    }

    useEffect( () =>
    {
        console.log( "id", props.userId )
    }, [ props.userId ] )

    const requirements = [
        { label: "At least 8 characters long", valid: password.length >= 8 },
        { label: "Include both uppercase and lowercase letters", valid: /[A-Z]/.test( password ) && /[a-z]/.test( password ) },
        { label: "Use at least one number (0-9)", valid: /\d/.test( password ) },
        { label: "Include at least one special character (!@#$%^&*)", valid: /[!@#$%^&*]/.test( password ) },
        { label: "Avoid common words or sequences", valid: password !== "" && !/password|1234|qwerty/.test( password ) },
        { label: "Password and confirm password must match", valid: password !== "" && password === confPassword },
    ];


    const HandleChangePassword = ( e ) =>
    {
        e.preventDefault();
        setIsloading( true );
        var formdata = new FormData();
        formdata.append( "user_id", props.userId );
        formdata.append( "email", props.email );
        formdata.append( "otp", props.otp );
        formdata.append( "password", password );
        formdata.append( "password_confirmation", confPassword );
        var requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
            headers: {
                "Authorization": "Basic " + btoa( `${ usernameAuth }:${ passwordAuth }` ),
            },
        };
        fetch( api_url + "change_password", requestOptions )
            .then( ( response ) => response.json() )
            .then( ( result ) =>
            {
                console.log( "results", result );
                if ( result.status === 1 )
                {
                    setSuccess( true );
                    setSuccessMsg( result.message );
                    setError( false );
                    setErrorMsg( "" );
                    setTimeout( () =>
                    {
                        props.hide();
                        setConfPassword( "" );
                        setPassword( "" );
                        setSuccess( false );
                        setSuccessMsg( "" );
                        setError( false );
                        setErrorMsg( "" );
                    }, 3000 );
                } else
                {
                    setError( true );
                    setSuccess( false );
                    setErrorMsg( result.message );
                }
                setIsloading( false );
            } )
            .catch( ( error ) =>
            {
                setIsloading( false );
            } );
    };

    return (
        <div className="flex justify-center flex-col px-[2vw] py-[2vw]">
            <form onSubmit={ HandleChangePassword }>
                <div className="relative mb-3">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg
                            className="w-6 h-6 text-gray-500"
                            fill="currentColor"
                            version="1.1"
                            id="Layer_1"
                            viewBox="0 0 330 330"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                { " " }
                                <g id="XMLID_509_">
                                    { " " }
                                    <path
                                        id="XMLID_510_"
                                        d="M65,330h200c8.284,0,15-6.716,15-15V145c0-8.284-6.716-15-15-15h-15V85c0-46.869-38.131-85-85-85 S80,38.131,80,85v45H65c-8.284,0-15,6.716-15,15v170C50,323.284,56.716,330,65,330z M180,234.986V255c0,8.284-6.716,15-15,15 s-15-6.716-15-15v-20.014c-6.068-4.565-10-11.824-10-19.986c0-13.785,11.215-25,25-25s25,11.215,25,25 C190,223.162,186.068,230.421,180,234.986z M110,85c0-30.327,24.673-55,55-55s55,24.673,55,55v45H110V85z"
                                    ></path>{ " " }
                                </g>{ " " }
                            </g>
                        </svg>
                    </div>
                    <input
                        type={type1}
                        value={ password }
                        className="bg-gray-50 sm:ml-[0.6rem] sm:text-[1.4rem] lm:ml-[0.6rem] tab:ml-[0.4rem] lm:text-[1.6rem] sl:text-[1.6rem] lt:text-[1.2vw] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full ps-10 p-2.5"
                        placeholder="Enter new password"
                        onChange={ ( e ) =>
                        {
                            setPassword( e.target.value );
                        } }
                        required
                    />
                    <span class="flex text-secondary justify-end mb-4 absolute top-3 right-2 cursor-pointer" onClick={ handleToggle1 }>
                        <Icon icon={ icon1 } size={ 20 } />
                    </span>
                </div>

                <div className="relative mb-3">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg
                            className="w-6 h-6 text-gray-500"
                            fill="currentColor"
                            version="1.1"
                            id="Layer_1"
                            viewBox="0 0 330 330"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                { " " }
                                <g id="XMLID_509_">
                                    { " " }
                                    <path
                                        id="XMLID_510_"
                                        d="M65,330h200c8.284,0,15-6.716,15-15V145c0-8.284-6.716-15-15-15h-15V85c0-46.869-38.131-85-85-85 S80,38.131,80,85v45H65c-8.284,0-15,6.716-15,15v170C50,323.284,56.716,330,65,330z M180,234.986V255c0,8.284-6.716,15-15,15 s-15-6.716-15-15v-20.014c-6.068-4.565-10-11.824-10-19.986c0-13.785,11.215-25,25-25s25,11.215,25,25 C190,223.162,186.068,230.421,180,234.986z M110,85c0-30.327,24.673-55,55-55s55,24.673,55,55v45H110V85z"
                                    ></path>{ " " }
                                </g>{ " " }
                            </g>
                        </svg>
                    </div>
                    <input
                        type={ type2 }
                        value={ confPassword }
                        className="bg-gray-50 sm:ml-[0.6rem] sm:text-[1.4rem] lm:ml-[0.6rem] tab:ml-[0.4rem] lm:text-[1.6rem] sl:text-[1.6rem] lt:text-[1.2vw] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full ps-10 p-2.5"
                        placeholder="Confirm password"
                        onChange={ ( e ) =>
                        {
                            setConfPassword( e.target.value );
                        } }
                        required
                    />
                    <span class="flex text-secondary justify-end mb-4 absolute top-3 right-2 cursor-pointer" onClick={ handleToggle2 }>
                        <Icon icon={ icon2 } size={ 20 } />
                    </span>
                </div>
                <ul className="mt-6">
                    { requirements.map( ( req, index ) => (
                        <li key={ index } className="ml-2 mt-1 flex items-center text-sm text-gray-600 sm:text-[1.05rem] text-[1.1vw]">
                            { req.valid ? (
                                <FaCheck className="text-green-500 mr-2" />
                            ) : (
                                <FaTimes className="text-red-500 mr-2" />
                            ) }
                            { req.label }
                        </li>
                    ) ) }
                </ul>
                <br />
                { error && (
                    <p className="sm:text-[1.2rem] text-[1vw] text-[red]">
                        {errorMsg}
                    </p>
                ) }
                { success && (
                    <p className="sm:text-[1.2rem] text-[1vw] text-[green]">
                        {successMsg}
                    </p>
                ) }
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
                        "Submit"
                    ) }
                </button>
            </form>
        </div>
    );
}

export default Password;
