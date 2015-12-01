<!DOCTYPE html>
<!-- saved from url=(0043)http://getbootstrap.com/examples/jumbotron/ -->
<html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="">

    <title>Edu Wenca</title>

    <!-- Bootstrap core CSS -->
    <link href="./css/bootstrap.min.css" rel="stylesheet">
    <link href="./style.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="./css/jumbotron-narrow.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body data-feedly-mini="yes">

    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="http://getbootstrap.com/examples/jumbotron/#">Edu Wenca</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
         <ul class="nav navbar-nav">
	  <li><a href="#">Link</a></li>
         </ul>
        </div><!--/.navbar-collapse -->
      </div>
    </nav>

    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron">
      <div id="container">
      <div id="canvas-container" class="container well">
        <canvas id="HexCanvas" width="900" height="400" style="width:100%;"></canvas> 
      </div>
      </div>

    </div>

    <div class="container">
      <!-- Example row of columns -->
      <div class="row">
        <div class="col-md-4">
	  <div class="well">
          <h2>No meat</h2>
          <p id="nomeat"></p>
          <p><a class="btn btn-default" href="http://getbootstrap.com/examples/jumbotron/#" role="button">View details »</a></p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="well">
          <h2>Learned it</h2>
          <p id="learned"></p>
          <p><a class="btn btn-default" href="http://getbootstrap.com/examples/jumbotron/#" role="button">View details »</a></p>
          </div>
       </div>
        <div class="col-md-4">
          <div class="well">
          <h2>Dreamed it</h2>
          <p id="dreamed"></p>
          <p><a class="btn btn-default" href="http://getbootstrap.com/examples/jumbotron/#" role="button">View details »</a></p>
          </div>
        </div>
      </div>
      <div id='row2' class="row">
        <div class="col-md-4">
	  <div class="well">
          <h2>Tried it</h2>
          <p id="tried"></p>
          <p><a class="btn btn-default" href="http://getbootstrap.com/examples/jumbotron/#" role="button">View details »</a></p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="well">
          <h2>Read it</h2>
          <p id="read"></p>
          <p><a class="btn btn-default" href="http://getbootstrap.com/examples/jumbotron/#" role="button">View details »</a></p>
          </div>
       </div>
        <div class="col-md-4">
          <div class="well">
          <h2>Been there</h2>
          <p id="been"></p>
          <p><a class="btn btn-default" href="http://getbootstrap.com/examples/jumbotron/#" role="button">View details »</a></p>
          </div>
        </div>
      </div>

      <hr>

      <footer>
        <p>© 2015</p>
      </footer>
    </div> <!-- /container -->


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="./js/bootstrap.min.js"></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="./js/ie10-viewport-bug-workaround.js"></script>
    <script type="text/javascript" src="jquery.fetchtweets.js"></script>
    <script src="./js/hexagon.js"></script>
    <script type="text/javascript">
    $(function () {
       loadtweets('');
        var hexagonGrid = new HexagonGrid("HexCanvas", 100);
        hexagonGrid.hexList.push(new Hexagon(0, 0, "#00b3ca")); 
        hexagonGrid.hexList.push(new Hexagon(0, 1, "#d2b29b"));
        hexagonGrid.hexList.push(new Hexagon(1, 0, "#e38690")); 
        hexagonGrid.hexList.push(new Hexagon(0, 2, "#f69256"));
        hexagonGrid.hexList.push(new Hexagon(0, 3, "#ead98b"));
        hexagonGrid.hexList.push(new Hexagon(0, 4, "#965251"));
        hexagonGrid.repaint();
    });
    </script>
    



<div id="feedly-mini" title="feedly Mini tookit"></div></body></html>
