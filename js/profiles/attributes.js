import{ MyHTTP } from '../utils/httpRequest.js';

const attributes = document.querySelector("#attributes"),
      table = document.querySelector("#attributesTableId");

const http = new MyHTTP;

attributes.addEventListener("click", () => {

    fetchAttributes();
});

const fetchAttributes = () => {

    if(document.querySelector("tbody") != null){
        document.getElementById("attributesTableId").removeChild(document.querySelector("tbody"));
    }

    const tbody = document.createElement("tbody");
    tbody.setAttribute("id", "attributeBody")
    
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

    http.get(`http://localhost:9081/company/api/attributes`)
    .then(attributes => {
        console.log(attributes);
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
        
        paginate.init('.myAttributesTable', options, filterOptions);
    })
    .catch(error => console.log(error));
};

table.onclick = ("click", "tr", (ap) => {
    
    let clickedRow = ap.path[1];

    if(clickedRow.id != "th"){

        const id = clickedRow.getElementsByTagName("td")[0].textContent;
        console.log(id);
    }
});