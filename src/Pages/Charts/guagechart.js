import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge";
import React, { useEffect, useRef, useState } from "react";
import Close from "../Svg/close";
import { get_station_data, get_station_list, get_home_data } from "../../lib/constants";

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

export default function GuageChart(props) {
	const [options, setOptions] = useState({
		credits: false,
		exporting: {
			enabled: false,
		},
		chart: {
			type: "gauge",
			plotBackgroundColor: null,
			plotBackgroundImage: null,
			plotBorderWidth: 0,
			plotShadow: false,
			height: "80%",
		},
		title: null,
		pane: {
			startAngle: -90,
			endAngle: 90,
			background: null,
			center: ["50%", "75%"],
			size: "110%",
		},
		yAxis: {
			min: 0,
			max: 500,
			tickPixelInterval: 72,
			tickPosition: "inside",
			tickColor: Highcharts.defaultOptions.chart.backgroundColor || "#FFFFFF",
			tickLength: 20,
			tickWidth: 2,
			minorTickInterval: null,
			labels: {
				distance: 20,
				style: {
					fontSize: "14px",
					color: "black",
				},
			},
			lineWidth: 0,
			plotBands: [
				{
					from: 0,
					to: 50,
					color: "#008000cf",
					outerRadius: "100%",
					thickness: "25%",
				},
				{
					from: 51,
					to: 100,
					color: "#f9da2ecf",
					outerRadius: "100%",
					thickness: "25%",
				},
				{
					from: 101,
					to: 150,
					color: "#ff9c00",
					outerRadius: "100%",
					thickness: "25%",
				},
				{
					from: 151,
					to: 200,
					color: "#df2e06d9",
					outerRadius: "100%",
					thickness: "25%",
				},
				{
					from: 201,
					to: 300,
					color: "#800454d9",
					outerRadius: "100%",
					thickness: "25%",
				},
				{
					from: 301,
					to: 500,
					color: "#7e0123",
					outerRadius: "100%",
					thickness: "25%",
				},
			],
		},
		plotOptions: {
			solidgauge: {
				dataLabels: {
					enabled: false,
				},
				linecap: "round",
				stickyTracking: false,
				rounded: true,
			},
		},
		series: [
			{
				name: "AQI",
				data: [0],
				tooltip: {
					valueSuffix: " ",
				},
				dataLabels: {
					format: "{y}",
					borderWidth: 0,
					color:
						(Highcharts.defaultOptions.title &&
							Highcharts.defaultOptions.title.style &&
							Highcharts.defaultOptions.title.style.color) ||
						"#333333",
					style: {
						fontSize: "3vw",
						color: "black",
					},
				},
				dial: {
					radius: "80%",
					backgroundColor: "gray",
					baseWidth: 12,
					baseLength: "0%",
					rearLength: "0%",
				},
				pivot: {
					backgroundColor: "gray",
					radius: 6,
				},
			},
		],
	});
	const [stationData, setStationData] = useState("");
	const [aqi, setAqi] = useState("");
	const [defaultStation, setDefaultStation] = useState(0);
	const [defaultValue, setDefaultValue] = useState(0);
	const [stationList, setStationList] = useState("");
	const [isVisible, setIsVisible] = useState(false);
	const componentRef = useRef(null);

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
		if (isVisible) {
			StationNames();
		}
	}, [isVisible]);


	const StationNames = async () => {
		setStationList(get_station_list);
	};

	useEffect(() => {
		Default();
	}, []);

	const Default = () => {
		setDefaultStation(get_home_data.default_aqi.station);
		setAqi(get_home_data.default_aqi);
	};

	useEffect(() => {
		if (props.pollutant === "gas" && aqi && aqi.hrecoms) {
			const hrecoms = JSON.parse(aqi.hrecoms);
			const title = hrecoms.title;
			const fill = hrecoms.fillColor;
			setDefaultValue(aqi.aqi);
			props.title(title);
			props.color(fill);
		} else if (props.pollutant === "pm" && aqi && aqi.hrecoms) {
			const hrecoms = JSON.parse(aqi.hrecoms);
			const title = hrecoms.ptitle;
			const fill = hrecoms.pfillColor;
			setDefaultValue(aqi.paqi);
			props.title(title);
			props.color(fill);
		}
	}, [aqi]);

	useEffect(() => {
		setDefaultStation(props.station);
	}, [props.station]);

	useEffect(() => {
		if (defaultStation && defaultStation !== "") {
			GetAQI();
		}
	}, [defaultStation]);

	useEffect(() => {
		const newOptions = { ...options };
		if (props.pollutant === "gas") {
			newOptions.series[0].data = [stationData && stationData.stationAQI];
			setOptions(newOptions);
			setDefaultValue(stationData && stationData.stationAQI);
			const fill = stationData && stationData.fillColor;
			newOptions.series[0].dial.backgroundColor = fill;
			newOptions.series[0].pivot.backgroundColor = fill;
			props.color(fill);
			props.update(stationData && stationData.last_update);
			props.title(stationData && stationData.aqiTitle);
		} else if (props.pollutant === "pm") {
			newOptions.series[0].data = [stationData && stationData.stationPAQI];
			setOptions(newOptions);
			setDefaultValue(stationData && stationData.stationPAQI);
			const fill = stationData && stationData.pFillColor;
			newOptions.series[0].dial.backgroundColor = fill;
			newOptions.series[0].pivot.backgroundColor = fill;
			props.update(stationData && stationData.last_update);
			props.title(stationData && stationData.paqiTitle);
			props.color(fill);
		}
	}, [props.pollutant, defaultStation, stationData]);

	const GetAQI = () => {
		setStationData(get_station_data);
	};

	return (
		<div
			ref={componentRef}
			className={`charts bg-white absolute sm:min-h-[50%] sm:max-h-[94%] sm:w-[100vw] tab:min-h-[40%] tab:max-h-[94%] tab:w-[100vw] lm:min-h-[24%] lm:max-h-[94%] lm:w-[100vw] sl:min-h-[30%] sl:max-h-[94%] sl:w-[60vw] lt:min-h-[50%] lt:max-h-[94%] lt:w-[34vw] sm:top-[4rem] lm:top-[5.6rem] tab:top-[5.8rem] sl:top-[8vw] lt:top-[3.8vw]  border border-[#e7e7e7] rounded-r-[0.8vw] ${props.show ? "visible" : "hidden"
				}`}
		>
			<div className="relative sm:h-[4rem] lm:h-[5rem] tab:h-[5.6rem] sl:h-[5.8vw] lt:h-[4vw] border border-[#e7e7e7]">
				<h1 className="text-primary font-[600] sm:text-[2rem] lm:text-[2.6rem] tab:text-[3.2rem] sl:text-[3.2vw] lt:text-[1.6vw] py-[0.2vw] px-[1.2vw]">
					{stationData.station_name} ({stationData.station_city})
				</h1>
				<button
					className="absolute sm:top-[1rem] lt:top-[1vw] right-[0.6vw]"
					onClick={props.close}
				>
					<Close />
				</button>
			</div>
			<div className="flex">
				<div className="w-[74%]">
					<div id="guageChart">
						<HighchartsReact highcharts={Highcharts} options={options} />;
					</div>
					<h1 className="text-center font-[600] sm:text-[2.4rem] tab:text-[3rem] sl:text-[2vw] lt:text-[1.6vw] sm:mt-[-6rem] sl:mt-[-4vw] sl:mb-[2vw] relative z-[99999] py-[0.2vw] px-[1.2vw]">
						AQI: {defaultValue}
					</h1>
				</div>
				<div className="w-[26%] px-[0.4vw] sm:py-[1rem] lt:py-[0.4vw] border border-[#f6f6f6]">
					{stationList &&
						stationList.map((station, index) => (
							<div
								className={`sm:text-[1.4rem] lm:text-[1.6rem] tab:text-[2rem] sl:text-[1.6vw] lt:text-[1vw] text-start cursor-pointer px-[0.4vw] sm:py-[0.4rem] sl:py-[0.4vw] lt:py-[0.2vw] my-[0.24vw] ${station.id === defaultStation
										? "rounded-lg bg-primary text-white text-[1.4vw] shadow"
										: ""
									}`}
								onClick={() => {
									setDefaultStation(station.id);
								}}
							>
								{station.station_name}
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
