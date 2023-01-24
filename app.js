const express = require("express");
const app = express();
const port = 3000;
const date = require(__dirname + "/date.js");

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let items = [];
let workItems = [];

app.get("/", (req, res) => {
    let dia = date.getDate();
    res.render("list", { listTitle: dia, newListItems: items });
});

app.post("/", (req, res) => {
    let item = req.body.newItem;
    req.body.list === "Work List " ? (
        workItems.push(item),
        res.redirect("/work")
    ) : (
        items.push(item),
        res.redirect("/")
    );
});

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", (req, res) => {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("work");
});

app.listen(port, () => {
    console.log(`Puerto aperturado en la ruta ${port}`);
});