(function (Application) {
    var Response = (function () {
        function Response() {
            this.server_status = new ServerStatus();
            this.actions_result = new Array();
        }
        return Response;
    })();
    Application.Response = Response;

    var ServerStatus = (function () {
        function ServerStatus() {
            this.message = '';
        }
        return ServerStatus;
    })();
    Application.ServerStatus = ServerStatus;

    var ActionResult = (function () {
        function ActionResult() {
            this.message = '';
        }
        return ActionResult;
    })();
    Application.ActionResult = ActionResult;
})(exports.Application || (exports.Application = {}));
var Application = exports.Application;
//# sourceMappingURL=application_response.js.map
