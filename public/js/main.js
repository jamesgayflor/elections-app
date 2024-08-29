vote_btns = document.querySelectorAll(".vote_bn");
console.log(vote_btns);

vote_btns.forEach(element => {
    element.addEventListener('click', () => {
        window.location.replace("/vote_canditate");
    })
});