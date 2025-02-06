// Função para redirecionar ao fim da animação
function redirecionarHome() {
    setTimeout(function() {
        window.location.href = './indexMobile.html'; // Redireciona para a home
    }, 2500); // Atraso de 2500ms para garantir que a animação tenha terminado
}

// Adiciona a função ao término da animação
window.addEventListener('load', function () {
    document.querySelector('.parallaxImg').addEventListener('animationend', redirecionarHome);
});