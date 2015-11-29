var Schema = require('../business/model_schema');
var config = require('./application_config');

(function (Application) {
    var ParserModule = (function () {
        function ParserModule() {
        }
        ParserModule.Parse = function (context, payload) {
            //Array<Schema.ModelSchemas.IVariableParserResult> {
            var _this = this;
            var Promise = require('promise');

            return new Promise(function (resolve, reject) {
                var list = new Array();
                var numberOfVariables = payload.variables.length - 1;

                for (var index in payload.variables) {
                    var variable = payload.variables[index];
                    var test = _this.checkData(context, variable);

                    if (test.successful) {
                        test.pacient = context.pacient;

                        test.variable = variable.variable;
                        test.valor = variable.valor;
                        test.timestamp_variable = ParserModule.convertDateToMillis(variable.data, variable.hora);
                        test.unitatMesura = variable.unitatMesura;
                        test.usuari = variable.usuari;
                        test.origen = 'ICS';
                        test.timestamp = Math.floor(new Date().getTime() / 1000);
                        test.comentari = variable.comentari;
                        test.metadades = variable.metadades;
                    }

                    list.push(test);

                    if (parseInt(index) == numberOfVariables)
                        resolve(list);
                }
            });
        };

        ParserModule.checkData = function (context, variable) {
            var parserResult = new Schema.ModelSchemas.DTOVariableParserResult();
            parserResult.successful = true;

            if (!context.pacient || context.pacient == '') {
                parserResult.message = config.Application.Configuration.PATIENT_PARSE_ERROR;
                parserResult.successful = false;
            }

            if (!variable.variable || variable.variable == '') {
                parserResult.message = config.Application.Configuration.VARIABLE_PARSE_ERROR;
                parserResult.successful = false;
            }

            if (!variable.valor || variable.valor == '') {
                parserResult.message = config.Application.Configuration.VALUE_PARSE_ERROR;
                parserResult.successful = false;
            }

            return parserResult;
        };

        ParserModule.convertDateToMillis = function (dateValue, timeValue) {
            var parts = dateValue.split("/");
            var partsTime = timeValue.split(":");

            var dayValue = parts[0];
            var monthValue = parts[1];
            var yearValue = parts[2];

            var hourValue = partsTime[0];
            var minuteValue = partsTime[1];
            var secondsValue = partsTime[2];

            var dt = new Date(parseInt(yearValue, 10), parseInt(monthValue, 10) - 1, parseInt(yearValue, 10), parseInt(hourValue), parseInt(minuteValue), parseInt(secondsValue));

            return Math.floor(dt.getTime() / 1000);
        };
        return ParserModule;
    })();
    Application.ParserModule = ParserModule;
})(exports.Application || (exports.Application = {}));
var Application = exports.Application;
//# sourceMappingURL=parser_module.js.map
