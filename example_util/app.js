const fs = require("fs");
const yaml = require("js-yaml");
const $RefParser = require("json-schema-ref-parser");
const { execSync } = require("child_process");
const Ajv = require("ajv");
const ajv = new Ajv({
  allErrors: true,
  strict: "log",
});
const addFormats = require("ajv-formats");
addFormats(ajv);
require("ajv-errors")(ajv);
const process = require("process");

const args = process.argv.slice(2);
// var example_set = args[0]
// var flow_set = args[1]
var base_yaml = "./beckn_yaml.yaml"; //args[0];
var example_yaml = "./index.yaml"; //args[1];
var outputPath = "../build/build.yaml";
var uiPath = "../../ui/build.js";
// const outputPath = `./build.yaml`;
// const unresolvedFilePath = `https://raw.githubusercontent.com/beckn/protocol-specifications/master/api/transaction/components/index.yaml`
const tempPath = `./temp.yaml`;

getSwaggerYaml("example_set", outputPath);

const SKIP_VALIDATION = {
  flows: "skip1",
  examples: "skip2",
  enums: "skip3",
  tags: "skip4",
};

async function baseYMLFile(file) {
  try {
    const schema = await $RefParser.dereference(file);
    return schema;
  } catch (error) {
    console.error("Error parsing schema:", error);
  }
}

async function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data?.value);
  if (!valid) {
    console.log(validate.errors);
    return true;
  }
  return false;
}

async function validateFlows(flows, schemaMap) {
  for (const flowItem of flows) {
    const { steps } = flowItem;
    if (steps && steps?.length) {
      for (const step of steps) {
        for (const api of Object.keys(schemaMap)) {
          if (step.api === api) {
            const result = await validateSchema(schemaMap[api], step.example);
            if (result) {
              console.log("Error[flows]:", `${flowItem?.summary + "/" + api}`);
              return (hasTrueResult = true);
            }
          }
        }
      }
    }
  }
}

async function validateExamples(exampleSets, schemaMap) {
  for (const example of Object.keys(exampleSets)) {
    for (const api of Object.keys(schemaMap)) {
      const exampleList = exampleSets[example].example_set[api]?.examples;
      if (exampleSets[example].example_set[api] && !exampleList) {
        throw Error(`Example not found for ${api}`);
      }

      if (exampleList !== undefined)
        for (const payload of Object.keys(exampleList)) {
          const result = await validateSchema(
            schemaMap[api],
            exampleList[payload]
          );
          if (result) {
            console.log("error[Example] :", `${example + "/" + api}`);
            return (hasTrueResult = true);
          }
        }
    }
  }
}

async function checkObjectKeys(currentExamplePos, currentSchemaPos, logObject) {
  for (const currentAttrib of Object.keys(currentExamplePos)) {
    const currentExample = currentExamplePos[currentAttrib];
    const currentSchema = currentSchemaPos[currentAttrib];
    if (currentSchemaPos[currentAttrib]) {
      if (Array.isArray(currentExamplePos[currentAttrib])) {
        //add logic, if has to check key values
      } else {
        //In on-search bpp/providers has no properties.
        //if items has to considered as properties
        //currentSchema?.properties || currentSchema?.items?.properties || currentSchema?.items
        const schema = currentSchema?.properties || currentSchema;
        await checkObjectKeys(currentExample, schema, logObject);
      }
    } else {
      throw Error(`Key not found: ${currentAttrib} in ${logObject}}`);
    }
  }
}

async function validateEnumsTags(exampleEnums, schemaMap) {
  for (const example of Object.keys(exampleEnums)) {
    const currentExample = exampleEnums[example];
    const currentSchema = schemaMap[example];

    //context & message loop
    for (const currentExamples of Object.keys(currentExample)) {
      const currentSchemaPos =
        currentSchema?.properties[currentExamples]?.properties;
      const currentExamplePos = currentExample[currentExamples];
      const logObject = `${example}/${currentExamples}`;

      await checkObjectKeys(currentExamplePos, currentSchemaPos, logObject);
    }
  }
}

async function getSwaggerYaml(example_set, outputPath) {
  const schema = await baseYMLFile(example_yaml);
  const baseYAML = await baseYMLFile(base_yaml);
  const { flows, examples: exampleSets, enum: enums, tags } = schema || {};
  const { paths } = baseYAML || {};
  let hasTrueResult = false; // Flag variable
  let schemaMap = {};

  for (const path in paths) {
    const pathSchema =
      paths[path]?.post?.requestBody?.content?.["application/json"]?.schema;
    schemaMap[path.substring(1)] = pathSchema;
  }

  if (!process.argv.includes(SKIP_VALIDATION.flows)) {
    hasTrueResult = await validateFlows(flows, schemaMap);
  }
  if (!process.argv.includes(SKIP_VALIDATION.examples)) {
    hasTrueResult = await validateExamples(exampleSets, schemaMap);
  }

  //move to separate files
  if (!process.argv.includes(SKIP_VALIDATION.enums)) {
    hasTrueResult = await validateEnumsTags(enums, schemaMap);
  }

  if (!process.argv.includes(SKIP_VALIDATION.tags)) {
    hasTrueResult = await validateEnumsTags(tags, schemaMap);
  }

  if (hasTrueResult) return;

  if (!hasTrueResult) {
    //remove these
    let examples = schema["examples"];
    examples = examples[example_set];
    buildSwagger(base_yaml, tempPath);
    const spec_file = fs.readFileSync(tempPath);
    const spec = yaml.load(spec_file);
    addEnumTag(spec, schema);
    GenerateYaml(spec, examples, outputPath);
    cleanup();
  }
}

function cleanup() {
  try {
    fs.unlinkSync(tempPath);
    console.log("Temporary file deleted");
  } catch (error) {
    console.error("Error deleting temporary file:", error);
  }
}

function writeSchemaMap(folder, schemaMap){
  for (const api of Object.keys(schemaMap)){
    var schema_yaml = folder+"/"+api+".yaml"
    var schmea = yaml.dump(schemaMap[api]);
    fs.writeFileSync(schema_yaml, schmea, "utf8");
  }
}

function buildSwagger(inPath, outPath) {
  try {
    const command = `swagger-cli bundle ${inPath} --outfile ${outPath} -t yaml`;
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(
      "An error occurred while generating the Swagger bundle:",
      error
    );
    process.exit(1);
  }
}

function addEnumTag(base, layer) {
  base["x-enum"] = layer["enum"];
  base["x-tags"] = layer["tags"];
  base["x-flows"] = layer["flows"];
  base["x-examples"] = layer["examples"];
}

function GenerateYaml(base, layer, output_yaml) {
  const output = yaml.dump(base);
  fs.writeFileSync(output_yaml, output, "utf8");
  const jsonDump = "let build_spec = " + JSON.stringify(base);
  fs.writeFileSync(uiPath, jsonDump, "utf8");
}
