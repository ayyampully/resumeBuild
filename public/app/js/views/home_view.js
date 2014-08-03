define([

    'models/edit_model',
    'views/edit_view',
    'utils/resume_utils',
    'views/login_view',
    'views/my_account_view',
    'hbs!templates/index'

],function(Edit, EditResumeView, ResumeUtils, LoginView, MyAccountView, homeViewTemplate){

    var HomeView = Backbone.View.extend({
        el: "body",
        utils: '',
        initialize: function(){
            _.bindAll(this)
        },

        events:{
            'click .temp-thumb' : 'showForm',
            'click #save' : 'saveForm',
            'click #cancel' : 'removeForm',
            'click #simplePopup .close' : 'removeForm',
            'click #login' : 'showLogin',
            'click #help' : 'showHelp',
            'click #logout' : 'logOutUser',
            'click #user-account' : 'showAccount',
            'click .logo' : 'showHome'
        },

        render: function(){
            console.log('m here')
            if(!this.model){
                var editModel = new Edit();
                this.model = editModel;
            }

            this.utils = new ResumeUtils({
                model: this.model
            });

            
            $('#content').html(homeViewTemplate);
            $('#content').addClass('home')
            this.utils.getSession(function(data){
                cnsole.log(data)
            });

        },

        showLogin: function(){
            var loginView = new LoginView({
                model: this.model
            });
            loginView.render();
        },

        logOutUser: function(){
            this.utils.resetSession();
            this.utils.setAppURL('home');
        },

        showHelp: function(){

        },

        showHome: function(){
            this.utils.setAppURL('home');
        },

        showForm: function(evt){
            var tempId = $(evt.currentTarget).attr('id');
            this.model.set({tempId:tempId});

            if(this.utils.getSession()){
                this.utils.setAppURL('template/'+tempId+'/edit');
            } else {
                $(this.el).append(this.utils.showForm(tempId));
            }
        },

        showAccount: function(e){
            e.preventDefault();
            console.log(this.model)
            var myAccountView = new MyAccountView({
                model: this.model
            });
            myAccountView.render();
            //this.utils.setAppURL('#/user/'+ this.model.get('username'), 'false');
        },

        saveForm: function(evt){
            var name = $("#name").val();
            var email = $("#email").val();
            var mobile = $("#mobile").val();
            var website = $("#website").val();
            if(name && email && mobile){
                this.removeForm();
                this.model.set({
                    name: name,
                    email: email,
                    mobile: mobile,
                    website : website
                });
                var editResumeView = new EditResumeView({
                    model: this.model
                });
                editResumeView.render();
            } else {
                alert('Fill in all the fields')
            }

        },

        removeForm: function(){
            $('#simplePopup,#popupScreen').fadeOut(300,function(){
                $(this).remove();
            })
        }


    })
    return HomeView;
})
