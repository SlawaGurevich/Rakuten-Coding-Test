class View {
	// Get the current model and the form on the page, then init.
	constructor(model) {
		this.model = model;
		this.form = document.getElementById("form");
		this._init();
	}

	// Add the event listener to submit the form.
	_init() {
		this.form.querySelector('#submit').addEventListener('click', (e) => this.onSubmit(e));

		// Check if there is any data in the form
		for (let input of this.form.querySelectorAll('input')) {
			input.addEventListener("input", () => {
				document.getElementById('submit').disabled = Array.from(this.form.querySelectorAll('input'))
																.map((em) => (em.value))
																.filter( (em) => ( em !== '' )).length === 0;
			});
		}
	}

	// Build the slider, either for the first time or after a new getData() call.
	buildSlider(data) {
		// Check if any results have been found...
		if(data.Items.length) {
			this.slider = new Slider('slider', data.Items);
		} else {
			// ... otherwise show an empty slider.
			document.getElementById('slider').innerHTML = '<div class="no-results">No results found. Please try again.'
		}
	}

	// Set the loading state until data has been loaded.
	setLoadingState() {
		document.getElementById('slider').innerHTML = '<div class="no-results">Loading...</div>';
	}

	// Go through all the inputs and determine which parameters to use for the fetch.
	onSubmit(e) {
		e.preventDefault();
		let inputs = this.form.querySelectorAll('input');
		let requestString = '';

		for( const input of inputs ) {
			// Ignore if empty.
			if (input.value !== '') {
				// Create the part of the request URL that will have the form data.
				requestString += `&${input.name}=${input.value}`;
			}
		}

		// Save the request String in the current model.
		this.model.set("requestString", requestString);

		// Let the controller know, that we want new data.
		window.dispatchEvent(new Event("reload data"));
	}
}

class Slider {
	// Slider needs data and an element to render into.
	constructor(em, data) {
		this.data = data;
		this.element = em;

		this._init();
	}

	// Renders the slider and sets the first active slides. Adds the event listener for recreating the slider.
	_init() {
		this.renderSlider(this.element, this.data);
		this.afterInit();
		// Listen for when the data has finished loading
		window.addEventListener('got data', this.createSlider);
	}

	// Set the first slides.
	afterInit() {
		document.getElementsByClassName('slide')[0].classList.add('visible');
		document.getElementsByClassName('dot')[0].classList.add('active');
	}

	// Render the whole slider into the em element with the data.
	renderSlider(em, data) {
		let slider = document.getElementById(em);
		slider.innerHTML = '';

		let sliderInner = document.createElement('div');
		sliderInner.id = 'slider--inner';
		slider.appendChild(sliderInner);

		// Create slides.
		for (const slide of data) {
			let item = slide.Item;
			let innerDiv = document.createElement('div');
			innerDiv.classList.add("slide");

			let innerHtml = `
				<div class="slide--left">
					<img src="${item.largeImageUrl}" alt="${item.title}" />
				</div>
				<div class="slide--right">
					<h1 class="slide--title">
						${item.title}
					</h1>
					<div class="slide--price">
						${item.itemPrice}円
					</div>
					<div class="slide--caption">
						${item.itemCaption}
					</div>
				</div>
			`
			innerDiv.innerHTML = innerHtml;

			sliderInner.appendChild(innerDiv);
		}

		// Create the navigation dots.
		let dotsContainer = document.createElement('div');
		dotsContainer.id = "dots";

		for (var i = 0; i < this.data.length; i++) {
			let item = this.data[i].Item;
			let index = i;
			let dotContainer = document.createElement('div');
			dotContainer.classList.add('dot-container');
			dotContainer.innerHTML = `<div class="dot" data-number="${i}"></div>`;
			dotContainer.addEventListener("click", () => this.changeSlide(index));
			dotsContainer.appendChild(dotContainer);
		}

		// Create navigation bar and buttons.
		let bottomBar = document.createElement('div');
		bottomBar.id = 'slider__bottom-bar';

		let backButton = document.createElement('button');
		backButton.id = "slider__button--back";
		backButton.classList.add('btn', 'btn-dark');
		backButton.innerText = "<";
		backButton.addEventListener('click', () => this.changeSlide('back'));

		let forwardButton = document.createElement('button');
		forwardButton.id = "slider__button--forward";
		forwardButton.classList.add('btn', 'btn-dark');
		forwardButton.innerText = ">";
		forwardButton.addEventListener('click', () => this.changeSlide('forward'));

		bottomBar.appendChild(backButton);
		bottomBar.appendChild(dotsContainer);
		bottomBar.appendChild(forwardButton);

		slider.appendChild(bottomBar);
	}

	// Change the slide to either next, previous, or a specific one.
	changeSlide(direction) {
		let currentSlideNumber = parseInt(document.querySelector('.dot.active').dataset.number);
		let nextSlideNumber;

		// If direction is forward, fo forth, if it's back, go back. If it's neither, it has to be a specific slide number.
		if( direction === "forward" ) {
			// Also check, if there is a next element, otherwise return the first index.
			nextSlideNumber = currentSlideNumber + 1 == this.data.length ? 0 : currentSlideNumber + 1;
		} else if ( direction === "back" ) {
			// Check, if there is a previous element. Otherwise return last index.
			nextSlideNumber = currentSlideNumber - 1 < 0 ? this.data.length - 1 : currentSlideNumber - 1;
		} else {
			nextSlideNumber = parseInt(direction);
		}

		// Remove the active classes from the current active elements.
		document.querySelector('.dot.active').classList.remove('active');
		document.querySelector('.slide.visible').classList.remove('visible');

		// Add the classes to the next active elements.
		document.getElementsByClassName('dot')[nextSlideNumber].classList.add('active');
		document.getElementsByClassName('slide')[nextSlideNumber].classList.add('visible');
	}
}