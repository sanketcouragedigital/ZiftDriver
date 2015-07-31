$(function() {
	$.validator.addMethod('customMobile', function(value, element) {
		return this.optional(element) || /^([789]\d{9})$/.test(value);
	}, "Please enter a valid 10 digit number");
	
	$('#updateForm').validate({
        rules: {
            oldmobileno : {
            	customMobile : true,
            	required : true
            },
            newmobileno : {
            	customMobile : true
            }
        },
        messages : {
			oldmobileno : {
				required : "Please enter a Mobile No."
			}
		},
        errorPlacement: function( error, element ) {
			error.insertAfter( element.parent() );
		}
    });
    
    $("#update").click(function() {
    	if($('#oldmobileno').valid()) {
			if($('#newmobileno').valid()) {
				var data = {
					oldmobileno : $("#oldmobileno").val(),
					newmobileno : $("#newmobileno").val(),
					newtaxino : $("#newtaxino").val(),
					method : "update",
					format : "json"
				};
				$.post("http://www.ziftapp.com/dev/api/ziftDriverDetailsAPI.php", data).done(function(response) {
					if(response.driverUpdate === "DRIVER_DETAILS_UPDATED") {
						$("#dlg-update-success").dialog({
	      					modal: true,
	     					buttons: {
	        					Ok: function() {
	          						$( this ).dialog( "close" );
	        					}
	      					}
	    				});
	    				$("element.style").css("background","white !important");
	    				window.location.href="index.html";
					} else if(response.driverUpdate === "ERROR_MOBILE_NO") {
						$("#dlg-update-mobileno-error").dialog({
	      					modal: true,
	     					buttons: {
	        					Ok: function() {
	          						$( this ).dialog( "close" );
	        					}
	      					}
	    				});
	    				$("element.style").css("background","white !important");
					} else {
						$("#dlg-update-error").dialog({
	      					modal: true,
	     					buttons: {
	        					Ok: function() {
	          						$( this ).dialog( "close" );
	        					}
	      					}
	    				});
	    				$("element.style").css("background","white !important");
	    				document.getElementById("oldmobileno").value = "";
	    				document.getElementById("newmobileno").value = "";
	    				document.getElementById("taxino").value = "";
					}
				}).fail(function() {
					$("#dlg-update-server-error").dialog({
						modal : true,
						buttons : {
							Ok : function() {
								$(this).dialog("close");
							}
						}
					});
					$("element.style").css("background","white !important");
					//When we do not receive a 200 OK from the server.
				});
			}
		}
	});
});
