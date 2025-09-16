import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Index from "./Pages/index";
import Admin from "./Pages/Admin/admin";
import Report from "./Pages/Report/report";
import Login from "./Pages/Admin/login";
import WindChart from "./Pages/Mobile/WindChart";
import DataView from "./Pages/Mobile/DataView";
import Requests from "./Pages/Requests/requests";
import "flowbite";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="/rsg-air-quality" element={<Index />} />
				<Route path="/rsg-air-quality/data-view" element={ <DataView /> } />
				{/* /rsg-air-quality/data-view?stationid=3,2&parameter=co,so2&frommonth=05-2024&tomonth=12-2024 */}

				<Route path="/rsg-air-quality/wind-chart" element={ <WindChart /> } />
				{/* /rsg-air-quality/wind-chart?station1=3&station2=2 */ }
				
				<Route path="/rsg-air-quality/admin" element={<Login />} />
				<Route path="/rsg-air-quality/admin/users" element={<Admin />} />
				<Route path="/rsg-air-quality/admin/reports" element={<Report />} />
				<Route path="/rsg-air-quality/admin/requests" element={<Requests />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
