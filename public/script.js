$(function() {
  
  //allow user to use Enter key to search
    $("#search").keyup(function(e){
      if (e.key == "Enter"){
        $("#album-search").click();
      }
    })
  
  //album search function
  $('#album-search').click(function() {
    let searchJSONlabel = "searchval"; //for server purposes
    let searchval = $("#search").val(); //get search value from user
    let result = {};
    
    //if search isnt empty begin process
    if(searchval != ""){
      const searchq = { searchJSONlabel , searchval};
      const options = {
        method: 'POST',
        headers: {
          "Content-Type" : 'application/json'
        },
        body: JSON.stringify(searchq)
      };
    
      fetch('/api', options).then(res => res.json()).then(data => {
        result = data;
        for(let i = 0 ; i < 20 ; i++)
      {
        //console.log(result.result.albummatches.album[i]);
        
        //second key of image object is giving issues so Object.values() puts the values into an array
        let imginfo = Object.values(result.results.albummatches.album[i].image[2]) 
        let imgsrc = imginfo[0]; //access the img url
        //need to check if entry has an image to display
        if(imgsrc != ""){
          $("#searchgrid").append(createGridEntry(imgsrc))
        }
      };
      });
    }
    
    $("#search").val(""); 
    $("#searchgrid").empty();  
    
    //dynamically creates a grid entry
    function createGridEntry(imagesource)
    {
      let gridEntry = $("<div></div>");
      gridEntry.attr("id", "grid-item");
      let img = $("<img />", {
        src: imagesource
      })
      gridEntry.append(img);
      return gridEntry;
    }
  })
  
  $("#grid-item").css("cursor", "pointer");
  
  //appends album chosen to user grid
  $("#searchgrid").on("click", "#grid-item img", function(){
    let chosensrc = $(this).attr('src'); //get source of selected album
    let gridentries = document.querySelectorAll("#ugriditem img"); //array of images
    for(let i = 0 ; i < 10 ; i++)
      {
        if(gridentries[i].className == "placeholder")
          {
            gridentries[i].src = chosensrc;
            gridentries[i].className = i.toString();
            i = 10;
          }
      } 
  })
  
  //remove a chosen album
  $("#ugriditem img").click(function() {
    $(this).attr("src", "album.png");
    $(this).attr("class", "placeholder");
  })
  
  //reset grid
  $("#reset").click(function() {
    let gridentries = document.querySelectorAll("#ugriditem img")
    for(let i = 0 ; i < 10 ; i++)
      {
        gridentries[i].className = "placeholder";
        gridentries[i].src = "images/onpage_images/album.png";
      }
  })
  
  /*
  //download grid
  $("#dnld").click(function() {
      html2canvas(document.getElementById("usergrid")).then(canvas =>{
        let anchorTag = document.createElement("a");
        document.body.appendChild(anchorTag);
        document.getElementById("usergrid").appendChild(canvas);
        anchorTag.download = "yourgrid.jpg";
        anchorTag.href = canvas.toDataURL();
        anchorTag.target = '_blank';
        anchorTag.click();
      })
  });*/
})
