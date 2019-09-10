class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;

		this._init();
	}

	_init() {
		window.addEventListener('reload data', () => { this.getData(this.model.get("baseUrl") + this.model.get("requestString")) })
	}

	// Async function to get the data.
	getData(searchString) {
		// Try getting the data, show error otherwise.
		this.view.setLoadingState();
		// Get the data from the provided URL.
		fetch(searchString)
			.then((res) => {
				// If the status is not ok, let the user know
				if ( res.status !== 200 ) {
					console.log("There was a problem. Status: " + response.status)
					return;
				}

				// If the data is fine, continue here
				res.json().then((data) => {
					this.view.buildSlider(data);
				});
			})
			.catch((e) => {
				console.log("There was an error retrieving the data:", e);
			})
	}
}