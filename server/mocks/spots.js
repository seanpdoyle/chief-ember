module.exports = function(app) {
  var express = require('express');
  var spotsRouter = express.Router();
  spotsRouter.get('/', function(req, res) {
    res.send({
      spots:[
        { id: 1, name: 'Love Park', image: 'http://photos-e.ak.instagram.com/hphotos-ak-xaf1/10584636_784128628286116_263854178_n.jpg' },
        { id: 2, name: 'Municipal', image: 'http://photos-a.ak.instagram.com/hphotos-ak-xfa1/10707044_635242319929760_501313702_n.jpg' }
      ]
    });
  });
  app.use('/api/spots', spotsRouter);
};
