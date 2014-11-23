
$(document).ready(function(){

	$("#picture_submit_button").hide();


	$('#choose-file').hide();
	$("#styled-choose-button").click(function(){
		$('#choose-file').click()
	})

	$('#choose-file').change(function() {
  		$('#picture_submit_button').click()
	});

	$('#picture_submit_button').click(function() {
		
		var html = "<div class='container-3 bis'>"+
				  "<div class='item-1'><span></span></div>"+
				  "<div class='item-2'><span></span></div>"+
				  "<div class='item-3'><span></span></div>"+
				  "<div class='item-4'><span></span></div>"+
				  "<div class='item-5'><span></span></div>"+
				  "<div class='item-6'><span></span></div>"+
				"</div>"

  		$('#styled-choose-button').replaceWith(html)
	})


  			
})