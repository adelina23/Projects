function selectProject() {
    var i,listItems;

	listItems = "<option value=''>Select a project</option>";
    $.getJSON('mocks/projectsData.json', function(data) {
          for (i = 0; i < data.length; i++) {
              listItems += "<option value='" + data[i].name + "'>" + data[i].name + "</option>";
          }
          $("#projs").html(listItems);
	localStorage.setItem('projects', JSON.stringify(data));
	  });
  }


function descriptionProject() {
    var i,localProject,projectName;
	
	$(".DEV").empty();
    $(".QA").empty();
    localProject = JSON.parse(localStorage.getItem('projects'));
    projectName = document.getElementById("projs").value;

    for (i = 0; i < localProject.length; i++) {
        if (projectName === localProject[i].name) {
            printProjects(localProject[i].PM);
            printBarChart(localProject[i].QA[0].adr,".QA");
            printBarChart(localProject[i].DEV[0].adr,".DEV");
		    printPieChart(localProject[i].QA[0].adr,".QA");
            printPieChart(localProject[i].DEV[0].adr,".DEV");
			printLineChart(localProject[i].QA[0].adr,".QA");
            printLineChart(localProject[i].DEV[0].adr,".DEV");
        }
        }
		
		$(".DEV").hide();
        $(".QA").hide();
    }
 

$(document).ready(function() {
    $(".devChart").click(function() {
        $(".DEV").fadeToggle("slow", "linear");
    });

    $(".qaChart").click(function() {
        $(".QA").fadeToggle("slow", "linear");
    });

});