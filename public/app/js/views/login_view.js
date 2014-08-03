define(
    [
        'models/edit_model',
        'utils/resume_utils',
        'views/home_view',
        'views/my_account_edit_view',
        'libs/jquery.validate.min'
    ],
    function(Edit, ResumeUtils, HomeView, MyAccountEditView ){
        var LoginView = Backbone.View.extend({
            el: "body",
            utils: '',
            flag:'',
            events: {
                'click #tabBar li':'tabSwitch',
                'click #login-btn':'loginUser',
                'click #register-btn':'registerUser',
                'click .simpleAlert #close':'redirectView',
                'click .simpleAlert .close':'redirectView'

            },
            initialize: function(){
                _.bindAll(this)
            },
            render: function(){
                this.utils = new ResumeUtils();
                this.utils.getTheme('login',function(data){
                    $('#content').html(data);
                });
                this.delegateEvents(this.events)

            },

            tabSwitch: function(evt){
                $('#tabBar li').removeClass('act');
                $(evt.target).addClass('act');
                var id = $(evt.target).attr('id');
                $('.forms',this.el).hide();
                $('#'+id+'-form',this.el).show();
            },
            loginUser: function(evt){
                $.validator.setDefaults({
                    debug: true,
                    success: "valid"
                });
                $.validator.addMethod("uname", function(value, element) {
                    return value.indexOf(" ") < 0;
                }, "No spaces allowed");
                var o_this = this;
                $("#login-form").validate({
                    rules: {
                        u_name: {
                            required: true,
                            uname: true
                        },
                        p_word: "required"
                   },
                    messages: {
                        u_name: {
                            required: "Please type a username",
                            uname: "No spaces allowed"
                        },
                        p_word: "Please enter your password"

                    },
                    submitHandler: function(form){
                        var username = $('#u_name', o_this.el).val();

                        var password = $('#p_word', o_this.el).val();

                        if(username && password){
                            var data = {
                                password: password,
                                username: username
                            }

                            o_this.utils.logUser(data,function(data){
                                o_this.utils.alertMsg(data);
                                o_this.flag = 'login';
                                console.log(data)
                                o_this.model.set({username: username});

                            }, function(err){
                                o_this.utils.alertMsg(err.responseText);
                            })
                        }
                    }
                });
            },
            registerUser: function(evt){
                $.validator.setDefaults({
                    debug: true,
                    success: "valid"
                });
                $.validator.addMethod("uname", function(value, element) {
                    return value.indexOf(" ") < 0;
                }, "No spaces allowed");
                var o_this = this;
                $("#register-form").validate({
                    rules: {
                        username: {
                            required: true,
                            uname: true
                        },
                        password: "required",
                        email: {
                            required: true,
                            email: true
                        },
                        email_confirm: {
                            required: true,
                            equalTo: "#email"
                        },
                        firstname: "required",
                        lastname: "required",
                        mobile: {
                            required: true,
                            minlength:10,
                            number:true
                        }

                    },
                    messages: {
                        username: {
                            required: "Please type a username",
                            uname: "No spaces allowed"
                        },
                        password: "Please enter your password",
                        email: "Please enter a valid email address",
                        email_confirm: {
                            required: "Please provide your email",
                            equalTo: "Please enter the same email as above"
                        },
                        firstname: "Please enter your first name",
                        lastname: "Please enter your last name",
                        mobile: "Please enter your mobile number"
                    },
                    submitHandler: function(form){
                        var username = $('#username', o_this.el).val();
                        //if(username.indexOf(" ")>0)return false;
                        var password = $('#password', o_this.el).val();
                        var email = $('#email', o_this.el).val();
                        var firstname = $('#firstname', o_this.el).val();
                        var lastname = $('#lastname', o_this.el).val();
                        var mobile = $('#mobile', o_this.el).val();
                        var website = $('#website', o_this.el).val();

                        if(username && password && email && firstname && lastname && mobile){
                            var data = {
                                firstName: firstname,
                                lastName: lastname,
                                email: email,
                                password: password,
                                username: username,
                                mobile:mobile
                            }

                            o_this.utils.regUser(data,function(data){
                                o_this.utils.alertMsg(data);
                                o_this.flag = 'register';
                                o_this.model.set({username: username});
                            }, function(err){
                                o_this.utils.alertMsg(err.responseText);
                            })
                        }
                    }
                });

            },
            redirectView: function(evt){
                console.log(evt.target)
                if(this.flag == 'login'){

                    this.utils.setAppURL('#/user/'+ this.model.get('username'));

                } else if(this.flag == 'register'){

                    this.utils.setAppURL('#/user/'+ this.model.get('username') +'/edit');

                }
                $('.simpleAlert, #popupScreen').remove();
            }
        })
        return LoginView;
    }
)
