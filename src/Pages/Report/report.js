import { useEffect, useState } from "react";
import AddReport from "./addReport";
import EditReport from "./editReport";
import { api_url } from "../../Variables";
import DeleteReport from "./delete";
import Nav from "../Admin/nav";
import { useNavigate } from "react-router-dom";

function Report ()
{
	const [ add, setAdd ] = useState( false );
	const [ edit, setEdit ] = useState( false );
	const [ deleteR, setDeleteR ] = useState( false );
	const [ report, setReport ] = useState( "" );
	const [ id, setId ] = useState( "" );
	const [ month, setMonth ] = useState( "" );
	const [ file, setFile ] = useState( "" );
	const [ selectedDate, setSelectedDate ] = useState( "" );
	const authenticate = localStorage.getItem( "authenticate" );
	const token = localStorage.getItem( "token" );
	const navigate = useNavigate();
	const [ reportCreated, setreportCreated ] = useState( false );
	const [ reportEdited, setreportEdited ] = useState( false );
	const [ reportDeleted, setreportDeleted ] = useState( false );
	const [ currentPage, setCurrentPage ] = useState( 1 );
	const [ initialItemsPerPage ] = useState( 10 );
	const [ itemsPerPage, setItemsPerPage ] = useState( initialItemsPerPage );
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	
	const currentItems = report.slice( indexOfFirstItem, indexOfLastItem );
	const paginate = ( pageNumber ) => setCurrentPage( pageNumber );
	const totalPages = Math.ceil( report.length / itemsPerPage );

	useEffect( () =>
	{
		if ( !token && !authenticate )
		{
			navigate( "/rsg-air-quality/admin" );
		} else
		{
		}
	}, [ token ] );

	useEffect( () =>
	{
		ViewAll();
	}, [ reportCreated, reportEdited, reportDeleted ] );

	const ViewAll = () =>
	{
		const myHeaders = new Headers();
		myHeaders.append( "Authorization", `Bearer ${ token }` );

		const requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		fetch( api_url + "admin/show_all_reports", requestOptions )
			.then( ( response ) => response.json() )
			.then( ( result ) =>
			{
				if ( result.status === 1 )
				{
					setReport( result.data );
				}
			} )
			.catch( ( error ) => console.error( error ) );
	};

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	function formatDate ( month, year )
	{
		return `${ months[ month - 1 ] } ${ year }`;
	}

	return (
		<div>
			<Nav />
			<h1 className="sm:text-[2.4rem] lm:text-[2.8rem] tab:text-[3rem] sl:text-[3.6vw] lt:text-[3vw] font-[600] text-primary text-center sm:mt-[0.4rem] sl:mt-[1vw]">
				Reports
			</h1>
			<br />{ " " }
			{ reportCreated && (
				<div
					id="toast-success"
					className="flex items-center p-4 mb-4 text-gray-500 bg-white rounded-lg shadow fixed top-[4.2vw] right-[5vw] z-50 lt:w-[20vw] lt:h-[4vw]"
					role="alert"
				>
					<div className="inline-flex items-center justify-center flex-shrink-0 lt:w-[2.6vw] lt:h-[2.6vw] text-green-500 bg-green-100 rounded-lg">
						<svg
							className="lt:w-[1.6vw] lt:h-[1.6vw]"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
						</svg>
						<span className="sr-only">Check icon</span>
					</div>
					<div className="ms-3 text-[1vw] font-normal">
						Report created successfully.
					</div>
					<button
						type="button"
						className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
						data-dismiss-target="#toast-success"
						aria-label="Close"
					>
						<span className="sr-only">Close</span>
						<svg
							className="w-4 h-4"
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
					</button>
				</div>
			) }
			{ reportEdited && (
				<div
					id="toast-success"
					className="flex items-center p-4 mb-4 text-gray-500 bg-white rounded-lg shadow fixed top-[4.2vw] right-[5vw] z-50 lt:w-[20vw] lt:h-[4vw]"
					role="alert"
				>
					<div className="inline-flex items-center justify-center flex-shrink-0 lt:w-[2.6vw] lt:h-[2.6vw] text-green-500 bg-green-100 rounded-lg">
						<svg
							className="lt:w-[1.6vw] lt:h-[1.6vw]"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
						</svg>
						<span className="sr-only">Check icon</span>
					</div>
					<div className="ms-3 text-[1vw] font-normal">
						Report updated successfully.
					</div>
					<button
						type="button"
						className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
						data-dismiss-target="#toast-success"
						aria-label="Close"
					>
						<span className="sr-only">Close</span>
						<svg
							className="w-4 h-4"
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
					</button>
				</div>
			) }
			{ reportDeleted && (
				<div
					id="toast-success"
					className="flex items-center p-4 mb-4 text-gray-500 bg-white rounded-lg shadow fixed top-[4.2vw] right-[5vw] z-50 lt:w-[20vw] lt:h-[4vw]"
					role="alert"
				>
					<div className="inline-flex items-center justify-center flex-shrink-0 lt:w-[2.6vw] lt:h-[2.6vw] text-green-500 bg-green-100 rounded-lg">
						<svg
							className="lt:w-[1.6vw] lt:h-[1.6vw]"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
						</svg>
						<span className="sr-only">Check icon</span>
					</div>
					<div className="ms-3 text-[1vw] font-normal">
						Report deleted successfully.
					</div>
					<button
						type="button"
						className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
						data-dismiss-target="#toast-success"
						aria-label="Close"
					>
						<span className="sr-only">Close</span>
						<svg
							className="w-4 h-4"
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
					</button>
				</div>
			) }
			<div className="sl:min-h-[40rem] sl:max-h-auto sl:w-[90%] sm:w-[90%] border border-[#c7c7c7] mx-auto rounded sm:p-[1rem] sl:p-[1.4vw]">
				<div className="flex justify-between">
					<div>
						<button
							type="button"
							onClick={ () =>
							{
								setAdd( true );
							} }
							className="bg-secondary rounded-md text-white font-[600] sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]"
						>
							Add Report
						</button>
					</div>
				</div>

				<br />
				<table className="w-full border border-[#c7c7c7] border-collapse">
					<thead className="bg-primary text-white font-[700]">
						<tr>
							<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem]  sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
								Id
							</td>
							<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
								Reports
							</td>
							<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
								Date
							</td>
							<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
								Action
							</td>
						</tr>
					</thead>
					<tbody>
						{ currentItems &&
							currentItems.length > 0 &&
							currentItems.map( ( n, index ) => (
								<tr key={ index }>
									<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
										{ index + 1 }
									</td>
									<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
										{ n.file_path.substring( n.file_path.lastIndexOf( "/" ) + 1 ) }
									</td>
									<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
										{ formatDate( n.month, n.year ) }
									</td>
									<td className="flex sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
										<button
											className="sl:m-[0.4vw]"
											onClick={ () =>
											{
												setId( n.id );
												setMonth( `${ n.year }-${ n.month }` );
												setSelectedDate( `0${ n.month }-${ n.year }` );
												setFile( n.file_path );
												setEdit( true );
											} }
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="bi bi-pencil-square sm:w-[2rem] sm:h-[2rem] lm:w-[2.4rem] lm:h-[2.4rem] tab:w-[2.8rem] tab:h-[2.8rem] sl:w-[3vw] sl:h-[3vw] lt:w-[1.6vw] lt:h-[1.6vw]"
												fill="#2292fe"
												viewBox="0 0 16 16"
											>
												<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
												<path
													fill-rule="evenodd"
													d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
												></path>
											</svg>
										</button>
										<button
											className="sl:m-[0.4vw]"
											onClick={ () =>
											{
												setId( n.id );
												setMonth( `${ n.year }-${ n.month }` );
												setSelectedDate( `0${ n.month }-${ n.year }` );
												setFile( n.file_path );
												setDeleteR( true );
											} }
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="bi bi-trash3 sm:w-[2rem] sm:h-[2rem] lm:w-[2.4rem] lm:h-[2.4rem] tab:w-[2.8rem] tab:h-[2.8rem] sl:w-[3vw] sl:h-[3vw] lt:w-[1.6vw] lt:h-[1.6vw]"
												fill="red"
												viewBox="0 0 16 16"
											>
												<path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"></path>
											</svg>
										</button>

										<a className="sl:m-[0.4vw]" href={ n.file_path }>
											<svg
												fill="green"
												className="bi bi-trash3 sm:w-[3rem] sm:h-[3rem] lm:w-[3.4rem] lm:h-[3.4rem] tab:w-[3.8rem] tab:h-[3.8rem] sl:w-[4.2vw] sl:h-[4.2vw] lt:w-[2.2vw] lt:h-[2.2vw]"
												version="1.1"
												id="Layer_1"
												viewBox="0 0 100 100"
												enableBackground="new 0 0 100 100"
											>
												<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
												<g
													id="SVGRepo_tracerCarrier"
													strokeLinecap="round"
													strokeLinejoin="round"
												></g>
												<g id="SVGRepo_iconCarrier">
													{ " " }
													<g>
														{ " " }
														<path d="M58.741,55.019L52.5,61.01V39.881c0-1.104-0.896-2-2-2s-2,0.896-2,2v21.908l-6.52-6.771c-0.78-0.781-1.922-0.781-2.703,0 s-0.719,2.047,0.062,2.828l9.825,9.795c0.375,0.375,0.899,0.586,1.43,0.586s1.047-0.211,1.422-0.586l0.147-0.143 c0.173-0.126,0.326-0.277,0.451-0.451l9.203-9.201c0.781-0.781,0.656-2.047-0.125-2.828C60.914,54.237,59.521,54.237,58.741,55.019 z"></path>{ " " }
														<path d="M76.791,37.795c-1.252,0-2.365,0.347-3.347,0.652c-0.246,0.076-0.487,0.151-0.722,0.217 c-4.002-9.179-13.133-15.237-23.221-15.237c-12.673,0-23.236,9.248-25.049,21.467c-1.082-0.213-2.162-0.32-3.228-0.32 c-9.694,0-17.287,7.136-17.287,16.488c0,9.324,7.593,16.438,17.287,16.438h55.566c11.562,0,20.621-8.554,20.621-19.716 C97.412,46.469,88.354,37.795,76.791,37.795z M76.791,73.5H21.225c-7.575,0-13.287-5.239-13.287-12.438 c0-7.229,5.712-12.583,13.287-12.583c1.289,0,2.616,0.257,3.886,0.651l0.443,0.177c0.593,0.204,1.251,0.13,1.772-0.22 c0.521-0.353,0.847-0.923,0.879-1.552c0.569-11.278,9.924-20.11,21.296-20.11c8.961,0,17.025,5.68,20.068,14.133 c0.285,0.793,1.113,1.323,1.957,1.323c1.131,0,2.18-0.326,3.105-0.614c0.779-0.243,1.514-0.471,2.158-0.471 c9.32,0,16.621,6.917,16.621,15.989C93.412,66.703,86.111,73.5,76.791,73.5z"></path>{ " " }
													</g>{ " " }
												</g>
											</svg>
										</a>
									</td>
								</tr>
							) ) }
					</tbody>
				</table>
				<br />
				<div className="flex justify-between">
					<div className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem]  sl:text-[1.8vw] lt:text-[1vw]">
						Showing { indexOfFirstItem + 1 } to { Math.min( indexOfLastItem, report.length ) } of { report.length } entries
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
			<AddReport
				show={ add }
				hide={ () =>
				{
					setAdd( false );
				} }
				success={ () =>
				{
					setreportCreated( true );
					setTimeout( () =>
					{
						setreportCreated( false );
					}, 3000 );
				} }
			/>
			<EditReport
				show={ edit }
				id={ id }
				month={ month }
				selectedDate={ selectedDate }
				file={ file }
				hide={ () =>
				{
					setEdit( false );
				} }
				success={ () =>
				{
					setreportEdited( true );
					setTimeout( () =>
					{
						setreportEdited( false );
					}, 3000 );
				} }
			/>
			<DeleteReport
				show={ deleteR }
				id={ id }
				month={ month }
				selectedDate={ selectedDate }
				file={ file }
				hide={ () =>
				{
					setDeleteR( false );
				} }
				success={ () =>
				{
					setreportDeleted( true );
					setTimeout( () =>
					{
						setreportDeleted( false );
					}, 3000 );
				} }
			/>
		</div>
	);
}

export default Report;
