import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api_url } from "../../Variables";
import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";

function AddReport ( props )
{
	const [ month, setMonth ] = useState( "" );
	const [ selectedDate, setSelectedDate ] = useState( "" );
	const fileInput = useRef( null );
	const [ isloading, setIsloading ] = useState( false );
	const [ error, setError ] = useState( false );
	const [ errorDesc, setErrorDesc ] = useState( false );
	const [ show, setShow ] = useState( "" );
	const token = localStorage.getItem( "token" );
	const [ emails, setEmails ] = useState( [] );
	const [ focused, setFocused ] = useState( false );
	const [ availableEmails, setAvailableEmails ] = useState( [] );
	const [ allEmails, setAllEmails ] = useState( [] );
	const [ showEmails, setShowEmails ] = useState( false );
	const [ showBtn, setShowBtn ] = useState( true );

	const handleEmailClick = ( email ) =>
	{
		setEmails( [ ...emails, email ] );
		setAvailableEmails( availableEmails.filter( ( e ) => e !== email ) );
	};

	const handleRemoveEmail = ( index ) =>
	{
		const removedEmail = emails[ index ];
		setEmails( emails.filter( ( _, i ) => i !== index ) );
		if (
			allEmails.includes( removedEmail ) &&
			!availableEmails.includes( removedEmail )
		)
		{
			setAvailableEmails( [ ...availableEmails, removedEmail ] );
		}
	};

	useEffect( () =>
	{
		setShow( props.show );
	}, [ props.show ] );

	useEffect( () =>
	{
		if ( availableEmails.length === 0 )
		{
			setShowEmails( false );
			setShowBtn( false );
		} else if ( showEmails === false )
		{
			setShowBtn( true );
		} else if ( showBtn === false )
		{
			setShowEmails( true );
		}
	}, [ availableEmails ] );

	const CreateReport = () =>
	{
		setIsloading( true );
		const myHeaders = new Headers();
		myHeaders.append( "Authorization", `Bearer ${ token }` );

		const formdata = new FormData();
		formdata.append( "month_year", selectedDate );
		if ( fileInput.current.files.length > 0 )
		{
			formdata.append( "file", fileInput.current.files[ 0 ] );
		} else
		{
			console.error( "No files selected" );
			return;
		}
		emails.forEach( ( e ) =>
		{
			formdata.append( "recepients[]", e );
		} );

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: formdata,
			redirect: "follow",
		};

		fetch( api_url + "admin/create_report", requestOptions )
			.then( ( response ) => response.json() )
			.then( ( result ) =>
			{
				if ( result.status === 1 )
				{
					setIsloading( false );
					setMonth( "" );
					setEmails( [] );
					fileInput.current.value = null;
					props.success();
					props.hide();
					setError( false );
					setErrorDesc( "" );
					setEmails( [] );
					GetEmails();
				} else
				{
					setError( true );
					setIsloading( false );
					setErrorDesc( result.message );
				}
			} )
			.catch( ( error ) => console.error( error ) );
	};

	const handleMonthChange = ( date ) =>
	{
		if ( date )
		{
			const formattedDate = format( date, "yyyy-MM" );
			const formattedDate2 = format( date, "MM-yyyy" );
			setMonth( formattedDate );
			setSelectedDate( formattedDate2 );
		}
	};

	const GetEmails = async () =>
	{
		const myHeaders = new Headers();
		myHeaders.append( "Authorization", `Bearer ${ token }` );

		const requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		fetch( api_url + "get_recepient_addresses", requestOptions )
			.then( ( response ) => response.json() )
			.then( ( result ) =>
			{
				if ( result.status === 1 )
				{
					setAvailableEmails( result.data );
					setAllEmails( result.data );
				}
			} )
			.catch( ( error ) => console.error( error ) );
	};

	useEffect( () =>
	{
		GetEmails();
	}, [] );

	return (
		<div
			tabIndex="-1"
			aria-hidden="true"
			className={ `overflow-y-auto overflow-x-hidden bg-[#000000ab] fixed top-0 right-0 left-0 z-[999999] justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full ${ show ? " visible" : "hidden"
				}` }
		>
			<div className="relative p-4 w-full mx-auto custom-width6 mt-[3vw]">
				<div className="relative bg-white rounded-md shadow custom-height6">
					<div className="flex items-center justify-between p-3 border-b rounded-t ">
						<h3 className="sm:text-[2.4rem] lm:text-[3rem] tab:text-[3.2rem] w-full text-center sl:text-[3vw] lt:text-[2.2vw] text-secondary font-semibold text-[#70747c]">
							Add Report
						</h3>
						<button
							type="button"
							className="text-gray-400 absolute top-[0.8vw] right-[0.4vw] bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
							onClick={ () =>
							{
								props.hide();
								setError( false );
								setErrorDesc( "" );
								setEmails( [] );
								GetEmails();
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
						onSubmit={ ( e ) =>
						{
							e.preventDefault();
							CreateReport();
						} }
						className="flex justify-center flex-col px-[2vw] py-[2vw]"
					>
						<div>
							<label
								className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw]"
								for="name"
							>
								Add Report:
							</label>
							<br />
							<input
								ref={ fileInput }
								className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] mt-[0.4vw] w-full sm:p-[0.2rem] lm:p-[0.4rem] tab:p-[0.6rem] lt:p-0 rounded border border-[#c7c7c7]"
								type="file"
								required
							/>
						</div>
						<br />
						<DatePicker
							showIcon
							selected={ month }
							className="sm:text-[1.4rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] lm:text-[1.6rem]"
							onChange={ handleMonthChange }
							dateFormat="MMMM yyyy"
							showMonthYearPicker
							placeholderText="Select Date"
							required
						/>
						<br />
						<ReactMultiEmail
							placeholder="Type Emails"
							emails={ emails }
							onChange={ ( _emails ) =>
							{
								setEmails( _emails );
							} }
							autoFocus={ true }
							onFocus={ () => setFocused( true ) }
							onBlur={ () => setFocused( false ) }
							getLabel={ ( email, index, removeEmail ) =>
							{
								return (
									<div data-tag key={ index }>
										<div data-tag-item>{ email }</div>
										<span
											data-tag-handle
											onClick={ () => handleRemoveEmail( index ) }
										>
											×
										</span>
									</div>
								);
							} }
						/>

						<div
							className={ `lt:text-[1vw] sm:text-[1.2rem] lm:text-[1.4rem] sl:text-[1.6vw] relative ${ showEmails ? "visible" : "hidden"
								}` }
						>
							<ul className="lt:max-h-[10vw] lt:min-h-[0] sm:mt-[1rem] lt:mt-[0.4vw] overflow-y-scroll border border-secondary rounded-md">
								<span
									className="absolute sm:text-[2rem] sm:top-[0.8rem] sm:right-[1rem] lt:top-[0.4vw] lt:right-[1vw] z-50 cursor-pointer "
									onClick={ () =>
									{
										setShowEmails( false );
										setShowBtn( true );
									} }
								>
									×
								</span>
								{ availableEmails.map( ( email, index ) => (
									<li
										key={ index }
										className="hover:bg-[#f6f6f6] lt:p-[0.2vw] cursor-pointer text-secondary"
										onClick={ () => handleEmailClick( email ) }
									>
										{ email }
									</li>
								) ) }
							</ul>
						</div>

						<div className={ `lt:text-[1vw] ${ showBtn ? "visible" : "hidden" }` }>
							<button
								type="button"
								onClick={ () =>
								{
									setShowEmails( true );
									setShowBtn( false );
								} }
								className="sm:mt-[1.4rem] lt:mt-[0.4vw] border-2 border-secondary bg-secondary lt:w-[8vw] text-white sm:text-[1.6rem] lm:text-[1.8rem] tab:text-[2rem] sl:text-[2vw] lt:text-[0.8vw] sm:p-[0.2rem] sl:p-[0.2vw] rounded"
							>
								Add Existing Emails
							</button>
						</div>
						{ error && (
							<h1 className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] text-[red]">
								{ errorDesc }
							</h1>
						) }

						<button
							type="submit"
							disabled={ isloading }
							className="mt-[2vw] border-2 border-secondary bg-secondary w-full text-white sm:text-[1.6rem] lm:text-[1.8rem] tab:text-[2rem] sl:text-[2vw] lt:text-[1.2vw] sm:p-[0.2rem] sl:p-[0.4vw] rounded"
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
								"Upload"
							) }
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
export default AddReport;
