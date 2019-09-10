window.addEventListener( "DOMContentLoaded", (e) => {
    console.log("DOM loaded");
	_init();
} );

function _init() {
	let model = new Model();
	let view = new View(model);
	let controller = new Controller(model, view);
}
