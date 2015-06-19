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

        if(checkedState) {
            textBox.disabled = true;
            textBox.value = -1;
            textBox.style.visibility = "hidden";
        } else {
            textBox.disabled = false;
            textBox.value = "";
            textBox.style.visibility = "visible";
        }
    });

});