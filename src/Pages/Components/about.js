import Close from "../Svg/close";
import img1 from "../../assets/images/about1.jpg";
import img2 from "../../assets/images/about2.jpg";

function About(props) {
	return (
		<div
			className={`overflow-auto bg-white absolute sm:h-[90%] lm:h-[92%] sl:h-[91.6%] sm:w-[100vw] lm:w-[100vw] tab:w-[100vw] sl:w-[60vw] lt:w-[47vw] sm:top-[4rem] lm:top-[5rem] tab:top-[5.8rem] sl:top-[8vw] lt:top-[3.8vw] border border-[#e7e7e7] rounded-r-[0.4vw] ${
				props.show ? "visible" : "hidden"
			}`}
		>
			<div className="sticky top-0 bg-white sm:h-[4rem] lm:h-[4.4rem] tab:h-[5rem] sl:h-[5vw] lt:h-[4.4vw] border border-[#e7e7e7]">
				<h1 className="text-primary font-[600] sm:text-[2rem] lm:text-[2.8rem] tab:text-[2.8rem] sl:text-[2.4vw] lt:text-[1.8vw] py-[0.8vw] px-[1.2vw]">
					ABOUT
				</h1>
				<button
					className="absolute sm:top-[0.6rem] sm:right-[0.6rem] lm:top-[1.6rem] lm:right-[0.6rem] tab:top-[1.2rem] lt:top-[1vw] lt:right-[0.6vw]"
					onClick={props.close}
				>
					<Close />
				</button>
			</div>
			<div className="py-[1vw] px-[1.2vw]">
				<img src={img1} alt="" />
				<br />
				<h1 className="sm:text-[1.6rem] sl:text-[1.8vw] tab:text-[2rem] lt:text-[1.4vw] lm:text-[2rem] font-[600] border-l-2 border-primary pl-[1vw] mb-[1vw]">
					AIR QUALITY INDEX
				</h1>
				<p className="sm:text-[1.2rem] sl:text-[1.1vw] lm:text-[1.6rem] tab:text-[1.8rem] sl:text-[1.6rem] lt:text-[1.4rem]">
					The Air Quality Index is an internationally accepted approach for
					presenting daily air quality reports. This index provides valuable
					information about air quality and the potential health effects
					associated with air pollution. The index is calculated according to
					the air quality index equation developed by the US Environmental
					Protection Agency. The air quality index includes the monitoring data
					of five criteria pollutants: nitrogen dioxide (NO2), carbon monoxide
					(CO), sulphur dioxide (SO2), ground ozone (O3), and particulate matter
					(PM10 and 2.5). The air quality index results are distributed into six
					colour-coded health impact categories for easy understanding by the
					public. An AQI value corresponding to 0 – 50 is represented by green
					colour, which indicates good air quality and concentrations of the
					pollutants are within the national limits, and presents no or
					negligible health impacts. On the other end of the spectrum, an AQI
					value higher than 300 or corresponding to maroon colour denotes
					hazardous air quality, which may pose serious health effects.
				</p>
				<br />
				<img src={img2} alt="" />
				<br />
			</div>
		</div>
	);
}

export default About;
