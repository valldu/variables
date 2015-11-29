var Schema = require('../business/model_schema');
var config = require('../application/application_config');

(function (Mongo) {
    var MongoActionResult = (function () {
        function MongoActionResult() {
        }
        return MongoActionResult;
    })();
    Mongo.MongoActionResult = MongoActionResult;

    var MongoConnection = (function () {
        function MongoConnection(driver, mongoConnection) {
            this._driver = driver;
            this._mongoConnection = mongoConnection;
        }
        MongoConnection.prototype.initDB = function () {
            try  {
                this._driver.openDB();

                return true;
            } catch (e) {
                //this._response.server_status.has_error = true;
                //this._response.server_status.message = e.toString();
                return false;
            }
        };

        MongoConnection.prototype.openDB = function () {
            try  {
                //this._driver.connect("mongodb://localhost/VariablesCliniques");
                //this._driver.connect("mongodb://172.16.18.177/VariablesCliniques");
                this._driver.connect(this._mongoConnection);
                this._database = this._driver.connection;

                this._database.on('error', function () {
                    console.error.bind(console, "connection error");
                });
                this._database.once('open', function () {
                    console.log("VariablesCliniques is open...");
                });
            } catch (ex) {
                throw new Error("Error connection to database");
            }
        };

        MongoConnection.prototype.insertVariable = function (data) {
            var _this = this;
            var Promise = require('promise');

            return new Promise(function (resolve, reject) {
                var openDbResult = _this.initDB();

                var result = new MongoActionResult();
                result.successful = true;

                if (!_this._variableModel) {
                    var schema = Schema.ModelSchemas.VariableSchema.getSchema(_this._driver);
                    _this._variableModel = _this._driver.model('variable', schema);
                }

                var record = new _this._variableModel({
                    pacient: data.pacient,
                    variable: data.variable,
                    timestamp_variable: data.timestamp_variable,
                    valor: data.valor,
                    unitatMesura: data.unitatMesura,
                    usuari: data.usuari,
                    origen: data.origen,
                    timestamp_backend: data.timestamp,
                    comentari: data.comentari,
                    metadades: data.metadades
                });

                try  {
                    if (openDbResult) {
                        record.save(function (err) {
                            if (err) {
                                result.successful = false;
                                result.message = err;
                                console.log(err.toString());

                                reject(result);
                            }

                            resolve(result);
                        });
                    } else {
                        result.successful = false;
                        result.message = config.Application.Configuration.OPEN_DB_MONGO_ERROR;

                        reject(result);
                    }
                } catch (e) {
                    result.successful = false;
                    result.message = e.toString();

                    reject(result);
                }
            });
        };
        return MongoConnection;
    })();
    Mongo.MongoConnection = MongoConnection;
})(exports.Mongo || (exports.Mongo = {}));
var Mongo = exports.Mongo;
//# sourceMappingURL=mongo_connection.js.map
