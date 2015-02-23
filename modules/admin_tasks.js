var tasks = {};
(function (admin_task) {
    var log = new Log('admin_tasks');
    //log.info('Request received');

    var esbServer;

    try {
        var serversConfig = require('/config/wso2-servers.json');
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

    var cookieHeader = options["HTTPHeaders"];

    if(cookieHeader == null) {

        var esb_jsession_id = session.get("ESB_JSESSION_ID");

        if(esb_jsession_id == null) {
            options.action = "urn:login";

            // Need to have SAML_RESPONSE_RECEIVED in session.
            // Add line session.put("SAML_RESPONSE_RECEIVED", samlResponse); into controller/acs.jag
            var payload = '<sso:login xmlns:sso="http://sso.saml2.authenticator.identity.carbon.wso2.org" xmlns:xsd="http://dto.sso.saml2.authenticator.identity.carbon.wso2.org/xsd">'
                +'<sso:authDto> <xsd:response>'
                + session.get("SAML_RESPONSE_RECEIVED")
                +'</xsd:response> </sso:authDto></sso:login>';

            try {
                // Open connection to SAML2 SSO Authentication Service - url currently hardcoded
                req.open(options, ADMIN_SERVICE_URL + "/SAML2SSOAuthenticationService", false);

                req.send(payload);
                var resp=req.responseXML;
                var isLoggedIn = resp..*::['return'].text();

                var responseCookies = req.getResponseHeader('Set-Cookie').split(';');

                // Assumed that JSESSIONID cookie is at the first element
                session.put("ESB_JSESSION_ID", responseCookies[0]);

            } catch (e) {
                print(e.toString()); // Print error if something goes wrong
            }
        }

        var jsId = session.get("ESB_JSESSION_ID");
        options["HTTPHeaders"] = [ { name : "Cookie", value : jsId} ];
    }

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



        log.info("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ is task running ^^^^^^^^^^^^^^^^^^^^^^^");
        log.info(options["HTTPHeaders"]);

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

}(tasks));
