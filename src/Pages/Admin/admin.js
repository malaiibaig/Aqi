import { useState, useEffect } from "react";
import AddUser from "./addUser";
import UpdateUser from "./updateUser";
import Nav from "./nav";
import { api_url } from "../../Variables";
import { useNavigate } from "react-router-dom";
import DeleteUser from "./delete";

function Admin ()
{
	const [ addUser, setAddUser ] = useState( false );
	const [ editUser, setEditUser ] = useState( false );
	const [ users, setUsers ] = useState( "" );
	const [ name, setName ] = useState( "" );
	const [ email, setEmail ] = useState( "" );
	const [ designation, setDesignation ] = useState( "" );
	const [ report, setReport ] = useState( "" );
	const [ data, setData ] = useState( "" );
	const [ deleteR, setDeleteR ] = useState( false );
	const [ id, setId ] = useState( "" );
	const authenticate = localStorage.getItem( "authenticate" );
	const token = localStorage.getItem( "token" );
	const navigate = useNavigate();
	const [ userCreated, setUserCreated ] = useState( false );
	const [ userEdited, setUserEdited ] = useState( false );
	const [ userDeleted, setUserDeleted ] = useState( false );
	const [ currentPage, setCurrentPage ] = useState( 1 );
	const [ initialItemsPerPage ] = useState( 10 );
	const[ itemsPerPage, setItemsPerPage ] = useState( initialItemsPerPage );
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const [ searchQuery, setSearchQuery ] = useState( '' );

	const filteredItems = users && users.filter( item =>
		item.name.toLowerCase().includes( searchQuery.toLowerCase() )
	);

	const currentItems = filteredItems.slice( indexOfFirstItem, indexOfLastItem );
	const paginate = ( pageNumber ) => setCurrentPage( pageNumber );
	const totalPages = Math.ceil( filteredItems.length / itemsPerPage );

	const handleItemsPerPageChange = ( event ) =>
	{
		setItemsPerPage( Number( event.target.value ) );
		setCurrentPage( 1 );
	};

	const handleSearchChange = ( event ) =>
	{
		setSearchQuery( event.target.value );
		setCurrentPage( 1 );
	};

	const highlightMatch = ( text, query ) =>
	{
		if ( !query ) return text;
		const parts = text.split( new RegExp( `(${ query })`, 'gi' ) );
		return parts.map( ( part, index ) =>
			part.toLowerCase() === query.toLowerCase() ? <span key={ index } className="bg-yellow-300">{ part }</span> : part
		);
	};
	
	useEffect( () =>
	{
		if ( !token && !authenticate )
		{
			navigate( "/rsg-air-quality/admin" );
		} else
		{
			navigate( "/rsg-air-quality/admin/users" );
		}
	}, [ token, authenticate, navigate ] );

	useEffect( () =>
	{
		ViewAll();
	}, [ userCreated, userEdited, userDeleted ] );

	const ViewAll = () =>
	{
		const myHeaders = new Headers();
		myHeaders.append( "Authorization", `Bearer ${ token }` );

		const requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		fetch( api_url + "admin/show_all_users", requestOptions )
			.then( ( response ) => response.json() )
			.then( ( result ) =>
			{
				if ( result.status === 1 )
				{
					setUsers( result.data );
				} else
				{
					setUsers("");
				}
			} )
			.catch( ( error ) => console.error( error ) );
	};

	return (
		<div>
			<Nav />
			<h1 className="sm:text-[3rem] lm:text-[3.4rem] tab:text-[3.6rem] sl:text-[3.6vw] lt:text-[3vw] font-[600] text-primary text-center sm:mt-[0.4rem] sl:mt-[1vw]">
				Users
			</h1>
			<br />

			{ userCreated && (
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
						User created successfully.
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

			{ userEdited && (
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
						User updated successfully.
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

			{ userDeleted && (
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
						User deleted successfully.
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

			<div className="sm:overflow-scroll sl:min-h-[40rem] sl:max-h-auto sl:w-[90%] sm:w-[90%] border border-[#c7c7c7] mx-auto rounded sm:p-[1rem] sl:p-[1.4vw]">
				<div className="flex justify-between">
					<div className="flex items-center">
						<h1 className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:mr-[1rem] sl:mr-[2vw]">
							Search:{ " " }
						</h1>
						<input
							className="sm:text-[1.4rem] sm:p-[0.2rem] lm:p-[0.4rem] lm:text-[1.8rem] tab:text-[1.8rem]  sl:text-[1.8vw] lt:text-[1.2vw] mt-[0.4vw] w-full sl:p-[0.6vw] rounded border border-[#c7c7c7]"
							type="text"
							value={ searchQuery }
							onChange={ handleSearchChange }
						/>
					</div>
					<div>
						<button
							type="button"
							onClick={ () =>
							{
								setAddUser( true );
							} }
							className="bg-secondary sm:p-[0.2rem] sl:p-[0.2vw] rounded-md"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="white"
								className="bi bi-person-fill-add sm:w-[3rem] sm:h-[3rem] lm:w-[4rem] lm:h-[4rem] sl:w-[4vw] sl:h-[4vw] lt:w-[3vw] lt:h-[3vw]"
								viewBox="0 0 16 16"
							>
								<path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"></path>
								<path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"></path>
							</svg>
						</button>
					</div>
				</div>
				<br />
				<div>
					<select value={ itemsPerPage }
						onChange={ handleItemsPerPageChange } className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem]  sl:text-[1.8vw] lt:text-[1.2vw] sl:p-[0.2vw] rounded border border-[#c7c7c7]">
						<option value="10">10</option>
						<option value="25">25</option>
						<option value="50">50</option>
					</select>
					<span className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem]  sl:text-[1.8vw] lt:text-[1.2vw] sm:ms-[0.5rem] sl:ms-[0.5vw]">
						Entries per page
					</span>
				</div>
				<br />
				<table className="w-[100%] border border-[#c7c7c7] border-collapse">
					<thead className="bg-primary text-white font-[700]">
						<tr>
							<td className="sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem]  sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
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
								Data Access
							</td>
							<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
								Report Access
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
								<tr>
									<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
										{ index + 1 + ( currentPage - 1 ) * itemsPerPage }
									</td>
									<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
										{ highlightMatch( n.name, searchQuery ) }
									</td>
									<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
										{ highlightMatch( n.email, searchQuery ) }
									</td>
									<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
										{ highlightMatch( n.designation, searchQuery ) }
									</td>
									<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
										{ n.data === 0 ? "False" : "True" }
									</td>
									<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
										{ n.report === 0 ? "False" : "True" }
									</td>
									<td className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.8vw] lt:text-[1.2vw] sm:p-[0.6rem] sl:p-[0.6vw] border border-[#c7c7c7]">
										<button
											className="sl:m-[0.4vw]"
											onClick={ () =>
											{
												setEditUser( true );
												setId( n.id );
												setName( n.name );
												setEmail( n.email );
												setDesignation( n.designation );
												setData( n.data );
												setReport( n.report );
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
												setDeleteR( true );
												setId( n.id );
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
									</td>
								</tr>
							) ) }
					</tbody>
				</table>
				<br />
				<div className="flex justify-between items-center mt-4">
					<div className="sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[1.8rem]  sl:text-[1.8vw] lt:text-[1vw]">
						Showing { indexOfFirstItem + 1 } to { Math.min( indexOfLastItem, users.length ) } of { users.length } entries
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
			<br />
			<br />
			<AddUser
				show={ addUser }
				hide={ () =>
				{
					setAddUser( false );
				} }
				success={ () =>
				{
					setUserCreated( true );
					setTimeout( () =>
					{
						setUserCreated( false );
					}, 3000 );
				} }
			/>

			<UpdateUser
				show={ editUser }
				id={ id }
				name={ name }
				email={ email }
				designation={designation}
				report={report}
				data={data}
				hide={ () =>
				{
					setEditUser( false );
				} }
				success={ () =>
				{
					setUserEdited( true );
					setTimeout( () =>
					{
						setUserEdited( false );
					}, 3000 );
				} }
			/>

			<DeleteUser
				show={ deleteR }
				id={ id }
				hide={ () =>
				{
					setDeleteR( false );
				} }
				success={ () =>
				{
					setUserDeleted( true );
					setTimeout( () =>
					{
						setUserDeleted( false );
					}, 3000 );
				} }
			/>
		</div>
	);
}

export default Admin;
