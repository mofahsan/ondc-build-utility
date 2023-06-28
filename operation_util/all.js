const fs = require('fs');
const yaml = require('js-yaml');
const operator = require('./operator/util')

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
            value = operator.evaluateOpretion(context, value["operation"]);
        }
        return value !== undefined ? value : match;
    });
}



