$(document).ready(function(){

	$( "#displayImage" ).live( 'change', function( e ) {
		var files = [];
		if(e.srcElement){
			files = e.srcElement.files[0]
		}
	  
	  console.log( files );

		var xhr = new XMLHttpRequest();
		
		var formData = new FormData();
		formData.append('displayImage', files);
		
		xhr.open('POST', '/imageupload', true);
		xhr.send(formData);
		/*$.ajax({
			url:'/imageupload',
			type:'POST',
			dataType:'html',
			data:formdata,
			success:function(resp){
				console.log(resp)
			},
			error:function(err){
				console.log(err.statusText)
			}
		});*/
		
	})
})