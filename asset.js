/*
 * Copyright (c) WSO2 Inc. (http://wso2.com) All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */
asset.server = function (ctx) {
    var type = ctx.type;
    return {
        onUserLoggedIn: function () {
        },
        endpoints: {
            apis: [
                {
                    url: 'create_task',
                    path: 'create_task.jag'
                },
                {
                    url: 'manage_task',
                    path: 'manage_task.jag'
                }
            ],
            pages: [
                {
                    title: 'Prepare Source',
                    url: 'set_ingredients',
                    path: 'set_ingredients.jag'
                },
                {
                    title: 'Prepare Destination',
                    url: 'set_results',
                    path: 'set_results.jag'
                },
                {
                    title: 'Deploy',
                    url: 'deploy',
                    path: 'deploy.jag'
                },
                {
                    title: 'Create Integration',
                    url: 'create_dish',
                    path: 'create_dish.jag'
                },
                {
                    title: 'Dashboard',
                    url: 'dashboard',
                    path: 'dashboard.jag'
                },
                {
                    title: 'Control Panel',
                    url: 'control_panel',
                    path: 'control_panel.jag'
                }
            ]
        }
    };
};


asset.renderer = function (ctx) {
    var buildDefaultLeftNav = function (page, util) {
        var id = page.assets.id;
        var navList = util.navList();
        navList.push('Overview','icon-step-1',util.buildUrl('details') + '/' + id);
        navList.push('Prepare Source','icon-step-2',util.buildUrl('set_ingredients') + '/' + id);
        navList.push('Prepare Destination','icon-step-3',util.buildUrl('set_results') + '/' + id);
        navList.push('Deploy','icon-step-4',util.buildUrl('deploy') + '/' + id);
        return navList.list();
    };

    return {
        details: function (page) {
            // To make value element always an Array
            var dish_asset = page.assets;

            var conn_disp_name1 = dish_asset.tables[1].fields.connectordisplayname.value;
            var conn_disp_name2 = dish_asset.tables[2].fields.connectordisplayname.value;

            var conn_name1 = dish_asset.tables[1].fields.connectorname.value;
            var conn_name2 = dish_asset.tables[2].fields.connectorname.value;

            var account1 = dish_asset.tables[1].fields.account.value;
            var account2 = dish_asset.tables[2].fields.account.value;

            var operation1 = dish_asset.tables[1].fields.operation.value;
            var operation2 = dish_asset.tables[2].fields.operation.value;

            var icon1 = dish_asset.tables[1].fields.icon.value;
            var icon2 = dish_asset.tables[2].fields.icon.value;

            var param_disp_name1 = dish_asset.tables[1].fields.parametersdisplayname.value;
            var param_disp_name2 = dish_asset.tables[2].fields.parametersdisplayname.value;

            var param_name1 = dish_asset.tables[1].fields.parametersname.value;
            var param_name2 = dish_asset.tables[2].fields.parametersname.value;

            var param_value1 = dish_asset.tables[1].fields.parametersvalue.value;
            var param_value2 = dish_asset.tables[2].fields.parametersvalue.value;

            var param_eg1 = dish_asset.tables[1].fields.parameterseg.value;
            var param_eg2 = dish_asset.tables[2].fields.parameterseg.value;

            var avroschema1 = dish_asset.tables[1].fields.avroschema.value;
            var avroschema2 = dish_asset.tables[2].fields.avroschema.value;

            if (!(conn_disp_name1 instanceof Array)) {
                dish_asset.tables[1].fields.connectordisplayname.value = [conn_disp_name1];
            }
            if (!(conn_disp_name2 instanceof Array)) {
                dish_asset.tables[2].fields.connectordisplayname.value = [conn_disp_name2];
            }

            if (!(conn_name1 instanceof Array)) {
                dish_asset.tables[1].fields.connectorname.value = [conn_name1];
            }
            if (!(conn_name2 instanceof Array)) {
                dish_asset.tables[2].fields.connectorname.value = [conn_name2];
            }

            if (!(account1 instanceof Array)) {
                dish_asset.tables[1].fields.account.value = [account1];
            }
            if (!(account2 instanceof Array)) {
                dish_asset.tables[2].fields.account.value = [account2];
            }

            if (!(operation1 instanceof Array)) {
                dish_asset.tables[1].fields.operation.value = [operation1];
            }
            if (!(operation2 instanceof Array)) {
                dish_asset.tables[2].fields.operation.value = [operation2];
            }

            if (!(icon1 instanceof Array)) {
                dish_asset.tables[1].fields.icon.value = [icon1];
            }
            if (!(icon2 instanceof Array)) {
                dish_asset.tables[2].fields.icon.value = [icon2];
            }

            if (!(param_disp_name1 instanceof Array)) {
                dish_asset.tables[1].fields.parametersdisplayname.value = [param_disp_name1];
            }
            if (!(param_disp_name2 instanceof Array)) {
                dish_asset.tables[2].fields.parametersdisplayname.value = [param_disp_name2];
            }

            if (!(param_name1 instanceof Array)) {
                dish_asset.tables[1].fields.parametersname.value = [param_name1];
            }
            if (!(param_name2 instanceof Array)) {
                dish_asset.tables[2].fields.parametersname.value = [param_name2];
            }

            if (!(param_value1 instanceof Array)) {
                dish_asset.tables[1].fields.parametersvalue.value = [param_value1];
            }
            if (!(param_value2 instanceof Array)) {
                dish_asset.tables[2].fields.parametersvalue.value = [param_value2];
            }

            if (!(param_eg1 instanceof Array)) {
                dish_asset.tables[1].fields.parameterseg.value = [param_eg1];
            }
            if (!(param_eg2 instanceof Array)) {
                dish_asset.tables[2].fields.parameterseg.value = [param_eg2];
            }

            if (!(avroschema1 instanceof Array)) {
                dish_asset.tables[1].fields.avroschema.value = [avroschema1];
            }
            if (!(avroschema2 instanceof Array)) {
                dish_asset.tables[2].fields.avroschema.value = [avroschema2];
            }
            page.assets = dish_asset;


            return page;
        },
        pageDecorators: {
            leftNav: function (page) {
                log.info('Using custom leftNav for dishes');
                page.leftNav = buildDefaultLeftNav(page, this);
                return page;
            }
        }
    };
};