import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from 'moment';
import { get_gases1, get_gases2 } from "../../lib/constants";

export default function LineChart(props) {
	const [chartOptions, setChartOptions] = useState({
		credits: {
			enabled: false,
		},
		title: {
			text: "Pollutant Concentration",
		},
		series: [],
		xAxis: {
			title: {
				enabled: true,
				text: "Time",
			},
		},
		yAxis: [
			{
				title: {
					enabled: true,
					text: "Concentrations",
					style: {
						fontWeight: "normal",
					},
				},
			},
			{
				title: {
					enabled: true,
					text: "Concentrations",
					style: {
						fontWeight: "normal",
					},
				},
				opposite: true,
			},
		],
	});

	const [gases, setGases] = useState("");
	const [gases2, setGases2] = useState("");


	useEffect(() => {
		selectedGasesHandler();
	}, [props.gasesStation, props.gasesStation2]);

	useEffect(() => {
		if (gases !== "" && props.gasStats === "8hourly") {
			GetChartGas8Hours();
		} else if (gases !== "" && props.gasStats === "daily") {
			GetChartGasDaily();
		} else if (gases !== "" && props.gasStats === "monthly") {
			GetChartGasMonthly();
		}
		else if (gases !== "" && props.gasStats === "yearly") {
			GetChartGasYearly();
		}
	}, [
		props.checkedItems,
		gases,
		gases2,
		props.gasStats,
		props.pollutant,
		props.gasesStation1,
		props.gasesStation2,
		props.station1,
		props.station2,
	]);

	const selectedGasesHandler = () => {
		if (props.gasesStation !== "") {
			setGases(get_gases1);
		} else if (props.gasesStation === "") {
			setGases("");
		}
		if (props.gasesStation2 !== "") {
			setGases2(get_gases2);
		} else if (props.gasesStation2 === "") {
			setGases2("");
		}
	};

	const GetChartGas8Hours = () => {
		if (!gases || !gases.hourly_8 || !gases.units) {
			return;
		}

		const filteredGases = props.checkedItems
			? props.checkedItems.filter(
				(gas) => gases && gases.hourly_8 && gases.hourly_8.hasOwnProperty(gas)
			)
			: [];

		const filteredGases2 = props.checkedItems
			? props.checkedItems.filter(
				(gas) => gases2 && gases2.hourly_8 && gases2.hourly_8.hasOwnProperty(gas)
			)
			: [];

		const filteredUnits = Object.entries((gases && gases.units) || {})
			.filter(([key]) => filteredGases.includes(key))
			.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

		const filteredUnits2 = Object.entries((gases2 && gases2.units) || {})
			.filter(([key]) => filteredGases2.includes(key))
			.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

		const customSeriesColors = {
			NO2: "#349bdb",
			O3: "#544fc5",
			SO2: "#cb3e36",
			NO: "#0c9450",
			NOX: "#e7711b",
			H2S: "#D568FB",
			CH4: "#04253c",
			NMHC: "#8c365d",
			THC: "#9F8B66",
			CO: "#d1bd3a",
			PM1: "#544fc5",
			PM10: "#0c9450",
			PM25: "#349bdb",
		};

		const adjustOpacity = (hexColor, opacity) => {
			const c = hexColor.substring(1);
			const rgb = parseInt(c, 16);
			const r = (rgb >> 16) & 0xff;
			const g = (rgb >> 8) & 0xff;
			const b = (rgb >> 0) & 0xff;
			return `rgba(${r},${g},${b},${opacity})`;
		};

		const timeOpacity = {
			"12:00 AM": 1.0,
			"08:00 AM": 0.7,
			"04:00 PM": 0.4,
		};

		const formatData = (data) => {
			const formattedData = [];
			const currentYear = moment().year();

			for (const date in data) {
				for (const time in data[date]) {
					const datetimeString = `${date} ${currentYear} ${time}`;
					const datetime = moment(datetimeString, 'MMM DD YYYY HH:mm');
					const formattedDate = datetime.format('DD MMM');
					const formattedTime = datetime.format('hh:mm A');
					formattedData.push([formattedDate, formattedTime, parseFloat(data[date][time])]);
				}
			}
			return formattedData;
		};

		const seriesData = filteredGases.map((gas) => ({
			name: props.gasesStation2
				? `${gas} (${filteredUnits[gas] || ""}): ${props.station1}`
				: `${gas} (${filteredUnits[gas] || ""})`,
			data: gases && gases.hourly_8 && formatData(gases.hourly_8[gas]),
			color: customSeriesColors[gas],
			stack: 'gas1',
			marker: {
				enabled: true,
				radius: 3.4,
				lineWidth: 1,
				fillColor: "#FFFFFF",
				symbol: "circle",
				lineColor: null,
			},
		}));

		const seriesData2 = filteredGases2.map((gas) => ({
			name: `${gas} (${filteredUnits2[gas] || ""}): ${props.station2}`,
			data: gases2 && gases2.hourly_8 && formatData(gases2.hourly_8[gas]),
			color: customSeriesColors[gas],
			stack: 'gas2',
			marker: {
				enabled: true,
				radius: 3.4,
				lineWidth: 1,
				fillColor: customSeriesColors[gas],
				symbol: "circle",
				lineColor: null,
			},
		}));

		const dates = [...new Set(seriesData.flatMap((series) => series.data.map((item) => item[0])))];
		const dates2 = [...new Set(seriesData2.flatMap((series) => series.data.map((item) => item[0])))];

		const combinedSeriesData = [...seriesData];
		const combinedSeriesData2 = [...seriesData2];

		const allSeries = [];

		combinedSeriesData.forEach((series) => {
			series.data.forEach(([date, time, value]) => {
				const seriesName = `${series.name} - ${time}`;
				let seriesIndex = allSeries.findIndex((s) => s.name === seriesName);
				if (seriesIndex === -1) {
					allSeries.push({
						name: seriesName,
						data: Array(dates.length).fill(0),
						color: adjustOpacity(series.color, timeOpacity[time] || 1.0),
						stack: 'gas1'
					});
					seriesIndex = allSeries.length - 1;
				}
				const dateIndex = dates.indexOf(date);
				if (dateIndex !== -1) {
					allSeries[seriesIndex].data[dateIndex] += value;
				}
			});
		});

		combinedSeriesData2.forEach((series) => {
			series.data.forEach(([date, time, value]) => {
				const seriesName = `${series.name} - ${time}`;
				let seriesIndex = allSeries.findIndex((s) => s.name === seriesName);
				if (seriesIndex === -1) {
					allSeries.push({
						name: seriesName,
						data: Array(dates2.length).fill(0),
						color: adjustOpacity(series.color, timeOpacity[time] || 1.0),
						stack: 'gas2'
					});
					seriesIndex = allSeries.length - 1;
				}
				const dateIndex = dates2.indexOf(date);
				if (dateIndex !== -1) {
					allSeries[seriesIndex].data[dateIndex] += value;
				}
			});
		});

		setChartOptions((prevOptions) => ({
			...prevOptions,
			series: allSeries,
			chart: {
				type: 'column',
			},
			title: {
				text: "Pollutant Concentration (Last 8 Hours)",
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: true,
						formatter: function () {
							return this.y;
						},
					},
				},
			},
			xAxis: {
				categories: dates,
				title: {
					text: 'Date',
				},
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Concentrations',
				},
				stackLabels: {
					enabled: false,
				},
			},
			tooltip: {
				headerFormat: '<b>{point.x}</b><br/>',
				pointFormat: '{series.name}: {point.y}<br/>',
			},
		}));
	};


	const GetChartGasDaily = () => {
		if (!gases || !gases.hourly || !gases.units) {
			return;
		}

		const filteredGases = props.checkedItems
			? props.checkedItems.filter(
				(gas) => gases && gases.hourly && gases.hourly.hasOwnProperty(gas)
			)
			: [];

		const filteredGases2 = props.checkedItems
			? props.checkedItems.filter(
				(gas) => gases2 && gases2.hourly && gases2.hourly.hasOwnProperty(gas)
			)
			: [];

		const filteredUnits = Object.entries((gases && gases.units) || {})
			.filter(([key]) => filteredGases.includes(key))
			.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

		const filteredUnits2 = Object.entries((gases2 && gases2.units) || {})
			.filter(([key]) => filteredGases2.includes(key))
			.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

		const customSeriesColors = {
			NO2: "#349bdb",
			O3: "#544fc5",
			SO2: "#cb3e36",
			NO: "#0c9450",
			NOX: "#e7711b",
			H2S: "#D568FB",
			CH4: "#04253c",
			NMHC: "#8c365d",
			THC: "#9F8B66",
			CO: "#d1bd3a",
			PM1: "#544fc5",
			PM10: "#0c9450",
			PM25: "#349bdb",
		};

		const seriesData = filteredGases.map((gas) => ({
			name: props.gasesStation2
				? `${gas} (${filteredUnits[gas] || ""}): ${props.station1}`
				: `${gas} (${filteredUnits[gas] || ""})`,
			data: gases.hourly[gas].map(([time, value]) => [time, value]),
			color: customSeriesColors[gas],
			marker: {
				enabled: true,
				radius: 3.4,
				lineWidth: 1,
				fillColor: "#FFFFFF",
				symbol: "circle",
				lineColor: null,
			},
		}));

		const seriesData2 = filteredGases2.map((gas) => ({
			name: `${gas} (${filteredUnits2[gas] || ""}): ${props.station2}`,
			data: gases2.hourly[gas].map(([time, value]) => [time, value]),
			color: customSeriesColors[gas],
			marker: {
				enabled: true,
				radius: 3.4,
				lineWidth: 1,
				fillColor: customSeriesColors[gas],
				symbol: "circle",
				lineColor: null,
			},
		}));

		const combinedSeriesData = [...seriesData, ...seriesData2];

		setChartOptions((prevOptions) => ({
			...prevOptions,
			series: combinedSeriesData,
			chart: {
				type: 'line',
			},
			title: {
				text: "Pollutant Concentration (Hourly)",
			},
			xAxis: {
				...prevOptions.xAxis,
				categories: filteredGases.length > 0
					? gases.hourly[filteredGases[0]].map(([time]) => time)
					: [],
			},
			yAxis: [
				{
					...(prevOptions.yAxis && prevOptions.yAxis[0]),
					title: {
						...(prevOptions.yAxis && prevOptions.yAxis[0] && prevOptions.yAxis[0].title),
						text: `Concentrations (${filteredUnits[filteredGases[0]] || ""})`,
					},
				},
				{
					...(prevOptions.yAxis && prevOptions.yAxis[1]),
					title: {
						...(prevOptions.yAxis && prevOptions.yAxis[1] && prevOptions.yAxis[1].title),
						text: `Concentrations (${filteredUnits[filteredGases.slice(-1)[0]] || ""})`,
					},
					opposite: true,
				},
			],
		}));
	};


	const GetChartGasMonthly = () => {
		if (!gases || !gases.units) {
			return;
		}

		const filteredGases = props.checkedItems
			? props.checkedItems.filter((gas) => gases && gases.hasOwnProperty(gas))
			: [];

		const filteredGases2 = props.checkedItems
			? props.checkedItems.filter((gas) => gases2 && gases2.hasOwnProperty(gas))
			: [];

		const filteredUnits = Object.entries((gases && gases.units) || {})
			.filter(([key]) => filteredGases.includes(key))
			.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

		const filteredUnits2 = Object.entries((gases2 && gases2.units) || {})
			.filter(([key]) => filteredGases2.includes(key))
			.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

		const customSeriesColors = {
			NO2: "#349bdb",
			O3: "#544fc5",
			SO2: "#cb3e36",
			NO: "#0c9450",
			NOX: "#e7711b",
			H2S: "#D568FB",
			CH4: "#04253c",
			NMHC: "#8c365d",
			THC: "#9F8B66",
			CO: "#d1bd3a",
			PM1: "#544fc5",
			PM10: "#0c9450",
			PM25: "#349bdb",
		};

		const seriesData = filteredGases.map((gas) => ({
			name: props.gasesStation2
				? `${gas} (${filteredUnits[gas] || ""}): ${props.station1}`
				: `${gas} (${filteredUnits[gas] || ""})`,
			data: gases && gases[gas].map(([time, value]) => [time, value]),
			color: customSeriesColors[gas],
			marker: {
				enabled: true,
				radius: 3.4,
				lineWidth: 1,
				fillColor: "#FFFFFF",
				symbol: "circle",
				lineColor: null,
			},
		}));

		const seriesData2 = filteredGases2.map((gas) => ({
			name: `${gas} (${filteredUnits2[gas] || ""}): ${props.station2}`,
			data: gases2 && gases2[gas].map(([time, value]) => [time, value]),
			color: customSeriesColors[gas],
			marker: {
				enabled: true,
				radius: 3.4,
				lineWidth: 1,
				fillColor: customSeriesColors[gas],
				symbol: "circle",
				lineColor: null,
			},
		}));

		const combinedSeriesData = [...seriesData, ...seriesData2];

		setChartOptions((prevOptions) => ({
			...prevOptions,
			series: combinedSeriesData,
			chart: {
				type: 'line',
			},
			title: {
				text: "Pollutant Concentration (Daily)",
			},
			xAxis: {
				...prevOptions.xAxis,
				categories: filteredGases.length > 0
					? gases[filteredGases[0]].map(([time]) => time)
					: [],
			},
			yAxis: [
				{
					...(prevOptions.yAxis && prevOptions.yAxis[0]),
					title: {
						...(prevOptions.yAxis && prevOptions.yAxis[0] && prevOptions.yAxis[0].title),
						text: `Concentrations (${filteredUnits[filteredGases[0]] || ""})`,
					},
				},
				{
					...(prevOptions.yAxis && prevOptions.yAxis[1]),
					title: {
						...(prevOptions.yAxis && prevOptions.yAxis[1] && prevOptions.yAxis[1].title),
						text: `Concentrations (${filteredUnits[filteredGases.slice(-1)[0]] || ""})`,
					},
					opposite: true,
				},
			],
		}));
	};

	const GetChartGasYearly = () => {
		if (!gases || !gases.yearly || !gases.units) {
			return;
		}

		const filteredGases = props.checkedItems
			? props.checkedItems.filter(
				(gas) => gases && gases.yearly && gases.yearly.hasOwnProperty(gas)
			)
			: [];

		const filteredGases2 = props.checkedItems
			? props.checkedItems.filter(
				(gas) => gases2 && gases2.yearly && gases2.yearly.hasOwnProperty(gas)
			)
			: [];

		const filteredUnits = Object.entries((gases && gases.units) || {})
			.filter(([key]) => filteredGases.includes(key))
			.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

		const filteredUnits2 = Object.entries((gases2 && gases2.units) || {})
			.filter(([key]) => filteredGases2.includes(key))
			.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

		const customSeriesColors = {
			NO2: "#349bdb",
			O3: "#544fc5",
			SO2: "#cb3e36",
			NO: "#0c9450",
			NOX: "#e7711b",
			H2S: "#D568FB",
			CH4: "#04253c",
			NMHC: "#8c365d",
			THC: "#9F8B66",
			CO: "#d1bd3a",
			PM1: "#544fc5",
			PM10: "#0c9450",
			PM25: "#349bdb",
		};

		const seriesData = filteredGases.map((gas) => ({
			name: props.gasesStation2
				? `${gas} (${filteredUnits[gas] || ""}): ${props.station1}`
				: `${gas} (${filteredUnits[gas] || ""})`,
			data: gases && gases.yearly && gases.yearly[gas].map(([time, value]) => [time, value]),
			color: customSeriesColors[gas],
			marker: {
				enabled: true,
				radius: 3.4,
				lineWidth: 1,
				fillColor: "#FFFFFF",
				symbol: "circle",
				lineColor: null,
			},
		}));

		const seriesData2 = filteredGases2.map((gas) => ({
			name: `${gas} (${filteredUnits2[gas] || ""}): ${props.station2}`,
			data: gases2 && gases2.yearly && gases2.yearly[gas].map(([time, value]) => [time, value]),
			color: customSeriesColors[gas],
			marker: {
				enabled: true,
				radius: 3.4,
				lineWidth: 1,
				fillColor: customSeriesColors[gas],
				symbol: "circle",
				lineColor: null,
			},
		}));

		const combinedSeriesData = [...seriesData, ...seriesData2];

		setChartOptions((prevOptions) => ({
			...prevOptions,
			series: combinedSeriesData,
			chart: {
				type: 'line',
			},
			title: {
				text: "Pollutant Concentration (Monthly)",
			},
			xAxis: {
				...prevOptions.xAxis,
				categories: filteredGases.length > 0
					? gases.yearly[filteredGases[0]].map(([time]) => time)
					: [],
			},
			yAxis: [
				{
					...(prevOptions.yAxis && prevOptions.yAxis[0]),
					title: {
						...(prevOptions.yAxis && prevOptions.yAxis[0] && prevOptions.yAxis[0].title),
						text: `Concentrations (${filteredUnits[filteredGases[0]] || ""})`,
					},
				},
				{
					...(prevOptions.yAxis && prevOptions.yAxis[1]),
					title: {
						...(prevOptions.yAxis && prevOptions.yAxis[1] && prevOptions.yAxis[1].title),
						text: `Concentrations (${filteredUnits[filteredGases.slice(-1)[0]] || ""})`,
					},
					opposite: true,
				},
			],
		}));
	};

	return (
		<div id="line-chart">
			<HighchartsReact highcharts={Highcharts} options={chartOptions} />
		</div>
	);
}
