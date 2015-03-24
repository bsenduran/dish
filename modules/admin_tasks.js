var tasks = {};
(function (admin_task) {
    var log = new Log('admin_tasks');
    //log.info('Request received');

    var esbServer;
    var connectorsJSON;
    try {
        var serversConfig = require('/config/wso2-servers.json');
        connectorsJSON = require('/config/connectors.json');
        esbServer = serversConfig.servers.esb_server;

    } catch (error){
        log.warn('Falling back to default server : localhost, Make sure to have /publisher/config/wso2-servers.json configured properly');

        esbServer = {
            "host": "https://localhost",
            "port": "9445"
        };

    }
//TODO add https
    var ADMIN_SERVICE_URL = esbServer.host + ":" + esbServer.port + "/services"; // URL to admin services without last '/'
    var USERNAME = "admin";
    var PASSWORD = "admin";


    var ws = require("ws");

    var req = new ws.WSRequest();
    var options = new Array();

    var server = require('store').server;
    var user = server.current(session);
    var carbon = require('carbon');

    var ipaasUtils = Packages.org.wso2.carbon.ipaas.util.IpaasUtils;

    var loggedInUser = user.username + "@" + carbon.server.tenantDomain();
    var authHeader = ipaasUtils.getAuthHeader(loggedInUser);

    options["HTTPHeaders"] = [{name: "Authorization", value: String(authHeader)}];

    options.useSOAP = 1.2;

    admin_task.deployTemplate = function (recipe_name, url) {
        options.action = "urn:importResource";

        var payload = '<ser:importResource xmlns:ser="http://services.resource.registry.carbon.wso2.org">'
            + '<ser:parentPath>/_system/governance/recipeTemplates</ser:parentPath>'
            + '<ser:resourceName>' + recipe_name + '_template</ser:resourceName>'
            + '<ser:mediaType>text/plain</ser:mediaType>'
            + '<ser:description>template</ser:description>'
            + '<ser:fetchURL>' + url + 'template.xml</ser:fetchURL>'
            + '</ser:importResource>';

        var result;

        try {
            // Open connection to Resource Admin service - url currently hardcoded
            req.open(options, ADMIN_SERVICE_URL + "/ResourceAdminService", false);

            // Send task.xml
            req.send(payload);


        } catch (e) {

            print(e.toString()); // Print error if something goes wrong

        }
    };

    admin_task.deployTransform = function (recipe_name, url) {
        // Method for importing resource
        options.action = "urn:importResource";

        var payload = '<ser:importResource xmlns:ser="http://services.resource.registry.carbon.wso2.org">'
            + '<ser:parentPath>/_system/governance/recipeTransformations</ser:parentPath>'
            + '<ser:resourceName>' + recipe_name + '_transformation</ser:resourceName>'
            + '<ser:mediaType>text/xml</ser:mediaType>'
            + '<ser:description>transformation</ser:description>'
            + '<ser:fetchURL>' + url + 'transformation.xml' + '</ser:fetchURL>'
            + '</ser:importResource>';

        var result;

        try {
            // Open connection to Resource Admin service - url currently hardcoded
            req.open(options, ADMIN_SERVICE_URL + "/ResourceAdminService", false);

            // Send task.xml
            req.send(payload);


        } catch (e) {

            print(e.toString()); // Print error if something goes wrong

        }
    };

    admin_task.deployTask = function (task_data) {
        options.action = "urn:addTaskDescription";

        // Fetch file from url
        //var taskData = get(overview_url + '/task.xml', '', 'xml');
        var xmlTaskData = new XML(task_data);

        log.info("=======");
        log.info(xmlTaskData);


        try {
            // Open connection to Task Admin service - url currently hardcoded
            req.open(options, ADMIN_SERVICE_URL + "/TaskAdmin", false);

            // Send task.xml
            req.send('<ns1:addTaskDescription xmlns:ns1="http://org.apache.axis2/xsd">' + xmlTaskData + '</ns1:addTaskDescription>');

            req.close();


        } catch (e) {

// 		print(e.toString()); // Though deploying task is completed, still returns an error

        }
    };

    admin_task.isTaskRunning = function (task_name) {

        var isRunning = false;

        options.action = "urn:isESBTaskRunning";

        var payload = '<adm:isESBTaskRunning xmlns:adm="http://admin.core.ntaskint.carbon.wso2.org">' +
            '<adm:taskName>' + task_name + '</adm:taskName>' +
            '</adm:isESBTaskRunning>';

        try {
            req.open(options, ADMIN_SERVICE_URL + "/ESBNTaskAdmin", false);
            req.send(payload);


            var result = req;
            var response = result.responseXML;
            isRunning = response..*::['return'].text();


        }
        catch (e) {
            log.error(e)
        }

        return isRunning;

    };

    admin_task.pauseTask = function(task_name) {

        var response;

        options.action = "urn:pauseESBTask";


        var payload = '<adm:pauseESBTask xmlns:adm="http://admin.core.ntaskint.carbon.wso2.org">' +
            '<adm:name>' + task_name + '</adm:name>' +
            '</adm:pauseESBTask>';

        try {
            req.open(options, ADMIN_SERVICE_URL + "/ESBNTaskAdmin", false);
            req.send(payload);


            var result = req;
            var xmlResponse = result.responseXML;
            response = xmlResponse..*::['return'].text();


        }
        catch (e) {
            log.error(e)
        }

        return response;

    };


    admin_task.resumeTask = function(task_name) {

        var response;

        options.action = "urn:resumeESBTask";


        var payload = '<adm:resumeESBTask xmlns:adm="http://admin.core.ntaskint.carbon.wso2.org">' +
            '<adm:name>' + task_name + '</adm:name>' +
            '</adm:resumeESBTask>';

        try {
            req.open(options, ADMIN_SERVICE_URL + "/ESBNTaskAdmin", false);
            req.send(payload);


            var result = req;
            var xmlResponse = result.responseXML;
            response = xmlResponse..*::['return'].text();


        }
        catch (e) {
            log.error(e)
        }

        return response;

    };

    //this is not used since the task group name is being converted while processing in ESB,
    // using deleteTaskDescription from TaskAdmin instead
    admin_task.deleteTask = function(task_name) {

        var response;

        options.action = "urn:deleteESBTask";


        var payload = '<adm:deleteESBTask xmlns:adm="http://admin.core.ntaskint.carbon.wso2.org">' +
            '<adm:name>' + task_name + '::synapse.simple.quartz</adm:name>' +
            '</adm:deleteESBTask>';

        try {
            req.open(options, ADMIN_SERVICE_URL + "/ESBNTaskAdmin", false);
            req.send(payload);


            var result = req;
            var xmlResponse = result.responseXML;
            response = xmlResponse..*::['return'].text();


        }
        catch (e) {
            log.error(e)
        }

        return response;

    };

    admin_task.deleteTaskDescription = function(task_name) {
        var response;

        options.action = "urn:deleteTaskDescription";

        var payload = '<xsd:deleteTaskDescription xmlns:xsd="http://org.apache.axis2/xsd">' +
                    '<xsd:s>' + task_name + '</xsd:s>' +
                    '<xsd:group>synapse.simple.quartz</xsd:group>' +
                    '</xsd:deleteTaskDescription>';

        try {
            req.open(options, ADMIN_SERVICE_URL + "/TaskAdmin", false);
            req.send(payload);

        }
        catch (e) {
            log.error(e)
        }

    };

    admin_task.isTaskExist = function(task_name) {
        var response;

        options.action = "urn:isContains";

        var payload = '<xsd:isContains xmlns:xsd="http://org.apache.axis2/xsd">' +
                        '<xsd:s>' + task_name + '</xsd:s>' +
                        '<xsd:group>synapse.simple.quartz</xsd:group>' +
                        '</xsd:isContains>';


        try {
            req.open(options, ADMIN_SERVICE_URL + "/TaskAdmin", false);
            req.send(payload);

            var result = req;
            var xmlResponse = result.responseXML;
            response = xmlResponse..*::['return'].text();

        }
        catch (e) {
            log.error(e)
        }

        return response;

    };


    admin_task.deployConnector = function(connection) {

        var connectorName = connectorsJSON.connectors[connection].name;
        var connectorPath = connectorsJSON.path.substr(-1) == "/" ? connectorsJSON.path : connectorsJSON.path+"/";

        var b64 = ipaasUtils.base64Sting(connectorPath+connectorName);
        options.action = "urn:uploadLibrary";
        var pload = '<upl:uploadLibrary  xmlns:upl="http://upload.service.library.mediation.carbon.wso2.org" '
            + 'xmlns:xsd="http://upload.service.library.mediation.carbon.wso2.org/xsd">'
            + '<upl:fileItems>'
            + '<xsd:dataHandler>' + String(b64) + '</xsd:dataHandler>'
            + '<xsd:fileName>' + connectorName + '</xsd:fileName>'
            + '<xsd:fileType>zip</xsd:fileType>'
            + '</upl:fileItems>'
            + '</upl:uploadLibrary>';

        try {
            req.open(options, ADMIN_SERVICE_URL + "/MediationLibraryUploader", false);
            var se_result = req.send(pload);
        } catch (e) {
            print(e.toString());
        }

    };

    admin_task.enableConnector = function(connection) {

        var connectorPackageName = connectorsJSON.connectors[connection].package;
        var libQName = "{"+connectorPackageName+"}"+connection;

        options.action = "urn:updateStatus";
        var pload = '<xsd:updateStatus xmlns:xsd="http://org.apache.synapse/xsd">'
            + '<xsd:libQName>'+libQName+'</xsd:libQName>'
            + '<xsd:libName>'+connection+'</xsd:libName>'
            + '<xsd:packageName>'+connectorPackageName+'</xsd:packageName>'
            + '<xsd:status>enabled</xsd:status>'
            + '</xsd:updateStatus>';

        try {
            req.open(options, ADMIN_SERVICE_URL + "/MediationLibraryAdminService", false);
            var se_result = req.send(pload);
        } catch (e) {
            print(e.toString());
        }

    };

    admin_task.isConnectorAlreadyDeployed = function(connection) {

        var connectorPackageName = connectorsJSON.connectors[connection].package;
        var libName = "";
        options.action = "urn:getLibraryInfo";
        var pload = '<xsd:getLibraryInfo xmlns:xsd="http://org.apache.synapse/xsd">'
            + '<xsd:libName>' + connection + '</xsd:libName>'
            + '<xsd:packageName>' + connectorPackageName + '</xsd:packageName>'
            + '</xsd:getLibraryInfo>';

        try {
            req.open(options, ADMIN_SERVICE_URL + "/MediationLibraryAdminService", false);

            req.send(pload);
            var respSE = req.responseXML;

            libName = respSE..*::['libName'].text();

        } catch (e) {
            print(e.toString());
        }
        return libName == connection;
    }

}(tasks));
