import{ formToJSON } from '../utils/bind.js';
import{ MyHTTP } from '../utils/httpRequest.js';
import{ getDepartment } from '../utils/department.js';

const http = new MyHTTP;

//get storage
let username;

let jwt;

if(localStorage.getItem("username") == null && sessionStorage.getItem("username") == null)
    location.replace("authenticate.html");

else if(localStorage.getItem("username") != null){

    username = localStorage.getItem("username");

    jwt = localStorage.getItem("jwt");
}
else{

    username = sessionStorage.getItem("username");

    jwt = sessionStorage.getItem("jwt")
}

//constant fields
const homeArea = document.querySelector("#homeArea"),

      home = document.querySelector("#home"),

      settings = document.querySelector("#settings"),

      settingsForm = document.querySelector("#settingsForm"),

      settingsArea = document.querySelector("#settingsArea"),

      changePasswordLink = document.querySelector("#change_password"),

      changePasswordForm = document.querySelector("#changePasswordForm"),

      deleteMyProfile = document.querySelector("#deleteMyProfile"),
      
      uploadCv = document.querySelector("#upload"),

      uploadCvInput = document.querySelector("#uploadCV"),
      
      downloadCv = document.querySelector("#download"),

      downloadLink = document.createElement('a');

      downloadLink.style.display = "none";

//tabs
home.addEventListener("click", () => {

    homeArea.style.display = "block";

    settingsArea.style.display = "none";
});

settings.addEventListener("click", () => {

    homeArea.style.display = "none";

    settingsArea.style.display = "block";
});

//profile values

http.get(`http://localhost:8080/pada/student/profile/${username}`, jwt)
.then(student => {
    
    if(student.status === 500)
        location.replace("authenticate.html");

    if(student.imagePath != null)
        document.querySelectorAll(".profileImage").forEach(image => image.src = `images/students/${username}/${student.imagePath}`);
    else
        document.querySelectorAll(".profileImage").forEach(image => image.src = "images/pada.jpg");

    if(student.cv !=null){
        downloadCv.style.display = "block";

        uploadCv.textContent = "CHANGE MY CV";

        if(localStorage.getItem("username") != null)
            localStorage.setItem("cv", `${student.cv.fileName}`)
        else
            sessionStorage.setItem("cv", `${student.cv.fileName}`);
    }
    else{
        downloadCv.style.display = "none";

        uploadCv.textContent = "UPLOAD CV";
    }

    document.getElementById("fullname").textContent = `${student.firstname} ${student.lastname}`;

    if(student.description != null){
        document.getElementById("desc").textContent = `${student.description}`;

        document.getElementById("description").value = `${student.description}`;
    }
    
    document.getElementById("dob").textContent = `${student.dateOfbirth}`;

    document.getElementById("mob").textContent = `${student.mobilePhone}`;
    document.getElementById("mobilePhone").value = `${student.mobilePhone}`;

    document.getElementById("mail").textContent = `${student.email}`;
    document.getElementById("email").value = `${student.email}`;

    if(student.workExperience === true){
        
        document.getElementById("nonWorkExp").style.display = "none";

        document.getElementById("workExp").style.display = "";

        document.querySelector("#ckb1").checked = true;
    }
    else{
        
        document.getElementById("nonWorkExp").style.display = "";

        document.getElementById("workExp").style.display = "none";

        document.querySelector("#ckb1").checked = false;
    }

    document.getElementById("depart").textContent = `${getDepartment[student.department]}`;

})
.catch(error => {
    
    console.log(error); 
    
    location.replace("authenticate.html");
});


//cv operations

//////////////////
uploadCv.addEventListener("click", () => {
    uploadCvInput.click();
});

const upload = (file) => {

    document.querySelector("#loadingImage").style.display = "block";

    const formData = new FormData();
    
    formData.append('file', file);

    setTimeout(() => {

        http.upload(`http://localhost:8080/pada/student/uploadFile/${username}`, formData, jwt)
        .then((data)=> {
            
            document.querySelector("#loadingImage").style.display = "none";
    
            if(data.status === 500)
                document.querySelector("#uploadFail").style.display = "block";
            else
                document.querySelector("#uploadSuccess").style.display = "block";
    
            setTimeout(() => {
    
            document.querySelector("#uploadSuccess").style.display = "none";

            document.querySelector("#uploadFail").style.display = "none";

            location.reload();
    
            }, 5000);
        })
        .catch(
            error => console.log(error) 
        );
    }, 3000);

};

const onSelectFile = () => upload(uploadCvInput.files[0]);

uploadCvInput.addEventListener('change', onSelectFile, false);

////////////////

downloadCv.addEventListener("click", () => {

    let fileName;

    if(localStorage.getItem("username") != null)
        fileName = localStorage.getItem("cv");
    else
        fileName = sessionStorage.getItem("cv");

    http.download(`http://localhost:8080/pada/student/downloadFile/${username}/${fileName}`, jwt)
      .then((data)=> {
        let blob = new Blob([data]);
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.click();
        })
      .catch(err => console.log(err));
    
});


