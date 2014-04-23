---
---

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

function search_engine(){
	var index;
	var posts = [];

	var init_index = function(){
		index = lunr(function(){
			this.field('title', {boost: 100});
			this.field('tags', {boost: 10});
			this.field('content');
			this.ref('url');
		});
	};

	var init_posts = function(){
		{%for post in site.posts %}
		var search_entry = {% include searchentry.json %};
		index.add(search_entry);
		posts.push(search_entry);
		{% endfor %}
	};

	init_index();
	init_posts();

	return {
		search: function(query){
			return index.search(query).map(function(search_result){
				return posts
					.filter(function(post){
						return post.url === search_result.ref;
					})
					.map(function(post){
						return {
							title: post.title,
							url: post.url
						};
					})[0];
			});
		}
	};
};

function search() {
	var query = $("#search-input").val();
	var results = search_engine().search(query);
    alert(query + " (" + results.length + " results)");
};