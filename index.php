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
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.0-rc.2/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.0.0-rc.2/dist/leaflet.js"></script>

</head>

<body>

<div id="container" class="col-md-12 container-fluid">
<div class="col-md-12">
<h1>Transitopia</h1>
<div class="col-md-7">
<h2> Context </h2>
<p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br><br>
</p>
<br>
</div>

</div>


<div class="col-md-4" id="first-third">
	<h2 class="subtitle">Select Analysis Type</h2>
	<br>
	<h3><a href="#" class="choiceMinority active"> Routes by Percent Minority Ridership </a></h3>
	<h3><a href="index2.php" class="choiceLowIncome"> Routes by Percent Low Income Ridership</a></h3>
	<br>
	<h2 class="subtitle"> Set Disparate Impact Threshold </h2>
	<div class="col-md-12" id="slider"></div>
			
	<div class="col-md-12" id="map"></div>
</div>

<div class="col-md-8">
	<div class="col-md-8" id="second-third">
	<h2 class="subtitle"> Adjust Service Hours by Route</h2><br>
			<h3 class="lowercase"> Change in Total Service Hours </h3>
			<div class="col-md-6">
			<h3 class="lowercase"> By Hours</h3>
			<h2 class="lowercase">Task: <span id="target-savings-dollars">-5%</span></h2>
			<h2 class="lowercase">Current: <span id="vrhTotSavings-dollars" class="highlighted"> 0 </span></h2><br>
			</div>
			<div class="col-md-6">
			<h3 class="lowercase"> By Percent </h3>
			<h2 class="lowercase">Task: <span id="target-savings">-5%</span></h2>
			<h2 class="lowercase">Current: <span id="vrhTotSavings" class="highlighted"> 0 </span></h2><br>
			</div>
			
		<div class="col-md-12" id="tableRows"></div>
		<div id="chart"></div>
	</div>

	<div class="col-md-4" id="calculations">
			
		<div id="summary">
			<h2 class="subtitle-large">Analysis Summary</h2><br>
			<h3 class="lowercase"> Disparate Impact Threshold: <span id="sliderRatio" class="highlighted"> 0 </span> </h3><br>
			<h3 class="lowercase"> Disparate Impact Ratio: <span id="calculatedRatio" class="highlighted"> 0 </span> </h3><br>
			<h3 class="lowercase"> Result: <br><span id="isThereImpact" class="highlighted"> </span> </h3>
		</div>

	</div>
</div>
	
</div> 

<script src="app.js"></script>
<script src="slider.js"></script>

</body>
</html>