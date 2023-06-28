window.onload = function () {
  // let url = Math.random() < 0.5?"https://raw.githubusercontent.com/beckn/mobility/main/api/mobility.yaml":"https://raw.githubusercontent.com/beckn/protocol-specifications/master/api/transaction/build/transaction.yaml"
  let url = "https://raw.githubusercontent.com/beckn/mobility/main/api/mobility.yaml"//"https://raw.githubusercontent.com/beckn/protocol-specifications/master/api/transaction/build/transaction.yaml"
  loadSwaggerUI(url)
}

function loadSwaggerYaml() {
  var inputText = document.getElementById('swagger_url').value;
  var result = inputText.toLowerCase();
  loadSwaggerUI(result)
}

function display(result) {
  document.getElementById('output').innerText = result;
}

function loadSwaggerUI(url) {
  const ui = SwaggerUIBundle({
    url: url,
    dom_id: '#swagger-ui',
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    layout: "BaseLayout",
    deepLinking: true
  });
  window.ui = ui
};
