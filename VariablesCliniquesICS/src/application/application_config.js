(function (Application) {
    var Configuration = (function () {
        function Configuration() {
        }
        Configuration.MONGO_CONNECTION = 'mongodb://10.29.67.24/VariablesCliniques';
        Configuration.HTTP_OK = 200;

        Configuration.JSON_PARSE_ERROR = "No s´ha pogut processar el JSON enviat com a payload. Motiu: ";
        Configuration.OPEN_DB_MONGO_ERROR = "No s'ha pogut establir connexió amb la base de dades";

        Configuration.PATIENT_PARSE_ERROR = 'No s´ha especificat un pacient';
        Configuration.VARIABLE_PARSE_ERROR = 'No s´ha especificat una variable';
        Configuration.VALUE_PARSE_ERROR = 'No s´ha especificat un valor de variable';
        return Configuration;
    })();
    Application.Configuration = Configuration;
})(exports.Application || (exports.Application = {}));
var Application = exports.Application;
//# sourceMappingURL=application_config.js.map
