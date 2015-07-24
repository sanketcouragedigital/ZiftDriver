$(function() {
	$.validator.addMethod('customMobile', function(value, element) {
		return this.optional(element) || /^([789]\d{9})$/.test(value);
	}, "Please enter a valid 10 digit number");

	$.validator.addMethod("passwordCheck", function(value) {
		return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value)
		&& /[A-Z]/.test(value)
		&& /\d/.test(value);
	}); 

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
            },
            password : {
            	required : true,
				minlength : 6,
				passwordCheck : true
            },
            confirmPassword : {
            	required: true,
				equalTo: "#password"
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
			},
			password: {
				required : "Please enter a Password",
				minlength : "Your password must be at least 6 characters long",
				passwordCheck : "Please enter atleast one digit and one upper case letter."
			},
			confirmPassword: {
				required : "Please enter a password",
				equalTo : "Please enter the same password as above"
			}
		},
        errorPlacement: function( error, element ) {
			error.insertAfter( element.parent() );
		}
    });
    
    $("#register").click(function() {
		if($('#name').valid() && $('#mobileno').valid() && $('#taxino').valid() && $('#password').valid() && $('#confirmPassword').valid()) {
			var data = {
				name : $("#name").val(),
				mobileno : $("#mobileno").val(),
				taxino : $("#taxino").val(),
				password : $("#confirmPassword").val(),
				isVerify : "false",
				method : "register",
				format : "json"
			};
			$.post("http://localhost/ZiftAPI/api/ziftDriverLoginRegisterAPI.php", data).done(function(response) {
				if(response.driverRegister === "DRIVER_DETAILS_SAVED") {
					alert("Thank you for registration!");
				} else {
					alert("Mobile No. already registered!");
				}
			}).fail(function() {
				//When we do not receive a 200 OK from the server.
			});
		}
	});
});
