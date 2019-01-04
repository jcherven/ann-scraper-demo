$.getJSON("/articles", (data) => {
    for (var i = 0; i < data.length; i++) {
        $("#articles")
        .append(`
            <div class="article-item" id="${data[i].articleId}" data-id="${data[i]._id}">
                <h3 class="article-title">${data[i].title}</h3>
                <p class="byline">${data[i].byLine}</p>
                <img class="preview-img" src="${data[i].imageLink}">
                <p class="preview-text">
                    ${data[i].subhead} ${data[i].previewText}
                    <a class="read-full-link" href="${data[i].link}" target="_blank">Read Full</a>
                </p>
            </div>
            `
        )
    }
});

$(document).on("click", ".article-item", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data) {
        console.log(data);
        $("#notes").append(`<h4>Save a note on ${data.title}</h4>`);
        $("#notes").append(`<textarea id='bodyinput' name='body'></textarea>`);
        $("#notes").append(`<button data-id= ${data._id} id='savenote'>Save Note</button>`);

        if (data.note) {
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            body: $("#bodyinput").val()
        }
    })
    .then(function(data) {
        console.log(data);
        $("#notes").empty();
    });

    $("#bodyinput").val("");
});