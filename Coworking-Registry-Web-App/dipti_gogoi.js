var searchresults = []

// function that loads initial two users
function loadLoginPage() {
    // array of objects for now, 1 for owner and 2 for coworker
    var userlogins = [ {name: "owner", email: "owner@email.com", phone: "123456789", password: "1234", usertype: 1, properties: []}, 
                       {name: "coworker", email: "coworker@email.com", phone: "123456789", password: "5678", usertype: 2, properties:[]}];
    // add demo properties
    var property1 = {address: "200 5 St SW", neighborhood: "downtown", squarefeet: "1500", parking: false, transit: true, workspaces: []};
    userlogins[0]["properties"].push(property1);
    property1 = {address: "800 bonavista drive", neighborhood: "south west", squarefeet: "2100", parking: true, transit: false, workspaces:[]};
    userlogins[0]["properties"].push(property1);
    // before storing check if it already exists
    // using localStore to persist data between different pages on same tab
    // will not be required once we use Database
    if (!localStorage["logins"]) {
        localStorage.setItem("logins", JSON.stringify(userlogins))
    }
    localStorage.setItem("userindex", -1);
}

// logout set user index to -1
function logout() {
    localStorage.setItem("userindex", -1);
}

// function that is called when login button is clicked
function login() {
    event.preventDefault();
    let user = document.getElementById('user').value;
    let password = document.getElementById('password').value;
    let logins = JSON.parse(localStorage.getItem("logins"));
    var foundUser = false;
    for (var i = 0; i < logins.length; i++) {
        if (user == logins[i]["email"]) {
            foundUser = true;
            if (password == logins[i]["password"]) {
                localStorage.setItem("userindex", i);
                if (logins[i]["usertype"] == 1) {
                    window.location.href = "owner.html";
                } else {
                    window.location.href = "coworker.html";
                }
                break;
            } else {
                alert("Invalid password");
            }
        }
    }
    if (foundUser == false) {
        alert("User name not found");
    }
}

// helper function
function userExists(user, logins) {
    for (var i = 0; i < logins.length; i++) {
        if (user == logins[i]["email"]) {
            return true;
        }
    }
    return false;
}

// function to signup
function signup() {
    event.preventDefault();
    let user = document.getElementById('user').value;
    let password = document.getElementById('password').value;
    let name = document.getElementById('name').value;
    let phone = document.getElementById('phonenumber').value;
    var usertypes = document.getElementsByName("usertype");
    let usertype = 1;
    let logins = JSON.parse(localStorage.getItem("logins"));
    for(var i = 0; i < usertypes.length; i++) {
        if(usertypes[i].checked) {
            usertype = parseInt(usertypes[i].value);
        }
    }
    if (!userExists(user, logins)) {
        if (usertype == 1) {
            logins.push({name: name, email: user, phone: phone, password: password, usertype: usertype, properties: []});
        } else {
            logins.push({name: name, email: user, phone: phone, password: password, usertype: usertype});
        }
        localStorage["logins"] = JSON.stringify(logins);
        alert("User added successfully");
    } else {
        alert("User name already exists");
    }
} 

function addProperty() {
    event.preventDefault();
    let address = document.getElementById('address').value;
    let neighborhood = document.getElementById('neighborhood').value;
    let sqft = document.getElementById('sqft').value;
    var logins = JSON.parse(localStorage.getItem("logins"));
    var index = localStorage.getItem("userindex");
    if (index == -1) {
        alert("You need to login as owner to access this page");
    } else {
        if (logins) {
            let user = logins[index];
            if (user["usertype"] == 2) {
                alert("You need to login as owner to access this page");
            } else {
                logins[index]["properties"].push({address: address, neighborhood: neighborhood, squarefeet: sqft, parking: document.getElementById("parking").checked, transit: document.getElementById("transit").checked, workspaces:[]});
                localStorage["logins"] = JSON.stringify(logins);
                alert("Property added successfully");
            }
        }
    }
}

