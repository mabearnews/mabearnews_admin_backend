

module.exports = function (app) {
    
    app.get('/', function (req, res) {
	res.send('Will send SPA');
    });

    // API routes
    require('../routes/api')(app);
    
}
