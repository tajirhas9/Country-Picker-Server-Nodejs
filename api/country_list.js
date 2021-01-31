const countryList = require('country-state-picker')

module.exports = function(app, chalk) {
	app.get("/countries", (req, res) => {
		console.log("GET request recieved for country list");

		let countriesJSON = countryList.getCountries();

		let countries = new Array();

		countriesJSON.forEach((country) => {
			countries.push(country.name);
		});

		res.send(JSON.stringify(countries));
	});
}