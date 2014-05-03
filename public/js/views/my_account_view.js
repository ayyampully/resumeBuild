define(
    [
        'utils/resume_utils',
        'hbs!templates/myaccount'
    ],
    function(ResumeUtils, myAccountTemplate){

        var MyAccountView = Backbone.View.extend({

            el: "body",

            utils: '',

            initialize: function(options){
                _.bindAll(this);
                this.options = options;
            },

            events: {
                'click #rb-edit':'editAccount',
                'click #rb-public':'publicView'
            },

            render: function(){
                this.utils = new ResumeUtils({
                    model:this.model
                });

                var o_this = this;
                this.utils.getSession();

                var data = {
                    username: this.model.get('username')||this.options.user
                }
                //console.log(this.options.user)
                this.utils.getUser(data, function(resp){
                    var resp = $.parseJSON(resp);
                    console.log(resp.priSkill)

                    $('#content').html(myAccountTemplate(resp));
                   /* o_this.utils.getTheme('myaccount',function(template){
                        var template = _.template(template, resp);
                        $('#content').html(template);
                        if(!o_this.model.get('username')){
                            $('#my-account .button-area').remove();
                        }
                        $('#my-account .detailed-resume').html(resp.resume);

                        $('.skillMeter').each(function(){

                            var maxVal = 10;// maximum value of scale
                            //var maxWValue = 340; height of graph area
                            var value = parseInt($('.value',this).find('span').html());//Making string as number
                            //calculating the graph values
                            var percent = Math.round((value/maxVal)*100);
                            //var wValue = Math.round((percent/100)*maxWValue);

                            $(".skill",this).find('span').animate({width:percent+'%'},{queue:false, duration:600, easing: 'linear'})
                        })
                    });
*/


                });

                this.delegateEvents(this.events);
            },

            editAccount: function(e){
                e.preventDefault();
                console.log(this.model)
                this.utils.setAppURL('user/'+ this.model.get('username') +'/edit');
            },

            publicView: function(){

            }
        })
        return MyAccountView;
    }
)
