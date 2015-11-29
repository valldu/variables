(function (ModelSchemas) {
    var DTOVariable = (function () {
        function DTOVariable() {
        }
        return DTOVariable;
    })();
    ModelSchemas.DTOVariable = DTOVariable;

    var DTOVariableParserResult = (function () {
        function DTOVariableParserResult() {
        }
        return DTOVariableParserResult;
    })();
    ModelSchemas.DTOVariableParserResult = DTOVariableParserResult;

    var VariableSchema = (function () {
        function VariableSchema() {
        }
        VariableSchema.getSchema = function (driver) {
            var schema = driver.Schema;

            return new schema({
                //_id: driver.Schema.Types.ObjectId,
                pacient: { type: String, index: true },
                variable: { type: String, index: true },
                timestamp_variable: { type: Number, index: true },
                valor: { type: driver.Schema.Types.Mixed, index: true },
                unitatMesura: { type: String, index: true },
                usuari: { type: String, index: true },
                origen: { type: String, index: true },
                timestamp_backend: { type: Number, index: true },
                comentari: { type: String, index: false },
                metadades: { type: driver.Schema.Types.Mixed, index: false }
            });
        };
        return VariableSchema;
    })();
    ModelSchemas.VariableSchema = VariableSchema;
})(exports.ModelSchemas || (exports.ModelSchemas = {}));
var ModelSchemas = exports.ModelSchemas;
//# sourceMappingURL=model_schema.js.map
