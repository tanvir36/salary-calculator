document.getElementById("calculate").addEventListener("submit",calculateHandler=(event)=>{
    event.preventDefault();

    // Getting all the values from the form
    var uname = event.target.uname.value;
    var email = event.target.email.value;
    var gender = event.target.gender.value;
    var dependents = event.target.dependents.value;
    var grossPay = event.target.grossPay.value;
    var tax;
    var cpp = 3166.45;
    var ei = 889.54;
    var totalDeductions;

    // checking if they contain null value
    nullValidation(uname, "uname");
    nullValidation(email, "email");
    nullValidation(gender, "gender");
    nullValidation(dependents, "dependents");
    nullValidation(grossPay, "grossPay");

    //checking for email format
    emailVal(email);

    // checking if the field are not null 
    if (nullValidation(uname, "uname") && nullValidation(email, "email") &&
        nullValidation(gender, "gender") && nullValidation(dependents, "dependents")
        && nullValidation(grossPay, "grossPay")&& emailVal(email)) {
            tax = taxCal(grossPay, gender, dependents);
            var fedTax = tax[0];
            var provTax = tax[1];
            var dependentBenefit = dependentsCal(dependents);
            var totalDeductions = Number(fedTax)+Number(provTax)+cpp+ei;
            var netPay = Number(grossPay)-Number(totalDeductions)+Number(dependentBenefit);

    // Displaying calculated values into the html page using DOM
            document.getElementById("fedTax").innerText = "$"+fedTax;
            document.getElementById("provTax").innerText = "$"+provTax;
            document.getElementById("cpp").innerText = "$"+cpp;
            document.getElementById("ei").innerText = "$"+ei;
            document.getElementById("totalDeductions").innerText = "$"+totalDeductions;
            document.getElementById("netPay").innerText = "$"+netPay;
         
    // Jquey to show the final result section         
            $(document).ready(function(){
                $("#result").show();
            });
    
    // Calculating the percentage of  all the values for displaying on piechart
            var fedTaxPie = (fedTax/grossPay)*100;
            var provTaxPie = (provTax/grossPay)*100;
            var cppPie = (cpp/grossPay)*100;
            var eiPie = (ei/grossPay)*100;
            var netPayPie =(netPay/grossPay)*100;
            var name =["Fed Tax", "Prov Tax", "CPP", "EI" , "Net Pay"];     
            var data = [fedTaxPie, provTaxPie,cppPie, eiPie,netPayPie];
            var colors= ["darkgoldenrod", "bisque","darkseagreen", "maroon","#f5e97fc0"];
            var canvas = document.getElementById("piechart");
            var context = canvas.getContext("2d");
            var x= 100;
            var y= 100;
            var radius = 100;
            var starting =0;

        //Making piechart using canvas tag and properties
            for(var i=0; i<data.length; i++) {
                var end = starting + (2 /100 *data[i]); 
                context.beginPath();
                context.fillStyle = colors[i];
                context.moveTo( x,y);
                context.arc(x,y,50,starting*Math.PI,end*Math.PI);
                context.fill();
                starting= end;

        //Making rectangular colored labels for piechart 
                context.rect (220, 25 * i, 15 , 15);
                context.fill();
                context.fillStyle= "cornsilk";
                context.fillText( name [i]  , 245, 25 * i +15);              
            }        
    } else{
        alert ("ALL FIELDS MANDATORY");
    }  
})

//  function to check if any input field is empty
function nullValidation(value, id){
    if (value == ""){
        document.getElementById(id).classList.add("bg-danger");
        return false;
    }else {
        document.getElementById(id).classList.remove("bg-danger");
        return true;
    } 
}

// function to check the proper email format
function emailVal(email){
    let pattern = ("^([a-z A-Z 0-9]+)@([a-z A-Z 0-9]+)\\.([a-z A-Z]{2,5})$");
    if(!email.match(pattern)) {
        document.getElementById("message").innerText= " Email format wrong!!";
        document.getElementById("message").classList.add("label");
        document.getElementById("message").classList.add("label-warning");
        return false;
    } else{
        document.getElementById("message").innerText= "";
        document.getElementById("message").classList.remove("label");
        return true;
    }
}

// Jquey to hide the final result section till all form fields are filled
$(document).ready(function(){
    $("#result").hide();    
});

// function to calculate the dependents benefit 
function dependentsCal(dependents){
    var benefit;
    if(dependents == "one"){
        benefit = 2400;
    }
    else if (dependents == "two"){
        benefit = 3400;
    }
    else if (dependents == "three"){
        benefit = 4200;
    }
    else{
        benefit = 5000;
    }
    return benefit;
}

//function to calculate the Tax taking into account gender and dependents
function taxCal(grossPay, gender,dependents){
    var cpp = 3166.45;
    var ei = 889.54; 
    var dependentBenefit = dependentsCal(dependents);
    var taxableAmt = grossPay - cpp - ei - dependentBenefit;
    var fedTax;
    var provTax;
    
    if(taxableAmt<=45000){
        if(gender == "female"){
            fedTax = taxableAmt*13/100;
        } else{
            fedTax = taxableAmt*15/100;
        }  
        provTax = taxableAmt*5/100;
    } 
    else if(taxableAmt > 45000 && taxableAmt <= 98000){
        if(gender == "female"){
            fedTax = taxableAmt*18/100;
        } else{
            fedTax = taxableAmt*20.5/100;
        }  
        provTax = taxableAmt*9/100;
    }
    else if(taxableAmt > 98000 && taxableAmt <= 150000){
        if(gender == "female"){
            fedTax = grossPay*24/100;
        } else{
            fedTax = taxableAmt*26/100;
        } 
        provTax = taxableAmt*11/100;
    }
    else if(taxableAmt > 150000 && taxableAmt <= 200000){
        if(gender == "female"){
            fedTax = grossPay*27/100;
        } else{
            fedTax = taxableAmt*29/100;
        } 
        provTax = taxableAmt*12/100;
    }
    else if(taxableAmt > 200000){
        if(gender == "female"){
            fedTax = taxableAmt*32/100;
        } else{
            fedTax = taxableAmt*33/100;
        }
        provTax = taxableAmt*13/100;
    }   
    return [fedTax.toFixed(2), provTax.toFixed(2)];
}