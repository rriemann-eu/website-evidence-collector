const fs = require("fs-extra");
const yaml = require("js-yaml");
const path = require("path");
const pug = require("pug");

const groupBy = require("lodash/groupBy");
const flatten = require("lodash/flatten");

function reporter(args) {
  const c = {
    args: args,
  };

  console.log(c.args);

  c.saveJson = function (data, filename) {
    let json_dump = JSON.stringify(data, null, 2);
    fs.writeFileSync(path.join(c.args.output, filename), json_dump);
  };

  c.saveYaml = function (data, filename) {
    let yaml_dump = yaml.safeDump(data, { noRefs: true });
    fs.writeFileSync(path.join(c.args.output, filename), yaml_dump);
  };

  c.generateHtml = function (
    data,
    filename = "inspection.html",
    template = "../assets/template.pug"
  ) {
    let html_template =
      c.args["html-template"] || path.join(__dirname, template);
    let html_dump = pug.renderFile(
      html_template,
      Object.assign({}, data, {
        pretty: true,
        basedir: path.join(__dirname, "../assets"),
        groupBy: groupBy,
        inlineCSS: fs.readFileSync(
          require.resolve("github-markdown-css/github-markdown.css")
        ),
      })
    );

    fs.writeFileSync(path.join(c.args.output, filename), html_dump);
  };

  c.saveSource = function (source, filename = "source.html") {
    fs.writeFileSync(path.join(c.args.output, filename), source);
  };

  return c;
}

module.exports = reporter;