

// main.js

function fetchData(url) {
  return fetch(url)
    .then(response => response.text())
    .then(yamlData => jsyaml.load(yamlData));
}



function loadTagSchema() {
  var dropdown1 = document.getElementById('tag-schema-dropdown');
  dropdown1.innerHTML = '';

  // Populate dropdown1
  Object.keys(TagData).forEach(function (key) {
    var option = document.createElement('option');
    option.text = key;
    dropdown1.add(option);
  });
}

function loadTagGroup() {
  var dropdown1 = document.getElementById('tag-schema-dropdown');
  var dropdown2 = document.getElementById('tag-group-dropdown');
  dropdown2.innerHTML = '';

  // Get the selected value from dropdown1
  var selectedValue1 = dropdown1.value;

  // Populate dropdown2
  Object.keys(TagData[selectedValue1]["tags"]).forEach(function (key) {
    var option = document.createElement('option');
    option.text = TagData[selectedValue1]["tags"][key]["code"];
    dropdown2.add(option);
  });
}

function loadTag() {
  var dropdown1 = document.getElementById('tag-schema-dropdown');
  var dropdown2 = document.getElementById('tag-group-dropdown');
  var dropdown3 = document.getElementById('tag-dropdown');
  dropdown3.innerHTML = '';

  // Get the selected values from dropdown1 and dropdown2
  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;

  // Populate dropdown3
  let selectedObject2 = TagData[selectedValue1]["tags"].find(obj => {
    if (obj["code"] === selectedValue2)
      return obj
  });
  console
  let list = selectedObject2.list
  list.forEach(function (obj) {
    var option = document.createElement('option');
    option.text = obj["code"];
    dropdown3.add(option);
  })
  displayTagGroup()
}

function displayTagGroup() {
  var dropdown1 = document.getElementById('tag-schema-dropdown');
  var dropdown2 = document.getElementById('tag-group-dropdown');

  // Get the selected values from dropdown1, dropdown2
  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;
  // Get the table data
  let selectedObject2 = TagData[selectedValue1]["tags"].find(obj => {
    if (obj["code"] === selectedValue2)
      return obj
  });
  var tableBody = document.getElementById('tag-group-table');
  if (tableBody && tableBody != {}) tableBody.innerHTML = '';
  insertRow(tableBody, "Code", selectedObject2.code)
  insertRow(tableBody, "Description", selectedObject2.description)
  insertRow(tableBody, "Refrences", selectedObject2.reference)
}

function displayTag() {
  var dropdown1 = document.getElementById('tag-schema-dropdown');
  var dropdown2 = document.getElementById('tag-group-dropdown');
  var dropdown3 = document.getElementById('tag-dropdown');

  // Get the selected values from dropdown1, dropdown2, and dropdown3
  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;
  // Get the table data
  let selectedObject2 = TagData[selectedValue1]["tags"].find(obj => {
    if (obj["code"] === selectedValue2)
      return obj
  });
  let list = selectedObject2["list"]
  var selectedValue3 = dropdown3.value;

  console.log("selectedValue3", selectedValue3)

  var tableData = list.find(obj => {
    if (obj["code"] == selectedValue3)
      return obj
  });
  // Get the table body element
  var tableBody = document.getElementById('tag-table');
  if (tableBody && tableBody != {}) tableBody.innerHTML = '';
  insertRow(tableBody, "Code", tableData.code)
  insertRow(tableBody, "Description", tableData.description)
  insertRow(tableBody, "Refrences", tableData.reference)

}

function insertRow(tableBody, key, value) {
  var row = tableBody.insertRow();
  var cell = row.insertCell();
  cell.innerHTML = key
  var cell = row.insertCell();
  cell.innerHTML = value;
}

function fetchTag() {
  var inputText = document.getElementById('tag_url').value;
  var result = inputText.toLowerCase();
  populateTags(result);
}

function populateTags(url) {
  // Example usage: fetch YAML data from a URL
  fetchData(url).then(data => {
    console.log(data)
    init(data)
  })
    .catch(error => {
      console.error('Error fetching or parsing YAML:', error);
    });
}

function initTag(data) {
  TagData = data
  loadTagSchema()
  loadTagGroup()
  loadTag()
}

populateTags("https://raw.githubusercontent.com/92shreyansh/mobility-specification/draft-1.x/api/mobility/build/build.yaml");

