/*
Main JS for tutorial: "Getting Started with HTML5 Local Databases"
Written by Ben Lister (darkcrimson.com) revised May 12, 2010
Tutorial: http://blog.darkcrimson.com/2010/05/local-databases/

Licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php
*/

$(function(){ 
	
	var localAherbook = {
		init: function () {
			//localAherbook.emptyTables('vendor_advt'); 
			this.initDatabase();
			// Button and link actions
			//this.dropTables();
			 $('#clear').on('click', function(){ 
				localAherbook.DropAllTable(); 
			});
			$('#logout').on('click', function(){ 
				localAherbook.dropAllTable();
				window.location.href = getAbsolutePath()+"login.html";
			});
			$('.loginForm').submit(function(){
				// clear localdb
				resetErrors();
				//localAherbook.dropAllTable();
				
				$('#loader').css('display','block'); 
				var data = $(this).serializeArray();
				var formData = $(this);
				var status = 0;
				$.ajax({
					url:BaseUrl+"user_login",
					async: false,
					data: data,
					dataType:'json', 
					type:'post',
					success: function(data) {
						if(data.status==1){
					  
						
				   if(data.content.user_data != ""){
						localAherbook.userDatasave(data.content.user_data,data.content.user_books,data.content.user_book_record,data.content.user_advt);
						
				 }
				 //return false;
					$('#loader').css('display','none'); 
					$('#flash_message').html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>You have been successfully logged in.</div>');
					 
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
				 $('#loader').css('display','none'); 
				}else{
					 
						$('#flash_message').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Server down</div>');
						$('#loader').css('display','none');
				} 
			   
			}

		});
		 
	   return false; 

	});
       //localAherbook.selectUser();
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
			        var shortName = 'AHERBOOK',
			        	version = '1.0',
						displayName = 'AHERBOOK DB',
						maxSize = 100000; // in bytes
			        AHERBOOK = openDatabase(shortName, version, displayName, maxSize);
					this.createTables();
					//this.selectAll();
					//this.dataadvt(all_advt)
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
		},
		 alertmsg: function() {
		   alert('dd');
	   },
		/***
		**** CREATE TABLE ** 
		***/
		createTables: function() {
			var that = this;
			AHERBOOK.transaction(
		        function (transaction) {
		        	transaction.executeSql('CREATE TABLE IF NOT EXISTS users(id INTEGER NOT NULL PRIMARY KEY, title TEXT NOT NULL, user_name TEXT NOT NULL, first_name TEXT NOT NULL, middle_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, comment TEXT NOT NULL, image TEXT NOT NULL, password TEXT NOT NULL, roll TEXT NOT NULL, status INTEGER NOT NULL, datetime TEXT NOT NULL, last_login TEXT);', [], that.nullDataHandler, that.errorHandler);
		        	transaction.executeSql('CREATE TABLE IF NOT EXISTS user_book(id INTEGER NOT NULL PRIMARY KEY, user_id INTEGER NOT NULL, book_name TEXT NOT NULL, event_date TEXT NOT NULL , event_time TEXT NOT NULL, event_date_formate TEXT NOT NULL, message TEXT NOT NULL, groom_name TEXT NOT NULL, bride_name TEXT NOT NULL, groom_image TEXT NOT NULL, bride_image TEXT NOT NULL, couple_image TEXT NOT NULL, location_address TEXT NOT NULL, home_address TEXT NOT NULL, status INTEGER NOT NULL, datetime TEXT);', [], that.nullDataHandler, that.errorHandler);
		        	transaction.executeSql('CREATE TABLE IF NOT EXISTS user_book_records(id INTEGER NOT NULL PRIMARY KEY, user_id INTEGER NOT NULL, user_book_id INTEGER NOT NULL, gift_type INTEGER NOT NULL, amount FLOAT NOT NULL, gift_name TEXT NOT NULL, gold_name TEXT NOT NULL, name TEXT NOT NULL, sur_name TEXT NOT NULL, father_name TEXT NOT NULL, villege TEXT NOT NULL, status INTEGER NOT NULL, created_date TEXT);', [], that.nullDataHandler, that.errorHandler);
		        	transaction.executeSql('CREATE TABLE IF NOT EXISTS vendor_advt(id INTEGER NOT NULL PRIMARY KEY, vendor_name TEXT NOT NULL, advt_title TEXT NOT NULL, advt_description TEXT NOT NULL, image TEXT NOT NULL, advt_start_date TEXT NOT NULL, advt_end_date TEXT NOT NULL, advt_amount_paid FLOAT NOT NULL, phone INTEGER NOT NULL, created_date TEXT NOT NULL, updated_date TEXT NOT NULL, status INTEGER NOT NULL);', [], that.nullDataHandler, that.errorHandler);
		         }
		    );	
		},

		/***
		**** INSERT INTO TABLE ** 
		***/		
		userDatasave: function(datavalue,databook,databookrecord,advtdata) {
			AHERBOOK.transaction(
			    function (transaction) {
					//alert(datavalue.title);
					//alert(JSON.stringify(datavalue));
				 	transaction.executeSql("INSERT INTO users(id, title, user_name, first_name, middle_name, last_name, email, phone, address, comment, image, password, roll, status, datetime, last_login) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [datavalue.id, datavalue.title, datavalue.user_name, datavalue.first_name, datavalue.middle_name, datavalue.last_name, datavalue.email, datavalue.phone, datavalue.address, datavalue.comment, datavalue.image, datavalue.password, datavalue.roll, datavalue.status, datavalue.datetime, datavalue.last_login]);	
							
			         $.each(databook,function(field_name,msg){
						 
						transaction.executeSql("INSERT INTO user_book(id, user_id, book_name, event_date, event_time, event_date_formate, message, groom_name, bride_name, groom_image, bride_image, couple_image, location_address, home_address, status, datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [msg.id, msg.user_id, msg.book_name, msg.event_date, msg.event_time, msg.event_date_formate, msg.message,  msg.groom_name, msg.bride_name, msg.groom_image, msg.bride_image, msg.couple_image, msg.location_address, msg.home_address, msg.status, msg.datetime]);	 		
						}); 
						
					$.each(databookrecord,function(field_name,msg){
						transaction.executeSql("INSERT INTO user_book_records(id, user_id, user_book_id, gift_type, amount, gift_name, gold_name, name, sur_name, father_name, villege, status, created_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [msg.id, msg.user_id, msg.user_book_id, msg.gift_type, msg.amount, msg.gift_name, msg.gold_name, msg.name, msg.sur_name, msg.father_name, msg.villege, msg.status, msg.created_date]);			
					});
			        
			        $.each(advtdata,function(field_name,msg){
						transaction.executeSql("INSERT INTO vendor_advt(id, vendor_name, advt_title, advt_description, image, advt_start_date, advt_end_date, advt_amount_paid, phone, created_date, updated_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [msg.id, msg.vendor_name, msg.advt_title, msg.advt_description, msg.image, msg.advt_start_date, msg.advt_end_date, msg.advt_amount_paid, msg.phone, msg.created_date, msg.updated_date, msg.status]);			
						});
						
						 
			    }
			);				
		},
		
		userBooksave: function(datavaluea) {
			AHERBOOK.transaction(
			    function (transaction) {
				
					$.each(datavaluea,function(field_name,msg){
						transaction.executeSql("INSERT INTO user_book(id, user_id, book_name, event_date, event_time, event_date_formate, message, groom_name, bride_name, groom_image, bride_image, couple_image, location_address, home_address, status, datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [msg.id, msg.user_id, msg.book_name, msg.event_date, msg.event_time, msg.event_date_formate,msg.message, msg.groom_name, msg.bride_name, msg.groom_image, msg.bride_image, msg.couple_image, msg.location_address,msg.home_address, msg.status, msg.datetime]);			
						}); 
				
			    }
			);				
		},
		
		userBookrecordsaves: function(datavalue) {
			AHERBOOK.transaction(
			    function (transaction) {
					
					$.each(datavalue,function(field_name,msg){
						transaction.executeSql("INSERT INTO user_book_records(id, user_id, user_book_id, gift_type, amount, gift_name, gold_name, name, sur_name, father_name, villege, status, created_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [msg.id, msg.user_id, msg.user_book_id, msg.gift_type, msg.amount, msg.gift_name, msg.gold_name, msg.name, msg.sur_name, msg.father_name, msg.villege, msg.status, msg.created_date]);			
						});
					}
			);				
		},
		
		userAdvtsave: function(datavalue) {
			AHERBOOK.transaction(
			    function (transaction) {
					$.each(datavalue,function(field_name,msg){
						transaction.executeSql("INSERT INTO vendor_advt(id, vendor_name, advt_title, advt_description, image, advt_start_date, advt_end_date, advt_amount_paid, phone, created_date, updated_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [msg.id, msg.vendor_name, msg.advt_title, msg.advt_description, msg.image, msg.advt_start_date, msg.advt_end_date, msg.advt_amount_paid, msg.phone, msg.created_date, msg.updated_date, msg.status]);			
						});
				 }
			);				
		},
		
		 
	   
	    
	    dataadvt: function(results) {
			$.each(results,function(field_name,msg){
							alert(msg);
						});	 
	    },
	    
		/***
		**** Save 'default' data into DB table **
		***/
	    saveAll: function() {
		    this.prePopulate(1);
	    },
	    
	    errorHandler: function( transaction, error ) {
	    
		 	if (error.code===1){
		 		// DB Table already exists
		 	} else {
		    	// Error is a human-readable string.
			    console.log('Oops.  Error was '+error.message+' (Code '+ error.code +')');
		 	}
		    return false;		    
	    },
	    
	    nullDataHandler: function() {
		    console.log("SQL Query Succeeded");
	    },
	    
		 
		/***
		**** SELECT DATA **
		***/	    
	  /*  selectUser: function() {
			
	    	var that = this;
			AHERBOOK.transaction(
			    function (transaction) {
			        transaction.executeSql("SELECT * FROM users;", [], that.UserSelectHandler, that.errorHandler);
			    }
			);			    
	    },*/
	    
		/***
		**** DELETE DB TABLES ** 
		***/
		dropAllTable : function() {
			 
			var that = this;
			AHERBOOK.transaction(
				function (transaction) {
					var tables = ["users", "user_book", "user_book_records", "vendor_advt"];
			    
					for (i = 0; i < tables.length; i++) { 
						transaction.executeSql("DROP TABLE "+tables[i] +";", [], that.nullDataHandler, that.errorHandler);
						//alert("DROP TABLE "+tables[i] +";");
					} 
			    	
				}
			);
						
		},
		
		dropuserTables: function() {
			var that = this;
			AHERBOOK.transaction(
			    function (transaction) {
			    	transaction.executeSql("DROP TABLE users;", [], that.nullDataHandler, that.errorHandler);
			    	}
			);
						
		},
		
		dropuserbookTables: function() {
			var that = this;
			AHERBOOK.transaction(
			    function (transaction) {
			    	transaction.executeSql("DROP TABLE user_book;", [], that.nullDataHandler, that.errorHandler);
			    	}
			);
						
		},
		
		dropuserbookrecordsTables: function() {
			var that = this;
			AHERBOOK.transaction(
			    function (transaction) {
			    	transaction.executeSql("DROP TABLE user_book_records;", [], that.nullDataHandler, that.errorHandler);
			    	}
			);
						
		},
		dropvendorTables: function() {
			var that = this;
			AHERBOOK.transaction(
			    function (transaction) {
			    	transaction.executeSql("DROP TABLE vendor_advt;", [], that.nullDataHandler, that.errorHandler);
			    	
				}
			);
						
		}
		
	    
	};
 	//Instantiate Demo
 	localAherbook.init();
	
});	

