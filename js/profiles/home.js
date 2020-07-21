const homeArea = document.querySelector("#homeArea"),
      home = document.querySelector("#home"),

      employees = document.querySelector("#employees"),
      employeesArea = document.querySelector("#employeesArea"),
      
      attributes = document.querySelector("#attributes"),
      attributesArea = document.querySelector("#attributesArea"),

      map = document.querySelector("#map"),
      mapArea = document.querySelector("#mapArea");


//tabs
home.addEventListener("click", () => {

    homeArea.style.display = "block";

    employeesArea.style.display = "none";

    attributesArea.style.display = "none";

    mapArea.style.display = "none";
});

employees.addEventListener("click", () => {

    homeArea.style.display = "none";

    attributesArea.style.display = "none";

    employeesArea.style.display = "block";

    mapArea.style.display = "none";
});

attributes.addEventListener("click", () => {

    homeArea.style.display = "none";

    attributesArea.style.display = "block";

    employeesArea.style.display = "none";

    mapArea.style.display = "none";
});

map.addEventListener("click", () => {

    homeArea.style.display = "none";

    attributesArea.style.display = "none";

    employeesArea.style.display = "none";

    mapArea.style.display = "block";
});