/// <reference path='../repository/mongo_connection'/>
/// <reference path='../net/http_module'/>
var connection = require('../repository/mongo_connection');
var net = require('../net/http_module');

var parser = require('./parser_module');
var result = require('./application_response');
var config = require('./application_config');

(function (Application) {
    var Manager = (function () {
        function Manager() {
        }
        Manager.prototype.init = function () {
            this.initResponse();
            this.loadModules();
            this.initModules();
        };

        Manager.prototype.initResponse = function () {
            this._response = new result.Application.Response();
            this._response.server_status.status_code = config.Application.Configuration.HTTP_OK;
            this._response.server_status.has_error = false;
        };

        Manager.prototype.loadModules = function () {
            var mongoose = require('mongoose');
            this._mongoConnection = new connection.Mongo.MongoConnection(mongoose, config.Application.Configuration.MONGO_CONNECTION);
            this._http = new net.Express.HttpModule();
        };

        Manager.prototype.initModules = function () {
            //this.initDB();
            this.initHttp();
        };

        Manager.prototype.initHttp = function () {
            this.createServer();
            this.enableHttpMethods();
        };

        Manager.prototype.createServer = function () {
            this._http.createServer();
        };

        Manager.prototype.enableHttpMethods = function () {
            var _this = this;
            var onStartMethod = function (queryString, payload) {
                // PARSER
                var Promise = require('promise');

                return new Promise(function (resolve, reject) {
                    var list;

                    parser.Application.ParserModule.Parse(queryString, payload).then(function (variablesList) {
                        list = variablesList;

                        var testsNumber = list.length - 1;
                        for (var index in list) {
                            var test = list[index];

                            if (test.successful) {
                                _this._mongoConnection.insertVariable(test).then(function (mongoResult) {
                                    var actionResult = new result.Application.ActionResult();
                                    actionResult.successful = mongoResult.successful;
                                    actionResult.message = mongoResult.message;
                                    actionResult.request_data = payload;

                                    _this._response.actions_result.push(actionResult);
                                    console.error.bind(console, "then");

                                    if (parseInt(index) == testsNumber)
                                        resolve(_this._response.actions_result);
                                }).catch(function (mongoResult) {
                                    var actionResult = new result.Application.ActionResult();
                                    actionResult.successful = mongoResult.successful;
                                    actionResult.message = mongoResult.message;
                                    actionResult.request_data = payload;

                                    _this._response.actions_result.push(actionResult);
                                    console.error.bind(console, "catch");

                                    if (parseInt(index) == testsNumber)
                                        resolve(_this._response.actions_result);
                                });
                            } else {
                                var actionResult = new result.Application.ActionResult();
                                actionResult.successful = false;
                                actionResult.message = test.message;
                                actionResult.request_data = payload;

                                _this._response.actions_result.push(actionResult);

                                if (parseInt(index) == testsNumber)
                                    resolve(_this._response.actions_result);
                            }
                        }
                    });
                });
            };

            var onEndMethod = function () {
                // INSERT
            };

            this._http.enableInsertVariableMethod(this._response, onStartMethod);
            this._http.enableUpdateVariableMethod(onStartMethod, onEndMethod);
            this._http.enableDeleteVariableMethod(onStartMethod, onEndMethod);
        };
        return Manager;
    })();
    Application.Manager = Manager;
})(exports.Application || (exports.Application = {}));
var Application = exports.Application;
//# sourceMappingURL=application_module.js.map
