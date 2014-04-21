// Search in title, tags, content
function search() {
	var query = $("#search-input").val();
    alert(query);
};

// Initialize search function on page load.
$(document).ready(function() {
	// Register search event handler for search button
	$("#search-button").click(function(event){
		event.preventDefault();
		search();
	});

	// Register search event handler for search field on enter.
	$("#search-input").keypress(function(event) {
		var enter_key_code = 13;
		if(event.which === enter_key_code){
			event.preventDefault();
			search();
		}
	});
});