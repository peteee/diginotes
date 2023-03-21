// All Posts
const postsContainer = document.querySelector('#posts');

/**
 * D A T A B A S E
 */

//     __.-._
//     '-._"7'
//      /'.-c
//      |  /T
// snd _)_/LI

// Let us open our database
let db;
const request = window.indexedDB.open("DigiNotesDB", 2);

// { id: 1, image: "hash1", caption: "pic 1", text: "testing 123" }
let objectStore; 
let postsObjectStore;
let postsData = [];

// global posts counter
let latestPostID = 0;

request.onerror = (event) => {
  console.error("Why didn't you allow my web app to use IndexedDB?!");
};
request.onsuccess = (event) => {
  db = event.target.result;
  console.log(db);
  
  var countRequest = db.transaction("posts").objectStore("posts").count();
  countRequest.onsuccess = () => {
    console.log(countRequest.result);
    latestPostID = countRequest.result;
    
    if(latestPostID != 0) {
      for(var i = 1; i <= latestPostID; i++) {
        db.transaction("posts").objectStore("posts").get(+i).onsuccess = (event) => {
          // console.log(`ID is ${event.target.result.id}`);
          // console.log(`DATE is ${event.target.result.date}`);
          // console.log(`IMG is ${event.target.result.image}`);
          // console.log(`CAPTION is ${event.target.result.caption}`);
          // console.log(`TEXT is ${event.target.result.text}`);
          
          var myPostsDiv = document.createElement("div")

          if(typeof event.target.result.date !== 'undefined'){
            var myDate = document.createElement("p");
            myDate.classList.add("date-head");
            myDate.append(event.target.result.date);
            myPostsDiv.append(myDate);
          }

          if(typeof event.target.result.image !== 'undefined'){
            // helper Image object
            var image = new Image();
            image.src = event.target.result.image;
            image.setAttribute("data-id", event.target.result.id);
        
            image.addEventListener("dblclick", function(){
              alert("you double-tapped on item number: " + this.dataset.id);
              top.location.href = "post.html?id="+this.dataset.id;
            })
            // adding image to posts section
            myPostsDiv.append(image);
          }
          if(typeof event.target.result.caption !== 'undefined' 
           && event.target.result.caption != "" ) {
            var myCaption = document.createElement("span");
            myCaption.append(event.target.result.caption);
            myPostsDiv.append(myCaption);
          }
          myPostsDiv.append(event.target.result.text);
          postsContainer.prepend(myPostsDiv);
      
        };
      }
   }
  
  };


};