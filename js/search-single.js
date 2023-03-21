/**
 * search for a single post in specific column with a keyword 
 */
function searchWithKey(term, column) {
    // First, open the IndexedDB database and create a transaction
    dbWKey = indexedDB.open('DigiNotesDB');
    dbWKey.onsuccess = (event) => {
        const database = event.target.result;
        const transaction = database.transaction(['posts'], 'readonly');
        const objectStore = transaction.objectStore('posts');
        
        // Define the keyword to search for
        const keyword = term;
        
        // Use the index to find the keyword in the column that you want to search in
        const index = objectStore.index(column);
        const request = index.get(keyword);
        
        request.onsuccess = (event) => {
            // Access the value associated with the keyword in the column
            const result = event.target.result;

            renderPost(result)
            console.log(result);
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
//means: find the post with "Rocket" in the caption

//Define postsContainer variable if necessary
const postsContainer = document.querySelector('#posts');

function renderPost(result) {
    postsContainer.innerHTML = 'Result:<br><br>';
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