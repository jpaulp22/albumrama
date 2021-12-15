$(function(){
  
  //hold all past grids
  let gridOb;
  
  //fetch grids
  fetch('/gridinfo', {method: "GET"}).then(res => res.json()).then(data => {
    gridOb = data;
    for(let i = 0 ; i < gridOb.allgrids.length ; i++ ){
      $("#existing-grids-cont").append(createGrid(gridOb.allgrids[i]));
    }
    if($('#existing-grids-cont').children().length < 1){
      console.log("theres no grids to show");
      let nogridcont = $("<div></div>");
      nogridcont.attr("id", "nogrid-cont");
      let nogrid = $("<div></div>");
      nogrid.attr("id", "nogrid");
      let nogridtext = $("<div></div>");
      nogridtext.attr("id", "nogridtext");
      let text = $("<p>Uh oh, looks like you haven't made any grids. Let's fix that. Go to <a href='/portal'>Collage Generator</a>.</p>");
      nogrid.append(text);
      nogridcont.append(nogrid);
      $("#existing-grids-cont").append(nogridcont);
    }
  } )
  
  function createGrid(arr){
    let usergrid = $("<div></div>");
    usergrid.attr("id", "usergrid");
    for(let i = 0 ; i < 10 ; i++){
      let ugriditem = $("<div></div>")
      ugriditem.attr("class", "ugriditem");
      let img = $("<img />", {
        src: arr[i]
      })
      ugriditem.append(img);
      usergrid.append(ugriditem);
    }
    return usergrid;
  }
})