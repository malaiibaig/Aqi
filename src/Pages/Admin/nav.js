import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Nav ()
{
	const [ mobileNav, setMobileNav ] = useState( false );
	const navigate = useNavigate();

	const handleLogout = () =>
	{
		localStorage.removeItem( "token" );
		localStorage.removeItem( "authenticate" );
		navigate( "/rsg-air-quality/admin" );
	};

	return (
		<nav className="bg-primary sticky sl:top-0 sm:top-0 tab:top-0 lt:top-0 z-50 lt:h-[4vw] sl:h-[8vw] tab:h-[6rem] sm:h-[4rem] lm:h-[5.6rem] flex items-center shadow-md">
			<div className="flex flex-wrap items-center justify-between flex-start w-[90%] mx-auto pt-[0.1vw]">
				<div className="flex">
					<button
						type="button"
						className=" sm:inline-flex lm:inline-flex mx-auto text-white bg-primary text-[1.2rem] z-[50] items-center w-8 h-8 justify-center rounded-lg sl:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
						onClick={ () =>
						{
							setMobileNav( ( prev ) => !prev );
						} }
					>
						<span className="sr-only">Open main menu</span>
						<svg
							className="w-3 h-3 lm:w-8 lm:h-8 sm:h-6 sm:w-6 mx-auto"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 17 14"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M1 1h15M1 7h15M1 13h15"
							/>
						</svg>
					</button>
					<div className="block w-auto flex items-center" id="navbar-default">
						<ul className="font-[600] flex-row space-x-2 rtl:space-x-reverse mt-0 border-0 sm:hidden lm:hidden sl:flex">
							<li>
								<a
									href="/rsg-air-quality/admin/users"
									className="anchor tracking-wide p-[0.2vw] ms-[1vw] me-[1vw] block text-white sl:text-[1.6vw] lt:text-[1vw] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
								>
									USERS
								</a>
							</li>
							<li>
								<a
									href="/rsg-air-quality/admin/reports"
									className="anchor tracking-wide p-[0.2vw] me-[1vw] block text-white sl:text-[1.6vw] lt:text-[1vw] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
								>
									REPORTS
								</a>
							</li>
							<li>
								<a
									href="/rsg-air-quality/admin/requests"
									className="anchor tracking-wide p-[0.2vw] me-[1vw] block text-white sl:text-[1.6vw] lt:text-[1vw] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
								>
									REQUESTS
								</a>
							</li>
						</ul>
					</div>
				</div>
				{ mobileNav && (
					<ul className="z-50 absolute sm:flex flex-col lm:flex sm:top-[3.8rem] lm:top-[4.8rem] tab:top-[6rem] sl:hidden bg-primary hidden text-center font-[600] justify-center items-start p-[1.4rem] w-[100vw] left-0">
						<li>
							<a
								href="/rsg-air-quality/admin/users"
								className="anchor tracking-wide p-[0.4rem] ms-[1vw] me-[1vw] block text-white sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
							>
								USERS
							</a>
						</li>
						<li>
							<a
								href="/rsg-air-quality/admin/reports"
								className="anchor tracking-wide p-[0.4rem] ms-[1vw] me-[1vw] block text-white sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
							>
								REPORTS
							</a>
						</li>
						<li>
							<a
								href="/rsg-air-quality/admin/requests"
								className="anchor tracking-wide p-[0.4rem] ms-[1vw] me-[1vw] block text-white sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
							>
								REQUESTS
							</a>
						</li>
						<li>
							<a
								href="#"
								className="anchor tracking-wide p-[0.4rem] ms-[1vw] me-[1vw] block text-white sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
								onClick={ handleLogout }
							>
								LOG OUT
							</a>
						</li>
					</ul>
				) }
				<div className="flex">
					<div className="block w-auto flex items-center" id="navbar-default">
						<ul className="font-[600] flex-row space-x-2 rtl:space-x-reverse mt-0 border-0 sm:hidden lm:hidden sl:flex">
							<li>
								<a
									href="#"
									className="anchor tracking-wide p-[0.2vw] ms-[1vw] me-[1vw] block text-white sl:text-[1.6vw] lt:text-[1vw] font-[600] hover:text-secondary transition ease-in delay-180 mt-1"
									onClick={ handleLogout }
								>
									LOG OUT
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
}
