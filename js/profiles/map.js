import{ MyHTTP } from '../utils/httpRequest.js';

const searchMode                   = document.querySelector("#search"),
      searchTable                  = document.querySelector("#searchTableId"),
      searchBtn                    = document.querySelector("#search-btn"),
      resultsMode                  = document.querySelector("#results"),
      resultsTable                 = document.querySelector("#resultsTableId"),
      backToSearchMode             = document.querySelector("#switchToSearchMode");

const http = new MyHTTP;

const fetchAttributes = () => {

    while (searchTable.hasChildNodes() /*|| table.hasChildNodes()*/) {
        searchTable.removeChild(searchTable.lastChild);
        //table.removeChild(table.lastChild);
    }

    const tbody = document.createElement("tbody");
    tbody.setAttribute("id", "searchBody")
    
    const trh = document.createElement("tr");
    trh.setAttribute("id", "th");

    const checkTh = document.createElement("th");
    checkTh.textContent = "-";

    const nameTh = document.createElement("th");
    nameTh.textContent = "NAME";

    const valueTh = document.createElement("th");
    valueTh.textContent = "VALUE";

    trh.appendChild(checkTh);
    trh.appendChild(nameTh);
    trh.appendChild(valueTh);

    tbody.appendChild(trh);

    http.get(`http://localhost:9081/company/api/attributes`)//"/js/profiles/attributes.json"
    .then(attributes => {
        
        attributes.forEach(attribute => {
            
            const tr = document.createElement("tr");
            tr.setAttribute("class", "handy");

            const input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("class", "attributesCheck");
            input.setAttribute("id", `${attribute.id}`);
            input.setAttribute("name", `${attribute.name} ${attribute.value}`);
        
            const label = document.createElement("label");
            label.setAttribute("for", "checkbox1");

            const span = document.createElement("span");
            span.setAttribute("class", "custom-checkbox");
        
            const checkbox = document.createElement("td");
            span.appendChild(input);
            span.appendChild(label);
            checkbox.appendChild(span);
            
            const name = document.createElement("td");
            name.textContent = `${attribute.name}`;

            const value = document.createElement("td");
            value.textContent = attribute.value;
            
            tr.appendChild(checkbox);
            tr.appendChild(name);
            tr.appendChild(value);

            tbody.appendChild(tr);

            searchTable.appendChild(tbody);
        });

        let options = {
            numberPerPage:10, //Ποσό δεδομένων ανά σελίδα
            goBar:false, //Γραμμή όπου μπορείτε να πληκτρολογήσετε τον αριθμό της σελίδας στην οποία θέλετε να μεταβείτε
            pageCounter:true, //Ο μετρητής σελίδας, στον οποίο είστε ένας από εσάς, πόσες σελίδες
        };
        
        let filterOptions = {
            el:'#searchBox' //Το πλαίσιο κειμένου για φιλτράρισμα, μπορεί να είναι μια class ή ένα id
        };
        
        paginate.init('.searchTable', options, filterOptions);
    })
    .catch(error => console.log(error));
};

fetchAttributes();

searchBtn.addEventListener("click", (e) => {

    e.preventDefault();

    const attributes = [];

    const checkboxes = document.querySelectorAll('.attributesCheck');

    checkboxes.forEach(checkbox => {

        if(checkbox.className.indexOf('attributesCheck')>-1 && checkbox.checked){
            
            attributes.push({
                id: checkbox.getAttribute("id")
            });
        }
    });

    fetchEmployees(attributes);

    searchMode.style.display = "none";
    resultsMode.style.display = "";
});

const fetchEmployees = (attributesData) => {

    while (resultsTable.hasChildNodes()) {
        resultsTable.removeChild(resultsTable.lastChild);
    }

    const tbody = document.createElement("tbody");
    tbody.setAttribute("id", "resultsBody")
    
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

    http.search("http://localhost:9081/company/api/employees/attributes", attributesData)
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

            resultsTable.appendChild(tbody);
        });

        let options = {
            numberPerPage:10, //Ποσό δεδομένων ανά σελίδα
            goBar:false, //Γραμμή όπου μπορείτε να πληκτρολογήσετε τον αριθμό της σελίδας στην οποία θέλετε να μεταβείτε
            pageCounter:true, //Ο μετρητής σελίδας, στον οποίο είστε ένας από εσάς, πόσες σελίδες
        };
        
        let filterOptions = {
            el:'#resultsBox' //Το πλαίσιο κειμένου για φιλτράρισμα, μπορεί να είναι μια class ή ένα id
        };
        
        paginate.init('.resultsTable', options, filterOptions);
    })
    .catch(error => console.log(error));
};

backToSearchMode.addEventListener("click", () => {

    searchMode.style.display = "";
    resultsMode.style.display = "none";
});

resultsTable.onclick = ("click", "tr", (ap) => {
    
    let clickedRow = ap.path[1];

    if(clickedRow.id != "th"){

        const employeeId = clickedRow.getElementsByTagName("td")[0].textContent;
        const employeeName = clickedRow.getElementsByTagName("td")[1].textContent;
        const address = clickedRow.getElementsByTagName("td")[2].textContent;
        const hasCar = (clickedRow.getElementsByTagName("td")[3].textContent === "x") ? false : true;

        console.log(employeeId, employeeName, address, hasCar);
    }
});