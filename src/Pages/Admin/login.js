import React, { useEffect, useState } from "react";
import { api_url, usernameAuth, passwordAuth } from "../../Variables";
import { useNavigate } from "react-router-dom";

function Login ()
{
	const [ email, setEmail ] = useState( "" );
	const [ password, setPassword ] = useState( "" );
	const [ error, setError ] = useState( false );
	const [ errorMessage, setErrorMessage ] = useState( "" );
	const authenticate = localStorage.getItem( "authenticate" );
	const token = localStorage.getItem( "token" );
	const [ isloading, setIsloading ] = useState( false );
	const navigate = useNavigate();

	useEffect( () =>
	{
		if ( !token && !authenticate )
		{
			navigate( "/rsg-air-quality/admin" );
		} else
		{
			navigate( "/rsg-air-quality/admin/users" );
		}
	}, [ token ] );

	const HandleLogIn = ( e ) =>
	{
		e.preventDefault();
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
		fetch( api_url + "admin_login", requestOptions )
			.then( ( response ) => response.json() )
			.then( ( result ) =>
			{
				if ( result.token )
				{
					localStorage.setItem( "token", result.token );
					localStorage.setItem( "authenticate", true );
					navigate( "/rsg-air-quality/admin/users" );
				} else
				{
					setError( true );
					setErrorMessage( result.message );
				}
				setIsloading( false );
			} )
			.catch( ( error ) =>
			{
				setIsloading( false );
				console.error( "error", error );
			} );
	};

	return (
		<div className="h-[100vh] w-full flex justify-center align-center">
			<div className="flex justify-center flex-col">
				<form
					onSubmit={ HandleLogIn }
					className="shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)] rounded-lg lt:px-[2vw] lt:py-[2vw] sm:px-[2rem] sm:py-[2rem] sm:w-[90vw] sm:h-[50vh] lm:px-[2rem] lm:py-[2rem] lm:w-[90vw] lm:h-[30vh] sl:px-[2rem] sl:py-[2rem] sl:w-[50vw] sl:h-[26vh] lt:w-[30vw] lt:h-[54vh]"
				>
					<h1 className="text-center sm:text-[2.2rem] lm:text-[2.6rem] sl:text-[3rem] lt:text-[2.2vw] font-[700] text-primary">
						Admin Login
					</h1>
					<br />
					<br />
					<div className="relative mb-6">
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
							className="bg-gray-50 sm:ml-[0.6rem] sm:text-[1.4rem] lm:ml-[0.6rem] tab:ml-[0.4rem] lm:text-[1.6rem] sl:text-[1.6rem] lt:text-[1.2vw] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full ps-10 p-2.5"
							placeholder="Enter your email"
							onChange={ ( e ) =>
							{
								setEmail( e.target.value );
							} }
							required
						/>
					</div>
					<div className="relative mb-6">
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
							type="password"
							className="bg-gray-50 sm:ml-[0.6rem] sm:text-[1.4rem] lm:ml-[0.6rem] tab:ml-[0.4rem] lm:text-[1.6rem] sl:text-[1.6rem] lt:text-[1.2vw] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full ps-10 p-2.5"
							placeholder="Enter your password"
							onChange={ ( e ) =>
							{
								setPassword( e.target.value );
							} }
							required
						/>
					</div>
					{ error && (
						<p className="sm:text-[1.2rem] text-[1vw] text-[red]">
							{errorMessage}
						</p>
					) }

					<br />

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
							"Login"
						) }
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
