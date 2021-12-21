//TODO: adicionar classe .active para links navbars que forem clicados

const api = axios.create({
    baseURL: "https://curriculo-crhist0.herokuapp.com",
});

// funções de criação de comentário e contato
function createComment() {
    let name = document.getElementById("commentName").value;
    let comment = document.getElementById("commentComment").value;
    api({
        method: "post",
        url: "/comments",
        data: {
            name,
            comment,
        },
    })
        .then((res) => {
            showOkMessage(res);
            clearAllInputs();
        })
        .catch((err) => {
            showErrorMessage(err);
        });
}
function createContact() {
    let name = document.getElementById("contactName").value;
    let phone = document.getElementById("contactPhone").value;
    let email = document.getElementById("contactMail").value;
    let prefers_contact_by = document.getElementById("contactPrefersContactBy").value;
    api({
        method: "post",
        url: "/contacts",
        data: {
            name,
            phone,
            email,
            prefers_contact_by,
        },
    })
        .then((res) => {
            showOkMessage(res);
            clearAllInputs();
        })
        .catch((err) => {
            showErrorMessage(err);
        });
}
function clearAllInputs() {
    document.getElementById("contactName").value = "";
    document.getElementById("contactPhone").value = "";
    document.getElementById("contactMail").value = "";
    document.getElementById("commentName").value = "";
    document.getElementById("commentComment").value = "";
}

// funções para tratar resposta da api
function showOkMessage(res) {
    let message = res.data.message;
    let title = res.data.title;
    return Swal.fire({
        icon: "success",
        title: `${title}`,
        text: `${message}`,
        confirmButtonColor: `#435837`,
    });
    // .then((result) => {});
}
function showErrorMessage(res) {
    let message = res.response.data.message;
    return Swal.fire({
        icon: "error",
        title: `Erro :(`,
        text: `${message}`,
        confirmButtonColor: `#435837`,
    });
}

//  função para exibir os comentários
function populateComments() {
    // url "/comments-dev" = filtrado
    // url "/comments" = todos
    api({
        method: "get",
        url: `/comments`,
    })
        .then((res) => {
            let comments = res.data.data;
            document.getElementById("indicatorsButton").innerHTML = "";
            document.getElementById("carousel-innerComents").innerHTML = "";
            let index = 0;
            for (const comment of comments) {
                let thisComment = new CreateCommentsCarousel(index, comment);
                document.getElementById("indicatorsButton").innerHTML += thisComment.button;
                document.getElementById("carousel-innerComents").innerHTML += thisComment.comment;
                index++;
            }
            console.log("Mensagens carregadas");
        })
        .catch((err) => {
            console.log({ err });
        });
}

// funções fábrica
class CreateCommentsCarousel {
    constructor(index, comment) {
        this.index = index;
        this.button =
            this.index == 0
                ? `<button type="button" data-bs-target="#carouselComentarios" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>`
                : `<button type="button" data-bs-target="#carouselComentarios" data-bs-slide-to="${this.index}" aria-label="Comentário"></button>`;
        this.comment =
            this.index == 0
                ? `<div class="carousel-item active">
                <div class="card-body d-flex flex-column justify-content-center" style="padding: 3rem 8rem;">
                    <h5 class="card-title">${comment.name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted text-end">${dateFormatter(comment.created_at)}</h6>
                    <hr style="width: 100%;">
                    <p class="card-text">${comment.comment}</p>
                </div>
            </div>`
                : `<div class="carousel-item">
        <div class="card-body d-flex flex-column justify-content-center" style="padding: 3rem 8rem;">
            <h5 class="card-title">${comment.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted text-end">${dateFormatter(comment.created_at)}</h6>
            <hr style="width: 100%;">
            <p class="card-text">${comment.comment}</p>
        </div>
    </div>`;
    }
    static printButton() {
        return this.button;
    }
    static printComment() {
        return this.comment;
    }
}
function dateFormatter(date) {
    // date = Array.from(date);
    let dia = `${date[8]}${date[9]}`;
    let mes = `${date[5]}${date[6]}`;
    let ano = `${date[0]}${date[1]}${date[2]}${date[3]}`;
    return `${dia}/${mes}/${ano}`;
}

document.getElementById("commentSendButton").addEventListener("click", createComment);
document.getElementById("contactSendButton").addEventListener("click", createContact);
document.getElementById("admArea").addEventListener("click", admAreaIn);

// função admArea
function admAreaIn() {
    Swal.fire({
        icon: "info",
        title: `Acesso restrito`,
        confirmButtonColor: `#435837`,
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: "Voltar",
        html: `
        
        <div class="form d-flex flex-column align-items-center">
        <input maxlength="20" type="text" class="form-control ms-2 me-2 w-75 mt-1 mb-1" id="admAreaName" style="background-color: transparent;" placeholder="Nome">
        </div>
        <div class="form d-flex flex-column align-items-center">
        <input maxlength="20" type="text" class="form-control ms-2 me-2 w-75 mt-1 mb-1" id="admAreaPass" style="background-color: transparent;" placeholder="Senha">
        </div>
        `,
    }).then((result) => {
        if (result.isConfirmed) {
            let name = document.getElementById("admAreaName").value;
            let pass = document.getElementById("admAreaPass").value;

            api({
                method: "post",
                url: "/admin",
                data: {
                    name,
                    pass,
                },
            })
                .then((res) => {
                    showOkMessage(res).then(() => {
                        window.location.pathname = "/admin/index.html";
                    });
                })
                .catch((err) => {
                    showErrorMessage(err);
                });
        } else if (result.isDenied || result.isDismissed) {
            return;
        }
    });
}

populateComments();
