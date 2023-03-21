function emptyDB() {

    //const db = indexedDB.open('myDatabase', 1);
    //db.onsuccess = (event) => {
        //const database = event.target.result;
        const objectStore3 = db.transaction(['posts'], 'readwrite').objectStore('posts');
        objectStore3.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        };
    //};

}


let dataRestore;
function restoreDB() {

    emptyDB();
    let myFile = document.getElementById("back-up");
    let fr = new FileReader();
    
    fr.addEventListener(
    "load",
    () => {
        //console.log(fr.result);
        dataRestore = JSON.parse(fr.result);
        console.log(dataRestore);

        let postsData;
        let objectStore2 = db.transaction("posts", "readwrite").objectStore("posts");
        (Object.values(dataRestore)).forEach(function(item, index){
            console.log(item.id);
            postsData = [
                { 
                    id: item.id,
                    image: item.image,
                    caption: item.caption,
                    text: item.text,
                    date: item.date
                }
            ];

            
            postsData.forEach((post) => {
                objectStore2.add(post);
            });
        });
        let mySite = document.querySelector("main");
        mySite.style.display = "none";
        setTimeout(function(){ location.reload(); }, 1500);
        




    },
    false
    );

    if (myFile.files[0]) {
        fr.readAsText(myFile.files[0]);
    }

}

//Usage: restoreDB(file);
