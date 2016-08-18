<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Transitopia</title>

<!-- D3 Library --> 
<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>


<!-- Queue.JS --> <script src="http://d3js.org/queue.v1.min.js"></script>
<!-- Tooltip --> <script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<!-- TopoJSON --> <script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.20/topojson.min.js"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css?family=Open+Sans:100,300,700|Raleway:400,700" rel="stylesheet">

<!-- Jquery -->
<script src="https://code.jquery.com/jquery-3.0.0.min.js"   integrity="sha256-JmvOoLtYsmqlsWxa7mDSLMwa6dZ9rrIdtrrVYRnDRH0="   crossorigin="anonymous"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>

<!-- Bootstrap-->
<script src="bootstrap.min.js"></script>
<link rel="stylesheet" href="bootstrap.min.css"/>
<!-- Custom Styling --> 
<link rel="stylesheet" href="app.css"/>

<!-- Leaflet -->
<link rel="stylesheet" href="https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.css" />
<script src="https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.js"></script>

</head>

<body>

<div id="container" class="col-md-12 container-fluid">
<div class="col-md-12">
<h1>Transitopia</h1>
<div class="col-md-7">
<h2> Context </h2>
<p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br><br>
</p>
<h4> Some Useful Definitions: </h4>
<p><b> Disparate Impact: </b> Policies, practices, rules, or other systems that appear to be neutral, but result in a disproportionate impact on protected group</p>
<p><b> Disparate Benefit: </b></p>
<p><b> DI/DB Ratio: </b></p>
<p><b> Vehice Revenue Hours: </b></p>
<br>
</div>
<div class="col-md-5" id="summary">
	<h2 class="subtitle">Analysis Summary</h2>
	<h3 class="lowercase"> Disparate Impact Threshold: <span id="sliderRatio" class="highlighted"> 0 </span> </h3>
	<h3 class="lowercase"> Disparate Impact Ratio: <span id="calculatedRatio" class="highlighted"> 0 </span> </h3>
	<h3 class="lowercase"> Result: <span id="isThereImpact" class="highlighted"> </span> </h3>
</div>
</div>


<div class="col-md-4" id="first-third">
	<h2 class="subtitle">Select Analysis Type</h2>
	
	<h4><a href="#" class="active"> Routes by Percent Minority Ridership </a></h4>
	<h4><a href="index2.php"> Routes by Percent Low Income Ridership</a></h4>

	<div class="col-md-12" id="map"></div>
</div>

<div class="col-md-8">
	<div class="col-md-5" id="second-third">
		<h2 class="subtitle"> Set Disparate Impact Threshold </h2>
		<div class="col-md-12" id="slider"></div>
		<div class="col-md-12" id="chart"></div>
	</div>

	<div class="col-md-7" id="calculations">
		<h2 class="subtitle"> Adjust Service Hours by Route</h2><br>
		<h2> Change in Total Service Hours </h2>
		<h2 class="lowercase">Task: <span id="target-savings">-5%</span></h2>
		<h2 class="lowercase">Current: <span id="vrhTotSavings" class="highlighted"> 0 </span></h2><br>
		<div class="col-md-12" id="tableRows"></div>

	</div>
</div>
	
</div> 

<script src="app.js"></script>
<script src="slider.js"></script>

</body>
</html>