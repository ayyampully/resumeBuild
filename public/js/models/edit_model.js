define([    'views/edit_view',    'app'],function(EditResumeView, App){    var EditResume = Backbone.Model.extend({            defaults : {                name: '',                email: '',                mobile: '',                website: 'Website',                tempId:'',                username:'',                company:'',                title:'',                photoUrl:'',                resume:'',                url:'',                userSession: false            }    });    return EditResume;})