function backUpDB() {
    const dbBackUp = indexedDB.open('DigiNotesDB');

    dbBackUp.onsuccess = (event) => {
    const database = event.target.result;
    const objectStore = database.transaction(['posts'], 'readonly').objectStore('posts');

    const data = {};

    objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
        data[cursor.key] = cursor.value;
        cursor.continue();
        } else {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'text/plain' });

        const downloadLink = document.createElement('a');
        downloadLink.download = 'DigiNotesDBBackup.txt';
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.click();
        }
    };
  };
}
// Usage: backUpDB();
