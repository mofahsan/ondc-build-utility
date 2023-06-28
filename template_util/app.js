const fs = require('fs');
const yaml = require('js-yaml');
const crypto = require('crypto');
const { get } = require('https');

class Input {
    context;
    operation;
    value;
    // constructor(value){
    //     this.value = value
    // }
    constructor(context, config){
        this.context = context
        this.operation = config.operation
        this.value = config.value
        this.__process();
    }
    __process(){
        if(this.operation) {
            this.value = evaluateOpretion(this.context, this.operation);
        }
        return this
    }
    getValue(){
        return this.value;
    }
}

class Output {
    context;
    operation;
    value;
    constructor(value) {
        this.value = value
    }
    // constructor(context, config){
    //     this.context = context
    //     this.operation = config.operation
    //     this.value = config.value
    // }
    __process(){
        if(this.operation) {
            this.value = evaluateOpretion(this.context, getOperation(this.operation.type));
        }
    }
    getValue(){
        this.__process
        return this.value;
    }
}

class GenerateUuidOperation {
    context;
    input;
    output;
    constructor(context) {
        this.context = context;
    }
    setInput(input) {
        this.input = input.__process().getValue();
        return this;
    }
    __process() {
        this.output = new Output(crypto.randomUUID());
        return this;
    }
    getOutput() {
      return this.__process().output;
    }
}

class GenerateTmpstmpOperation {
    context;
    input;
    output;
    constructor(context) {
        this.context = context;
    }
    setInput(input) {
        this.input = input.__process().getValue();
        return this;
    }
    __process() {
        this.output = new Output(new Date().toISOString());
        return this;
    }
    getOutput() {
      return this.__process().output;
    }
} 

class ReadOperation {
    constructor(context) {
        this.context = context;
    }
    context;
    input;
    output;
    setInput(input) {
        this.input = input.__process();
        return this;
    }
    __process() {
        this.output = new Output(getAttribute(context, this.input.getValue().split(".")));
        return this;
    }
    getOutput() {
        return this.__process().output;
    }
}

const args = process.argv.slice(2);
const in_file = args[0]
const out_file = args[1]
const config_yaml = fs.readFileSync(in_file, 'utf8');
const config = yaml.load(config_yaml);
const template_path = config.template.url;
const template_dict = config.template.dict;
const payload_yaml = fs.readFileSync(template_path, 'utf8');

var context =  {req_body:{context:{message_id:"test_id",domain:"ONDC:RET10"}}, other:{text:"hellow"}};

const resolved_yaml = resolveTemplate(context, payload_yaml, template_dict)

console.log(resolved_yaml)
const resolved_json = JSON.stringify(yaml.load(resolved_yaml), null, 4)
fs.writeFileSync(out_file, resolved_json, 'utf8');

function resolveTemplate(context, template, values) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        var value = values[key]
        if(value && value["operation"]){
            value = evaluateOpretion(context, value["operation"]);
        }
        return value !== undefined ? value : match;
    });
}

function getAttribute(data, keyArr) {
    let key = isNaN(keyArr[0]) ? keyArr[0] : parseInt(keyArr[0]);
    if (data[key] && data[key] != undefined) {
      if (keyArr.length == 1) {
        return data[key];
      }
      return getAttribute(data[key], keyArr.slice(1, keyArr.length));
    }
    return undefined;
}

function evaluateOpretion(context, op) {
    var opt = getOperation(context, op.type)
    if(op["input"]){
        opt.input = evaluateInput(context, op["input"])
    }
    console.log(opt)
    return opt.getOutput().getValue();
}

function evaluateInput(context, inputObj) {
    var input = new Input(context, inputObj);
    return input;
}

function getOperation(context, op){
    switch(op){
        case "GENERATE_UUID":
            return new GenerateUuidOperation(context)
        case "READ":
            return new ReadOperation(context)
        case "GENERATE_TIMESTAMP":
            return new GenerateTmpstmpOperation(context)
    }
}