// settings operations
//image

const photoLink = document.querySelector("#changePhotoLink");
const photoInput = document.querySelector("#changePhoto");

photoLink.addEventListener("click", (e) => {
    e.preventDefault();

    photoInput.click();
});

const uploadImage = (image) => {

    if(image.type.startsWith("image")){

        document.querySelector("#no_image").style.display = "none";

        document.querySelector("#loadingIm").style.display = "block";

        const formData = new FormData();
        
        formData.append('file', image);

        setTimeout(() => {

            http.upload(`http://localhost:8080/pada/student/saveImage/${username}`, formData, jwt)
            .then((data)=> {
                
                document.querySelector("#loadingIm").style.display = "none";

                document.querySelector("#uploadImageFail").style.display = "none";
        
                if(data !== "ACCEPTED")
                    document.querySelector("#uploadImageFail").style.display = "block";
                else{
                    document.querySelector("#uploadImageSuccess").style.display = "block";
        
                    setTimeout(() => {
            
                        document.querySelector("#uploadImageSuccess").style.display = "none";

                        document.querySelector("#uploadImageFail").style.display = "none";

                        location.reload();
            
                    }, 5000);
                }

            })
            .catch(
                error => console.log(error) 
            );
        }, 3000);
    }
    else
        document.querySelector("#no_image").style.display = "block";
}

const onSelectImage = () => uploadImage(photoInput.files[0]);

photoInput.addEventListener('change', onSelectImage, false);

//form
settingsForm.addEventListener("submit", (e) => {

    e.preventDefault();

    document.querySelector("#mailFail").style.display = "none";

    let settingsData = formToJSON(settingsForm.elements);

    if(document.querySelector("#ckb1").checked === true)
        settingsData.workExperience = true;

    else
        settingsData.workExperience = false;

        if(settingsData.mobilePhone.trim() === "" || settingsData.mobilePhone.length == 10){
            
            document.querySelector("#mobReq").style.display = "none";

            document.querySelector("#loadingIma").style.display = "block";

            settingsData.username = username;

            http.put(`http://localhost:8080/pada/student/settings`, settingsData, jwt)
            .then(res => {
                if(res === "CREATED"){
                    setTimeout(() => {

                        document.querySelector("#loadingIma").style.display = "none";
                        
                        document.querySelector("#mailSuccess").style.display = "block";
                        
                        setTimeout(() => location.reload(), 2000);

                    }, 3000);
                }
                else{
                    setTimeout(() => {
    
                        document.querySelector("#loadingIma").style.display = "none";
                        
                        document.querySelector("#mailFail").style.display = "block";
    
                    }, 3000);
                }
            })
            .catch(error => console.log(error))
            
        }
        else
            document.querySelector("#mobReq").style.display = "block";
});

deleteMyProfile.addEventListener("click", () => {
    
    let confirmation = confirm("Are you sure you want to delete your profile?");

    if(confirmation){

        http.delete(`http://localhost:8080/pada/user/delete/profile/${username}`, jwt)
            .then(res => {
                console.log(res);

                localStorage.removeItem("username");

                localStorage.removeItem("jwt");

                sessionStorage.removeItem("username");

                sessionStorage.removeItem("jwt");

                location.replace("authenticate.html");
            })
            .catch(error => console.log(error));
    }
        
    else
        console.log("No.")
});

// change password

changePasswordLink.addEventListener("click", () => {

    document.querySelector('#id04').style.display='block';
});
document.querySelector("#username").value = username;
changePasswordForm.addEventListener("submit", (e) => {

    e.preventDefault();

    document.querySelector("#changeSuccess").style.display = "none";

    document.querySelector("#changeFail").style.display = "none";

    let data = formToJSON(changePasswordForm.elements);

    if(data.newPassword === data.repeatPass){

        document.querySelector('#diffPassw').style.display='none';

        delete data.repeatPass;

        document.querySelector("#loadingImag").style.display = "block";

        http.authenticatedPost("http://localhost:8080/pada/authenticate/changePassword", data, jwt)
        .then(res => {
            if(res.errorCode !== 406){
                document.querySelector("#loadingImag").style.display = "none";
                
                document.querySelector("#changeSuccess").style.display = "block";
            }
            else{
                document.querySelector("#loadingImag").style.display = "none";
            
                document.querySelector("#changeFail").style.display = "block";
            }
        })
        .catch(res => {
            console.log(res);
            document.querySelector("#loadingImag").style.display = "none";
            
            document.querySelector("#changeFail").style.display = "block";
        });
    }
    else
        document.querySelector('#diffPassw').style.display='block';

});

//Logout

document.getElementById('logout').addEventListener('click', (e) => {
    
    localStorage.removeItem("username");

    localStorage.removeItem("jwt");

    sessionStorage.removeItem("username");

    sessionStorage.removeItem("jwt");

    location.replace("authenticate.html");
});