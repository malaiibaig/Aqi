/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [ "./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js" ],
	theme: {
		extend: {
			colors: {
				primary: "#04253c",
				secondary: "#9F8B66",
				primaryLight: "#04253c82",
			},
		},
		screens: {
			sm: "300px",
			lm: "531px",
			tab: "768px",
			sl: "993px",
			lt: "1200px",
		},
	},
	plugins: [ require( "flowbite/plugin" ) ],
};
