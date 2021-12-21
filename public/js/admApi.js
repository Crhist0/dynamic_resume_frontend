// em construção

const api = axios.create({
    baseURL: "https://curriculo-crhist0.herokuapp.com/",
});

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

//  função para exibir os comentários não aprovados
function populateCommentsUnapproved() {
    api({
        method: "get",
        url: "/comments-dev?approved=false",
    })
        .then((res) => {
            let comments = res.data.data;
            document.getElementById("indicatorsButton").innerHTML = "";
            document.getElementById("carousel-innerComents").innerHTML = "";
            let index = 0;
            for (const comment of comments) {
                let thisComment = new CreateCommentsCarousel(index, comment);
                console.log(thisComment.uid);
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
//  função para exibir os comentários aprovados
function populateCommentsApproved() {
    api({
        method: "get",
        url: "/comments-dev?approved=true",
    })
        .then((res) => {
            let comments = res.data.data;
            document.getElementById("indicatorsButton2").innerHTML = "";
            document.getElementById("carousel-innerComents2").innerHTML = "";
            let index = 0;
            for (const comment of comments) {
                let thisComment = new CreateCommentsCarousel(index, comment);
                document.getElementById("indicatorsButton2").innerHTML += thisComment.button;
                document.getElementById("carousel-innerComents2").innerHTML += thisComment.comment;
                index++;
            }
            console.log("Mensagens carregadas");
        })
        .catch((err) => {
            console.log({ err });
        });
}

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
                    <div class="d-flex justify-content-center">
                    ${createApproveButton(comment.uid)}
                    ${createUnapproveButton(comment.uid)}
                    ${createDeleteeButton(comment.uid)}

                    </div>
                </div>
            </div>`
                : `<div class="carousel-item">
        <div class="card-body d-flex flex-column justify-content-center" style="padding: 3rem 8rem;">
            <h5 class="card-title">${comment.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted text-end">${dateFormatter(comment.created_at)}</h6>
            <hr style="width: 100%;">
            <p class="card-text">${comment.comment}</p>
            <div class="d-flex justify-content-center">
            ${createApproveButton(comment.uid)}
            ${createUnapproveButton(comment.uid)}
            ${createDeleteeButton(comment.uid)}
            
            </div>
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

function createApproveButton(uid) {
    return `
    
        <button onclick="approveComment('${uid}')" id="approveCommentButton" type="button" class="btn btn-outline-light contactButton me-3">Aprovar</button>

    `;
}
function createUnapproveButton(uid) {
    return `
 
        <button onclick="unapproveComment('${uid}')" id="approveCommentButton" type="button" class="btn btn-outline-light contactButton me-3">Desaprovar</button>
    
    `;
}
function createDeleteeButton(uid) {
    return `
 
        <button onclick="deleteComment('${uid}')" id="deleteCommentButton" type="button" class="btn btn-outline-light contactButton">Apagar</button>
    
    `;
}

function approveComment(uid) {
    api({
        method: "put",
        url: "/comments",
        data: {
            uid,
        },
    })
        .then((res) => {
            console.log({ res });
            populateCommentsUnapproved();
            populateCommentsApproved();
        })
        .catch((err) => {
            console.log({ err });
        });
}

function unapproveComment(uid) {
    api({
        method: "put",
        url: "/comments-dev",
        data: {
            uid,
        },
    })
        .then((res) => {
            console.log({ res });
            populateCommentsUnapproved();
            populateCommentsApproved();
        })
        .catch((err) => {
            console.log({ err });
        });
}

function deleteComment(uid) {
    api({
        method: "delete",
        url: `/comments?uid=${uid}`,
    })
        .then((res) => {
            console.log({ res });
            populateCommentsUnapproved();
            populateCommentsApproved();
        })
        .catch((err) => {
            console.log({ err });
        });
}

//  funções do contato

function printContact(contact) {
    return `
    <div class="card m-2" style="width: 18rem; border: 1px solid rgba(67, 88, 55, 0.3);">
        <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">Nome: ${contact.name}</h5>
            <p class="card-text">Fone: ${contact.phone}</p>
            <p class="card-text">E-mail: ${contact.email}</p>
            <p class="card-text">Prefere contato por: ${contact.prefers_contact_by}</p>
            <div class=" d-flex justify-content-center mt-3">
            <button onclick="archiveContact('${contact.uid}')" id="approveCommentButton" data-index="1" type="button" class="btn btn-outline-light contactButton">Apagar</button>
        </div>
        </div>
    </div>
    `;
}

function archiveContact(uid) {
    console.log(uid);
    api({
        method: "put",
        url: "/contacts",
        data: {
            uid: uid,
        },
    })
        .then((res) => {
            let contactList = res.data.data;
            populateContacts(contactList);
        })
        .catch((err) => {
            console.log({ err });
        });
}

function populateContacts(contactList) {
    document.getElementById("contactsArea").innerHTML = "";
    for (const contact of contactList) {
        document.getElementById("contactsArea").innerHTML += printContact(contact);
    }
}

function getContacts() {
    api({
        method: "get",
        url: "/contacts",
    })
        .then((res) => {
            let contactList = res.data.data;
            populateContacts(contactList);
        })
        .catch((err) => {
            console.log({ err });
        });
}

getContacts();
populateCommentsUnapproved();
populateCommentsApproved();