function listProperties() {
    var table = document.getElementById("myproperties");
    table.innerHTML="";
    var logins = JSON.parse(localStorage.getItem("logins"));
    var index = localStorage.getItem("userindex");
    localStorage["workIndex"] = -1;
    localStorage["propIndex"] = -1;

    if (index == -1) {
        alert("You need to login as owner to access this page");
    }
    var th = document.createElement("th");
    th.colSpan = "6";
    th.innerHTML = "<h3>List of Properties:</h3>";
    table.appendChild(th);
    if (logins) {
        var tr = document.createElement("tr");
        table.appendChild(tr);
        var td = document.createElement("td");
        td.innerHTML = "Select";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Address";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Neighborhood";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Square Feet";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Parking Garage";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Public Transit";
        tr.appendChild(td);
        for (var i = 0; i < logins[index]["properties"].length; i++) {
            tr = document.createElement("tr");
            table.appendChild(tr);
            td = document.createElement("td");
            var option = document.createElement("input");
            option.type = "radio";
            option.name = "selectproperty";
            option.value = i;
            td.appendChild(option);
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = logins[index]["properties"][i]["address"];
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = logins[index]["properties"][i]["neighborhood"];
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = logins[index]["properties"][i]["squarefeet"];
            tr.appendChild(td);
            td = document.createElement("td");
            if (logins[index]["properties"][i]["parking"]) {
                td.innerHTML = "Yes";
            } else {
                td.innerHTML = "No";
            }
            tr.appendChild(td);
            td = document.createElement("td");
            if (logins[index]["properties"][i]["transit"]) {
                td.innerHTML = "Yes";
            } else {
                td.innerHTML = "No";
            }
            tr.appendChild(td);
        }
    }
}

function getSelectedPropertyIndex() {
    var propertyList = document.getElementsByName("selectproperty");
    for (var i = 0; i < propertyList.length; i++) {
        if (propertyList[i].checked) {
            return propertyList[i].value;
        }
    }
    return -1;
}

function getSelectedWorkSpaceIndex() {
    var workList = document.getElementsByName("selectworkspace");
    for (var i = 0; i < workList.length; i++) {
        if (workList[i].checked) {
            return workList[i].value;
        }
    }
    return -1;
}


function delistProperty() {
    var logins = JSON.parse(localStorage.getItem("logins"));
    var index = localStorage.getItem("userindex");
    if (index == -1) {
        alert("You need to login as owner to access this page");
        return;
    }
    let propIndex = getSelectedPropertyIndex();
    if (propIndex == -1) {
        alert("Please select a property first");
    } else {
        logins[index]["properties"].splice(propIndex, 1);
        localStorage["logins"] = JSON.stringify(logins);
        alert("Property delisted successfully");
    }
    listProperties();

}

function getWorkSpaceType(code) {
    switch (code) {
        case 1:
            return "Meeting Room";
        case 2:
            return "Private Office";
        case 3:
            return "Desk";
    }
}

function getLeaseTerm(code) {
    switch (code) {
        case 1:
            return "Day";
        case 2:
            return "Week";
        case 3:
            return "Month";
    }
}

function listWorkSpaces() {
    var table = document.getElementById("workspaces");
    var div = document.getElementById("delistWorkspace");
    table.innerHTML="";
    div.innerHTML = "";
    var logins = JSON.parse(localStorage.getItem("logins"));
    var index = localStorage.getItem("userindex");
    if (index == -1 || !logins) {
        alert("You need to login as owner to access this page");
        return;
    }
    let propIndex = getSelectedPropertyIndex();
    if (propIndex == -1) {
        alert("Please select a property");
        return;
    }
    localStorage.setItem("propIndex", propIndex);
    workspaces = logins[index]["properties"][propIndex]["workspaces"];
    if (workspaces.length != 0) {
        var th = document.createElement("th");
        th.colSpan = "7";
        th.innerHTML = "<h3>List of Workspaces:</h3>";
        table.appendChild(th);
        var tr = document.createElement("tr");
        table.appendChild(tr);
        var td = document.createElement("td");
        td.innerHTML = "Select";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Type";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Capacity";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Smoking";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Available";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Lease Term";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Price";
        tr.appendChild(td);
        for (var i = 0; i < workspaces.length; i++) {
            tr = document.createElement("tr");
            table.appendChild(tr);
            td = document.createElement("td");
            var option = document.createElement("input");
            option.type = "radio";
            option.name = "selectworkspace";
            option.value = i;
            td.appendChild(option);
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = getWorkSpaceType(parseInt(workspaces[i]["type"]));
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = workspaces[i]["numberindividuals"]
            tr.appendChild(td);
            td = document.createElement("td");
            if (workspaces[i]["smoking"]) {
                td.innerHTML = "Yes";
            } else {
                td.innerHTML = "No";
            }
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = workspaces[i]["availabledate"]
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = getLeaseTerm(parseInt(workspaces[i]["leaseterm"]));
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = workspaces[i]["price"]
            tr.appendChild(td);
        }
        
        var button = document.createElement("button");
        button.innerHTML = "Delist Workspace";
        button.onclick = function() {
            deleteWorkspace();
        }        
        div.appendChild(button);
        var button = document.createElement("button");
        button.innerHTML = "Modify";
        button.onclick  = function() {
            modifyWorkSpaceHelper();
        }
        div.appendChild(button);
    }

}

