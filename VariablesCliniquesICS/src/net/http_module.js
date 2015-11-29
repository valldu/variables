var express = require('express');
var path = require('path');
var http = require('http');
var result = require('../application/application_response');
var config = require('../application/application_config');

(function (Express) {
    var HttpModule = (function () {
        function HttpModule() {
            this._express = express();

            this.init();
        }
        HttpModule.prototype.init = function () {
            // all environments
            this._express.set('port', process.env.PORT || 3000);
            this._express.set('views', path.join(__dirname, 'views'));

            this._express.use(express.logger('dev'));
            this._express.use(express.json());
            this._express.use(express.urlencoded());
            this._express.use(express.methodOverride());
            this._express.use(this._express.router);

            this._express.use(express.static(path.join(__dirname, 'public')));

            // development only
            if ('development' == this._express.get('env')) {
                this._express.use(express.errorHandler());
            }
        };

        HttpModule.prototype.createServer = function () {
            var _this = this;
            http.createServer(this._express).listen(this._express.get('port'), function () {
                console.log('Express server listening on port ' + _this._express.get('port'));
            });
        };

        HttpModule.prototype.enableInsertVariableMethod = function (response, onStartMethod) {
            var _this = this;
            this._express.post('/api/variables', function (request, response) {
                var queryString = _this.getQueryString(request);

                var payload = new Object();

                try  {
                    payload['variables'] = JSON.parse(_this.getPayload(request).variables);
                } catch (e) {
                    var processResult = new result.Application.Response();

                    processResult.server_status.has_error = true;
                    processResult.server_status.status_code = config.Application.Configuration.HTTP_OK;
                    processResult.server_status.message = config.Application.Configuration.JSON_PARSE_ERROR + e.toString();

                    response.send(processResult);
                }

                onStartMethod(queryString, payload).then(function (processResult) {
                    response.send(processResult);
                });
            });
        };

        HttpModule.prototype.enableUpdateVariableMethod = function (onStartMethod, onEndMethod) {
            var _this = this;
            this._express.patch('/api/variables', function (request, response) {
                var queryString = _this.getQueryString(request);

                var payload = _this.getPayload(request);

                onStartMethod(queryString, payload);

                response.send(payload);

                onEndMethod();
            });
        };

        HttpModule.prototype.enableDeleteVariableMethod = function (onStartMethod, onEndMethod) {
            var _this = this;
            this._express.delete('/api/variables', function (request, response) {
                var queryString = _this.getQueryString(request);

                var payload = _this.getPayload(request);

                onStartMethod(queryString, payload);

                response.send(payload);

                onEndMethod();
            });
        };

        HttpModule.prototype.getQueryString = function (request) {
            var url = require('url');

            var url_parts = url.parse(request.url, true);
            return url_parts.query;
        };

        HttpModule.prototype.getPayload = function (request) {
            return request.body;
        };
        return HttpModule;
    })();
    Express.HttpModule = HttpModule;
})(exports.Express || (exports.Express = {}));
var Express = exports.Express;
//# sourceMappingURL=http_module.js.map
