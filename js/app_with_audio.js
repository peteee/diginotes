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
const formCaption = document.querySelector('#caption');
const formImg = document.querySelector('#img-upload');

// Preview & All Posts
const postsContainer = document.querySelector('#posts');

// file input label 
const fileLabel = document.querySelector('.custom-file-upload');

// image carrier var
let imgCarrier = null;
let audioCarrier = null;

//localStorage.setItem("app-memory", "");
let imgData;
let soundData;

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
const request = window.indexedDB.open("DigiNotesDB", 1);

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
          // console.log(`TEXT is ${event.target.result.text}`);
          
          var myPostsDiv = document.createElement("div")
          if(typeof event.target.result.image !== 'undefined'){
            // helper Image object
            var image = new Image();
            image.src = event.target.result.image;
            image.setAttribute("data-id", event.target.result.id);
        
            // adding image to posts section
            myPostsDiv.append(image);
          }
          if(typeof event.target.result.audio !== 'undefined'){
            // helper Image object
            var audi = new Audio();
            audi.src = event.target.result.audio;
            audi.controls = true;
        
            // adding image to posts section
            myPostsDiv.append(audi);
          }
          if(typeof event.target.result.caption !== 'undefined'){
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


/**
 * Structure of your DB 
 */
request.onupgradeneeded = (event) => {

  db = event.target.result;
  objectStore = db.createObjectStore("posts", { keyPath: "id" });

  objectStore.createIndex("id", "id", { unique: true });
  objectStore.createIndex("image", "image", { unique: false });
  objectStore.createIndex("audio", "audio", { unique: false });
  objectStore.createIndex("caption", "caption", { unique: false });
  objectStore.createIndex("text", "text", { unique: false });

}

// function to convert image to base64 string
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
    // if( !( /image/i ).test( file.type ) ) {
    //   alert( "File "+ file.name +" is not an image." );
    //   return false;
    // }
    // if( !( /audio/i ).test( file.type ) ) {
    //   alert( "File "+ file.name +" is not an audio file." );
    //   return false;
    // }
    console.log(file.name);
    //fileLabel.append(file.name);
    if( ( /image/i ).test( file.type ) ) {
    var fileNamePreview = document.querySelector(".custom-file-upload span");
    fileNamePreview.append(file.name);
    }
    
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
      if( ( /image/i ).test( file.type ) ) {
      toDataURL(blobURL)
      .then(dataUrl => {
        imgData = dataUrl;
        console.log('RESULT:', dataUrl)
        })
      }
      if( ( /audio/i ).test( file.type ) ) {
      toDataURL(blobURL)
      .then(dataUrl => {
        soundData = dataUrl;
        //console.log('RESULT:', dataUrl)
        })
      }

      if( ( /image/i ).test( file.type ) ) {
        // helper Image object
        var image = new Image();
        image.src = blobURL;
        //preview.appendChild(image); // preview commented out, I am using the canvas instead
        imgCarrier = image;
        fileLabel.style.backgroundImage = 'url('+blobURL+')';
      }
      if( ( /audio/i ).test( file.type ) ) {
        // helper Image object
        var audi = new Audio();
        audi.src = blobURL;
        audi.controls = true;
        //preview.appendChild(image); // preview commented out, I am using the canvas instead
        audioCarrier = audi;
        // fileLabel.style.backgroundImage = 'url('+blobURL+')';
      }

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
    console.log(formCaption.value);

    if(formText.value === '') {
      alert("Please type something...");
    } else {
      
      if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {
          alert('The File APIs are not fully supported in this browser.');
          return false;
      }

      /**
       * Posting the recent post directly
       */
      var myPostsDiv = document.createElement("div")

      //if(typeof imgCarrier != 'undefined')
      if(imgCarrier != null)
        myPostsDiv.appendChild(imgCarrier);
      if(audioCarrier != null)
        myPostsDiv.appendChild(audioCarrier);

      // adding posts to posts section
      var myCaption = document.createElement("span");
      myCaption.append(formCaption.value);
      myPostsDiv.append(myCaption);
      myPostsDiv.append(formText.value);
      postsContainer.prepend(myPostsDiv);

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
          audio: soundData,
          caption: formCaption.value,
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
});

formImg.onchange = function() {
    readfiles(formImg.files);
}