function loadModifyWorkspacePage() {
    var workIndex = localStorage["workIndex"];
    var propIndex = localStorage["propIndex"];
    var logins = JSON.parse(localStorage.getItem("logins"));
    var index = localStorage["userindex"];
    if (workIndex == -1) {
        alert("Please select a workspace");
        return;
    }
    let workspace = logins[index]["properties"][propIndex]["workspaces"][workIndex];
    document.getElementById("numberofindividuals").value = workspace["numberindividuals"];
    document.getElementById("smoking").checked = workspace["smoking"];
    document.getElementById("available").value = workspace["availabledate"];
    document.getElementById("leaseterm").value = workspace["leaseterm"];
    document.getElementById("workspacetype").value = workspace["type"];
    document.getElementById("price").value = workspace["price"];
}

function modifyWorkspace() {
    var workIndex = localStorage["workIndex"];
    var propIndex = localStorage["propIndex"];
    var logins = JSON.parse(localStorage.getItem("logins"));
    var index = localStorage["userindex"];
    if (workIndex == -1) {
        alert("Please select a workspace");
        return;
    }
    logins[index]["properties"][propIndex]["workspaces"][workIndex]["numberindividuals"] = document.getElementById("numberofindividuals").value;
    logins[index]["properties"][propIndex]["workspaces"][workIndex]["smoking"] = document.getElementById("smoking").checked;
    logins[index]["properties"][propIndex]["workspaces"][workIndex]["availabledate"] = document.getElementById("available").value;
    logins[index]["properties"][propIndex]["workspaces"][workIndex]["leaseterm"] = document.getElementById("leaseterm").value;
    logins[index]["properties"][propIndex]["workspaces"][workIndex]["type"] = document.getElementById("workspacetype").value;
    logins[index]["properties"][propIndex]["workspaces"][workIndex]["price"] = document.getElementById("price").value;
    localStorage["logins"] = JSON.stringify(logins);
    alert("Workspace successfully modified");
}

function modifyWorkSpaceHelper() {
    var workIndex = getSelectedWorkSpaceIndex();
    if (workIndex == -1) {
        alert("Please select a workspace");
    } else {
        localStorage.setItem("workIndex", workIndex);
        window.location.href = "modifyWorkspace.html";
    }
}

function deleteWorkspace() {
    let propIndex = localStorage["propIndex"];
    let workspaceIndex = getSelectedWorkSpaceIndex();
    var logins = JSON.parse(localStorage.getItem("logins"));
    var index = localStorage.getItem("userindex");
    if (index == -1) {
        alert("You need to login as owner to access this page");
        return;
    }
    if (workspaceIndex == -1) {
        alert("Please select a workspace");
    } else {
        logins[index]["properties"][propIndex]["workspaces"].splice(workspaceIndex, 1);
        localStorage["logins"] = JSON.stringify(logins);
        alert("Workspace delisted successfully");
    }
    listWorkSpaces();
}

function addWorkSpaceHelper() {
    propIndex = getSelectedPropertyIndex();
    if (propIndex == -1) {
        alert("Please select a property");
    } else {
        localStorage.setItem("propIndex", propIndex);
        window.location.href = "addWorkSpace.html";
    }
}

function modifyPropertyHelper() {
    propIndex = getSelectedPropertyIndex();
    if (propIndex == -1) {
        alert("Please select a property");
    } else {
        localStorage.setItem("propIndex", propIndex);
        window.location.href = "modifyProperty.html";
    }
}

