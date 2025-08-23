// const inputBox = document.getElementById("input-box");
// const listContainer = document.getElementById("list-container");

// function addTask() {
//   if (inputBox.value === "") {
//     alert("Add some task");
//   } else {
//     let li = document.createElement("li"); //creating li
//     li.innerHTML = inputBox.value; //adding value in li
//     listContainer.appendChild(li); //adding in list-container

//     //adding cross to delete list
//     let span = document.createElement("span"); //creating span
//     span.innerHTML = "\u00d7"; //adds x
//     li.appendChild(span); //adding in li
//   }
//   inputBox.value = "";
//   saveData();
// }

// listContainer.addEventListener(
//   "click",
//   function (e) {
//     if (e.target.tagName === "LI") {
//       //e.target = what is actually clicked
//       // If the user clicks on the <li>, e.target will be that <li>.
//       // If they click on the <span>, e.target will be the <span>.
//       //e.target.tagName returns captial only 'LI'

//       // tagName returns "LI", "SPAN", "DIV"
//       // console.log(e.target);        // Shows the clicked element
//       // console.log(e.target.tagName); // Shows the tag name (e.g. "LI" or "SPAN")
//       e.target.classList.toggle("checked");
//       //if no class add, if class then removes
//       saveData();
//     } else if (e.target.tagName === "SPAN") {
//       e.target.parentElement.remove();
//       saveData();
//     }
//   },
//   { capture: false }
//   //Inner → Middle → Outer of DOM
//   //span → li → ul → body → html
// );

// function saveData() {
//   localStorage.setItem("data", listContainer.innerHTML);
//   //localStorage.setItem("key", "value");
// }

// function showTask() {
//   listContainer.innerHTML = localStorage.getItem("data");
// }
// showTask();

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

//function for add button
function addTask() {
  if (inputBox.value === "") {
    alert("List cannot be empty");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    //in created li = add list
    listContainer.appendChild(li); //append in list-container

    //add cross value
    let span = document.createElement("span");
    span.innerHTML = "\u00d7"; //code for x
    li.appendChild(span); //add in li
    saveData(); //save after adding list
  }
  inputBox.value = "";
}

listContainer.addEventListener("click", function (e) {
  //one for list
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveData(); //save after add/remove li
  }
  //one for cross list
  else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove(); //remove parent-Element (span)
    saveData(); //save after removed list
  }
});

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data");
}
showTask(); //show everytime refreshed
