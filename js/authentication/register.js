import{ formToJSON } from '../utils/bind.js';
import{ MyHTTP } from '../utils/httpRequest.js';

const http = new MyHTTP;

const   forwardToRegisterAsAstudentOrACompany = document.querySelector("#forwardToRegisterAsAstudentOrACompany"),

        registerUsername = document.querySelector("#registerUsername"),

        reqResisterMessageUsername = document.querySelector("#reqResisterMessageUsername"),

        registerPass = document.querySelector("#registerPass"),

        reqResisterMessagePassword = document.querySelector("#reqResisterMessagePassword"),

        registerRepeatPass = document.querySelector("#registerRepeatPass"),

        reqResisterMessageRepeatPassword = document.querySelector("#reqResisterMessageRepeatPassword"),

        agreeTerms = document.querySelector("#ckb2"),

        reqResisterMessageAgreeTerms = document.querySelector("#reqResisterMessageAgreeTerms"),

        studentForm = document.querySelector("#studentForm"),

        companyForm = document.querySelector("#companyForm");

//Forward to choose if you are a student or a company
forwardToRegisterAsAstudentOrACompany.addEventListener("click", () => {
   
    if(registerUsername.value.trim() === "")
        reqResisterMessageUsername.style.display = "block";
    
    else
        reqResisterMessageUsername.style.display = "none";

    if(registerPass.value.trim() === "")
        reqResisterMessagePassword.style.display = "block";

    else
        reqResisterMessagePassword.style.display = "none";
    

    if(registerRepeatPass.value.trim() === "")
        reqResisterMessageRepeatPassword.style.display = "block";

    else
        reqResisterMessageRepeatPassword.style.display = "none"; 
    
    
    
    if(agreeTerms.checked === false)
        reqResisterMessageAgreeTerms.style.display = "block";

    else
        reqResisterMessageAgreeTerms.style.display = "none"; 
    
    if(registerUsername.value.trim() != "" && registerPass.value.trim() != "" && 
    
        registerRepeatPass.value.trim() != "" && agreeTerms.checked === true){

            if(registerPass.value === registerRepeatPass.value){

                document.getElementById("diffPassw").style.display='none';

                document.getElementById('id01').style.display='block';
            }

            else
                document.getElementById("diffPassw").style.display='block';
    }
    
});

//Student Registration
const studentRegistration = (username, password) => {
    
    let studentData = formToJSON(studentForm.elements);
    
    studentData.username = username;

    studentData.password = password;

    if(document.querySelector("#ckb3").checked === true)
        studentData.workExperience = true;
    
    else
        studentData.workExperience = false;

    
    if(studentData.department != 0){
        
        document.querySelector("#departChoice").style.display = "none";
        
        if(studentData.mobilePhone.trim() === "" || studentData.mobilePhone.length == 10){
            
            document.querySelector("#mobReq").style.display = "none";

            document.querySelector("#loadingImage").style.display = "block";

            //console.log(studentData);

            http.post("http://localhost:8080/pada/register/student", studentData)
            .then(response => {
                
                console.log(response);

                document.querySelector("#registerFail").style.display = "none";

                setTimeout(() => {

                    if(response === "CREATED"){

                        document.querySelector("#loadingImage").style.display = "none";
                        
                        document.querySelector("#registerSuccess").style.display = "block";
                        
                        setTimeout(() => location.reload(), 2000);

                    }
                    else{
                        
                        document.querySelector("#loadingImage").style.display = "none";
                    
                        document.querySelector("#registerFail").style.display = "block";
                    }
    
                }, 3000);
            
            })
            .catch(error => console.log(error))
             
        }
        else
            document.querySelector("#mobReq").style.display = "block";
    }
    
    else
        document.querySelector("#departChoice").style.display = "block";
}

document.querySelector("#registerAsStudent").addEventListener("click", () => {

    document.getElementById('id02').style.display='block';

});

studentForm.addEventListener("submit", (e) => {
        
    e.preventDefault();

    studentRegistration(registerUsername.value, registerPass.value);
});


//Company Registration
const companyRegistration = (username, password) => {

    let companyData = formToJSON(companyForm.elements);
    
    companyData.username = username;

    companyData.password = password;
    
    document.querySelector("#loadingImageComp").style.display = "block";

    //console.log(companyData);

    http.post("http://localhost:8080/pada/register/company", companyData)
    .then(response => {
        
        console.log(response);

        document.querySelector("#registerCompFail").style.display = "none";

        setTimeout(() => {

            if(response === "CREATED"){

                document.querySelector("#loadingImageComp").style.display = "none";
        
                document.querySelector("#registerCompSuccess").style.display = "block";
                
                setTimeout(() => location.reload(), 2000);

            }
            else{
                
                document.querySelector("#loadingImageComp").style.display = "none";
            
                document.querySelector("#registerCompFail").style.display = "block";
            }

        }, 3000);
    
    })
    .catch(error => console.log(error))
}

document.querySelector("#registerAsCompany").addEventListener("click", () => {

    document.getElementById('id04').style.display='block';
});

companyForm.addEventListener("submit", (e) => {

    e.preventDefault();

    companyRegistration(registerUsername.value, registerPass.value);
});