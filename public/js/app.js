// app.js define([    'models/edit_model',	'views/home_view',    'views/edit_view',    'views/login_view',    'views/my_account_view',    'views/my_account_edit_view'],function(Edit, HomeView, EditView, LoginView, MyAccountView, MyAccountEditView){    var AppRouter = Backbone.Router.extend({        routes: {            'home':'renderHome',            'template/:tempId/edit': 'editTemplate',            'user/login': 'userLogin',            'user/:user': 'userAccount',            'user/:user/edit': 'editUserAccount',            '*defauts':'defaultRoute'        }    });    $(document).ready(function(){        var appRouter = new AppRouter();        if(!this.model){            var editModel = new Edit();         }        var homeView = new HomeView();        appRouter.on('route:defaultRoute', function(){            homeView.render();        });        appRouter.on('route:renderHome', function(){            homeView.render();        });        appRouter.on('route:editTemplate', function(tempId){           // console.log(this.model)            editModel.set('tempId',tempId)            var editView = new EditView({                model: editModel            });            editView.render();        });        appRouter.on('route:userLogin', function(){            var loginView = new LoginView({                model: editModel            });            loginView.render();        });        appRouter.on('route:userAccount', function(user){            editModel.set('username', user)            console.log(editModel)            var myAccountView = new MyAccountView({                model: editModel,                user: user            });            myAccountView.render();        });        appRouter.on('route:editUserAccount', function(user){            var myAccountEditView = new MyAccountEditView({                model: editModel            });            myAccountEditView.render();        });        Backbone.history.start();		homeView.render();        //Backbone.history.navigate('home', {trigger: true});	})   	});