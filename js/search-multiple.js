/**
 * search for multiple posts in a specific column with a keyword 
 */
function searchMWithKey(term, column) {
    // First, open the IndexedDB database and create a transaction
    dbMWKey = indexedDB.open('DigiNotesDB');
    dbMWKey.onsuccess = (event) => {
        const database = event.target.result;
        const transaction = database.transaction(['posts'], 'readonly');
        const objectStore = transaction.objectStore('posts');
        
        // Define the keyword to search for
        const keyword = term;
        
        // Use the index to find all entries that contain the keyword
        const index = objectStore.index(column);
        const request = index.openCursor(IDBKeyRange.only(keyword));
        const results = [];
        
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              // Add the matching record to the results array
              results.push(cursor.value);
              cursor.continue();
            } else {
              // Log the results array when all matching records have been retrieved
              console.log(results);
              // render the posts
              //Define postsContainer variable if necessary
              const postsContainer = document.querySelector('#posts');
              postsContainer.innerHTML = 'Results:<br><br>';
              results.forEach(function(item){
                renderMPost(item);
              });
            }
          };
          
          request.onerror = (event) => {
            console.log('Error: ' + event.target.errorCode);
          };
    };
}

/**
 * Usage
 */

//searchWithKey("Rocket", "caption");
//means: find all posts with "Rocket" in the caption



function renderMPost(result) {
    var myPostsDiv = document.createElement("div")
    if(typeof result.date !== 'undefined'){
      var myDate = document.createElement("p");
      myDate.classList.add("date-head");
      myDate.append(result.date);
      myPostsDiv.append(myDate);
    }
    if(typeof result.image !== 'undefined'){
      // helper Image object
      var image = new Image();
      image.src = result.image;
      image.setAttribute("data-id", result.id);
  
      // adding image to posts section
      myPostsDiv.append(image);
    }
    if(typeof result.caption !== 'undefined' 
     && result.caption != ""){
      var myCaption = document.createElement("span");
      myCaption.append(result.caption);
      myPostsDiv.append(myCaption);
    }
    myPostsDiv.append(result.text);
    postsContainer.append(myPostsDiv);
}