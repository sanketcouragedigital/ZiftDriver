var geocoder;
var timerId;
var clicked = false;
$(function() {
	$.validator.addMethod('customMobile', function(value, element) {
		return this.optional(element) || /^([789]\d{9})$/.test(value);
	}, "Please enter a valid 10 digit number");

	$('#forHireForm').validate({
        rules: {
            mobileno: {
            	customMobile : true,
            	required : true
            }
        },
        messages : {
			mobileno : {
				required : "Please enter a Mobile No.",
			}
		},
        errorPlacement: function( error, element ) {
			error.insertAfter( element.parent() );
		}
    });
	
	$("#hired").hide();
	
	$("#forHire").click(function() {
		if($('#mobileno').valid()) {
			findCurrentlatlong();
			timerId = setInterval(findCurrentlatlong, 300000);
			$("#hired").show();
			if (clicked === false) {
				$(this).addClass('ui-disabled');
				clicked = true;
			}
		}
	});
	
	$("#hired").click(function() {
		clearInterval(timerId);
		deleteDriverLocationEntry();
		document.getElementById("mobileno").value = "";
		$("#hired").hide();
		$('#forHire').removeClass('ui-disabled');
		clicked = false;
	});

	function findCurrentlatlong() {
		geocoder = new google.maps.Geocoder();
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var latitude = position.coords.latitude;
				var longitude = position.coords.longitude;
				findAreaofLocation(latitude, longitude);
			});
		} else {
			alert("Location not found");
		}
	}

	function findAreaofLocation(latitude, longitude) {
		var latlng = new google.maps.LatLng(latitude, longitude);
		geocoder.geocode({
			'latLng' : latlng
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {

					var add = results[0].formatted_address;
					var value = add.split(",");

					count = value.length;
					country = value[count - 1];
					state = value[count - 2];
					city = value[count - 3];
					area = value[count - 4];
					saveCurrentLocation(latitude, longitude, area);
				} else {
					alert("No results found");
				}
			} else {
				alert("Geocoder failed due to: " + status);
			}
		});
	}

	function saveCurrentLocation(latitude, longitude, area) {
		var data = {
			mobileno : $("#mobileno").val(),
			latitude : latitude,
			longitude : longitude,
			area : area,
			method : "forhire",
			format : "json"
		};
		$.post("http://www.ziftapp.com/api/ziftapi.php", data, function(response){
			if(response.forHireData === "LOCATION_SAVED") {
				alert("Please wait. We are searching Fare for you!");
			}
		}).done(function(response) {
			
			//Successful response from server goes here.
		}).fail(function() {
			//When we do not receive a 200 OK from the server.
		});
	}
	
	function deleteDriverLocationEntry() {
		var data = {
			mobileno : $("#mobileno").val(),
			method : "hired",
			format : "json"
		};
		$.post("http://www.ziftapp.com/api/ziftapi.php", data).done(function() {
			//Successful response from server goes here.
		}).fail(function() {
			//When we do not receive a 200 OK from the server.
		});
	}
}); 