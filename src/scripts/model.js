class Model {
	// Set the base URL we will use. Can be extended with a form in the view to select the API.
	constructor() {
		this.store = {
			baseUrl: "https://app.rakuten.co.jp/services/api/BooksDVD/Search/20170404?format=json&booksGenreId=003&applicationId=1057232034750714217"
		}
	}

	// Set a value in the store.
	set(key, value) {
		this.store[key] = value;
	}

	// Get a value in the store.
	get(key) {
		let re = this.store[key];
		return re;
	}
}