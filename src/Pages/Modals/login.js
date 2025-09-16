import React, { useEffect, useState } from "react";
import { api_url, recaptcha, usernameAuth, passwordAuth } from "../../Variables";
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'
import ReCAPTCHA from 'react-google-recaptcha';

function Login ( props )
{
	const [ email, setEmail ] = useState( "" );
	const [ password, setPassword ] = useState( "" );
	const [ error, setError ] = useState( false );
	const [ errorMsg, setErrorMsg ] = useState( false );
	const userToken = sessionStorage.getItem( 'userToken' );
	const [ isloading, setIsloading ] = useState( false );
	const [ type, setType ] = useState( 'password' );
	const [ icon, setIcon ] = useState( eyeOff );
	const [ recaptchaToken, setRecaptchaToken ] = useState( null );
	const [ failedAttempts, setFailedAttempts ] = useState(
		parseInt( localStorage.getItem( "failedAttempts" ) ) || 0
	);
	const [ lockoutTime, setLockoutTime ] = useState(
		parseInt( localStorage.getItem( "lockoutTime" ) ) || null
	);

	useEffect( () =>
	{
		if ( lockoutTime )
		{
			const remainingTime = lockoutTime - Date.now();
			if ( remainingTime <= 0 )
			{
				setFailedAttempts( 0 );
				setLockoutTime( null );
				localStorage.removeItem( "failedAttempts" );
				localStorage.removeItem( "lockoutTime" );
			}
		}
	}, [ lockoutTime ] );

	useEffect( () =>
	{
		setFailedAttempts( 0 );
		setLockoutTime( null );
		localStorage.removeItem( "failedAttempts" );
		localStorage.removeItem( "lockoutTime" );
	}, [ email ] );

	const handleRecaptchaChange = ( token ) =>
	{
		setRecaptchaToken( token );
	};

	const reset = () =>
	{
		setEmail( "" );
		setPassword( "" );
		setError( false );
		setErrorMsg("");
	};

	useEffect( () =>
	{
		if ( !props.isVisible )
		{
			reset();
		}
	}, [ props.isVisible] );

	const handleToggle = () =>
	{
		if ( type === 'password' )
		{
			setIcon( eye );
			setType( 'text' )
		} else
		{
			setIcon( eyeOff )
			setType( 'password' )
		}
	}

	useEffect( () =>
	{
		if ( userToken !== null )
		{
			if ( props.down )
			{
				props.hide();
				Downloads();
			} else if ( props.rep )
			{
				props.error2();
				if ( props.reportHide )
				{
					props.setReport( false );
				} else
				{
					props.setReport( true );
				}
				setTimeout( () =>
				{
					props.hide();
				}, 0 ); 
			} else
			{
				props.hide();
			}
		}
	}, [ userToken, props ] );

	const HandleLogIn = ( e ) =>
	{
		e.preventDefault();
		if ( lockoutTime && Date.now() < lockoutTime )
		{
			setError( "Too many failed attempts. Please try again later." );
			return;
		}
		if ( recaptchaToken )
		{
		setIsloading( true );
		var formdata = new FormData();
		formdata.append( "email", email );
		formdata.append( "password", password );
		var requestOptions = {
			method: "POST",
			body: formdata,
			redirect: "follow",
			headers: {
				"Authorization": "Basic " + btoa( `${ usernameAuth }:${ passwordAuth }` ),
			},
		};
		fetch( api_url + "login", requestOptions )
			.then( ( response ) => response.json() )
			.then( ( result ) =>
			{
				console.log( "result", result )
				if ( result.token && result.user )
				{
					sessionStorage.setItem( 'userToken', result.token );
					props.token( result.token );
					props.hide();
					setEmail( "" );
					setPassword( "" );
					setError( false );
					setErrorMsg( "" );
					setFailedAttempts( 0 );
					localStorage.removeItem( "failedAttempts" );
					localStorage.removeItem( "lockoutTime" );
				} else if ( result.status === 1 )
				{
					props.setId( result.user_id );
					setError( true );
					setErrorMsg( result.message );
					setTimeout( () =>
					{
						props.forgot();
						props.hide();
					}, 5000 );
				} else
				{
					setError( true );
					const newFailedAttempts = failedAttempts + 1;
					setFailedAttempts( newFailedAttempts );
					localStorage.setItem( "failedAttempts", newFailedAttempts );
					if ( newFailedAttempts >= 5 )
					{
						const lockoutUntil = Date.now() + 60 * 60 * 1000; // Lock for 1 hour
						setLockoutTime( lockoutUntil );
						localStorage.setItem( "lockoutTime", lockoutUntil );
						setErrorMsg( "Too many failed attempts. Please try again in 1 hour." );
					} else
					{
						setErrorMsg( result.message );
					}
				}
				setIsloading( false );
			} )
			.catch( ( error ) =>
			{
				console.error( "Login request failed:", error );
				setIsloading( false );
			} );
		} else
		{
			setError( true );
			setErrorMsg( "Please complete the captcha." );
		}
	};

	const Downloads = () =>
	{
		setIsloading( true );
		const myHeaders = new Headers();
		myHeaders.append( "Authorization", `Basic ${ btoa( `${ usernameAuth }:${ passwordAuth }` ) }` );
		myHeaders.append( "Authorization", `Bearer ${ userToken }` );
		const formdata = new FormData();
		formdata.append( "from", props.frommonth );
		formdata.append( "to", props.tomonth );
		props.station.forEach( ( station ) =>
		{
			formdata.append( "station[]", station );
		} );
		props.param.forEach( ( parameter ) =>
		{
			formdata.append( "parameter[]", parameter );
		} );

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: formdata,
			redirect: "follow",
		};

		fetch( api_url + "download", requestOptions )
			.then( ( response ) => response.json() )
			.then( ( result ) =>
			{
				if ( result.status === 1 && result.message )
				{
					const fileUrl = result.message;
					fetch( fileUrl, {
						method: "GET",
						mode: "no-cors",
						headers: {
							Authorization: `Bearer ${ userToken }`,
						},
					} )
						.then( ( response ) => response.blob() )
						.then( ( blob ) =>
						{
							const url = window.URL.createObjectURL( blob );
							const link = document.createElement( "a" );
							link.href = result.message;
							link.download = result.message;
							document.body.appendChild( link );
							link.click();
							document.body.removeChild( link );
							window.URL.revokeObjectURL( url );
						} )
						.catch( ( error ) =>
							console.error( "Error downloading the file:", error )
						);
					setIsloading( false );
					props.hide();
				} else
				{
					props.hide();
					props.error();
					setIsloading( false );
				}
			} )
			.catch( ( error ) =>
			{
				console.error( error );
				setIsloading( false );
			} );
	};

	return (
		<div className="flex justify-center flex-col px-[2vw] py-[2vw]">
			<form onSubmit={ HandleLogIn }>
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
						type={ type }
						value={password}
						className="bg-gray-50 sm:ml-[0.6rem] sm:text-[1.4rem] lm:ml-[0.6rem] tab:ml-[0.4rem] lm:text-[1.6rem] sl:text-[1.6rem] lt:text-[1.2vw] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full ps-10 p-2.5"
						placeholder="Enter your password"
						onChange={ ( e ) =>
						{
							setPassword( e.target.value );
						} }
						required
					/>
					<span class="flex text-secondary justify-end mb-4 absolute top-3 right-2 cursor-pointer" onClick={ handleToggle }>
						<Icon icon={ icon } size={ 20 } />
					</span>
				</div>
				<div className="sm:text-[1.2rem] text-[1.2vw] mx-2 flex justify-end">
					<span onClick={ () =>
					{
						props.forgot();
						props.hide();
					} } className="underline ms-2 text-secondary font-medium cursor-pointer">Forgot password?</span>
				</div>
				<br />
				{ error && (
					<p className="sm:text-[1.2rem] text-[1vw] text-[red]">
						{errorMsg}
					</p>
				) }

				<div className="mx-auto w-[70%] my-4">
					<ReCAPTCHA
						sitekey={ recaptcha }
						onChange={ handleRecaptchaChange }
					/>
				</div>
				
				<button
					type="submit"
					disabled={isloading}
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
						"Login"
					) }
				</button>
				
				<div className="sm:text-[1.4rem] text-[1.6vw] mx-2">
					Don't have an account?
					<span onClick={ () =>
					{
						props.signUp();
						props.hide();
					} } className="underline ms-2 text-secondary font-medium cursor-pointer">Sign Up</span>
				</div>
			</form>
		</div>
	);
}

export default Login;
