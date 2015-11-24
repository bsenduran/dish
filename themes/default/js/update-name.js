$(function(){
    var obtainFormMeta=function(formId){
        return $(formId).data();
    };

    $('#add-form-btn').on('click',function(){
        if(field_validator() === true) {
            var dishId = $('#assetId').text();
            $('#form-update').ajaxSubmit({
                success:function(){
                    var options=obtainFormMeta('#form-update');
                    alert('Integration will be deployed in a moment');
                    changeDishLifeCycle(dishId);
                    console.log(options);
                    window.location=options.redirectUrl;
                },
                error:function(){
                    alert('Unable to update the integration');
                }
            });
        }
        else {
            bootbox.alert("Make Sure All the Fields Are Non Empty", function() {
            });
        }
    });

    $('#test-form-btn').on('click',function(){

        if(field_validator() === true) {
            var overviewName = $('#form-update').find('input[name="overview_name"]').val();
            var overviewTriggerCount = $('#form-update').find('input[name="overview_triggercount"]').val();

            // Setting temporary values
            $('#form-update').find('input[name="overview_triggercount"]').val('1');

            // Submit to save in ES
            $('#form-update').ajaxSubmit({
                success:function(){

                    // Sending to ESB
                    var options=obtainFormMeta('#form-update');

                    window.location=options.redirectUrl + "&test=true" + "&dishName=" + overviewName;

                    alert('Integration testing is completed');
                },
                error:function(){
                    alert('Unable to test the integration');
                }
            });
        } else {
            bootbox.alert("Make Sure All the Fields Are Non Empty", function() {
            });
        }

        // Resetting to previous values
        $('#form-update').find('input[name="overview_triggercount"]').val(overviewTriggerCount);
    });

    // Toggling trigger-count based on checkbox status
    $('#triggerForever').on('click',function(){
        var checkedState = document.getElementById("triggerForever").checked;
        var textBox = document.getElementById("triggerCount");

        // Using HTML5 sessionStorage
        if(checkedState) {
            textBox.disabled = true;
            sessionStorage.setItem("triggerCount", textBox.value);
            textBox.value = -1;

        } else {
            textBox.disabled = false;
            var c = sessionStorage.getItem("triggerCount")
            if (c != null){
                textBox.value = c;
                sessionStorage.setItem("triggerCount", "");
            } else {
                textBox.value = "";
            }
        }
    });

    function changeDishLifeCycle(dishId){
        $.ajax({
            url: "/publisher/apis/asset/" + dishId + "/change-state?type=dish&lifecycle=DishLifeCycle&nextState=active",
            method: "POST",
            contentType: "text/html; charset=utf-8"
        })
    }

    var field_validator = function () {
        var return_val = true;
        $( ".validating_field" ).each(function() {
            if ($(this).val() === "") {
                return_val = false;
            }
        });
        return return_val;
    }

});