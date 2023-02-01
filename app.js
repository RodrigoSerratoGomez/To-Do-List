const express = require("express");
const mongoose = require('mongoose');
const _ = require("lodash");
const app = express();
const port = process.env.PORT;

mongoose.set('strictQuery', false);
mongoose.connect(
    "mongodb+srv://rodrigo-admin:TzdrSNyJgPS0VGwH@cluster0.yqkcimk.mongodb.net/todoListDB",
    { useNewUrlParser: true },
    (err) => { err ? console.log(err) : console.log("MongDB Successfull Connect"); }
);

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const itemsSchema = new mongoose.Schema({
    name: String
})
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to you To Do List!"
});
const item2 = new Item({
    name: "Hit de button + to add a new Item!"
});
const item3 = new Item({
    name: "Hit the checkbox to delete some Item!"
});
const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});
const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
    Item.find({}, (err, foundItems) => {
        foundItems.length === 0 ? (
            Item.insertMany(defaultItems, function (err) {
                err ? console.log(err) : console.log("Successfull Save Collection")
            }),
            res.redirect("/")
        ) : (
            res.render("list", { listTitle: "Today", newListItems: foundItems })
        )
    });
});

app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (error, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, function (error, foundList) {
        if (!error) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save(() => res.redirect("/" + customListName));
            } else {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            };
        };
    });
})

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function (error) {
            error ? console.log(error) : (console.log("Successfully Deleted Check Item"), res.redirect("/"))
        });
    } else {
        List.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: checkedItemId } } },
            function (error, foundList) {
                if (!error) {
                    res.redirect("/" + listName);
                }
            });
    };


});

app.listen(port || 3000, () => {
    console.log(`Puerto aperturado en la ruta ${port}`);
});