import { useEffect, useState } from "react";
import { api_url } from "../../Variables";

function UpdateUser ( props )
{
	const [ name, setName ] = useState( "" );
	const [ email, setEmail ] = useState( "" );
	const [ designation, setDesignation ] = useState( "" );
	const [ data, setData ] = useState( 0 );
	const [ report, setReport ] = useState( 0 );
	const token = localStorage.getItem( "token" );
	const [ error, setError ] = useState( false );
	const [ errorMessage, setErrorMessage ] = useState( "" );
	const [ isloading, setIsloading ] = useState( false );
	const [ admin, setAdmin ] = useState( 0 );

	useEffect( () =>
	{
		setName( props.name );
		setEmail( props.email );
		setDesignation( props.designation );
		setData( props.data);
		setReport( props.report);
	}, [ props ] );

	const UpdateUsers = () =>
	{
		setIsloading( true );
		const myHeaders = new Headers();
		myHeaders.append( "Authorization", `Bearer ${ token }` );

		const formdata = new FormData();
		formdata.append( "user_id", props.id );
		formdata.append( "name", name );
		formdata.append( "email", email );
		formdata.append( "designation", designation );
		formdata.append( "make_admin", admin ? 1 : 0 );
		formdata.append( "data", data ? 1 : 0 );
		formdata.append( "report", report ? 1 : 0 );

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: formdata,
			redirect: "follow",
		};

		fetch( api_url + "admin/update_user", requestOptions )
			.then( ( response ) => response.json() )
			.then( ( result ) =>
			{
				if ( result.status === 1 )
				{
					props.success();
					props.hide();
					setError( false );
					setErrorMessage( "" );
					setIsloading( false );
				} else
				{
					setError( true );
					setErrorMessage( result.message );
					setIsloading( false );
				}
			} )
			.catch( ( error ) =>
			{
				console.error( error );
				setIsloading( false );
			} );
	};

	const handleAdmin = ( event ) =>
	{
		setAdmin( event.target.checked );
	};

	const handleData = ( event ) =>
	{
		setData( event.target.checked );
	};

	const handleReport = ( event ) =>
	{
		setReport( event.target.checked );
	};

	return (
		<div
			tabIndex="-1"
			aria-hidden="true"
			className={ `overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 z-[999999] justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full ${ props.show ? " visible" : "hidden"
				}` }
		>
			<div className="relative p-4 w-full mx-auto custom-width5 mt-[3vw]">
				<div className="relative bg-white rounded-md shadow custom-height5">
					<div className="flex items-center justify-between p-4 border-b rounded-t ">
						<h3 className="sm:text-[2.4rem] lm:text-[2.6rem] tab:text-[2.8rem] w-full text-center sl:text-[3.2vw] lt:text-[2.2vw] text-secondary font-semibold text-[#70747c]">
							Edit User
						</h3>
						<button
							type="button"
							className="text-gray-400 absolute top-[0.8vw] right-[0.4vw] bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
							onClick={ () =>
							{
								props.hide();
								setError( false );
								setErrorMessage( "" );
							} }
						>
							<svg
								className="w-5 h-5"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
								/>
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
					</div>
					<form
						className="px-[1.8vw] py-[1.2vw]"
						onSubmit={ ( e ) =>
						{
							e.preventDefault();
							UpdateUsers();
						} }
					>
						<div>
							<label
								className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw]"
								for="name"
							>
								Name:
							</label>
							<br />
							<input
								className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] mt-[0.4vw] w-full sm:p-[0.2rem] lm:p-[0.4rem] tab:p-[0.6rem] rounded border border-[#c7c7c7]"
								type="text"
								value={ name }
								onChange={ ( e ) =>
								{
									setName( e.target.value );
								} }
								placeholder="Enter your name"
								required
							/>
						</div>
						<br />
						<div>
							<label
								className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw]"
								for="name"
							>
								Email:
							</label>
							<br />
							<input
								className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] mt-[0.4vw] w-full sm:p-[0.2rem] lm:p-[0.4rem] tab:p-[0.6rem] rounded border border-[#c7c7c7]"
								type="email"
								value={ email }
								onChange={ ( e ) =>
								{
									setEmail( e.target.value );
								} }
								placeholder="Enter your email"
								required
							/>
						</div>
						<br />
						<div>
							<label
								className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw]"
								for="name"
							>
								Designation:
							</label>
							<br />
							<input
								className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] mt-[0.4vw] w-full sm:p-[0.2rem] lm:p-[0.4rem] tab:p-[0.6rem] rounded border border-[#c7c7c7]"
								type="text"
								value={ designation }
								onChange={ ( e ) =>
								{
									setDesignation( e.target.value );
								} }
								placeholder="Enter your designation"
								required
							/>
						</div>
						<br />
						<label
							className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw]"
							for="name"
						>
							Select user access rights:
						</label>
						<br />
						<div className="flex items-center justify-around mt-2">
							<div class="flex items-center mb-4">
								<input id="admin-checkbox" type="checkbox" checked={ admin } onChange={ handleAdmin } class="w-6 h-6 text-secondary bg-white text-2xl border-gray-300 rounded focus:ring-0" />
								<label for="admin-checkbox" class="ms-2 sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw]">Admin</label>
							</div>
							<div class="flex items-center mb-4">
								<input id="data-checkbox1" type="checkbox" checked={ data } onChange={ handleData } class="w-6 h-6 text-secondary bg-white text-2xl border-gray-300 rounded focus:ring-0" />
								<label for="data-checkbox1" class="ms-2 sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw]">Data Download</label>
							</div>
							<div class="flex items-center mb-4">
								<input id="report-checkbox1" type="checkbox" checked={ report } onChange={ handleReport } class="w-6 h-6 text-secondary bg-white text-2xl border-gray-300 rounded focus:ring-0" />
								<label for="report-checkbox1" class="ms-2 sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw]">Reports Download</label>
							</div>
						</div>
						{ error && (
							<h6 className="lt:text-[1vw] text-[red]">
								{errorMessage}
							</h6>
						) }

						<br />
						<button
							type="submit"
							disabled={ isloading }
							className="bg-secondary w-full text-white sm:text-[1.8rem] lm:text-[1.8rem] tab:text-[2.2rem] sl:text-[2vw] lt:text-[1.2vw] sm:p-[0.2rem] sl:p-[0.4vw] rounded mx-1"
						>
							{ isloading ? (
								<div role="status">
									<svg
										aria-hidden="true"
										className="w-8 h-8 text-gray-200 animate-spin fill-gray-600 lt:h-[2vw] lt:w-[1.8vw] sl:h-[1.8vw] sl:w-[3vw] sm:h-[2rem] sm:w-[2rem] mx-auto"
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
								"Update"
							) }
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
export default UpdateUser;
