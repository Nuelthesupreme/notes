const express = require("express"), path = require("path"), fs = require("fs");

// Instantiating application
const app = express();
const PORT = process.env.PORT || 3000;

// Declare middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//functions go here
const pathToDb = path.join(__dirname, '/db/db.json');

const handleGetAllNotes = (req, res) => {
    const db = fs.readFileSync(pathToDb);
    const allNotes = JSON.parse(db);
    res.json(allNotes)
}

const handleCreateNote = (req, res) => {
    const { title, text } = req.body; // Comes from user
    const id = Date.now().toString(); // Generated server-side

    const db = fs.readFileSync(pathToDb);
    const allNotes = JSON.parse(db);
    allNotes.push({ title, text, id });
    fs.writeFileSync(pathToDb, JSON.stringify(allNotes));
    res.send({ title, text, id });
}

const handleDeleteNote = (req, res) => {
    const noteIdToDelete = req.param('id');

    const db = fs.readFileSync(pathToDb);
    const allNotes = JSON.parse(db);
    const newNotes = allNotes.filter(note => note.id !== noteIdToDelete);
    fs.writeFileSync(pathToDb, JSON.stringify(newNotes));
    allNotes.length === newNotes.length
        ? res.send(`Note ${noteIdToDelete} does not exist!`)
        : res.send(`Note ${noteIdToDelete} has been deleted sucessfully!`)
}

//Routes go here
app.get("/api/notes", handleGetAllNotes);
app.post("/api/notes", handleCreateNote);
app.delete("/api/notes/:id", handleDeleteNote)

app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')))

app.get('/*', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')))

app.listen(PORT, () => console.log(`server is running http://localhost:${PORT}`))