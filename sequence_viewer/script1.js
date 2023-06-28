window.onload = function () {
    document.getElementById('file-input').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            const openApiYaml = event.target.result;
            let data = jsyaml.load(openApiYaml)
            loadFlow(data["x-flows"])
        };
        reader.readAsText(file);
    });
}

function loadSteps(steps) {
    const stepsList = document.getElementById('steps-list');
    const stepSummary = document.getElementById('step-summary');
    const stepDescription = document.getElementById('step-description');
    const yamlContent = document.getElementById('yaml-content');
    // Render the steps list
    steps.forEach((step, index) => {
        const li = document.createElement('li');
        li.textContent = step["summary"];
        li.classList.add('step');
        li.dataset.index = index;
        stepsList.appendChild(li);
    });

    // Add click event listener to each step
    const flowElements = document.getElementsByClassName('step');
    Array.from(flowElements).forEach(step => {
        step.addEventListener('click', handleFlowClick);
    });

    // Handle step click event
    function handleFlowClick(event) {
        const clickedStep = event.target;
        const stepIndex = clickedStep.dataset.index;

        // Remove 'active' class from all steps
        Array.from(flowElements).forEach(flow => {
            flow.classList.remove('active');
        });

        // Add 'active' class to clicked step
        clickedStep.classList.add('active');

        // Get YAML content for the selected step index
        const selectedStep = steps[stepIndex];
        stepSummary.textContent = selectedStep["summary"]
        stepDescription.textContent = selectedStep["description"]
        yamlContent.textContent = JSON.stringify(selectedStep["example"]["value"], null, 2);
    }

};


function loadFlow(flows) {
    const flowsList = document.getElementById('flows-list');
    const flowSummary = document.getElementById('flow-summary');
    const flowDescription = document.getElementById('flow-description');
    // Render the steps list
    flows.forEach((flow, index) => {
        const li = document.createElement('li');
        li.textContent = flow["summary"];
        li.classList.add('flow');
        li.dataset.index = index;
        flowsList.appendChild(li);
    });

    // Add click event listener to each step
    const flowElements = document.getElementsByClassName('flow');
    Array.from(flowElements).forEach(step => {
        step.addEventListener('click', handleFlowClick);
    });

    // Handle step click event
    function handleFlowClick(event) {
        const clickedStep = event.target;
        const flowIndex = clickedStep.dataset.index;

        // Remove 'active' class from all steps
        Array.from(flowElements).forEach(flow => {
            flow.classList.remove('active');
        });

        // Add 'active' class to clicked step
        clickedStep.classList.add('active');

        // Get YAML content for the selected step index
        const selectedFlow = flows[flowIndex];
        flowSummary.textContent = selectedFlow["summary"]
        flowDescription.textContent = selectedFlow["description"]
        loadSteps(selectedFlow["steps"])
    }

};

function loadFlowURI(url) {
    fetchData(url).then(data => {
        console.log(data)
        loadFlow(data["flow"])
    })
        .catch(error => {
            console.error('Error fetching or parsing YAML:', error);
        });
};

function fetchData(url) {
    return fetch(url)
        .then(response => response.text())
        .then(yamlData => jsyaml.load(yamlData));
}
