---
---

// Initialize search function on page load.
$(document).ready(function() {
	var navigate_to_search_page = function(){
		var query = $("#search-input").val();
		window.location.href = "/search?query=" + query;
	};

	// Register search event handler for search button
	$("#search-button").click(function(event){
		event.preventDefault();
		navigate_to_search_page();
	});

	// Register search event handler for search field on enter.
	$("#search-input").keypress(function(event) {
		var enter_key_code = 13;
		if(event.which === enter_key_code){
			event.preventDefault();
			navigate_to_search_page();
		}
	});
});

// Initialize search content if on search page
$(document).ready(function() {
	var search_engine = function (){
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
								tags: post.tags.split(" , "),
								excerpt: post.excerpt,
								url: post.url
							};
						})[0];
				});
			}
		};
	};

	var initialize_search_content = function(query, search_results){
		$.get("/blog/js/searchresult.mst", function(template){
			var query_result = {
				query: query, 
				results: search_results
			};
			$("#search-content").html(Mustache.render(template, query_result));
		});
	};

	var load_search_page = function(){
		var query = $.url().param("query");
		var results = search_engine().search(query);
		initialize_search_content(query, results);
	};

	if($("#search-content").length > 0){
		load_search_page();
	}
});