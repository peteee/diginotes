/**
 * * D I G I N O T E S   A P P *
 * - Web Interface Programming -
 */

//            __
// .-.__      \ .-.  ___  __
// |_|  '--.-.-(   \/\;;\_\.-._______.-.
// (-)___     \ \ .-\ \;;\(   \       \ \
//  Y    '---._\_((Q)) \;;\\ .-\     __(_)
//  I           __'-' / .--.((Q))---'    \,
//  I     ___.-:    \|  |   \'-'_          \
//  A  .-'      \ .-.\   \   \ \ '--.__     '\
//  |  |____.----((Q))\   \__|--\_      \     '
//     ( )        '-'  \_  :  \-' '--.___\
//      Y                \  \  \       \(_)
//      I                 \  \  \         \,
//      I                  \  \  \          \
//      A                   \  \  \          '\
//      |                    \  \__|           '
//                            \_:.  \
//                              \ \  \
//                               \ \  \
//                                \_\_|

console.log("App initialized...");

const postItBtn = document.querySelector('button#post-it');
const myPostsForm = document.querySelector('form#post');

// form data
const formText = document.querySelector('textarea#note');
const formImg = document.querySelector('#img-upload');

// Preview
const postsContainer = document.querySelector('#posts');

// file input label 
const fileLabel = document.querySelector('.custom-file-upload');

// image carrier var
let imgCarrier = null;

//localStorage.setItem("app-memory", "");
let imgData;

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
const request = window.indexedDB.open("MyTestDatabase", 6);

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
          // console.log(`IMG is ${event.target.result.image}`);
          // console.log(`CAPTION is ${event.target.result.caption}`);
          //console.log(`TEXT is ${event.target.result.text}`);
          
          if(typeof event.target.result.image !== 'undefined'){
            // helper Image object
            var image = new Image();
            image.src = event.target.result.image;
            image.setAttribute("data-id", event.target.result.id);
        
            // adding image to posts section
            postsContainer.prepend(image);
          }
          if(typeof event.target.result.caption !== 'undefined'){
            postsContainer.prepend(event.target.result.caption);
          }
          postsContainer.prepend(event.target.result.text);
      
        };
      }
   }
  
  };


};

request.onupgradeneeded = (event) => {

  db = event.target.result;
  objectStore = db.createObjectStore("posts", { keyPath: "id" });

  objectStore.createIndex("id", "id", { unique: true });
  objectStore.createIndex("image", "image", { unique: false });
  objectStore.createIndex("caption", "caption", { unique: false });
  objectStore.createIndex("text", "email", { unique: false });

  // objectStore.transaction.oncomplete = (event) => {
  //   // Store values in the newly created objectStore.
  //   postsObjectStore = db.transaction("posts", "readwrite").objectStore("posts");
  //   postsData.forEach((post) => {
  //     postsObjectStore.add(post);
  //   });
  // };

}







const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))


function processfile(file) {
    console.log(file.type)
    if( !( /image/i ).test( file.type ) ) {
      alert( "File "+ file.name +" is not an image." );
      return false;
    }
    console.log(file.name);
    fileLabel.append(file.name);

    // read the files
    var reader = new FileReader();
    
    reader.readAsArrayBuffer(file);

     
    reader.onload = function (event) {
      // blob stuff
      var blob = new Blob([event.target.result]); // create blob...
      window.URL = window.URL || window.webkitURL;
      var blobURL = window.URL.createObjectURL(blob); // and get it's URL
      
      // // creates a base64 version of image
      // imgData = reader.readAsDataURL(blob);
      // console.log(imgData);
      toDataURL(blobURL)
      .then(dataUrl => {
        imgData = dataUrl;
        //console.log('RESULT:', dataUrl)
      })

      // helper Image object
      var image = new Image();
      image.src = blobURL;
      //preview.appendChild(image); // preview commented out, I am using the canvas instead
      imgCarrier = image;
      fileLabel.style.backgroundImage = 'url('+blobURL+')';
      
    };
    
   
  }

function readfiles(files) {
    for (var i = 0; i < files.length; i++) {
      processfile(files[i]); // process each file at once
    }
    formImg.value = ""; //remove the original files from fileinput
}


postItBtn.addEventListener("click", function() {
    console.log(formText.value);
    console.log(formImg.value);
    if(formText.value === '') {
      alert("Please type something...");
    } else {
      
      if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {
          alert('The File APIs are not fully supported in this browser.');
          return false;
      }
      //readfiles(formImg.files);


      // adding posts to posts section
      postsContainer.innerHTML += formText.value + '<br>';
      
      //if(typeof imgCarrier != 'undefined')
      if(imgCarrier != null)
        postsContainer.appendChild(imgCarrier);

      /**
       * Storing to DB
       */
      if(latestPostID === 0)
        latestPostID = 1;
      else
        latestPostID++;

      postsData = [
        { 
          id: latestPostID,
          image: imgData,
          caption: "test pic",
          text: formText.value
        }
      ];

      postsObjectStore = db.transaction("posts", "readwrite").objectStore("posts");
      postsData.forEach((post) => {
        postsObjectStore.add(post);
      });    

      /**
       * Form reset
       */

      // reset preview box
      imgCarrier = null;
      fileLabel.style.backgroundImage = 'none';
      // reset the form
      myPostsForm.reset();
    
    }
})

formImg.onchange = function() {
    readfiles(formImg.files);
}