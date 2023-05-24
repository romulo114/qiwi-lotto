
$(function() {

  
$(".more-lotto-details").click(function(e){
		if($(this).closest(".product-line").find(".hiddenlinenumbers").hasClass("show-line-numbers")){
		   $(this).closest(".product-line").find(".hiddenlinenumbers").removeClass("show-line-numbers");
		}
		else{
		   $(this).closest(".product-line").find(".hiddenlinenumbers").addClass("show-line-numbers");
		}
	});
  $("#signupform").validate({
    // Specify validation rules
    rules: {
      fname: "required",
      lname: "required",
      phone: "required",
      email: {
        required: true,
        email: true,
		remote: "/index.php/home/email_check"
      },
      password: {
        required: true,
        
      },
	  
	conf_password : {
		required: true,		
		equalTo : "#password"
	}
    },
    // Specify validation error messages
    messages: {
		firstname: "Please enter your firstname",
		lastname: "Please enter your lastname",
		phone: "Please enter your phone",
		password: {
			required: "Please provide a password",
		},	
		email: {
			required:"Please enter email",
			email:"Please enter a valid email address",
			remote:"Email already exists.",
		},
		conf_password : {		
			required : "Plesae enter confirm password",
			equalTo : "Confirm password does not match."
		}
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      form.submit();
    }
  });
  




  $("#signupform1").validate({
    // Specify validation rules
    rules: {
      fname: "required",
      lname: "required",
      phone: "required",
      email: {
        required: true,
        email: true,
		remote: "/index.php/home/email_check"
      },
      password1: {
        required: true,
        
      },
	  
	conf_password : {
		required: true,		
		equalTo : "#password1"
	}
    },
    // Specify validation error messages
    messages: {
		firstname: "Please enter your firstname",
		lastname: "Please enter your lastname",
		phone: "Please enter your phone",
		password1: {
			required: "Please provide a password",
		},	
		email: {
			required:"Please enter email",
			email:"Please enter a valid email address",
			remote:"Email already exists.",
		},
		conf_password : {		
			required : "Plesae enter confirm password",
			equalTo : "Confirm password does not match."
		}
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      form.submit();
    }
  });
  
    $("#signinform").validate({
    // Specify validation rules
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
      
      }
    },
    // Specify validation error messages
    messages: {
		password: {
			required: "Please provide a password",			
		},	
      email: "Please enter a valid email address"
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      form.submit();
    }
  });

  $(".remove-button").click(function(){
    var rowid=$(this).attr("data-rowid");
	$this=$(this);
    $.ajax({
      method: "POST",
      url: CONFIG.base_url+"cart/delete/",
      data: { rowid: rowid }
    })
    .done(function( data ) {
     //if(data.error==0){
      $this.closest(".product-line").remove();
     //}
    });

  });

  $("#submit_order").click(function(e){
    e.preventDefault();
    if ($('#term').prop("checked")==false) {
      alert("Please accept terms and conditions");
      return;
    }
    var price=$("#order_total").val();
    var payment_method=$("#payment_method").val();
    $.ajax({
      method: "POST",
      url: CONFIG.base_url+"/checkout_payment",
      data: { price: price,payment_method:payment_method }
    })
    .done(function( data ) {
      //$("#load_payment").attr('src',data);
      //$(data).filter('.modal').modal('show');
      
      $(".load-iframe").html(data);
      $(".modal").modal('show');
      //$('#myModal').modal('show');
     
    });

  })

  
  
});