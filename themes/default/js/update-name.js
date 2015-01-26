$(function(){
    var obtainFormMeta=function(formId){
        return $(formId).data();
    };

    $('#add-form-btn').on('click',function(){
        $('#form-update').ajaxSubmit({
            success:function(){
                var options=obtainFormMeta('#form-update');
                alert('Dish will be deployed in a moment');
                window.location=options.redirectUrl;
            },
            error:function(){
                alert('Unable to update the dish');
            }
        });
    });

});