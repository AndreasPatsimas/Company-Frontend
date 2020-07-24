import{ MyHTTP } from '../utils/httpRequest.js';
import{ formToJSON } from '../utils/bind.js';

const employees                    = document.querySelector("#employees"),
      table                        = document.querySelector("#employeesTableId"),
      attributesTable              = document.querySelector("#employeeAttributesTableId"),
      addEmployeeLinkBtn           = document.querySelector("#onEmployeeAdd"),
      addEmployeeForm              = document.querySelector("#addEmployeeForm"),
      employeeAddLoading           = document.querySelector("#employeeAddLoading"),
      employeeAddSuccess           = document.querySelector("#employeeAddSuccess"),
      employeeAddFail              = document.querySelector("#employeeAddFail"),
      closeAddEmployeeModal        = document.querySelector("#closeAddEmployeeModal"),
      employeeName                 = document.querySelector("#employeeName"),
      employeeId                   = document.querySelector("#employeeId"),
      address                      = document.querySelector("#address"),
      hasCar                       = document.querySelector("#hasCar"),
      dateOfBirth                  = document.querySelector("#dateOfBirth"),
      deleteEmployeeBtn            = document.querySelector("#deleteEmployeeBtn"),
      employeeAttributesLink       = document.querySelector("#employeeAttributes"),
      closeEmployeeAttributesModal = document.querySelector("#closeEmployeeAttributesModal"),
      employeeAttributesModal      = document.querySelector("#employeeAttributesModal");

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

    http.get("/js/profiles/employees.json") //`http://localhost:9081/company/api/employees`
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
        address.value = clickedRow.getElementsByTagName("td")[2].textContent;
        hasCar.checked = (clickedRow.getElementsByTagName("td")[3].textContent === "x") ? false : true;
        dateOfBirth.value = clickedRow.getElementsByTagName("td")[4].textContent;

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
    address.value       = null;
    hasCar.checked      = false;
    dateOfBirth.value   = null;

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
    
    data.hasCar = hasCar.checked ? true : false;

    employeeAddLoading.style.display = "block";

    http.post("http://localhost:9081/company/api/employees", data)
    .then(res => {
        
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

// Add/Remove Attributes to Employees

employeeAttributesLink.addEventListener("click", () => {
    
    employeeAttributesModal.style.display = "block";

    fetchAttributes();
});

closeEmployeeAttributesModal.addEventListener("click", () => {

    employeeAttributesModal.style.display = "none";

    fetchEmployees();
});

const fetchAttributes = () => {

    while (attributesTable.hasChildNodes()) {
        attributesTable.removeChild(attributesTable.lastChild);
    }

    const tbody = document.createElement("tbody");
    tbody.setAttribute("id", "attributeEmployeesBody")
    
    const trh = document.createElement("tr");
    trh.setAttribute("id", "th");

    const idTh = document.createElement("th");
    idTh.style.display = "none";

    const nameTh = document.createElement("th");
    nameTh.textContent = "NAME";

    const valueTh = document.createElement("th");
    valueTh.textContent = "VALUE";

    trh.appendChild(idTh);
    trh.appendChild(nameTh);
    trh.appendChild(valueTh);

    tbody.appendChild(trh);

    http.get("/js/profiles/attributes.json")//`http://localhost:9081/company/api/attributes`
    .then(attributes => {
        
        attributes.forEach(attribute => {
            
            const tr = document.createElement("tr");
            tr.setAttribute("class", "handy");

            const id = document.createElement("td");
            id.textContent = `${attribute.id}`;
            id.style.display = "none";
            
            const name = document.createElement("td");
            name.textContent = `${attribute.name}`;

            const value = document.createElement("td");
            value.textContent = attribute.value;

            tr.appendChild(id);
            tr.appendChild(name);
            tr.appendChild(value);

            tbody.appendChild(tr);

            attributesTable.appendChild(tbody);
        });

        let options = {
            numberPerPage:5, //Ποσό δεδομένων ανά σελίδα
            goBar:false, //Γραμμή όπου μπορείτε να πληκτρολογήσετε τον αριθμό της σελίδας στην οποία θέλετε να μεταβείτε
            pageCounter:true, //Ο μετρητής σελίδας, στον οποίο είστε ένας από εσάς, πόσες σελίδες
        };
        
        let filterOptions = {
            el:'#employeeAttributesBox' //Το πλαίσιο κειμένου για φιλτράρισμα, μπορεί να είναι μια class ή ένα id
        };
        
        paginate.init('.employeeAttributesTable', options, filterOptions);
    })
    .catch(error => console.log(error));
};