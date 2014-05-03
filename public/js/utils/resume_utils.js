define([
    'app',
    'utils/utils_views'
],function(App){
    var resumeUtils = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this.events)
        },
        render: function(){
            console.log('Resume js');
        },
        getTheme: function(id,successCallback){
            var theme;
            $.ajax({
                url:'js/templates/'+id+'.html',
                type: 'GET',
                dataType:'html',
                success: successCallback
            });

        },
        textEditor: function(id, width, initialContent){
            var count = $('.mce-tinymce').length;
            if(count == 0){
                tinymce.init({
                    selector : id,
                    width : width,
                    toolbar: "bold italic underline | bullist numlist outdent indent",
                    init_instance_callback:function(){
                        tinymce.activeEditor.setContent(initialContent);
                    }
                });
            } else {
                tinymce.activeEditor.setContent(initialContent);
            }

        },
        removeEditor: function(id){
            tinymce.remove(id);
        },
        getEditorContent: function(){
            var content = tinymce.activeEditor.getContent();
            content = $(content).html();
            return content;
        },
        showForm:function(id){
           /* var template = Handlebars.templates['utils-views.hb']({
                src : id
            });
            return template;*/
        },
        showWait: function(id){
            var spinner = '<div id="spinner"><img src="images/loader.gif" /></div>'
            $(id).parents('.spinner').append(spinner);
            $('#spinner').delay(800).fadeOut(800, function(){
                $(this).remove();
            });
        },

        alertMsg: function(msg, callback){
            this.getTheme('alert',function(template){
                var template = _.template(template);
                $('#content').append(template({
                    msg: msg
                }));
            });
        },

        regUser: function(data, successCallback, errorCallback){
            $.ajax({
                url: '/register',
                type: 'POST',
                dataType:'html',
                data: data,
                success: successCallback,
                error: errorCallback
            })
        },
        logUser: function(data, successCallback, errorCallback){
            $.ajax({
                url: '/login',
                type: 'POST',
                dataType:'html',
                data: data,
                success: successCallback,
                error: errorCallback
            })
        },
        getUser: function(data, successCallback, errorCallback){
            $.ajax({
                url: '/getuser',
                type: 'POST',
                dataType:'html',
                data: data,
                success: successCallback,
                error: errorCallback
            })
        },

        updateUser: function(data, successCallback, errorCallback){
            $.ajax({
                url: '/updateuser',
                type: 'POST',
                dataType:'html',
                data: data,
                success: successCallback,
                error: errorCallback
            })
        },

        getSession: function(){
           var o_this = this,
               session;
           $.ajax({
                url:'/getsession',
                type:'GET',
                async:false,
                success: function(data){
                    //console.log(data)
                    if($('#user-account').length == 0){
                        var html = '<li id="user-account">Welcome <span>'+data.name+'</span></li><li id="logout"><span>logout</span></li>';
                        $('#rb-menu').prepend(html);
                        $('#rb-menu #login').hide();
                    }
                    o_this.model.set('username', data.username);
                    o_this.model.set('userSession', true);
                    session = true;

                },
                error:function(err){
                    console.log(err.statusText);
                    $('#rb-menu #login').show();
                    $('#rb-menu #user-account, #rb-menu #logout').remove();
                    session = false;
                    o_this.model.set('username', '');
                    o_this.model.set('userSession', false);
                }
            })
            return session;
        },

        resetSession: function(){
            $.ajax({
                url:'/resetsession',
                type:'GET',
                success:function(data){

                    $('#rb-menu #login').show();
                    $('#rb-menu #user-account, #rb-menu #logout').remove();
                },
                error: function(err){
                    console.log(err.statusText);

                }

            })

        },

        setAppURL: function(route){
            //window.location.href = 'http://localhost:8080/#/'+route;
            Backbone.history.navigate(route, {trigger: true});
        }
    });
    return resumeUtils;
})
