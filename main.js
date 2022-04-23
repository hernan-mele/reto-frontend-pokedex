let pokemons = ''
let limit = 9
let offset = 0

const pokemonList = document.querySelector('.pokemon')
const input = document.querySelector('.search__section-input')
const loader = document.querySelector('.loader')

let observador = new IntersectionObserver((entradas, observador) => {
    entradas.forEach(entrada => {
        if(entrada.isIntersecting){
            offset +=9
            limit += 9
            cargarPokemones()
        }
    })
}, {
    rootMargin: '0px 0px 0px 0px',
    threshold: 1.0
})

const fill = (number, len) => "0".repeat(len - number.toString().length) + number.toString()

const tiposDePokemones = datos => {
    console.log(datos.length)
    if(datos.length === 1){
        return `<p class="${datos[0].type.name}">${datos[0].type.name}</p>`
    }else if(datos.length === 2){
        return `<p class="${datos[0].type.name}">${datos[0].type.name}</p><p class="${datos[1].type.name}">${datos[1].type.name}</p>`
    }
}

const filtrarPokemones = async(e) => {

    loader.classList.add('loader')
    try{
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${e}`)
    
        if(respuesta.status === 200){
            const datos = await respuesta.json()

    
            console.log(datos)
            pokemons = ''
            pokemons += `
            <div class="pokemon__info">
                <img class="pokemon__img" src="${datos.sprites.other['official-artwork'].front_default}">
                <h5>N.º${fill(datos.id, 4)}</h5>
                <h3 class="pokemon__name">${datos.name}</h3>
                <div class="pokemon__info-types">
                   ${tiposDePokemones(datos.types)}
                </div>
            </div>`

            pokemonList.innerHTML = pokemons
        }else if(respuesta.status === 401){
            alert('Pusiste la llave mal')
        }else if(respuesta.status === 404){
            alert('El Pokemon que buscas no existe')
        }else{
            alert('Hubo un error y no sabemos que paso')
        }

    }
    catch(error){
        console.log(error)
    }
    finally{
        loader.classList.remove('loader')
    }
}

let nombre = []

input.addEventListener('keypress', (e) => {
    
    if(e.keyCode !== 13){
        nombre.push(e.key)
    }else if(e.keyCode === 13){
        nombre = nombre.join("")
        input.value = ""
        input.textContent = ""
        filtrarPokemones(nombre)
        nombre = []
    }

    
})


const cargarPokemones = async() => {

    loader.classList.add('loader')
    try{
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}/`)

        if(respuesta.status === 200){
            const datos = await respuesta.json()

            datos.results.forEach(pokemon => {
                pokemons += `
                    <div class="pokemon__info">
                        <img class="pokemon__img" src="${pokemon.url}">
                        <h3 class="pokemon__name">${pokemon.name}</h3>
                    </div>
                `
            })
            pokemonList.innerHTML = pokemons

            const pokemonesEnPantalla = document.querySelectorAll('.pokemon .pokemon__info')
            let ultimoPokemon = pokemonesEnPantalla[pokemonesEnPantalla.length - 1]
            observador.observe(ultimoPokemon)
        }else if(respuesta.status === 401){
            alert('Pusiste la llave mal')
        }else if(respuesta.status === 404){
            alert('El Pokemon que buscas no existe')
        }else{
            alert('Hubo un error y no sabemos que paso')
        }
    }
    catch(error){
        console.log(error)
    }
    finally{
        loader.classList.remove('loader')
    }
}

cargarPokemones()