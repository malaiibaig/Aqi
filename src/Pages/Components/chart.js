import { Fragment, useEffect, useRef, useState } from "react";
import Close from "../Svg/close";
import LineChart from "../Charts/linechart";
import BarChart from "../Charts/barchart";
import Modals from "../Modals/modals";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import MatChart from "../Charts/matchart";
import WindChart from "../Charts/windChart";
import { api_url, username, password } from "../../Variables";
import { get_gases1, get_gases2, get_home_data, get_station_data, get_station_list } from "../../lib/constants";

function Chart(props) {
	var primary = "#9F8B66";
	const [pollutant, setPollutant] = useState(true);
	const [air, setAir] = useState(false);
	const [mat, setMat] = useState(false);
	const [lineZoom, setLineZoom] = useState(false);
	const [barZoom, setBarZoom] = useState(false);
	const [matZoom, setMatZoom] = useState(false);
	const [windZoom, setWindZoom] = useState(false);
	const [lineChart, setLineChart] = useState(true);
	const [barChart, setBarChart] = useState(false);
	const [matChart, setMatChart] = useState(false);
	const [stationList, setStationList] = useState("");
	const [stationData, setStationData] = useState("");
	const [gasesList, setGasesList] = useState("");
	const [units, setUnits] = useState("");
	const [gasesCheckedItems, setGasesCheckedItems] = useState([]);
	const [matCheckedItems, setMatCheckedItems] = useState([]);
	const [windCheckedItems, setWindCheckedItems] = useState(['ws']);
	const [stationId, setStationId] = useState("");
	const [stationId2, setStationId2] = useState("");
	const [secondStation, setSecondStation] = useState(false);
	const [removeStation, setRemoveStation] = useState(false);
	const [stationHover, setStationHover] = useState("");
	const [stationName, setStationName] = useState("");
	const [stationName2, setStationName2] = useState("");
	const [stats, setStats] = useState("daily");
	const [isPrevDisabled, setIsPrevDisabled] = useState(true);
	const [isNextDisabled, setIsNextDisabled] = useState(false);
	const swiperRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	const componentRef = useRef(null);

	const Default = () => {
		setStationId(get_home_data.default_aqi.station);
	};


	const handlePrevClick = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slidePrev();
		}
	};

	const handleNextClick = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slideNext();
		}
	};

	const updateButtonsState = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			const swiper = swiperRef.current.swiper;
			setIsPrevDisabled(swiper.isBeginning);
			setIsNextDisabled(swiper.isEnd);
		}
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{
				threshold: 0.5,
			}
		);

		if (componentRef.current) {
			observer.observe(componentRef.current);
		}

		return () => {
			if (componentRef.current) {
				observer.unobserve(componentRef.current);
			}
		};
	}, []);

	useEffect(() => {
		console.log(props.mat);
		if (props.mat === true) {
			setPollutant(false);
			setAir(false);
			setMat(true);
			setLineChart(false);
			setBarChart(false);
			setMatChart(true);
		} else {
			setPollutant(true);
			setAir(false);
			setMat(false);
			setLineChart(true);
			setBarChart(false);
			setMatChart(false);
		}
	}, [props.mat]);

	useEffect(() => {
		if (isVisible) {
			StationNames();
			if (stationId && stationId !== "") {
				if (props.pollutant === "gas") {
					GasesData();
				} else if (props.pollutant === "pm") {
					PMData();
				}
			}
		}
	}, [isVisible]);

	useEffect(() => {
		if (isVisible) {
			setGasesCheckedItems("");
		}
	}, [isVisible, props.pollutant]);

	useEffect(() => {
		console.log("station id", stationId);
		if (isVisible && stationId && stationId !== "") {
			StationData();
			if (props.pollutant === "gas") {
				GasesData();
			} else if (props.pollutant === "pm") {
				PMData();
			}
		}
	}, [isVisible, stationId, props.pollutant, stationId2]);

	useEffect(() => {
		if (
			(isVisible && stationId === "" && stationId2 === "") ||
			(isVisible && stationId !== "" && stationId2 === "") ||
			(isVisible && stationId !== "" && stationId2 !== "")
		) {
			setStationId(props.station);
			setSecondStation(true);
			setRemoveStation(false);
		} else {
			Default();
		}
	}, [isVisible, props.station]);

	const StationNames = async () => {
		setStationList(get_station_list);
	};

	const StationData = () => {
		if (stationId) {
			setStationData(get_station_data);
			setStationName(get_station_data.station_name);
		}
		if (stationId2) {
			setStationData(get_station_data);
			setStationName2(get_station_data.station_name);
		}
	};

	const GasesData = async () => {
		console.log("Gases Data Id", stationId);
		if (stationId) {
			const list = Object.keys(get_gases1).filter(
				(key) =>
					!key.startsWith("PM") &&
					key !== "hourly" &&
					key !== "units" &&
					key !== "hourly_8" &&
					key !== "yearly"
			);
			setGasesList(list);
			setUnits(get_gases1.units);
		}
		if (stationId2) {
			const list = Object.keys(get_gases2).filter(
				(key) =>
					!key.startsWith("PM") &&
					key !== "hourly" &&
					key !== "units" &&
					key !== "hourly_8" &&
					key !== "yearly"
			);
			setGasesList(list);
			setUnits(get_gases2.units);
		}

	};

	const PMData = async () => {
		const list = Object.keys(get_gases1).filter((key) => key.startsWith("PM"));
		setGasesList(list);
		setUnits(get_gases1.units);
	};

	const handleChartChange = (p) => {
		if (p === "pc") {
			setPollutant(true);
			setAir(false);
			setMat(false);
			setLineChart(true);
			setBarChart(false);
			setMatChart(false);
		} else if (p === "air") {
			setPollutant(false);
			setAir(true);
			setMat(false);
			setLineChart(false);
			setBarChart(true);
			setMatChart(false);
		} else if (p === "md") {
			setPollutant(false);
			setAir(false);
			setMat(true);
			setLineChart(false);
			setBarChart(false);
			setMatChart(true);
		} else if (p === "guage") {
			setPollutant(false);
			setAir(false);
			setMat(false);
			setLineChart(false);
			setBarChart(false);
			setMatChart(false);
		}
	};

	const handleGasCheckboxChange = (event) => {
		const value = event.target.value;
		if (event.target.checked) {
			setGasesCheckedItems([...gasesCheckedItems, value]);
		} else {
			setGasesCheckedItems(gasesCheckedItems.filter((item) => item !== value));
		}
		console.log("gases", gasesCheckedItems);
	};

	const handleMatCheckboxChange = (event) => {
		setWindCheckedItems("");
		const value = event.target.value;
		if (event.target.checked) {
			setMatCheckedItems([...matCheckedItems, value]);
		} else {
			setMatCheckedItems(matCheckedItems.filter((item) => item !== value));
		}
	};

	const handleWindCheckboxChange = (event) => {
		setMatCheckedItems("");
		const value = event.target.value;
		if (event.target.checked) {
			setWindCheckedItems([...windCheckedItems, value]);
		} else {
			setWindCheckedItems(windCheckedItems.filter((item) => item !== value));
		}
	};

	const customSeriesColors = {
		NO2: "peer-checked:bg-[#349bdb]",
		O3: "peer-checked:bg-[#544fc5]",
		SO2: "peer-checked:bg-[#cb3e36]",
		NO: "peer-checked:bg-[#0c9450]",
		NOX: "peer-checked:bg-[#e7711b]",
		H2S: "peer-checked:bg-[#D568FB]",
		CO: "peer-checked:bg-[#d1bd3a]",
		CH4: "peer-checked:bg-[#04253c]",
		NMHC: "peer-checked:bg-[#8c365d]",
		THC: "peer-checked:bg-[#9F8B66]",
		PM1: "peer-checked:bg-[#544fc5]",
		PM10: "peer-checked:bg-[#0c9450]",
		PM25: "peer-checked:bg-[#349bdb]",
	};

	return (
		<div
			ref={componentRef}
			className={`charts bg-white absolute sm:min-h-[150%] sm:max-h-[150%] lm:min-h-[70rem] lm:max-h-[100%] tab:min-h-[90rem] tab:max-h-[100%] sl:min-h-[50%] sl:max-h-[94%] lt:min-h-[91.6%] lt:max-h-[94%] sm:w-[100vw] sl:w-[60vw] lt:w-[47vw] sm:top-[4rem] lm:top-[5.4rem] tab:top-[6rem] sl:top-[8vw] lt:top-[3.8vw] border border-[#e7e7e7] rounded-r-[0.8vw] ${props.show && componentRef ? "visible" : "hidden"
				}`}
		>
			<div className="relative flex sm:h-[3.6rem] sl:h-[4.4vw] lt:h-[3vw] lm:h-[4.2rem] tab:h-[5rem] border border-[#e7e7e7]">
				<h1 className="text-primary font-[600] sm:text-[2rem] sl:text-[2.8vw] lt:text-[1.6vw] lm:text-[2.4rem] tab:text-[3.2rem] py-[0.2vw] px-[1.2vw]">
					{stationData.station_name} ({stationData.station_city})
				</h1>
				<button
					className="absolute sm:top-[1rem] lt:top-[1vw] right-[0.6vw]"
					onClick={props.close}
				>
					<Close />
				</button>
			</div>
			<div className="flex border border-[#e7e7e7] items-center sm:h-[4rem] lm:h-[5rem] tab:h-[6rem] sl:h-[3.8vw] lt:h-[3.4vw] ">
				<svg
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
					fill={primary}
					className={`cursor-pointer review-swiper-button-prev sm:w-[3rem] sm:h-[3rem] lm:w-[4rem] lm:h[4rem] tab:w-[5rem] tab:h[5rem] sl:w-[3vw] sl:h-[3vw] lt:w-[2vw] lt:h-[2vw] ${isPrevDisabled ? "disabled" : ""
						}`}
					onClick={handlePrevClick}
				>
					<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
					<g
						id="SVGRepo_tracerCarrier"
						strokeLinecap="round"
						strokeLinejoin="round"
					></g>
					<g id="SVGRepo_iconCarrier">
						{" "}
						<title>arrowhead-left</title>{" "}
						<g id="Layer_2" data-name="Layer 2">
							{" "}
							<g id="invisible_box" data-name="invisible box">
								{" "}
								<rect width="48" height="48" fill="none"></rect>{" "}
							</g>{" "}
							<g id="icons_Q2" data-name="icons Q2">
								{" "}
								<path d="M20.8,24,31.4,13.4a1.9,1.9,0,0,0-.2-3,2.1,2.1,0,0,0-2.7.2l-11.9,12a1.9,1.9,0,0,0,0,2.8l11.9,12a2.1,2.1,0,0,0,2.7.2,1.9,1.9,0,0,0,.2-3Z"></path>{" "}
							</g>{" "}
						</g>{" "}
					</g>
				</svg>
				<div className="relative w-[90%] mx-auto sm:h-[1.8rem] lm:h-[2.8rem] sl:h-[2.6vw] sm:text-[1rem] lm:text-[1.6rem] sl:text-[1.2vw] flex items-center">
					<Swiper
						ref={swiperRef}
						slidesPerView={5}
						spaceBetween={10}
						navigation={{
							nextEl: ".review-swiper-button-next",
							prevEl: ".review-swiper-button-prev",
						}}
						modules={[Navigation]}
						className="mySwiper lt:h-[3.4vw]"
						style={{ paddingTop: "0.9vw" }}
						onSlideChange={updateButtonsState}
					>
						{stationList &&
							stationList.map((station, index) => (
								<SwiperSlide
									key={index}
									onMouseOver={() => {
										setStationHover(station.id);
									}}
									onMouseOut={() => {
										setStationHover("");
									}}
								>
									<div
										className={`sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[2rem] sl:text-[1.6vw] lt:text-[1.1vw] text-center cursor-pointer ${station.id === stationId || station.id === stationId2
											? "active-station"
											: ""
											}`}
										onClick={() => {
											setStationId(station.id);
											setStationId2("");
											StationData(station.id);
											setSecondStation(true);
											setRemoveStation(false);
										}}
									>
										{station.station_name}
									</div>

									{stationId2 === "" && stationId !== station.id ?
										<span
											className="absolute bg-secondary hover:bg-secondary cursor-pointer z-[99999999] sm:top-[-0.4rem] lm:top-[-0.6rem] left-[50%] transform translate-x-[-40%] text-white rounded-[50%] sm:w-[1rem] sm:h-[1rem] lm:w-[1.2rem] lm:h-[1.2rem] tab:w-[1.4rem] tab:h-[1.4rem] flex justify-center items-center lt:hidden"
											onClick={() => {
												if (stationId2 === "" && stationId !== station.id) {
													setStationId2(station.id);
													StationData(station.id);
													setSecondStation(false);
													setRemoveStation(true);
												}
											}}
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												className="lt:w-[2vw] lt:h-[2vw]"
											>
												<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
												<g
													id="SVGRepo_tracerCarrier"
													strokeLinecap="round"
													strokeLinejoin="round"
												></g>
												<g id="SVGRepo_iconCarrier">
													{" "}
													<path
														d="M6 12H18M12 6V18"
														stroke="#fff"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													></path>{" "}
												</g>
											</svg>
										</span>
										: ""
									}

									{stationHover === station.id &&
										stationId &&
										secondStation &&
										station.id !== stationId && (
											<span
												className="absolute bg-secondary hover:bg-secondary cursor-pointer z-[99999999] top-[-0.7vw] left-[50%] transform translate-x-[-40%] text-white rounded-[50%] w-[1vw] h-[1vw] flex justify-center items-center"
												onClick={() => {
													if (stationId2 === "" && stationId !== station.id) {
														setStationId2(station.id);
														StationData(station.id);
														setSecondStation(false);
														setRemoveStation(true);
													}
												}}
											>
												<svg
													viewBox="0 0 24 24"
													fill="none"
													className="lt:w-[2vw] lt:h-[2vw]"
												>
													<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
													<g
														id="SVGRepo_tracerCarrier"
														strokeLinecap="round"
														strokeLinejoin="round"
													></g>
													<g id="SVGRepo_iconCarrier">
														{" "}
														<path
															d="M6 12H18M12 6V18"
															stroke="#fff"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														></path>{" "}
													</g>
												</svg>
											</span>
										)}

									{stationHover === station.id &&
										stationId2 &&
										secondStation &&
										station.id !== stationId2 && (
											<span
												className="absolute bg-secondary hover:bg-secondary cursor-pointer z-[99999999] top-[-0.7vw] left-[50%] transform translate-x-[-40%] text-white rounded-[50%] w-[1vw] h-[1vw] flex justify-center items-center"
												onClick={() => {
													if (stationId === "" && stationId2 !== station.id) {
														setStationId(station.id);
														StationData(station.id);
														setSecondStation(false);
														setRemoveStation(true);
													}
												}}
											>
												<svg
													viewBox="0 0 24 24"
													fill="none"
													className="lt:w-[2vw] lt:h-[2vw]"
												>
													<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
													<g
														id="SVGRepo_tracerCarrier"
														strokeLinecap="round"
														strokeLinejoin="round"
													></g>
													<g id="SVGRepo_iconCarrier">
														{" "}
														<path
															d="M6 12H18M12 6V18"
															stroke="#fff"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														></path>{" "}
													</g>
												</svg>
											</span>
										)}

									{removeStation && station.id === stationId && (
										<span
											className="absolute bg-white cursor-pointer z-[99999999] sm:top-[-0.4rem] lm:top-[-0.6rem] tab:top-[-0.6rem] sl:top-[-0.4rem] lt:top-[-0.7vw] right-[-0.4vw] border border-secondary transform translate-x-[-40%] text-secondary text-[2vw] rounded-[50%] sm:w-[1rem] lm:w-[1.2rem] tab:w-[1.4rem] sl:w-[1rem] sm:h-[1rem] lm:h-[1.2rem] tab:h-[1.4rem] sl:h-[1rem] lt:w-[1vw] lt:h-[1vw] flex justify-center items-center"
											onClick={() => {
												setStationId(stationId2);
												setStationId2("");
												setSecondStation(true);
												setRemoveStation(false);
											}}
										>
											<svg
												fill={primary}
												viewBox="0 0 32 32"
												className="lt:w-[2vw] lt:h-[2vw]"
											>
												<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
												<g
													id="SVGRepo_tracerCarrier"
													strokeLinecap="round"
													strokeLinejoin="round"
												></g>
												<g id="SVGRepo_iconCarrier">
													{" "}
													<path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z"></path>{" "}
												</g>
											</svg>
										</span>
									)}
									{removeStation && station.id === stationId2 && (
										<span
											className="absolute bg-white cursor-pointer z-[99999999] sm:top-[-0.4rem] lm:top-[-0.6rem] tab:top-[-0.6rem] sl:top-[-0.4rem] lt:top-[-0.7vw] right-[-0.4vw] border border-secondary transform translate-x-[-40%] text-secondary text-[2vw] rounded-[50%] sm:w-[1rem] lm:w-[1.2rem] tab:w-[1.4rem] sl:w-[1rem] sm:h-[1rem] lm:h-[1.2rem] tab:h-[1.4rem] sl:h-[1rem] lt:w-[1vw] lt:h-[1vw] flex justify-center items-center"
											onClick={() => {
												setStationId2("");
												setSecondStation(true);
												setRemoveStation(false);
											}}
										>
											<svg
												fill={primary}
												viewBox="0 0 32 32"
												className="lt:w-[2vw] lt:h-[2vw]"
											>
												<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
												<g
													id="SVGRepo_tracerCarrier"
													strokeLinecap="round"
													strokeLinejoin="round"
												></g>
												<g id="SVGRepo_iconCarrier">
													{" "}
													<path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z"></path>{" "}
												</g>
											</svg>
										</span>
									)}
								</SwiperSlide>
							))}
					</Swiper>
				</div>
				<svg
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
					fill={primary}
					className={`cursor-pointer review-swiper-button-next  sm:w-[3rem] sm:h-[3rem] lm:w-[4rem] lm:h[4rem] tab:w-[5rem] tab:h[5rem] sl:w-[3vw] sl:h-[3vw] lt:w-[2vw] lt:h-[2vw] ${isNextDisabled ? "disabled" : ""
						}`}
					onClick={handleNextClick}
				>
					<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
					<g
						id="SVGRepo_tracerCarrier"
						strokeLinecap="round"
						strokeLinejoin="round"
					></g>
					<g id="SVGRepo_iconCarrier">
						{" "}
						<title>arrowhead-right</title>{" "}
						<g id="Layer_2" data-name="Layer 2">
							{" "}
							<g id="invisible_box" data-name="invisible box">
								{" "}
								<rect width="48" height="48" fill="none"></rect>{" "}
							</g>{" "}
							<g id="icons_Q2" data-name="icons Q2">
								{" "}
								<path d="M27.2,24,16.6,34.6a1.9,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2l11.9-12a1.9,1.9,0,0,0,0-2.8l-11.9-12a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3Z"></path>{" "}
							</g>{" "}
						</g>{" "}
					</g>
				</svg>
			</div>

			<div className="py-[0.2vw] px-[1vw] w-full">
				<div
					onClick={() => handleChartChange("pc")}
					className={`chart-tab inline-block relative text-[#cccccc] text-center px-[0.4vw] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw] cursor-pointer transition ease-in delay-180 my-[0.4vw] me-[2vw] ${pollutant ? "chart-active" : ""
						}`}
				>
					Pollutant Concentration
				</div>
				<div
					onClick={() => handleChartChange("air")}
					className={`chart-tab inline-block relative text-[#cccccc] text-center px-[0.4vw] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw] cursor-pointer transition ease-in delay-180 my-[0.4vw] me-[2vw] ${air ? "chart-active" : ""
						}`}
				>
					Air Quality Index
				</div>
				<div
					onClick={() => handleChartChange("md")}
					className={`chart-tab inline-block relative text-[#cccccc] text-center px-[0.4vw] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw] cursor-pointer transition ease-in delay-180 my-[0.4vw] me-[2vw] ${mat ? "chart-active" : ""
						}`}
				>
					Meteorological Data
				</div>
			</div>

			{lineChart && (
				<Fragment>
					<div className="h-[5vw] relative px-[0.8vw] py-[0.4vw] flex flex-wrap justify-start">
						{gasesList &&
							gasesList.map((gases, index) => (
								<label
									key={index}
									className="inline-flex items-center cursor-pointer justify-center m-[0.2vw] my-[0.1vw] sm:w-[32.4%] sl:w-[32%] lt:w-[19%] border rounded border-[#f1f1f1]"
								>
									{units && units[gases] && (
										<span className="inline-block sm:w-[66%] sl:w-[58%]">
											<span className="sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw]">
												{gases}
											</span>
											<sub className="sm:text-[1rem] lm:text-[1.2rem] tab:text-[1.4rem] sl:text-[1.4vw] lt:text-[0.66vw] text-gray-500">
												({units[gases]})
											</sub>
										</span>
									)}
									<input
										type="checkbox"
										onChange={handleGasCheckboxChange}
										value={gases}
										checked={
											gasesCheckedItems
												? gasesCheckedItems.includes(gases)
												: false
										}
										className="sr-only peer"
									/>
									<div
										className={`relative mt-[0.2vw] absolute left-[0.2vw] sm:w-[3rem] tab:w-[3.4rem] sl:w-[3vw] lt:w-[2.4vw] sm:h-[1.6rem] tab:h-[1.8rem] sl:h-[1.4vw] lt:h-[1vw] bg-gray-300 rounded-full peer sm:peer-checked:after:translate-x-[1.2rem] tab:peer-checked:after:translate-x-[1.6rem] sl:peer-checked:after:translate-x-[1vw] lt:peer-checked:after:translate-x-[0.9vw] peer-checked:after:border-white after:content-[''] after:absolute sm:after:top-[0.05rem] tab:after:top-[0.1rem] sl:after:top-[0.1vw] after:start-[0.3vw] after:bg-white after:border-gray-300 after:border after:rounded-full sl:after:w-[1.2vw] sl:after:h-[1.2vw] lt:after:w-[0.8vw] lt:after:h-[0.8vw] sm:after:w-[1.4rem] sm:after:h-[1.4rem] tab:after:w-[1.6rem] tab:after:h-[1.6rem] after:transition-all after:transition-all ${customSeriesColors[gases]}`}
									></div>
								</label>
							))}
					</div>

					<Fragment>
						<LineChart
							legend={false}
							checkedItems={gasesCheckedItems}
							gasesStation={stationId}
							gasesStation2={stationId2}
							station1={stationName}
							station2={stationName2}
							gasStats={stats}
							pollutant={props.pollutant}
						/>
						<div className="sm:h-[4rem] sl:h-[1vw] w-full flex justify-between items-center sl:mt-[-1vw] mb-[1vw]">
							<div className="ps-[1vw]">
								<button
									onClick={() => {
										setStats("daily");
									}}
									className={`inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[0.9vw] bg-white text-secondary border border-secondary border-[0.12vw] sm:w-[6rem] lm:w-[6.2rem] tab:w-[6.8rem] sl:w-[6vw] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw] 
									${stats === "daily" ? "btn-bg text-white" : ""}`}
								>
									Hourly
								</button>
								<button
									onClick={() => {
										setStats("monthly");
									}}
									className={`inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[0.9vw] bg-white text-secondary border border-secondary border-[0.12vw] sm:w-[6rem] lm:w-[6.2rem] tab:w-[6.8rem] sl:w-[6vw] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
									${stats === "monthly" ? "btn-bg text-white" : ""}`}
								>
									Daily
								</button>
								<button
									onClick={() => {
										setStats("8hourly");
									}}
									className={`inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[0.9vw] bg-white text-secondary border border-secondary border-[0.12vw] sm:w-[6rem] lm:w-[6.2rem] tab:w-[6.8rem] sl:w-[6vw] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
									${stats === "8hourly" ? "btn-bg text-white" : ""}`}
								>
									8 Hours
								</button>
								<button
									onClick={() => {
										setStats("yearly");
									}}
									className={`inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[0.9vw] bg-white text-secondary border border-secondary border-[0.12vw] sm:w-[6rem] lm:w-[6.2rem] tab:w-[6.8rem] sl:w-[6vw] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
									${stats === "yearly" ? "btn-bg text-white" : ""}`}
								>
									Monthly
								</button>
							</div>
							<button
								onClick={() => {
									setLineZoom(true);
									setBarZoom(false);
								}}
								className="zoom inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[1vw] font-[600] bg-secondary text-white sm:h-[2rem] lm:h-[2.4rem] sl:h-[2.2vw] sm:w-[6rem] lm:w-[6.2rem] sl:w-[4.2vw] lt:w-[4vw] me-[1vw] rounded-tr rounded-bl"
							>
								ZOOM
							</button>
						</div>
					</Fragment>
				</Fragment>
			)}

			{barChart && (
				<Fragment>
					<BarChart
						legend={false}
						station={stationId}
						station2={stationId2}
						stats={stats}
						stationName1={stationName}
						stationName2={stationName2}
						pollutant={props.pollutant}
					/>
					<div className="h-[1.6vw] w-full flex justify-between items-center sl:mt-0 mb-[0.8vw]">
						<div className="ps-[1vw]">
							<button
								onClick={() => {
									setStats("daily");
								}}
								className={`inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[0.9vw] bg-white text-secondary border border-secondary border-[0.12vw] sm:w-[6rem] lm:w-[6.2rem] tab:w-[6.8rem] sl:w-[6vw] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
									${stats === "daily" ? "btn-bg text-white" : ""}`}
							>
								Hourly
							</button>
							<button
								onClick={() => {
									setStats("monthly");
								}}
								className={`inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[0.9vw] bg-white text-secondary border border-secondary border-[0.12vw] sm:w-[6rem] lm:w-[6.2rem] tab:w-[6.8rem] sl:w-[6vw] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
									${stats === "monthly" ? "btn-bg text-white" : ""}`}
							>
								Daily
							</button>
							<button
								onClick={() => {
									setStats("8hourly");
								}}
								className={`inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[0.9vw] bg-white text-secondary border border-secondary border-[0.12vw] sm:w-[6rem] lm:w-[6.2rem] tab:w-[6.8rem] sl:w-[6vw] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
									${stats === "8hourly" ? "btn-bg text-white" : ""}`}
							>
								8 Hours
							</button>
							<button
								onClick={() => {
									setStats("yearly");
								}}
								className={`inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[0.9vw] bg-white text-secondary border border-secondary border-[0.12vw] sm:w-[6rem] lm:w-[6.2rem] tab:w-[6.8rem] sl:w-[6vw] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
									${stats === "yearly" ? "btn-bg text-white" : ""}`}
							>
								Monthly
							</button>
						</div>
						<button
							onClick={() => {
								setBarZoom(true);
								setLineZoom(false);
							}}
							className="zoom inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[1vw] font-[600] bg-secondary text-white sm:h-[2rem] lm:h-[2.4rem] sl:h-[2.2vw] sm:w-[6rem] lm:w-[6.2rem] sl:w-[4.2vw] lt:w-[4vw] me-[1vw] rounded-tr rounded-bl"
						>
							ZOOM
						</button>
					</div>

					{/* <div className="bg-[#efefef] text-[#898989] sm:h-[7rem] sl:h-[8vw] lt:h-[5vw] sm:p-[0.7rem] sl:p-[1.2vw] lt:p-[0.8vw] sm:mt-4 sl:mt-0 sm:text-[0.8rem] sl:text-[1.2vw] lt:text-[0.8vw]">
						<p>
							The UAE National Standard 1-hour averaging period is used to
							determine the hourly AQI for CO, NO2, SO2 and O3. The overall
							Dubai AQI reported on the website represents the highest recorded
							AQI for all gaseous pollutants at all air quality stations for the
							last hour.
						</p>
					</div> */}
				</Fragment>
			)}

			{matChart && (
				<Fragment>
					<div className="flex flex-wrap justify-start items-around px-[1vw] mt-[-0.6vw]">
						<div className="mat-div flex flex-col justify-center mt-[1vw] sm:mx-[0.25rem] sl:mx-[0.4vw] items-center sm:h-[6rem] lm:h-[7rem] tab:h-[8rem] sl:h-[8vw] lt:h-[4.2vw] sm:w-[30%] lm:w-[32%] sl:w-[13vw] lt:w-[6.6vw] rounded-md">
							<h5 className="font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw]">
								Wind Speed
							</h5>
							<h4 className="font-[600] sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.4vw] lt:text-[0.8vw]">
								{stationData.windspeed} {units && units.WS}
							</h4>
							<label className="inline-flex items-center cursor-pointer justify-center m-[0.2vw] my-[0.1vw] w-[100%] rounded">
								<input
									type="checkbox"
									onChange={handleWindCheckboxChange}
									value="ws"
									checked={
										windCheckedItems ? windCheckedItems.includes("ws") : false
									}
									className="sr-only peer"
								/>
								<div className="relative mt-[0.2vw] absolute left-[0.2vw] sm:w-[3rem] tab:w-[3.4rem] sl:w-[3vw] lt:w-[2.4vw] sm:h-[1.6rem] tab:h-[1.8rem] sl:h-[1.4vw] lt:h-[1vw] bg-gray-300 rounded-full peer sm:peer-checked:after:translate-x-[1.2rem] tab:peer-checked:after:translate-x-[1.6rem] sl:peer-checked:after:translate-x-[1vw] lt:peer-checked:after:translate-x-[0.9vw] peer-checked:after:border-white after:content-[''] after:absolute sm:after:top-[0.05rem] tab:after:top-[0.1rem] sl:after:top-[0.1vw] after:start-[0.3vw] after:bg-white after:border-gray-300 after:border after:rounded-full sl:after:w-[1.2vw] sl:after:h-[1.2vw] lt:after:w-[0.8vw] lt:after:h-[0.8vw] sm:after:w-[1.4rem] sm:after:h-[1.4rem] tab:after:w-[1.6rem] tab:after:h-[1.6rem] after:transition-all peer-checked:bg-[#e7711b]"></div>
							</label>
						</div>
						<div className="mat-div flex flex-col justify-center mt-[1vw] sm:mx-[0.25rem] sl:mx-[0.4vw] items-center sm:h-[6rem] lm:h-[7rem] tab:h-[8rem] sl:h-[8vw] lt:h-[4.2vw] sm:w-[30%] lm:w-[32%] sl:w-[13vw] lt:w-[6.6vw] rounded-md">
							<h5 className="font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw]">
								Wind Dir
							</h5>
							<h4 className="font-[600] sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.4vw] lt:text-[0.8vw]">
								{stationData.winddirection} {units && units.WD}
							</h4>
							<label className="inline-flex items-center cursor-pointer justify-center m-[0.2vw] my-[0.1vw] w-[100%] rounded">
								<input
									type="checkbox"
									onChange={handleWindCheckboxChange}
									value="wd"
									checked={
										windCheckedItems ? windCheckedItems.includes("wd") : false
									}
									className="sr-only peer"
								/>
								<div className="relative mt-[0.2vw] absolute left-[0.2vw] sm:w-[3rem] tab:w-[3.4rem] sl:w-[3vw] lt:w-[2.4vw] sm:h-[1.6rem] tab:h-[1.8rem] sl:h-[1.4vw] lt:h-[1vw] bg-gray-300 rounded-full peer sm:peer-checked:after:translate-x-[1.2rem] tab:peer-checked:after:translate-x-[1.6rem] sl:peer-checked:after:translate-x-[1vw] lt:peer-checked:after:translate-x-[0.9vw] peer-checked:after:border-white after:content-[''] after:absolute sm:after:top-[0.05rem] tab:after:top-[0.1rem] sl:after:top-[0.1vw] after:start-[0.3vw] after:bg-white after:border-gray-300 after:border after:rounded-full sl:after:w-[1.2vw] sl:after:h-[1.2vw] lt:after:w-[0.8vw] lt:after:h-[0.8vw] sm:after:w-[1.4rem] sm:after:h-[1.4rem] tab:after:w-[1.6rem] tab:after:h-[1.6rem] after:transition-all  peer-checked:bg-[#6f42c1]"></div>
							</label>
						</div>
						<div className="mat-div flex flex-col justify-center mt-[1vw] sm:mx-[0.25rem] sl:mx-[0.4vw] items-center sm:h-[6rem] lm:h-[7rem] tab:h-[8rem] sl:h-[8vw] lt:h-[4.2vw] sm:w-[30%] lm:w-[32%] sl:w-[13vw] lt:w-[6.6vw] rounded-md">
							<h5 className="font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw]">
								Temperature
							</h5>
							<h4 className="font-[600] sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.4vw] lt:text-[0.8vw]">
								{stationData.temp} {units && units.TEMP}
							</h4>
							<label className="inline-flex items-center cursor-pointer justify-center m-[0.2vw] my-[0.1vw] w-[100%] rounded">
								<input
									type="checkbox"
									onChange={handleMatCheckboxChange}
									value="temp"
									checked={
										matCheckedItems ? matCheckedItems.includes("temp") : false
									}
									className="sr-only peer"
								/>
								<div className="relative mt-[0.2vw] absolute left-[0.2vw] sm:w-[3rem] tab:w-[3.4rem] sl:w-[3vw] lt:w-[2.4vw] sm:h-[1.6rem] tab:h-[1.8rem] sl:h-[1.4vw] lt:h-[1vw] bg-gray-300 rounded-full peer sm:peer-checked:after:translate-x-[1.2rem] tab:peer-checked:after:translate-x-[1.6rem] sl:peer-checked:after:translate-x-[1vw] lt:peer-checked:after:translate-x-[0.9vw] peer-checked:after:border-white after:content-[''] after:absolute sm:after:top-[0.05rem] tab:after:top-[0.1rem] sl:after:top-[0.1vw] after:start-[0.3vw] after:bg-white after:border-gray-300 after:border after:rounded-full sl:after:w-[1.2vw] sl:after:h-[1.2vw] lt:after:w-[0.8vw] lt:after:h-[0.8vw] sm:after:w-[1.4rem] sm:after:h-[1.4rem] tab:after:w-[1.6rem] tab:after:h-[1.6rem] after:transition-all peer-checked:bg-[#0c9450]"></div>
							</label>
						</div>
						<div className="mat-div flex flex-col justify-center mt-[1vw] sm:mx-[0.25rem] sl:mx-[0.4vw] items-center sm:h-[6rem] lm:h-[7rem] tab:h-[8rem] sl:h-[8vw] lt:h-[4.2vw] sm:w-[30%] lm:w-[32%] sl:w-[13vw] lt:w-[6.6vw] rounded-md">
							<h5 className="font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw]">
								Rain
							</h5>
							<h4 className="font-[600] sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.4vw] lt:text-[0.8vw]">
								{stationData.rain} {units && units.RAIN}
							</h4>
							<label className="inline-flex items-center cursor-pointer justify-center m-[0.2vw] my-[0.1vw] w-[100%] rounded">
								<input
									type="checkbox"
									onChange={handleMatCheckboxChange}
									value="rain"
									checked={
										matCheckedItems ? matCheckedItems.includes("rain") : false
									}
									className="sr-only peer"
								/>
								<div className="relative mt-[0.2vw] absolute left-[0.2vw] sm:w-[3rem] tab:w-[3.4rem] sl:w-[3vw] lt:w-[2.4vw] sm:h-[1.6rem] tab:h-[1.8rem] sl:h-[1.4vw] lt:h-[1vw] bg-gray-300 rounded-full peer sm:peer-checked:after:translate-x-[1.2rem] tab:peer-checked:after:translate-x-[1.6rem] sl:peer-checked:after:translate-x-[1vw] lt:peer-checked:after:translate-x-[0.9vw] peer-checked:after:border-white after:content-[''] after:absolute sm:after:top-[0.05rem] tab:after:top-[0.1rem] sl:after:top-[0.1vw] after:start-[0.3vw] after:bg-white after:border-gray-300 after:border after:rounded-full sl:after:w-[1.2vw] sl:after:h-[1.2vw] lt:after:w-[0.8vw] lt:after:h-[0.8vw] sm:after:w-[1.4rem] sm:after:h-[1.4rem] tab:after:w-[1.6rem] tab:after:h-[1.6rem] after:transition-all peer-checked:bg-[#cb3e36]"></div>
							</label>
						</div>
						<div className="mat-div flex flex-col justify-center mt-[1vw] sm:mx-[0.25rem] sl:mx-[0.4vw] items-center sm:h-[6rem] lm:h-[7rem] tab:h-[8rem] sl:h-[8vw] lt:h-[4.2vw] sm:w-[30%] lm:w-[32%] sl:w-[13vw] lt:w-[6.6vw] rounded-md">
							<h5 className="font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] tab:text-[1.4rem] sl:text-[1.6vw] lt:text-[0.9vw]">
								Humidity
							</h5>
							<h4 className="font-[600] sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.4vw] lt:text-[0.8vw]">
								{stationData.humidity} {units && units.HUM}
							</h4>
							<label className="inline-flex items-center cursor-pointer justify-center m-[0.2vw] my-[0.1vw] w-[100%] rounded">
								<input
									type="checkbox"
									onChange={handleMatCheckboxChange}
									value="hum"
									checked={
										matCheckedItems ? matCheckedItems.includes("hum") : false
									}
									className="sr-only peer"
								/>
								<div className="relative mt-[0.2vw] absolute left-[0.2vw] sm:w-[3rem] tab:w-[3.4rem] sl:w-[3vw] lt:w-[2.4vw] sm:h-[1.6rem] tab:h-[1.8rem] sl:h-[1.4vw] lt:h-[1vw] bg-gray-300 rounded-full peer sm:peer-checked:after:translate-x-[1.2rem] tab:peer-checked:after:translate-x-[1.6rem] sl:peer-checked:after:translate-x-[1vw] lt:peer-checked:after:translate-x-[0.9vw] peer-checked:after:border-white after:content-[''] after:absolute sm:after:top-[0.05rem] tab:after:top-[0.1rem] sl:after:top-[0.1vw] after:start-[0.3vw] after:bg-white after:border-gray-300 after:border after:rounded-full sl:after:w-[1.2vw] sl:after:h-[1.2vw] lt:after:w-[0.8vw] lt:after:h-[0.8vw] sm:after:w-[1.4rem] sm:after:h-[1.4rem] tab:after:w-[1.6rem] tab:after:h-[1.6rem] after:transition-all peer-checked:bg-[#544fc5]"></div>
							</label>
						</div>
						<div className="mat-div flex flex-col justify-center mt-[1vw] sm:mx-[0.25rem] sl:mx-[0.4vw] items-center sm:h-[6rem] lm:h-[7rem] tab:h-[8rem] sl:h-[8vw] lt:h-[4.2vw] sm:w-[30%] lm:w-[32%] sl:w-[13vw] lt:w-[6.6vw] rounded-md">
							<h5 className="font-[600] sm:text-[1.2rem] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6vw] lt:text-[0.9vw]">
								SR
							</h5>
							<h4 className="font-[600] sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.4vw] lt:text-[0.8vw]">
								{stationData.stationSR} {units && units.SR}
							</h4>
							<label className="inline-flex items-center cursor-pointer justify-center m-[0.2vw] my-[0.1vw] w-[100%] rounded">
								<input
									type="checkbox"
									onChange={handleMatCheckboxChange}
									value="sr"
									checked={
										matCheckedItems ? matCheckedItems.includes("sr") : false
									}
									className="sr-only peer"
								/>
								<div className="relative mt-[0.2vw] absolute left-[0.2vw] sm:w-[3rem] tab:w-[3.4rem] sl:w-[3vw] lt:w-[2.4vw] sm:h-[1.6rem] tab:h-[1.8rem] sl:h-[1.4vw] lt:h-[1vw] bg-gray-300 rounded-full peer sm:peer-checked:after:translate-x-[1.2rem] tab:peer-checked:after:translate-x-[1.6rem] sl:peer-checked:after:translate-x-[1vw] lt:peer-checked:after:translate-x-[0.9vw] peer-checked:after:border-white after:content-[''] after:absolute sm:after:top-[0.05rem] tab:after:top-[0.1rem] sl:after:top-[0.1vw] after:start-[0.3vw] after:bg-white after:border-gray-300 after:border after:rounded-full sl:after:w-[1.2vw] sl:after:h-[1.2vw] lt:after:w-[0.8vw] lt:after:h-[0.8vw] sm:after:w-[1.4rem] sm:after:h-[1.4rem] tab:after:w-[1.6rem] tab:after:h-[1.6rem] after:transition-all peer-checked:bg-[#349bdb]"></div>
							</label>
						</div>
					</div>
					<Fragment>
						{matCheckedItems.length > 0 && (
							<MatChart
								legend={false}
								checkedItems={matCheckedItems}
								matStation={stationId}
								matStation2={stationId2}
								stationName1={stationName}
								stationName2={stationName2}
								matStats={stats}
								pollutant={props.pollutant}
								units={units}
							/>
						)}

						{windCheckedItems.length > 0 && (
							<WindChart
								legend={false}
								checkedItems={windCheckedItems}
								station={stationId}
								station2={stationId2}
								stationName1={stationName}
								stationName2={stationName2}
								stats={stats}
							/>
						)}

						{(windCheckedItems.length > 0 || matCheckedItems.length > 0) && (
							<div className="h-[2.2vw] w-full flex justify-between items-center mt-[-1vw] absolute sm:bottom-[1rem] sl:bottom-[0.6vw]">
								<div className="ps-[1vw]">
									<button
										onClick={() => {
											setStats("daily");
										}}
										className={`inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[0.9vw] bg-white text-secondary border border-secondary border-[0.12vw] sm:w-[6rem] lm:w-[6.2rem] tab:w-[6.8rem] sl:w-[6vw] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
									${stats === "daily" ? "btn-bg text-white" : ""}`}
									>
										Hourly
									</button>
									<button
										onClick={() => {
											setStats("monthly");
										}}
										className={`inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[0.9vw] bg-white text-secondary border border-secondary border-[0.12vw] sm:w-[6rem] lm:w-[6.2rem] tab:w-[6.8rem] sl:w-[6vw] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
									${stats === "monthly" ? "btn-bg text-white" : ""}`}
									>
										Daily
									</button>
									<button
										onClick={() => {
											setStats("8hourly");
										}}
										className={`inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[0.9vw] bg-white text-secondary border border-secondary border-[0.12vw] sm:w-[6rem] lm:w-[6.2rem] tab:w-[6.8rem] sl:w-[6vw] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
									${stats === "8hourly" ? "btn-bg text-white" : ""}`}
									>
										8 Hours
									</button>
									<button
										onClick={() => {
											setStats("yearly");
										}}
										className={`inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[0.9vw] bg-white text-secondary border border-secondary border-[0.12vw] sm:w-[6rem] lm:w-[6.2rem] tab:w-[6.8rem] sl:w-[6vw] lt:w-[5vw] py-[0.2vw] rounded-[2vw] mx-[0.2vw]
									${stats === "yearly" ? "btn-bg text-white" : ""}`}
									>
										Monthly
									</button>
								</div>
								<button
									onClick={() => {
										{
											matCheckedItems.length > 0 && setMatZoom(true);
										}
										{
											windCheckedItems.length > 0 && setWindZoom(true);
										}
									}}
									className="zoom inline-block relative sm:text-[1.2rem] lm:text-[1.4rem] tab:text-[1.6rem] sl:text-[1.2vw] lt:text-[1vw] font-[600] bg-secondary text-white sm:h-[2rem] lm:h-[2.4rem] sl:h-[2.2vw] sm:w-[6rem] lm:w-[6.2rem] sl:w-[4.2vw] lt:w-[4vw] me-[1vw] rounded-tr rounded-bl"
								>
									ZOOM
								</button>
							</div>
						)}
					</Fragment>
				</Fragment>
			)}

			{lineZoom && (
				<Modals
					checkedItems={gasesCheckedItems}
					gasesStation={stationId}
					gasesStation2={stationId2}
					station1={stationName}
					station2={stationName2}
					gasStats={stats}
					pollutant={props.pollutant}
					showLine={lineZoom}
					hideLine={() => {
						setLineZoom(false);
					}}
				/>
			)}

			{barZoom && (
				<Modals
					station={stationId}
					station2={stationId2}
					stats={stats}
					stationName1={stationName}
					stationName2={stationName2}
					pollutant={props.pollutant}
					showBar={barZoom}
					hideBar={() => {
						setBarZoom(false);
					}}
				/>
			)}

			{matZoom && (
				<Modals
					checkedItems={matCheckedItems}
					matStation={stationId}
					matStation2={stationId2}
					stationName1={stationName}
					stationName2={stationName2}
					matStats={stats}
					pollutant={props.pollutant}
					units={units}
					showMat={matZoom}
					hideMat={() => {
						setMatZoom(false);
					}}
				/>
			)}

			{windZoom && (
				<Modals
					checkedItems={windCheckedItems}
					station={stationId}
					station2={stationId2}
					stationName1={stationName}
					stationName2={stationName2}
					stats={stats}
					showWind={windZoom}
					hideWind={() => {
						setWindZoom(false);
					}}
				/>
			)}
		</div>
	);
}

export default Chart;
