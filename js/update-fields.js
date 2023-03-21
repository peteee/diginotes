function updateVal(idkey, newValue) {

    // First, open the IndexedDB database and create a transaction
    const dbUpdate = indexedDB.open('DigiNotesDB');
    dbUpdate.onsuccess = (event) => {
    const database = event.target.result;
    const transaction = database.transaction(['posts'], 'readwrite');
    const objectStore = transaction.objectStore('posts');
    
    // Define the key of the object to update
    const key = idkey;
    // Use the get method to retrieve the existing object
    const getRequest = objectStore.get(key);
    
    getRequest.onsuccess = (event) => {
        // Retrieve the existing object
        const existingObject = event.target.result;
        
        // Modify the relevant field / column -> rename myField to f.ex. caption
        existingObject.myField = newValue;
        
        // Use the put method to save the updated object
        const putRequest = objectStore.put(existingObject);
        
        putRequest.onsuccess = (event) => {
        console.log('Object updated successfully');
        };
        
        putRequest.onerror = (event) => {
        console.log('Error: ' + event.target.errorCode);
        };
    };
    
    getRequest.onerror = (event) => {
        console.log('Error: ' + event.target.errorCode);
    };
  };
}

/**
 * Usage: example
 */

//updateVal(12, "Testing 1,2,3");