
module.exports = setupGrunt;

function setupGrunt(grunt) {
	grunt.initConfig({
		'package': grunt.file.readJSON('package.json'),
		'jshint': {
			'files': ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
			'options': '<%= package.jshintConfig %>'
		},
		'nodeunit': {
			'files': ['test/**/*.js']
		},
		'watch': {
			'files': '<%= jshint.files %>',
			'tasks': 'default'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jshint', 'nodeunit']);
	grunt.registerTask('test', ['jshint', 'nodeunit']);
}
