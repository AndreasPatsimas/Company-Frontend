import{ MyHTTP } from '../utils/httpRequest.js';
import{ formToJSON } from '../utils/bind.js';

const employees             = document.querySelector("#employees"),
      table                 = document.querySelector("#employeesTableId"),
      addEmployeeLinkBtn    = document.querySelector("#onEmployeeAdd"),
      addEmployeeForm       = document.querySelector("#addEmployeeForm"),
      employeeAddLoading    = document.querySelector("#employeeAddLoading"),
      employeeAddSuccess    = document.querySelector("#employeeAddSuccess"),
      employeeAddFail       = document.querySelector("#employeeAddFail"),
      closeAddEmployeeModal = document.querySelector("#closeAddEmployeeModal"),
      employeeName          = document.querySelector("#employeeName"),
      employeeId            = document.querySelector("#employeeId"),
      deleteEmployeeBtn     = document.querySelector("#deleteEmployeeBtn");

const http = new MyHTTP;

employees.addEventListener("click", () => {

    fetchEmployees();
});

const fetchEmployees = () => {

    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }

    const tbody = document.createElement("tbody");
    tbody.setAttribute("id", "employeeBody")
    
    const trh = document.createElement("tr");
    trh.setAttribute("id", "th");

    const idTh = document.createElement("th");
    idTh.style.display = "none";

    const nameTh = document.createElement("th");
    nameTh.textContent = "NAME";

    const addressTh = document.createElement("th");
    addressTh.textContent = "ADDRESS";

    const carTh = document.createElement("th");
    carTh.textContent = "CAR";

    const dateOfBirthTh = document.createElement("th");
    dateOfBirthTh.textContent = "BIRTHDAY";

    const attributesTh = document.createElement("th");
    attributesTh.textContent = "ATTRIBUTES";

    trh.appendChild(idTh);
    trh.appendChild(nameTh);
    trh.appendChild(addressTh);
    trh.appendChild(carTh);
    trh.appendChild(dateOfBirthTh);
    trh.appendChild(attributesTh);

    tbody.appendChild(trh);

    http.get(`http://localhost:9081/company/api/employees`)
    .then(employees => {
        
        employees.forEach(employee => {
            
            const tr = document.createElement("tr");
            tr.setAttribute("class", "handy");

            const id = document.createElement("td");
            id.textContent = `${employee.id}`;
            id.style.display = "none";
            
            const name = document.createElement("td");
            name.textContent = `${employee.name}`;

            const address = document.createElement("td");
            address.textContent = `${employee.address}`;
        
            const car = document.createElement("td");
            const carHtml = employee.hasCar ? "<span style='color: green;'>✓</span>" : "<span style='color: red;'>x</span>"
            car.innerHTML = carHtml;
        
            const dateOfBirth = document.createElement("td");
            dateOfBirth.textContent = `${employee.dateOfBirth}`;
        
            const attributes = document.createElement("td");
            attributes.textContent = `${employee.attributesFormat}`;

            tr.appendChild(id);
            tr.appendChild(name);
            tr.appendChild(address);
            tr.appendChild(car);
            tr.appendChild(dateOfBirth);
            tr.appendChild(attributes);

            tbody.appendChild(tr);

            table.appendChild(tbody);
        });

        let options = {
            numberPerPage:5, //Ποσό δεδομένων ανά σελίδα
            goBar:false, //Γραμμή όπου μπορείτε να πληκτρολογήσετε τον αριθμό της σελίδας στην οποία θέλετε να μεταβείτε
            pageCounter:true, //Ο μετρητής σελίδας, στον οποίο είστε ένας από εσάς, πόσες σελίδες
        };
        
        let filterOptions = {
            el:'#attributesBox' //Το πλαίσιο κειμένου για φιλτράρισμα, μπορεί να είναι μια class ή ένα id
        };
        
        paginate.init('.myEmployeesTable', options, filterOptions);
    })
    .catch(error => console.log(error));
};

table.onclick = ("click", "tr", (ap) => {
    
    let clickedRow = ap.path[1];

    if(clickedRow.id != "th"){

        employeeId.value = clickedRow.getElementsByTagName("td")[0].textContent;
        employeeName.value = clickedRow.getElementsByTagName("td")[1].textContent;

        deleteEmployeeBtn.style.display = "";
        addEmployeeLinkBtn.click();
    }
});

addEmployeeLinkBtn.addEventListener("click", () => {

    employeeAddSuccess.style.display = "none";

    employeeAddFail.style.display = "none";

    document.getElementById("addEmployeeModal").style.display = "block";
});

closeAddEmployeeModal.addEventListener("click", () => {

    document.getElementById("addEmployeeModal").style.display = "none";

    employeeId.value    = null;
    employeeName.value  = null;

    deleteEmployeeBtn.style.display = "none";
});

addEmployeeForm.addEventListener("submit", (e) => {

    e.preventDefault();

    addEmployee();
});

const addEmployee = () =>{

    employeeAddSuccess.style.display = "none";

    employeeAddFail.style.display = "none";

    const data = formToJSON(addEmployeeForm.elements);
    
    if(data.id.trim() === "")
        data.id = null;

    employeeAddLoading.style.display = "block";

    http.post("http://localhost:9081/company/api/employees", data)
    .then(res => {
        console.log(res);
        if(res.status === 201){
            employeeAddLoading.style.display = "none";
            
            employeeAddSuccess.style.display = "block";

            fetchEmployees();
        }
        else{
            employeeAddLoading.style.display = "none";
        
            employeeAddFail.style.display = "block";
        }
    })
    .catch(res => {
        console.log(res);
        employeeAddLoading.style.display = "none";
        
        employeeAddFail.style.display = "block";
    });
};

deleteEmployeeBtn.addEventListener("click", () => {

    const confirmation = confirm("Are you sure you want to delete this employee?");

    if(confirmation){

        http.delete(`http://localhost:9081/company/api/employees/${employeeId.value}`)
        .then(res => {
            console.log(res);

            location.reload();
        })
        .catch(error => console.log(error));
    }
});