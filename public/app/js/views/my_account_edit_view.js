define(
    [
        'utils/resume_utils',
        'hbs!templates/myaccount-edit',
        'libs/imageSelect/scripts/jquery.imgareaselect.pack'
    ],

    function(ResumeUtils, myAccountEditTemplate){

        var MyAccountEditView = Backbone.View.extend({

            el: "#content",

            utils: '',

            flag: false,

            imgWidth: 0,
            imgHeight: 0,
            cropWidth: 0,
            cropHeight: 0,
            cropX: 0,
            cropY: 0,

            events: {
                'click #rb-update':'updateAccount',
                'change #profileImage':'addPhoto',
                'mouseup #rb-save':'savePhoto',
                'click .simpleAlert #close':'redirect',
                'click .simpleAlert .close':'redirect',
                'click .toolbar .add' : 'addRow',
                'click .toolbar .remove' : 'removeRow'
            },

            initialize: function(){
                _.bindAll(this)
            },

            render: function(){
                this.utils = new ResumeUtils({
                    model : this.model
                });
                var o_this = this;
                var data = {
                    username: this.model.get('username')
                }
                console.log(this.model)
                this.utils.getUser(data, function(resp){
                   /* o_this.utils.getTheme('myaccount-edit',function(template){
                        var template = _.template(template);

                    });*/
                    $('#content').html(myAccountEditTemplate($.parseJSON(resp)));
                    $('#content .edit-foto').hide();

                }, function(err){
                    $('#content').html('<p class="err">Please login to edit your account</p>');
                });

                this.delegateEvents(this.events);
            },

            updateAccount: function(){
                $.validator.setDefaults({
                    debug: true,
                    ignore: ".noValidate",
                    success: "valid"
                });

                var o_this = this;
                $("#update-form").validate({

                    rules: {
                        firstname: "required",
                        lastname: "required",
                        mobile: {
                            required: true,
                            minlength:10,
                            number:true
                        }

                    },
                    messages: {
                        firstname: "Please enter your first name",
                        lastname: "Please enter your last name",
                        mobile: "Please enter your mobile number"
                    },
                    submitHandler: function(form){
                        var username = o_this.model.get('username')
                        var company = $('#company', o_this.el).val();
                        var title = $('#title', o_this.el).val();
                        var firstname = $('#firstname', o_this.el).val();
                        var lastname = $('#lastname', o_this.el).val();
                        var mobile = $('#mobile', o_this.el).val();
                        var website = $('#website', o_this.el).val();
                        var photoUrl = 'http://asdasdsad';
                        var priSkill = [];
                        $('.pri-skill').each(function(i){
                            var skill = $(this).find('input').val();
                            var level = $(this).find('select').val();
                            var count = parseInt(i)+1;
                            if(skill==''){
                                o_this.utils.alertMsg('Primary skill box '+ count +' cannot be left blank.');
                                return false;
                            } else {
                                priSkill.push({
                                    skill: skill,
                                    level: level
                                });
                            }
                        });

                        console.log(username)
                        if(username && firstname && lastname && mobile){
                            var data = {
                                firstname: firstname,
                                lastname: lastname,
                                title: title,
                                company: company,
                                username: username,
                                mobile:mobile,
                                photoUrl:photoUrl,
                                website:website,
                                priSkill:priSkill
                            }
                            console.log(data)
                            o_this.utils.updateUser(data,function(data){
                                o_this.utils.alertMsg(data);
                                o_this.flag = true
                            }, function(err){
                                o_this.utils.alertMsg(err.responseText);
                            })
                        }
                    }
                });
            },

            addPhoto: function(evt){
                var files = [];
                var o_this = this;
                if(evt.srcElement){
                    files = evt.srcElement.files[0]
                }
                var xhr = new XMLHttpRequest();
                xhr.onload = function(e) {
                    var res = this;
                    if (res.status == 200) {

                        o_this.utils.getTheme('add-photo',function(template){
                            $('.simplePopup').remove();
                            var template = _.template(template);
                            console.log($.parseJSON(res.responseText))
                            $('#content').append(template($.parseJSON(res.responseText)));
                            o_this.imageSelect();
                        });
                    } else{
                        console.log(this.responseText);
                    }
                };
                var formData = new FormData();
                formData.append('displayImage', files);

                xhr.open('POST', '/imageupload', true);
                xhr.send(formData);
            },

            imageSelect: function(){
                var o_this = this;
                $('img#userPhoto').imgAreaSelect({
                    handles: true,
                    aspectRatio:'190:225',

                    onSelectChange: function(img, selection) {

                        var scaleX = 190 / (selection.width || 1);
                        var scaleY = 225 / (selection.height || 1);

                        $('#previewImage > img').css({
                            width: Math.round(scaleX * img.width) + 'px',
                            height: Math.round(scaleY * img.height) + 'px',
                            marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
                            marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
                        });
                    },

                    onSelectEnd: function(img, selection){
                        //console.log('width: ' + selection.width + '; height: ' + selection.height);
                        o_this.imgWidth = img.width;
                        o_this.imgHeight = img.height;
                        o_this.cropWidth = selection.width;
                        o_this.cropHeight = selection.height;
                        o_this.cropX = selection.x1;
                        o_this.cropY = selection.y1;
                    }
                });
            },

            savePhoto: function(){
                console.log('sss')
                if(!xhr){
                    var xhr = new XMLHttpRequest();

                    xhr.onload = function(e) {
                        var res = this;
                        if (res.status == 200) {
                            console.log(this.responseText);
                        } else{
                            console.log(this.responseText);
                        }
                    };
                    if(this.imgWidth == 0 || this.imgHeight==0){
                        return false;
                    } else {
                        var formData = new FormData();
                        formData.append('imgWidth', this.imgWidth);
                        formData.append('imgHeight', this.imgHeight);
                        formData.append('cropWidth', this.cropWidth);
                        formData.append('cropHeight', this.cropHeight);
                        formData.append('cropX', this.cropX);
                        formData.append('cropY', this.cropY);

                        xhr.open('POST', '/imagecrop', true);
                        console.log(formData)
                        xhr.send(formData);
                    }
                 }
            },

            redirect: function(){
                if(this.flag){
                    this.utils.setAppURL('#/user/'+ this.model.get('username'));
                }
                $('.simpleAlert, #popupScreen').remove();
            },

            addRow: function(evt){
                var len = $('.pri-skill').length;
                if(len==4){
                    return false;
                }
                var html = '<div class="pri-skill"><label>'+(len+1)+'</label><input type="text" min="3" max="30" class="skill-input noValidate" placeholder="Add your skill">'+
                               ' <select class="expertise noValidate">' +
                                   '<option value="3" selected>Beginner</option>' +
                                   '<option value="5" >Intermediate</option>' +
                                   '<option value="7" >Advanced</option>' +
                                   '<option value="9" >Expert</option>' +
                                   '<option value="10" >Master</option>' +
                                   '</select>';
                if(len==3){
                    html+='<div class="toolbar"><span class="remove">Remove row</span></div>'
                } else{
                    html+='<div class="toolbar"><span class="add">Add row</span><span class="remove">Remove row</span></div>'
                }
                html+= '</div>';

                $('.add','.pri-skill').remove();
                $('#addSkills').append(html)

                this.delegateEvents(this.event)
            },
            removeRow: function(evt){
                var len = $('.pri-skill').length;
                var addHtml = '<span class="add">Add row</span>';

                $(evt.currentTarget).parents('.pri-skill').remove();

                if($('.pri-skill:last .add').length==0){
                    $('.toolbar','.pri-skill:last').prepend(addHtml);
                }
                _.each($('.pri-skill'), function(el, i){
                    $('label', el).html(i+1)
                })
            }

        });
        return MyAccountEditView;
    }
);
