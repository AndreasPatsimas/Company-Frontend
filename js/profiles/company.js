import{ formToJSON } from '../utils/bind.js';
import{ MyHTTP } from '../utils/httpRequest.js';
import{ getDepartment } from '../utils/department.js';

const http = new MyHTTP;


const getAge = (dateString) => {

    var today = new Date();
    
    var birthDate = new Date(dateString);
    
    var age = today.getFullYear() - birthDate.getFullYear();
   
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
};

//constant fields
const homeArea = document.querySelector("#homeArea"),

      home = document.querySelector("#home"),

      settings = document.querySelector("#settings"),

      settingsForm = document.querySelector("#settingsForm"),

      settingsArea = document.querySelector("#settingsArea"),

      changePasswordLink = document.querySelector("#change_password"),

      changePasswordForm = document.querySelector("#changePasswordForm"),

      deleteMyProfile = document.querySelector("#deleteMyProfile"),

      search = document.querySelector("#search_students"),

      searchForm = document.querySelector("#search_form"),

      searchArea = document.querySelector("#searchArea"),

      map = document.querySelector("#map"),

      mapForm = document.querySelector("#map_form"),

      mapArea = document.querySelector("#mapArea"),
      
      table = document.querySelector("#tableId"),      
      
      downloadLink = document.createElement('a');

      downloadLink.style.display = "none";



//tabs
home.addEventListener("click", () => {

    homeArea.style.display = "block";

    settingsArea.style.display = "none";

    searchArea.style.display = "none";

    mapArea.style.display = "none";
});

settings.addEventListener("click", () => {

    homeArea.style.display = "none";

    searchArea.style.display = "none";

    settingsArea.style.display = "block";

    mapArea.style.display = "none";
});

search.addEventListener("click", () => {

    homeArea.style.display = "none";

    searchArea.style.display = "block";

    settingsArea.style.display = "none";

    mapArea.style.display = "none";
});

map.addEventListener("click", () => {

    homeArea.style.display = "none";

    searchArea.style.display = "none";

    settingsArea.style.display = "none";

    mapArea.style.display = "block";
});

// profile company

// http.get(`http://localhost:8080/pada/company/profile/${username}`, jwt)
// .then(company => {

//     document.querySelector("#company_name").textContent = `${company.companyName}`;

//     document.querySelector("#mail").textContent = `${company.email}`;

//     document.querySelector("#units").textContent = `${company.units}`;

//     document.querySelector("#companyName").value = `${company.companyName}`;

//     document.querySelector("#email").value = `${company.email}`;

// })
// .catch(error => {
    
//     console.log(error); 
    
//     location.replace("authenticate.html");
// });

// search operations

//search students by department and work experience

searchForm.addEventListener("submit", (e) => {
    
    e.preventDefault();

    let searchData = formToJSON(searchForm.elements);

    if(document.querySelector("#ckb3").checked === true)
        searchData.workExperience = true;

    else
        searchData.workExperience = false;

    if(searchData.department != 0){
    
        document.querySelector("#departChoice").style.display = "none";

        document.querySelector("#students_not_found").style.display = "none";

        document.querySelector("#loadingImage").style.display = "block";

        setTimeout(() => {

            document.querySelector("#loadingImage").style.display = "none";

            const tbody = document.createElement("tbody");

            const trh = document.createElement("tr");
            trh.setAttribute("id", "th");

            const th = document.createElement("th");
            th.textContent = "-";

            const fullnameTh = document.createElement("th");
            fullnameTh.textContent = "FULLNAME";

            const emailTh = document.createElement("th");
            emailTh.textContent = "EMAIL";

            const ageTh = document.createElement("th");
            ageTh.textContent = "AGE";

            trh.appendChild(th);
            trh.appendChild(fullnameTh);
            trh.appendChild(emailTh);
            trh.appendChild(ageTh);

            tbody.appendChild(trh);

            http.get(`http://localhost:8080/pada/company/search/students/${username}/${searchData.department}/${searchData.workExperience}`, jwt)
            .then(students => {

                students.forEach(student => {
                    
                    const tr = document.createElement("tr");
                    tr.setAttribute("class", "handy");
                    
                    const imageTd = document.createElement("td");

                    if(student.imagePath != null){
                        const img = document.createElement("img");
                        img.setAttribute("class","profile_image");
                        img.setAttribute("src",`images/students/${student.username}/${student.imagePath}`);
                        img.setAttribute("alt","-");
                        imageTd.appendChild(img);
                    }
                    else
                        imageTd.textContent = "-";

                    const fullname = document.createElement("td");
                    fullname.textContent = `${student.firstname} ${student.lastname}`;

                    const email = document.createElement("td");
                    email.textContent = student.email;

                    const age = document.createElement("td");
                    age.textContent = getAge(student.dateOfbirth);

                    tr.appendChild(imageTd);
                    tr.appendChild(fullname);
                    tr.appendChild(email);
                    tr.appendChild(age);

                    tbody.appendChild(tr);

                    table.appendChild(tbody);

                })

                let options = {
                    numberPerPage:5, //Ποσό δεδομένων ανά σελίδα
                    goBar:true, //Γραμμή όπου μπορείτε να πληκτρολογήσετε τον αριθμό της σελίδας στην οποία θέλετε να μεταβείτε
                    pageCounter:true, //Ο μετρητής σελίδας, στον οποίο είστε ένας από εσάς, πόσες σελίδες
                };
                
                let filterOptions = {
                    el:'#searchBox' //Το πλαίσιο κειμένου για φιλτράρισμα, μπορεί να είναι μια class ή ένα id
                };
                
                paginate.init('.myTable',options,filterOptions);

                document.getElementById('id01').style.display ='block';
            })
            .catch(error => {
                
                console.log(error);

                document.querySelector("#students_not_found").style.display = "block";
            })

        }, 3000);               

    }
    
    else
        document.querySelector("#departChoice").style.display = "block";

});

