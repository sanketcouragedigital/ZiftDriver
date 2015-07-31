$(function() {
	$.validator.addMethod('customMobile', function(value, element) {
		return this.optional(element) || /^([789]\d{9})$/.test(value);
	}, "Please enter a valid 10 digit number");

	$('#registerForm').validate({
        rules: {
        	name : {
        		required : true
        	},
            mobileno : {
            	customMobile : true,
            	required : true
            },
            taxino : {
            	required : true
            }
        },
        messages : {
        	name : {
        		required : "Please enter your Name"
        	},
			mobileno : {
				required : "Please enter a Mobile No."
			},
			taxino : {
				required : "Please enter your Taxi No."
			}
		},
        errorPlacement: function( error, element ) {
			error.insertAfter( element.parent() );
		}
    });
    
    $("#register").click(function() {
		if($('#name').valid() && $('#mobileno').valid() && $('#taxino').valid()) {
			var data = {
				name : $("#name").val(),
				mobileno : $("#mobileno").val(),
				taxino : $("#taxino").val(),
				isVerify : "false",
				method : "register",
				format : "json"
			};
			$.post("http://www.ziftapp.com/dev/api/ziftDriverDetailsAPI.php", data).done(function(response) {
				if(response.driverRegister === "DRIVER_DETAILS_SAVED") {
					$("#dlg-register-success").dialog({
						modal : true,
						buttons : {
							Ok : function() {
								$(this).dialog("close");
							}
						}
					});
					$("element.style").css("background","white !important"); 
					window.location.href="forhire.html";
				} else {
					$("#dlg-register-error").dialog({
      					modal: true,
     					buttons: {
        					Ok: function() {
          						$( this ).dialog( "close" );
        					}
      					}
    				});
    				$("element.style").css("background","white !important");
					document.getElementById("name").value = "";
					document.getElementById("mobileno").value = "";
					document.getElementById("taxino").value = "";
				}
			}).fail(function() {
				$("#dlg-register-server-error").dialog({
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
	});
});
