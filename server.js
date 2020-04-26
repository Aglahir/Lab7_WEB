const express = require("express");
const body_parser = require("body-parser");
const uuid = require("uuid");
const morgan = require("morgan");
const validateToken = require("./middleware/validateToken");

const json = body_parser.json();

const port = 3000;

let app = express();
app.use(morgan("dev"));
app.use(validateToken);

let bookmarks = [
  {
    id: uuid.v4(),
    title: "BM1",
    description: "Some description",
    url: "url/BM1",
    rating: 10,
  },
  {
    id: uuid.v4(),
    title: "BM1",
    description: "Some description 2",
    url: "url/BM1.2",
    rating: 8,
  },
];

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

app.get("/bookmarks", (req, res) => {
  return res.status(200).json(bookmarks);
});

app.get("/bookmark", (req, res) => {
  let title = req.query.title;

  if (!title) {
    res.statusMessage = "Title missing";
    return res.status(406).end();
  }

  let output = [];
  for (let i = 0; i < bookmarks.length; i++) {
    if (title === bookmarks[i].title) {
      output.push(bookmarks[i]);
    }
  }

  if (output.length == 0) {
    res.statusMessage = "Title Not Found";
    return res.status(404).end();
  } else {
    return res.status(200).json(output);
  }
});

app.post("/bookmark", json, (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let url = req.body.url;
  let rating = req.body.rating;

  if (!title || !description || !url || !rating) {
    res.statusMessage = "Missing fields";
    return res.status(406).end();
  }

  let newObj = {
    id: uuid.v4(),
    title: title,
    description: description,
    url: url,
    rating: rating,
  };

  bookmarks.push(newObj);

  return res.status(201).json(newObj);
});

app.delete("/bookmark/:id", (req, res) => {
  let id = req.params.id;
  let targetIndex = bookmarks.findIndex((bookmark) => {
    if (bookmark.id === id) {
      return true;
    }
  });

  if (targetIndex) {
    res.statusMessage = "Bookmark not found";
    return res.status(404).end();
  } else {
    bookmarks.splice(targetIndex, 1);
    return res.status(200).end();
  }
});

app.patch("/bookmark/:id", json, (req, res) => {
  let idParam = req.params.id;
  let idBody = req.body.id;

  if (!idParam) {
    res.statusMessage = "Missing ID parameter";
    return res.status(406).end();
  }

  // I am assuming is not always needed the body one
  if (idBody) {
    if (idBody !== idParam) {
      res.statusMessage = "Parameter and body field IDs must match";
      return res.status(409).end();
    }
  }

  let title = req.body.title;
  let description = req.body.description;
  let url = req.body.url;
  let rating = req.body.rating;

  let output = {};

  let targetIndex = bookmarks.findIndex((bookmark) => {
    if (bookmark.id === idParam) {
      return true;
    }
  });

  if (targetIndex) {
    res.statusMessage = "Bookmark not found";
    return res.status(404).end();
  } else {
    if (title) {
      output["title"] = title;
      bookmarks[targetIndex].title = title;
    }
    if (description) {
      output["description"] = description;
      bookmarks[targetIndex].description = description;
    }
    if (url) {
      output["url"] = url;
      bookmarks[targetIndex].url = url;
    }
    if (rating) {
      output["rating"] = rating;
      bookmarks[targetIndex].rating = rating;
    }

    return res.status(202).json(output);
  }
});
