$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results f previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

    $('.inspiration-getter').submit( function(event){
		// zero out results f previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags1 = $(this).find("input[name='answerers']").val();
		getTopanswers(tags1);
	});

});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

var getTopanswers = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	
	var request = {
						site: 'stackoverflow',		
					};
	
	var result = $.ajax({
		url:'http://api.stackexchange.com/2.2/tags/'+tags+'/top-answerers/all_time',
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result) {
     var html;
      
     $.each(result.items, function(index,value){
        var display_name="";
        var link_name="";
        var reputation="";
        var profile_image="";
        var user_id="";
        var user_type="";
        html="";

        display_name=(value.user.display_name);
         link_name=(value.user.link)
         profile_image=(value.user.profile_image);
         reputation=(value.user.reputation);
         user_id=(value.user.user_id);
         user_type=(value.user.user_type);

         html= '<p> User Name:'+display_name+ '<br> Reputation:'+reputation+ '<br>'+
         '<a href="'+link_name+'">'+
         '<img src=' + profile_image+ '>'+
         '</p>';


         html= '<dl class="result question">'+
           '<dt>User Name:'+'</dt>'+
           '<dd>'+display_name+'</dd>'+
           '<dt> Reputation:'+'</dt>'+
           '<dd>'+reputation+ '</dd>'+
           '<dd><a href="'+link_name+'">'+'</dd>'+
         '<dd>'+'<img src=' + profile_image+ '>'+ '</dd>'
         '</dl>';
$('.results').append(html);
      });
 

});
};


