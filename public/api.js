//TODO: adicionar classe .active para links navbars que forem clicados

// const axios = require("axios");

function dev() {
    let name = document.getElementById("commentComment").value;
    let comment = document.getElementById("commentName").value;
    console.log(name + " : " + comment);

    axios({
        method: "post",
        url: "/comments",
        data: {
            name,
            comment,
        },
    }).then((res) => {
        console.log({ res });
    });
}
