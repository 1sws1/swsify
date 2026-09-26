const fs = require("fs");
const path = require("path");

const songsRoot = path.join(__dirname, "songs");

const folders = fs.readdirSync(songsRoot).filter(name => {
    return fs.statSync(path.join(songsRoot, name)).isDirectory();
});

folders.forEach(folder => {
    const folderPath = path.join(songsRoot, folder);
    const mp3s = fs.readdirSync(folderPath).filter(f => f.endsWith(".mp3"));

    const jsonPath = path.join(folderPath, "songs.json");
    fs.writeFileSync(jsonPath, JSON.stringify(mp3s, null, 2));

    console.log(`✔ ${folder}: wrote songs.json with ${mp3s.length} songs`);
});

console.log("Done!");