function loadModifyPropertyPage() {
    var propIndex = localStorage.getItem("propIndex");
    if (!propIndex) {
        alert("Please select a property first");
    } else {
        var logins = JSON.parse(localStorage.getItem("logins"));
        var index = localStorage.getItem("userindex");
        if (index == -1) {
            alert("You need to login as owner to access this page");
            return;
        }
        document.getElementById("address").value = logins[index]["properties"][propIndex]["address"];
        document.getElementById("neighborhood").value = logins[index]["properties"][propIndex]["neighborhood"];
        document.getElementById("sqft").value = logins[index]["properties"][propIndex]["squarefeet"];
        document.getElementById("parking").checked = logins[index]["properties"][propIndex]["parking"];
        document.getElementById("transit").checked = logins[index]["properties"][propIndex]["transit"];
    }
}

function modifyProperty() {
    var propIndex = localStorage.getItem("propIndex");
    if (!propIndex) {
        alert("Please select a property first");
    } else {
        var logins = JSON.parse(localStorage.getItem("logins"));
        var index = localStorage.getItem("userindex");
        if (index == -1) {
            alert("You need to login as owner to access this page");
            return;
        }
        logins[index]["properties"][propIndex]["address"] = document.getElementById("address").value;
        logins[index]["properties"][propIndex]["neighborhood"] = document.getElementById("neighborhood").value;
        logins[index]["properties"][propIndex]["squarefeet"] = document.getElementById("sqft").value;
        logins[index]["properties"][propIndex]["parking"] = document.getElementById("parking").checked;
        logins[index]["properties"][propIndex]["transit"]  = document.getElementById("transit").checked;
        localStorage["logins"] = JSON.stringify(logins);
        alert("Property successfully modified");
    }
}

function addWorkspace() {
    event.preventDefault();
    
    let workspacetype = document.getElementById("workspacetype").value;
    let numberindividuals = document.getElementById("numberofindividuals").value;
    let smoking = document.getElementById("smoking").checked;
    let availabledate = document.getElementById("available").value;
    let leaseterm = document.getElementById("leaseterm").value;
    let price = document.getElementById("price").value;
    var workspace = {type: workspacetype, numberindividuals: numberindividuals, smoking: smoking, availabledate:availabledate, leaseterm:leaseterm, price: price};
    let propIndex = localStorage["propIndex"];
    if (!propIndex) {
        alert("Please select a property");
        return;
    }
    
    var logins = JSON.parse(localStorage.getItem("logins"));
    var index = localStorage.getItem("userindex");
    if (index == -1) {
        alert("You need to login as owner to access this page");
        return;
    }
    logins[index]["properties"][propIndex]["workspaces"].push(workspace);
    localStorage["logins"] = JSON.stringify(logins); 
    alert("Workspace added successfully");  
}

