import{ MyHTTP } from '../utils/httpRequest.js';
import{ formToJSON } from '../utils/bind.js';

const attributes = document.querySelector("#attributes"),
      table                 = document.querySelector("#attributesTableId"),
      addAttributeLinkBtn   = document.querySelector("#onAttributeAdd"),
      addAttributeForm      = document.querySelector("#addAttributeForm"),
      attributeAddLoading   = document.querySelector("#attributeAddLoading"),
      attributeAddSuccess   = document.querySelector("#attributeAddSuccess"),
      attributeAddFail      = document.querySelector("#attributeAddFail"),
      closeAddAtributeModal = document.querySelector("#closeAddAtributeModal"),
      attributeName         = document.querySelector("#attributeName"),
      attributeValue        = document.querySelector("#value"),
      attributeId           = document.querySelector("#attributeId"),
      deleteAttributeBtn    = document.querySelector("#deleteAttributeBtn");

const http = new MyHTTP;

attributes.addEventListener("click", () => {

    fetchAttributes();
});

const fetchAttributes = () => {

    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
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

    http.get(`http://localhost:9081/company/api/attributes`)//"/js/profiles/attributes.json"
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

        attributeId.value = clickedRow.getElementsByTagName("td")[0].textContent;
        attributeName.value = clickedRow.getElementsByTagName("td")[1].textContent;
        attributeValue.value = clickedRow.getElementsByTagName("td")[2].textContent;

        deleteAttributeBtn.style.display = "";
        addAttributeLinkBtn.click();
    }
});

addAttributeLinkBtn.addEventListener("click", () => {

    attributeAddSuccess.style.display = "none";

    attributeAddFail.style.display = "none";

    document.getElementById("addAttributeModal").style.display = "block";
});

closeAddAtributeModal.addEventListener("click", () => {

    document.getElementById("addAttributeModal").style.display = "none";

    attributeId.value    = null;
    attributeName.value  = null;
    attributeValue.value = null;

    deleteAttributeBtn.style.display = "none";
});

addAttributeForm.addEventListener("submit", (e) => {

    e.preventDefault();

    addAttribute();
});

const addAttribute = () =>{

    attributeAddSuccess.style.display = "none";

    attributeAddFail.style.display = "none";

    const data = formToJSON(addAttributeForm.elements);
    
    if(data.id.trim() === "")
        data.id = null;

    attributeAddLoading.style.display = "block";

    http.post("http://localhost:9081/company/api/attributes", data)
    .then(res => {
        console.log(res);
        if(res.status === 201){
            attributeAddLoading.style.display = "none";
            
            attributeAddSuccess.style.display = "block";

            fetchAttributes();
        }
        else{
            attributeAddLoading.style.display = "none";
        
            attributeAddFail.style.display = "block";
        }
    })
    .catch(res => {
        console.log(res);
        attributeAddLoading.style.display = "none";
        
        attributeAddFail.style.display = "block";
    });
};

deleteAttributeBtn.addEventListener("click", () => {

    const confirmation = confirm("Are you sure you want to delete this attribute?");

    if(confirmation){

        http.delete(`http://localhost:9081/company/api/attributes/${attributeId.value}`)
        .then(res => {
            console.log(res);

            location.reload();
        })
        .catch(error => console.log(error));
    }
});