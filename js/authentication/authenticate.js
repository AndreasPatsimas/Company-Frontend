import{ formToJSON } from '../utils/bind.js';
import{ MyHTTP } from '../utils/httpRequest.js';

const http = new MyHTTP;

const title = document.querySelector("#title"),

      backImageTitle = document.querySelector("#backImageTitle");

//Login Form
const loginForm = document.querySelector("#loginForm"),

      switchToRegisterLink = document.querySelector("#switchToRegisterLink"),
      
      forgotPassForm = document.querySelector("#forgotPassForm"),
      
      remember = document.querySelector("#ckb1");

//Register Form
const registerForm = document.querySelector("#registerForm"),

      switchToLoginLink = document.querySelector("#switchToLoginLink");

//Operations
switchToRegisterLink.addEventListener("click", () => {

    title.textContent = "Sign up";

    backImageTitle.textContent = "Sign Up";

    loginForm.style.display = "none";

    registerForm.style.display = "block";
});

switchToLoginLink.addEventListener("click", () => {

    title.textContent = "Sign in";

    backImageTitle.textContent = "Sign In";

    registerForm.style.display = "none";

    loginForm.style.display = "block";
});


//Login
loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    document.querySelector("#authFail").style.display = "none";

    let authenticationData = formToJSON(loginForm.elements);

    if(document.querySelector("#ckb1").checked === true)
        authenticationData.remember = true;

    else
        authenticationData.remember = false;

    document.querySelector("#loginbtn").style.display = "none";

    document.querySelector("#loadingImag").style.display = "block";

    http.post("http://localhost:8080/pada/authenticate", authenticationData)
    .then(response => {
        
        //console.log(response);
        
        document.querySelector("#registerFail").style.display = "none";

        setTimeout(() => {

            document.querySelector("#loadingImag").style.display = "none";
            
            document.querySelector("#loginbtn").style.display = "block";
    
            if(response.authenticationStatus === "AUTHENTICATION_SUCCEEDED"){

                if(ckb1.checked){
                    
                    localStorage.setItem("jwt", response.jwt);

                    localStorage.setItem("username", response.username);
                }
                else{
                    
                    sessionStorage.setItem("jwt", response.jwt);

                    sessionStorage.setItem("username", response.username);

                    localStorage.removeItem("jwt");

                    localStorage.removeItem("username");
                }
    
                if(response.authorities[0].authority === "ROLE_STUDENT")
                    //console.log("student");
                    location.replace("student.html");
    
                else
                    //console.log("company");
                    location.replace("company.html")
            }
            
            else
                document.querySelector("#authFail").style.display = "block";
    
        }, 3000);
    
    })
    .catch(error => console.log(error))

});

//Forgot Password
document.querySelector("#forgotPass").addEventListener("click", () => {

    document.querySelector("#id03").style.display = "block";
});

forgotPassForm.addEventListener("submit", (e) => {

    e.preventDefault();

    document.querySelector("#mailSuccess").style.display = "none";

    document.querySelector("#mailFail").style.display = "none";

    let data = formToJSON(forgotPassForm.elements);

    document.querySelector("#loadingIma").style.display = "block";

    //console.log(data);

    http.post("http://localhost:8080/pada/authenticate/forgotPassword", data)
    .then(response => {
        
        //console.log(response);
        
        document.querySelector("#registerFail").style.display = "none";

        setTimeout(() => {

            document.querySelector("#loadingIma").style.display = "none";
    
            if(response.forgotPasswordStatus === "USERNAME_VERIFIED"){
    
                document.querySelector("#mailSuccess").style.display = "block";
            }
            
            else
                document.querySelector("#mailFail").style.display = "block";
    
        }, 3000);
    
    })
    .catch(error => console.log(error))

});