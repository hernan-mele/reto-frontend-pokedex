let pokemons = ''
let pokemonCard = ''
let limit = 9
let offset = 0
let stats = []

const pokemonList = document.querySelector('.pokemon')
const input = document.querySelector('.search__section-input')
const loader = document.querySelector('.loader')
const headerSearch = document.querySelector('.header__search')
const headerSearchEngine = document.querySelector('.header__search-engine')
const pokemonProfileCard = document.querySelector('.pokemon__profile')
let pokemonsCards



headerSearch.addEventListener('click', () => {
    if(headerSearchEngine.style.display === 'block'){
        headerSearchEngine.style.display = 'none'
    }else{
        headerSearchEngine.style.display = 'block'
    }
})


let observador = new IntersectionObserver((entradas, observador) => {
    entradas.forEach(entrada => {
        if(entrada.isIntersecting){
            offset += 9
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

headerSearchEngine.addEventListener('keypress', (e) => {

    console.log(e.key)

    if(e.keyCode !== 13){
        nombre.push(e.key)
    }else if(e.keyCode === 13){
        nombre = nombre.join("")
        headerSearchEngine.value = ""
        headerSearchEngine.textContent = ""
        filtrarPokemones(nombre)
        nombre = []
    }

})

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


const pokemonCardsCreator = (url) => {
    const respuesta = fetch(url)
    
        const data = respuesta.then(respuesta => respuesta.json())

            data.then(data => {
                stats = data.stats.map(stat => {
                    return [stat.base_stat, stat.stat.name]
                })
                pokemonCard = `
                    <div class="pokemon__card">
                        <img class="pokemon__card-img" src="${data.sprites.other['official-artwork'].front_default}">
                        <div class="stats__div">
                            <h5>N.°${fill(data.id, 4)}</h5>
                            <h3 class="pokemon__card-name">${data.name}</h3>
                            <div class="pokemon__card-types">
                                ${tiposDePokemones(data.types)}
                            </div>
                            <p class="pokemon__weight">Weight: <span>${data.weight}</span></p>
                            <div class="pokemon__card-details">
                                <div class="pokemon__stats">
                                <p class="stats__title">Stats</p>
                                    <p>${stats[0][1]}: ${stats[0][0]}</p>
                                    <p>${stats[1][1]}: ${stats[1][0]}</p>
                                    <p>${stats[2][1]}: ${stats[2][0]}</p>
                                    <p>${stats[3][1]}: ${stats[3][0]}</p>
                                    <p>${stats[4][1]}: ${stats[4][0]}</p>
                                    <p>${stats[5][1]}: ${stats[5][0]}</p>
                                </div>
                            </div>
                            <button class="pokemon__card-close">Close</button>
                        </div>
                    </div>
                `
                pokemonProfileCard.innerHTML = pokemonCard
                pokemonProfileCard.classList.toggle('show')
                console.log(pokemonProfileCard.innerHTML)
                const closeCardButton = document.querySelector('.pokemon__card-close')
                closeCardButton.addEventListener('click', () => {
                    pokemonProfileCard.classList.remove('show')
                })
        })
}




const cargarPokemones = async() => {

    loader.classList.add('loader')
    try{
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}/`)

        if(respuesta.status === 200){
            const datos = await respuesta.json()

            datos.results.forEach(pokemon => {
                const res = fetch(pokemon.url)
                const data = res.then(response => response.json())

                data.then(data => {
                    stats = data.stats.map(stat => {
                        return [stat.base_stat, stat.stat.name]
                    })
                    
                    pokemons += `
                            <div class="pokemon__info">
                                <img class="pokemon__img" src="${data.sprites.other['official-artwork'].front_default}">
                                <h5>N.º${fill(data.id, 4)}</h5>
                                <h3 class="pokemon__name">${data.name}</h3>
                                <div class="pokemon__info-types">
                                ${tiposDePokemones(data.types)}
                                </div>
                            </div>
                            `

                    pokemonList.innerHTML = pokemons
                    
                }).catch(error => {
                    console.log(error)
                }).finally(() => {
                    const pokemonesEnPantalla = document.querySelectorAll('.pokemon .pokemon__info')
                    let ultimoPokemon = pokemonesEnPantalla[pokemonesEnPantalla.length - 1]
                    observador.observe(ultimoPokemon)
                    pokemonesEnPantalla.forEach(pokemons => {
                        pokemons.addEventListener('click', (e) => {
                            e.preventDefault()
                            let pokemonName = e.currentTarget.querySelector('.pokemon__name').textContent
                            for(let pokemon in datos.results){
                                if(datos.results[pokemon].name.match(pokemonName)){
                                    console.log(datos.results[pokemon].url)
                                    pokemonCardsCreator(datos.results[pokemon].url)
                                }
                            }
                        })
                    })
                })
                
            })


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

window.addEventListener('load', () => {
    console.log('finished loading')
})


cargarPokemones()