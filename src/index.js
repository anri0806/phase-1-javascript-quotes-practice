document.addEventListener("DOMContentLoaded", () => {
  fetchQuotes();
});

document
  .querySelector("form#new-quote-form")
  .addEventListener("submit", handleEvent);

////1. GET - Populate page with quotes with GET////
function fetchQuotes() {
  fetch("http://localhost:3000/quotes?_embed=likes")
    .then((response) => response.json())
    .then((data) =>
      data.forEach((quoteData) => {
        //console.log(quoteData);
        renderDOM(quoteData);
      })
    );
}

////1. Render DOM - Populate page with quotes with GET////
function renderDOM(quoteData) {
  let quoteList = document.querySelector("ul#quote-list");

  let quoteCard = document.createElement("li");

  let blockquote = document.createElement("blockquote");
  blockquote.classList.add("blockquote");
  let p = document.createElement("p");
  p.classList.add("mb-0");
  p.innerText = quoteData.quote;
  let footer = document.createElement("footer");
  footer.classList.add("blockquote-footer");
  footer.innerText = quoteData.author;
  let br = document.createElement("br");

  let likeBtn = document.createElement("button");
  likeBtn.classList.add("btn-success");
  likeBtn.innerText = "Likes: ";
  let span = document.createElement("span");
  span.innerText = 0;
  likeBtn.appendChild(span);

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("btn-danger");
  deleteBtn.innerText = "Delete";

  let editBtn = document.createElement("button");
  editBtn.classList.add("edit_btn");
  editBtn.innerText = "Edit";

  quoteCard.append(blockquote, p, footer, br, likeBtn, deleteBtn, editBtn);

  quoteList.appendChild(quoteCard);

  ////3.Event - Delete a quote////
  deleteBtn.addEventListener("click", () => {
    //console.log("clicked")
    deleteQuote(quoteData.id);
    quoteCard.remove();
  });

  ////4.Event - Like a quote////
  likeBtn.addEventListener("click", () => {
    //console.log('clicked')
    //span.innerText++;
    likeQuote(quoteData.id);

    ////6.GET - always have updated number of likes////
    fetch(`http://localhost:3000/likes?quotedId=${quoteData.id}`)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data)
        data.forEach((likedData) => {
          //console.log(likedData.quoteId)<= list of liked quote's id
          if (quoteData.id === likedData.quoteId) {
            console.log(quoteData.id);
            span.innerText ++
          }
        });
      });
  });

  ////5.Event - edit a quote////
  editBtn.addEventListener("click", () => {
    //console.log('clicked')
    let form = document.createElement("form");
    let textInput = document.createElement("input");
    textInput.name = "text";
    textInput.type = "text";
    textInput.value = p.textContent;
    let save = document.createElement("input");
    save.type = "submit";
    save.value = "save";

    form.append(textInput, save);
    quoteCard.insertBefore(form, blockquote);

    form.addEventListener("submit", (e) => {
      //console.log(form.text.value)
      e.preventDefault();

      p.innerText = e.target.text.value;

      fetch(`http://localhost:3000/quotes/${quoteData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          quote: form.text.value,
        }),
      });
    });
  });
}

////2. Create/add a new quote////
function handleEvent(e) {
  e.preventDefault();

  let quoteObj = {
    quote: e.target.quote.value,
    author: e.target.author.value,
  };
  //console.log(submitBtn.quote.value)

  addNewQuote(quoteObj);
  renderDOM(quoteObj);
}

////2. POST - Create/add a new quote////
function addNewQuote(quoteObj) {
  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(quoteObj),
  });
}

////3. DELETE - Delete a quote////
function deleteQuote(id) {
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}

////4. Like a quote////
function likeQuote(id) {
  fetch("http://localhost:3000/likes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      quoteId: parseInt(id),
    }),
  });
}
