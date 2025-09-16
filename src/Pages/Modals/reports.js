import React, { useEffect, useState } from "react";
import { api_url } from "../../Variables";

export default function Reports ( props )
{
	const [ report, setReport ] = useState( "" );
	const userToken = sessionStorage.getItem( 'userToken' );

	useEffect( () =>
	{
		ViewAll();
	}, [ userToken ] );

	const ViewAll = () =>
	{
		if ( userToken !== null )
		{
			const myHeaders = new Headers();
			myHeaders.append( "Authorization", `Bearer ${ userToken }` );

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
					} else
					{
						console.log( "result", result );
						props.error3();
					}
				} )
				.catch( ( error ) => console.error( error ) );
		}
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
		<div className="flex justify-center flex-col px-[0.2vw] py-[0.8vw] overflow-y-auto" >
			<table className="border-collapse border border-gray-400 table-div w-full">
				<thead className="sticky sm:top-[4rem] lt:top-[4vw] bg-white z-50 shadow-md">
					<tr className="bg-primary text-white">
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
					{ report &&
						report.length > 0 &&
						report.map( ( n, index ) => (
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
									<a className="sl:m-[0.4vw]" href={ n.file_path } target="_blank">
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
		</div>
	);
}
