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
							date: post.date,
							tags: post.tags.split(","),
							excerpt: post.excerpt,
							url: post.url
						};
					})[0];
			});
		}
	};
};

function search() {
	var get_search_query = function(){
		return $("#search-input").val();
	};

	var clear_search_query = function(){
		$("#search-input").val("");
	 	$("#search-input").blur();
	};

	var load_search_page = function(query, results){
		$.get("/blog/js/searchresult.mst", function(template){
			var query_result = {
				query: query, 
				results: results
			};
			$("#content").html(Mustache.render(template, query_result));
		});
	};
	
	var query = get_search_query();
	clear_search_query();
	var results = search_engine().search(query);
	load_search_page(query, results);	
};