/*
Main JS for tutorial: "Getting Started with HTML5 Local Databases"
Written by Ben Lister (darkcrimson.com) revised May 12, 2010
Tutorial: http://blog.darkcrimson.com/2010/05/local-databases/

Licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php
*/

$(function(){ 
	var localDBDemo = {
		init: function () {
			this.initDatabase();
			var url = window.location.href;
			var queryString = url ? url.split('=')[1] : window.location.search.slice(1);
			if(queryString != ""){
				localDBDemo.getAdvt_by_id(queryString);
			}
			localDBDemo.getuserdetails();
			
		$('#advt-details-form').submit(function(){
			var data = $(this).serializeArray();
            var formData = $(this);
            resetErrors();
            var status = 0;
            $.ajax({
                url:BaseUrl+"sms",
                async: false,
				data: data,
                dataType:'json', 
                type:'post',
                success: function(data) {
                    if(data.status==1){
						$('#flash_message').html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>You have been successfully Submmited .</div>');
					     window.location.href = "index.html";					
					}else if(data.status==0){
						if(jQuery.type(data.message)=='string'){
							$('#flash_message').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+data.message+'</div>');
						}else{
							$.each(data.message,function(field_name,msg){
							var msg_data = '<label class="error" for="'+field_name+'">'+msg+'</label>';
							$('input[name="' + field_name + '"], select[name="' + field_name + '"]').addClass('inputTxtError').after(msg_data);
							
						});	
					 }
					} 
                   
                }, 
       error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
        alert('error');
      }

            });
             
           return false; 
            
        });

				function resetErrors() {
				$('form input, form select').removeClass('inputTxtError');
				$('#flash_message').html('');
				$('label.error').remove();
				}
        
		},

		initDatabase: function() {
			try {
			    if (!window.openDatabase) {
			        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
			    } else {
			        var shortName = 'DEMODB',
			        	version = '1.0',
						displayName = 'DEMODB Test',
						maxSize = 100000; // in bytes
			        DEMODB = openDatabase(shortName, version, displayName, maxSize);
			    }
			} catch(e) {
			    if (e === 2) {
			        // Version mismatch.
			        console.log("Invalid database version.");
			    } else {
			        console.log("Unknown error "+ e +".");
			    }
			    return;
			} 
		},dataSelectHandler: function( transaction, results ) {
				var i=0,
				row;
		   for (i ; i<results.rows.length; i++) {
			   row = results.rows.item(i);
			 	$("#Advt-details-show").append('<img src="'+row['image']+'" height="300"  style="width:100%;">');
			 //	$("#Advt-details-show").append('<form action="" method="post" id="advt-details-form">');
			 	$("#advt-details-form").append('<input type="hidden" name="advt_id" value="'+row['id']+'">');
					}
				
				}, 
		  getAdvt_by_id: function(id) {
	    	var that = this;
			DEMODB.transaction(
			    function (transaction) {
			        transaction.executeSql("SELECT * FROM vendor_advt WHERE id = "+id+";", [], that.dataSelectHandler, that.errorHandler);
			    }
			);			    
	    },
	    
	    dataSelectHandleruser: function( transaction, results ) {
				var i=0,
				row;
		   for (i ; i<results.rows.length; i++) {
			   row = results.rows.item(i);	
			    $("#advt-details-form").append('<input type="text" name="name" value="'+row['first_name']+' '+row['middle_name']+' '+row['last_name']+'" placeholder="Enter Your Name"><br><br>');
			 	$("#advt-details-form").append('<input type="text" name="phone" value="'+row['phone']+'" placeholder="Enter Your Phone Number"><br><br>');
			 	$("#advt-details-form").append('<textarea name="meassge" placeholder="Enter Your Message"></textarea><br><br>');
				$("#advt-details-form").append('<input type="hidden" name="user_id" value="'+row['id']+'">');
			 	$("#advt-details-form").append('<input type="hidden" name="myip" value="'+myip+'"><br><br>');
			 	$("#advt-details-form").append('  <button  id="submitbutton" class="k-button k-primary">SUBMIT</button>');
			 //	$("#Advt-details-show").append('</form>');
			 	}
				
				}, 
		  getuserdetails: function(id) {
	    	var that = this;
			DEMODB.transaction(
			    function (transaction) {
			        transaction.executeSql("SELECT * FROM users ;", [], that.dataSelectHandleruser, that.errorHandler);
			    }
			);			    
	    },
	    dropTables: function(table_name) {
			var that = this;
			DEMODB.transaction(
			    function (transaction) {
			    	transaction.executeSql("DROP TABLE "+table_name+";", [], that.nullDataHandler, that.errorHandler);
			    }
			);
			console.log("Table 'page_settings' has been dropped.");
		}
		
	};

 	localDBDemo.init();
	
});	

