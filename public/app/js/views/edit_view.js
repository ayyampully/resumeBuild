define([
    'models/edit_model',
    'utils/resume_utils'
],function(Edit, ResumeUtils){
    var ResumeEditView = Backbone.View.extend({
        el: "#content",
        utils: null,
        activeElement:'',
        initialize: function(){
            _.bindAll(this)
        },

        events:{
            'click .edit' : 'editField',
            'click #edit-view .save' : 'saveContent',
            'click #edit-view .cancel' : 'cancelContent',
            'hover #resume .row' : 'showToolbar',
            'click #toolbar .add' : 'addRow',
            'click #toolbar .remove' : 'removeRow',
            'click #saveResume' : 'saveResume'
        },

        render: function(){
            var o_this = this;
            this.utils = new ResumeUtils({
                model: this.model
            });
            var tempId = this.model.get('tempId');
console.log(o_this.model.toJSON())
            $('#content').removeClass('home');
            if(this.model.get('username')){
                var data = {
                    username: this.model.get('username')
                }
                this.utils.getUser(data, function(resp){
                    var resp = $.parseJSON(resp)
                    $('#content .left').html(resp.resume);
                });
            } else {
                this.utils.getTheme(tempId, function(data){
                    var template = _.template(data,(o_this.model.toJSON()));
                    $('#content .left').html(template);
                })
            }

            if(this.utils.getSession()){
                $("#account-actions").show();
            }

        },

        editField: function(evt){

            this.activeElement = $(evt.currentTarget);
            var label = this.activeElement.html();
            this.utils.showWait('#text-edit');
            $("#msgs").html("After editing click on Save/Cancel");
            $("#text-edit").html(label);
            this.utils.textEditor('#text-edit', 288, label);
            $("#account-actions").hide();
            $("#default-actions").show();
        },

        saveContent: function(){
            this.activeElement.html(this.utils.getEditorContent());
            $("#edit-view .button-area").hide();
            if(this.utils.getSession()){
                $("#account-actions").show();
            }
        },

        saveResume: function(){
            console.log(this.model.get('username'));
            var username = this.model.get('username');
            var resume = $('#content .col.left').html();
            $.ajax({
                url:'/updateresume',
                type:'POST',
                data: {username: username, resume: resume},
                success: function(data){
                    console.log(data)

                },
                error:function(err){
                    console.log(err)

                }
            })
        },

        cancelContent: function(){
            this.utils.removeEditor('#text-edit');
            $("#msgs").html("Click on the fields to edit");
            $("#edit-view .button-area").hide();
            if(this.utils.getSession()){
                $("#account-actions").show();
            }
        },

        showToolbar: function(evt){
            var elem = $(evt.currentTarget);

            var toolbar = '<div id="toolbar" class="toolbar"><span class="add">Add row</span><span class="remove">Remove row</span></div>';
            //if($('#toolbar', elem).length){
               $('#toolbar').remove();
           // }else{
               elem.append(toolbar);
                //console.log(elem)
           // }
        },

        addRow: function(evt){
           var elem = $(evt.currentTarget).parents('.row');
           var row = '<div class="row"><label class="edit">Label</label><p class="edit">Description</p></div>';
           $(elem).after(row);
        },

        removeRow: function(evt){
            var elem = $(evt.currentTarget).parents('.row').remove();
        }
    })
    return ResumeEditView;
})
