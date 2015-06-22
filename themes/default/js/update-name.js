$(function(){
    var obtainFormMeta=function(formId){
        return $(formId).data();
    };

    $('#add-form-btn').on('click',function(){
        $('#form-update').ajaxSubmit({
            success:function(){
                var options=obtainFormMeta('#form-update');
                alert('Integration will be deployed in a moment');
                window.location=options.redirectUrl;
            },
            error:function(){
                alert('Unable to update the integration');
            }
        });
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

});