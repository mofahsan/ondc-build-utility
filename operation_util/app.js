const fs = require('fs');
const yaml = require('js-yaml');
const crypto = require('crypto');

const config_yaml = fs.readFileSync("./operation.yaml", 'utf-8');
const config =  yaml.load(config_yaml)



class Input {
    constructor(value) {
        this.value = value;
    }
    getValue(){
        return this.value;
    }
}

class Output {
    constructor(value) {
        this.value = value;
    }
    getValue(){
        return this.value;
    }
}



class GenerateUuidOperation {
  
    getOutput() {
      return new Output(crypto.randomUUID());
    }
}

function getOperation(op){
    switch(op){
        case "GENERATE_UUID":
            return new GenerateUuidOperation()
    }
}

console.log(getOperation(config.operation.type).getOutput().getValue())
  
//   const operation = getOperation('GENERATE_UUID');
//   console.log(operation.getOutput().getValue()); // Output: 8
  
  
// const args = process.argv.slice(2);
// const in_file = args[0]
// const out_file = args[1]
// const config_yaml = fs.readFileSync(in_file, 'utf8');
// const config = yaml.load(config_yaml);
// const template_path = config.template.url;
// const template_dict = config.template.dict;
// const payload_yaml = fs.readFileSync(template_path, 'utf8');
// const resolved_yaml = resolveTemplate(payload_yaml, template_dict)
// const resolved_json = JSON.stringify(yaml.load(resolved_yaml), null, 4)
// fs.writeFileSync(out_file, resolved_json, 'utf8');

// function resolveTemplate(template, values) {
// return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
//     return values[key] !== undefined ? values[key] : match;
// });
// }

