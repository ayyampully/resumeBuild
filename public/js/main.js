require.config({
	paths: {
		jQuery: '/js/libs/jquery/jquery',
		Underscore: '/js/libs/underscore/underscore',
		Backbone: '/js/libs/backbone/backbone'
	},
	shim: {
		'Backbone': ['Underscore', 'jQuery'],
		'app': ['Backbone']
	}
});
require(['app'], function(app) {
	app.initialize();
});