function searchWorkSpaces() {
    event.preventDefault();

    searchresults = []
    
    let address = document.getElementById("address").value;
    console.log(address);
    let neighborhood = document.getElementById("neighborhood").value;
    let sqft = document.getElementById("sqft").value;
    let parking = document.getElementById("parking").checked;
    let transit = document.getElementById("transit").checked;
    let workspacetype = parseInt(document.getElementById("workspacetype").value);
    let numberindividuals = document.getElementById("numberofindividuals").value;
    let smoking = document.getElementById("smoking").checked;
    let availabledate = document.getElementById("available").value;
    let leaseterm = parseInt(document.getElementById("leaseterm").value);
    let price = document.getElementById("price").value;
    var logins = JSON.parse(localStorage.getItem("logins"));
    
    
    for (var i = 0; i < logins.length; i++) {
        for (var j=0; j < logins[i]["properties"].length; j++ ) {
            console.log(j);
            var property = logins[i]["properties"][j];
            if (address != "" && property["address"] != address) {
                continue;
            }
            if (neighborhood != "" && property["neighborhood"] != neighborhood) {
                continue;
            }
            if (sqft != "" && property["squarefeet"] != sqft) {
                continue;
            }
            if (parking != property["parking"]) {
                continue;
            }
            if (transit != property["transit"]) {
                continue;
            }
            console.log(property);
            for (var k = 0; k < property["workspaces"].length; k++) {
                var workspace = property["workspaces"][k];
                if (workspacetype != 0 && workspace["type"] != workspacetype) {
                    continue;
                }
                if (numberindividuals != "" && workspace["numberindividuals"] != numberindividuals) {
                    continue;
                }
                if (availabledate != "" && workspace["availabledate"] != availabledate) {
                    continue;
                } 
                if (leaseterm != 0 && workspace["leaseterm"] != leaseterm) {
                    continue;
                }
                if (smoking != workspace["smoking"]) {
                    continue;
                }
                if (price != "" && workspace["price"]!= price) {
                    continue;
                }
                searchresults.push({workspace: workspace, userIndex: i, propertyIndex: j});
            }
        }
    }
    var table = document.getElementById("searchResults");
    var div = document.getElementById("viewDetails");
    table.innerHTML="";
    div.innerHTML = "";
    if (searchresults.length != 0) {
        var th = document.createElement("th");
        th.colSpan = "7";
        th.innerHTML = "<h3>Search Results:</h3>";
        table.appendChild(th);
        var tr = document.createElement("tr");
        table.appendChild(tr);
        var td = document.createElement("td");
        td.innerHTML = "Select";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Type";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Capacity";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Smoking";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Available";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Lease Term";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = "Price";
        tr.appendChild(td);
        for (var i = 0; i < searchresults.length; i++) {
            workspace = searchresults[i]["workspace"];
            tr = document.createElement("tr");
            table.appendChild(tr);
            td = document.createElement("td");
            var option = document.createElement("input");
            option.type = "radio";
            option.name = "selectworkspace";
            option.value = i;
            td.appendChild(option);
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = getWorkSpaceType(parseInt(workspace["type"]));
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = workspace["numberindividuals"]
            tr.appendChild(td);
            td = document.createElement("td");
            if (workspace["smoking"]) {
                td.innerHTML = "Yes";
            } else {
                td.innerHTML = "No";
            }
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = workspace["availabledate"]
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = getLeaseTerm(parseInt(workspace["leaseterm"]));
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = workspace["price"]
            tr.appendChild(td);
        }
        
        var button = document.createElement("button");
        button.innerHTML = "View Details";
        button.onclick = function() {
            viewWorkSpaceDetails();
        }        
        div.appendChild(button);
        var button = document.createElement("button");
        button.innerHTML = "View Owner Information";
        button.onclick  = function() {
            viewOwnerDetails();
        }
        div.appendChild(button);
    } else {
        alert("No Workspace Matches the Criteria");
    }
    console.log(searchresults);
}

function viewWorkSpaceDetails() {
    var table = document.getElementById("details");
    table.innerHTML="";
    var workIndex = getSelectedWorkSpaceIndex();
    if (workIndex == -1) {
        alert("Please select a workspace");
    } else {
        var logins = JSON.parse(localStorage.getItem("logins"));   
        var myvar = searchresults[workIndex];
        property = logins[myvar["userIndex"]]["properties"][myvar["propertyIndex"]];     
        var th = document.createElement("th");
        th.innerHTML = "Workspace Details";
        th.colSpan = "2";
        table.appendChild(th);
        var tr = document.createElement("tr");
        table.appendChild(tr);
        td = document.createElement("td");
        td.innerHTML = "Address";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = property["address"];
        tr.appendChild(td);
        tr = document.createElement("tr");
        table.appendChild(tr);
        td = document.createElement("td");
        td.innerHTML = "Neighborhood";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = property["neighborhood"];
        tr.appendChild(td);
        tr = document.createElement("tr");
        table.appendChild(tr);
        td = document.createElement("td");
        td.innerHTML = "Square Footage";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = property["squarefeet"];
        tr.appendChild(td);
    }

}

function viewOwnerDetails() {
    var table = document.getElementById("details");
    table.innerHTML="";
    var workIndex = getSelectedWorkSpaceIndex();
    if (workIndex == -1) {
        alert("Please select a workspace");
    } else {
        var logins = JSON.parse(localStorage.getItem("logins"));   
        var myvar = searchresults[workIndex];
        property = logins[myvar["userIndex"]];     
        var th = document.createElement("th");
        th.innerHTML = "Owner Details";
        th.colSpan = "2";
        table.appendChild(th);
        var tr = document.createElement("tr");
        table.appendChild(tr);
        td = document.createElement("td");
        td.innerHTML = "Name";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = property["name"];
        tr.appendChild(td);
        tr = document.createElement("tr");
        table.appendChild(tr);
        td = document.createElement("td");
        td.innerHTML = "Email";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = property["email"];
        tr.appendChild(td);
        tr = document.createElement("tr");
        table.appendChild(tr);
        td = document.createElement("td");
        td.innerHTML = "Phone Number";
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = property["phone"];
        tr.appendChild(td);
    }
}