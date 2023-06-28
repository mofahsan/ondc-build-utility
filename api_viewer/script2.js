

// main.js

var parsedData

function loadDropdown1() {
  var dropdown1 = document.getElementById('dropdown1');
  dropdown1.innerHTML = '';

  // Populate dropdown1
  Object.keys(parsedData).forEach(function (key) {
    var option = document.createElement('option');
    option.text = key;
    dropdown1.add(option);
  });
}

function loadDropdown2() {
  var dropdown1 = document.getElementById('dropdown1');
  var dropdown2 = document.getElementById('dropdown2');
  dropdown2.innerHTML = '';

  // Get the selected value from dropdown1
  var selectedValue1 = dropdown1.value;

  // Populate dropdown2
  Object.keys(parsedData[selectedValue1]).forEach(function (key) {
    var option = document.createElement('option');
    option.text = key;
    dropdown2.add(option);
  });
}

function loadDropdown3() {
  var dropdown1 = document.getElementById('dropdown1');
  var dropdown2 = document.getElementById('dropdown2');
  var dropdown3 = document.getElementById('dropdown3');
  dropdown3.innerHTML = '';

  // Get the selected values from dropdown1 and dropdown2
  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;

  // Populate dropdown3
  parsedData[selectedValue1][selectedValue2].forEach(function (item) {
    var option = document.createElement('option');
    option.text = item["value"];
    console.log("iten added", item.value)
    dropdown3.add(option);
  });
}

function displayTable() {
  var dropdown1 = document.getElementById('dropdown1');
  var dropdown2 = document.getElementById('dropdown2');
  var dropdown3 = document.getElementById('dropdown3');

  // Get the selected values from dropdown1, dropdown2, and dropdown3
  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;
  var selectedValue3 = dropdown3.value;

  console.log("selectedValue3", selectedValue3)
  // Get the table data
  var tableData = parsedData[selectedValue1][selectedValue2].find(obj => {
    if (obj["value"] == selectedValue3)
      return obj
  });

  // Get the table body element
  var tableBody = document.getElementById('result-table');
  if (tableBody && tableBody != {}) tableBody.innerHTML = '';
  insertRow(tableBody, "ENUM", tableData.value)
  insertRow(tableBody, "Description", tableData.description)
  insertRow(tableBody, "Refrences", tableData.reference)
  insertRow(tableBody, "APIs", tableData.api)

}

function insertRow(tableBody, key, value) {
  var row = tableBody.insertRow();
  var cell = row.insertCell();
  cell.innerHTML = key
  var cell = row.insertCell();
  cell.innerHTML = value;
}

function fetchData(url) {
  return fetch(url)
    .then(response => response.text())
    .then(yamlData => jsyaml.load(yamlData));
}

// function loadTagYaml() {
//   var inputText = document.getElementById('enum_url').value;
//   var result = inputText.toLowerCase();
//   populateEnums(result);
// }

function populateEnums(url) {
  // Example usage: fetch YAML data from a URL
  fetchData(url).then(data => {
    console.log(data)
    initSchema(data["x-enum"])
    initTag(data["x-tags"])
  })
    .catch(error => {
      console.error('Error fetching or parsing YAML:', error);
    });
}

function initSchema(data) {
    parsedData = data
    loadDropdown1()
    loadDropdown2()
    loadDropdown3()
}

// populateEnums("https://raw.githubusercontent.com/92shreyansh/json-schema-store/v1.0.0/enum.yaml")

populateEnums("https://raw.githubusercontent.com/92shreyansh/mobility-specification/draft-1.x/api/mobility/build/build.yaml");