document.querySelector("#closeModal").onclick = () => {

    document.getElementById("tableId").removeChild(document.querySelector("tbody"));
    
    document.getElementById('id01').style.display='none';
};

//search_table

table.onclick = ("click", "tr", (ap) => {
    
    let clickedRow = ap.path[1];

    if(clickedRow.id != "th"){

        const email = clickedRow.getElementsByTagName("td")[2].textContent;

        http.get(`http://localhost:8080/pada/company/student/profile/${username}/${email}`, jwt)
        .then(student => {
            console.log(student);

            if(student.imagePath != null){
                document.querySelector(".student_profile_image").src = `images/students/${student.username}/${student.imagePath}`;
            }
            else
                document.querySelector(".student_profile_image").src = "images/pada.jpg";

                document.querySelector("#fullnameSt").textContent = `${student.firstname} ${student.lastname}`;
                document.querySelector("#deptSt").textContent = `${getDepartment[student.department]}`;

                if(student.description != null)
                    document.querySelector("#descSt").textContent = `${student.description}`;
                else
                    document.querySelector("#descSt").textContent = `No description`;

                document.querySelector("#dobSt").textContent = `${student.dateOfbirth}`;
                document.querySelector("#mobSt").textContent = `${student.mobilePhone}`;
                document.querySelector("#mailSt").textContent = `${student.email}`;
                
                if(student.workExperience === true){
        
                    document.getElementById("nonWorkExp").style.display = "none";
            
                    document.getElementById("workExp").style.display = "";
                }
                else{
                    
                    document.getElementById("nonWorkExp").style.display = "";
            
                    document.getElementById("workExp").style.display = "none";            
                }

                if(student.cv != null){

                    let fileName = student.cv.fileName;
                    
                    document.getElementById("no-cv").style.display = "none";
            
                    document.getElementById("uploaded-cv").style.display = "";

                    document.getElementById("downloadCv").addEventListener("click", () => {
                    
                        http.download(`http://localhost:8080/pada/company/downloadFile/${username}/${student.username}/${fileName}`, jwt)
                          .then((data)=> {

                            let blob = new Blob([data]);
                            downloadLink.href = window.URL.createObjectURL(blob);
                            downloadLink.download = fileName;
                            downloadLink.click();
                            
                            //setTimeout(() => location.reload(), 2000)
                            })
                          .catch(err => console.log(err));
                        
                    });
                }
                else{

                    document.getElementById("no-cv").style.display = "";
            
                    document.getElementById("uploaded-cv").style.display = "none"; 
                }
        })
        .catch(error => console.log(error))
        
        document.getElementById('id02').style.display='block';
    }
})

document.querySelector("#closeModalStudent").onclick = () => {



    document.getElementById('id02').style.display='none';
    
};





// settings operations

//profile values

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

            http.upload(`http://localhost:8080/pada/company/saveImage/${username}`, formData, jwt)
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

    let settingsData = formToJSON(settingsForm.elements);

    settingsData.username = username;

    document.querySelector("#loadingIma").style.display = "block";

    if(settingsData.units == "")
        settingsData.units = 0;

        http.put(`http://localhost:8080/pada/company/settings`, settingsData, jwt)
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
