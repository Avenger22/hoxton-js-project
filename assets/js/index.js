//-----------------------------------------------------------------------------------------------------------------

// #region 'GLOBAL VARIABLES AND DOM ELEMENTS CATCHER'
const sectionContainerMenusEl = document.querySelector('section.container-menus')
let headerSub2CatcherEl = null
let headerCatcherEl = null
let ulSub2CatcherEl = null
// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'STATE OBJECT, STATE MANAGEMENT'
const state = {

    //two important arrays for fetching and udapting the state
    items: [],
    users: []

}

// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'SERVER FUNCTIONS'
function getItemsArrayFromServer() {

    return fetch('http://localhost:3000/items')        
        .then(function (response) 
        {
            return response.json()
        })

}

function getUsersArrayFromServer() {

    return fetch('http://localhost:3000/users')        
        .then(function (response) 
        {
            return response.json()
        })

}
// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'HELPER FUNCTIONS'

// #region 'EVENT LISTENER FUNCTIONS
window.onscroll = function() {

    if (document.body.scrollTop >= 280 || document.documentElement.scrollTop >= 280) {
        headerCatcherEl.style.display = 'grid'
        headerCatcherEl.style.gridTemplateRows = '1fr'
        headerSub2CatcherEl.style.display = 'none'
        headerCatcherEl.style.height = '100px'
    } 
    
    else {
        headerCatcherEl.style.display = 'grid'
        headerCatcherEl.style.gridTemplateRows = '0.5fr 0.5fr'
        headerCatcherEl.style.height = '160px'
        headerSub2CatcherEl.style.display = 'grid'

        ulSub2CatcherEl.style.display = 'grid'
        ulSub2CatcherEl.style.gridTemplateColumns = 'repeat(6,150px)'
        ulSub2CatcherEl.style.gridGap = '20px'
        ulSub2CatcherEl.style.placeItems = 'center'
        ulSub2CatcherEl.style.borderTop = '2px solid #fff'
    }

}
// #endregion

// #region 'FILTER FUNCTIONS'

// #endregion

// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'RENDER FUNCTIONS'

// #region 'RENDER MODALS'

// #endregion

// #region 'RENDER PAGE HTML'
function renderHeader() {

    const headerMenuEl = document.createElement('header')
    headerMenuEl.setAttribute('class', 'header-menu')

    headerCatcherEl = headerMenuEl //this makes sure when rendered i catch this DOM el and save it in global variables

    const subHeaderDiv = document.createElement('div')
    subHeaderDiv.setAttribute('class', 'header-sub-1')

    const ulHeader1El = document.createElement('ul')
    ulHeader1El.setAttribute('class', 'ul-sub-1')

    const liLogoEl = document.createElement('li')
    liLogoEl.setAttribute('id', 'logo')

    const logoLinkEl = document.createElement('a')
    logoLinkEl.setAttribute('href', '#')
    logoLinkEl.textContent = 'AlbVitaFitness'

    liLogoEl.append(logoLinkEl)

    const buttonImageEl = document.createElement('button')
    buttonImageEl.setAttribute('class', 'button-image')

    const iconLiEl = document.createElement('li')

    const hamburgerIconEl = document.createElement('img')
    hamburgerIconEl.setAttribute('src', './assets/icons/hamburger.png')
    hamburgerIconEl.setAttribute('alt', '')

    iconLiEl.append(hamburgerIconEl)
    buttonImageEl.append(iconLiEl)

    const formWrapperEl = document.createElement('form')
    formWrapperEl.setAttribute('class', 'form-wrapper')

    // #region 'CREATING SELECT MENU'
    const categoriesSelectEl = document.createElement('select')
    categoriesSelectEl.setAttribute('name', 'filter-by-categories')
    categoriesSelectEl.setAttribute('id', 'filter-by-categories')

    const optionCategories1El = document.createElement('option')
    optionCategories1El.setAttribute('value', 'categories')
    optionCategories1El.textContent = 'Categories'

    const optionCategories2El = document.createElement('option')
    optionCategories2El.setAttribute('value', 'multivitamins')
    optionCategories2El.textContent = 'MultiVitamins and essentials minerals'

    const optionCategories3El = document.createElement('option')
    optionCategories3El.setAttribute('value', 'preWorkout')
    optionCategories3El.textContent = 'Pre-Workout'

    const optionCategories4El = document.createElement('option')
    optionCategories4El.setAttribute('value', 'proteins')
    optionCategories4El.textContent = 'Proteins'

    const optionCategories5El = document.createElement('option')
    optionCategories5El.setAttribute('value', 'testosteroneBoosters')
    optionCategories5El.textContent = 'Testosterone Boosters'

    const optionCategories6El = document.createElement('option')
    optionCategories6El.setAttribute('value', 'weight-gainers')
    optionCategories6El.textContent = 'Weigh Gainers'

    const optionCategories7El = document.createElement('option')
    optionCategories7El.setAttribute('value', 'aminoacids')
    optionCategories7El.textContent = 'Aminoacids'

    const optionCategories8El = document.createElement('option')
    optionCategories8El.setAttribute('value', 'creatines')
    optionCategories8El.textContent = 'Creatines'

    const optionCategories9El = document.createElement('option')
    optionCategories9El.setAttribute('value', 'weightBurners')
    optionCategories9El.textContent = 'Weigh Burners'

    categoriesSelectEl.append(optionCategories1El, optionCategories2El, optionCategories3El, optionCategories4El,
        optionCategories5El, optionCategories6El, optionCategories7El, optionCategories8El, optionCategories9El)

    // #endregion

    const searchInputEl = document.createElement('input')
    searchInputEl.setAttribute('type', 'text')
    searchInputEl.setAttribute('name', 'search-product')
    searchInputEl.setAttribute('value', '')
    searchInputEl.setAttribute('placeholder', 'Search for products....')

    const searchButtonEl = document.createElement('button')
    searchButtonEl.setAttribute('id', 'special-button')
    searchButtonEl.textContent = 'Search'

    formWrapperEl.append(categoriesSelectEl, searchInputEl, searchButtonEl)

    const userButton = document.createElement('button')
    userButton.setAttribute('class', 'button-image')

    const userIconEl = document.createElement('img')
    userIconEl.setAttribute('src', './assets/icons/user.png')
    userIconEl.setAttribute('alt', '')

    userButton.append(userIconEl)

    const shoppingBagButton = document.createElement('button')
    shoppingBagButton.setAttribute('class', 'button-image')

    const shoppingBagIconEl = document.createElement('img')
    shoppingBagIconEl.setAttribute('src', './assets/icons/shopping-bag.png')
    shoppingBagIconEl.setAttribute('alt', '')

    shoppingBagButton.append(shoppingBagIconEl)

    ulHeader1El.append(liLogoEl, buttonImageEl, formWrapperEl, userButton, shoppingBagButton)

    subHeaderDiv.append(ulHeader1El)

    const subHeaderDiv2 = document.createElement('div')
    subHeaderDiv2.setAttribute('class', 'header-sub-2')

    headerSub2CatcherEl = subHeaderDiv2

    const ulHeader2El = document.createElement('ul')
    ulHeader2El.setAttribute('class', 'ul-sub-2')

    ulSub2CatcherEl = ulHeader2El //catching the DOM ELEMENT to global VARIABLE

    const liHomeEl = document.createElement('li')

    const homeLinkEl = document.createElement('a')
    homeLinkEl.setAttribute('href', '#')
    homeLinkEl.textContent = 'Home'

    liHomeEl.append(homeLinkEl)

    const liProductsEl = document.createElement('li')

    const productsLinkEl = document.createElement('a')
    productsLinkEl.setAttribute('href', '#')
    productsLinkEl.textContent = 'Products'

    liProductsEl.append(productsLinkEl)

    const liOffersEl = document.createElement('li')

    const offersLinkEl = document.createElement('a')
    offersLinkEl.setAttribute('href', '#')
    offersLinkEl.textContent = 'Offers'

    liOffersEl.append(offersLinkEl)

    const liAboutEl = document.createElement('li')

    const aboutLinkEl = document.createElement('a')
    aboutLinkEl.setAttribute('href', '#')
    aboutLinkEl.textContent = 'About Us'

    liAboutEl.append(aboutLinkEl)

    const liBlogEl = document.createElement('li')

    const blogLinkEl = document.createElement('a')
    blogLinkEl.setAttribute('href', '#')
    blogLinkEl.textContent = 'Blog'

    liBlogEl.append(blogLinkEl)

    const liContactEl = document.createElement('li')

    const contactLinkEl = document.createElement('a')
    contactLinkEl.setAttribute('href', '#')
    contactLinkEl.textContent = 'Contact'

    liContactEl.append(contactLinkEl)

    ulHeader2El.append(liHomeEl, liProductsEl, liOffersEl, liAboutEl, liBlogEl, liContactEl)

    subHeaderDiv2.append(ulHeader2El)

    headerMenuEl.append(subHeaderDiv, subHeaderDiv2)

    sectionContainerMenusEl.append(headerMenuEl)

}

function renderMain(itemsArray) {

    const mainEl = document.createElement('main')
    mainEl.setAttribute('class', 'main-menu')

    const ribbon1El = document.createElement('div')
    ribbon1El.setAttribute('class', 'main-ribbon-1')

    const spanWrapperEl = document.createElement('div')
    spanWrapperEl.setAttribute('class', 'span-wrapper')

    const homeSpanEl = document.createElement('span')
    homeSpanEl.setAttribute('id', 'special-home')
    homeSpanEl.textContent = 'Home'

    const spanEl = document.createElement('span')
    spanEl.textContent = '/'

    const productSpan = document.createElement('span')
    productSpan.textContent = 'Products'

    spanWrapperEl.append(homeSpanEl, spanEl, productSpan)

    ribbon1El.append(spanWrapperEl)

    const ribbon2El = document.createElement('div')
    ribbon2El.setAttribute('class', 'main-ribbon-2')

    const boxWrapperEl = document.createElement('div')
    boxWrapperEl.setAttribute('class', 'box-wrapper-1')

    const numberSpanEl = document.createElement('span')
    numberSpanEl.setAttribute('class', 'number-span')
    numberSpanEl.textContent = '150'

    const foundSpanEl = document.createElement('span')
    foundSpanEl.textContent = 'Products found'

    boxWrapperEl.append(numberSpanEl, foundSpanEl)

    const filterFormEl = document.createElement('form')
    filterFormEl.setAttribute('id', 'filter-by-sort')
    filterFormEl.setAttribute('autocomplete', 'off')

    const filterLabel = document.createElement('label')
    filterLabel.setAttribute('for', 'filter-by-type')

    const h3El = document.createElement('h3')
    h3El.textContent = 'Sorting Options:'

    filterLabel.append(h3El)

    const selectEl = document.createElement('select')
    selectEl.setAttribute('name', 'filter-by-sort')
    selectEl.setAttribute('id', 'filter-by-sort')

    const option1El = document.createElement('option')
    option1El.setAttribute('value', 'deffault')
    option1El.textContent = 'Sorting Deffault'

    const option2El = document.createElement('option')
    option2El.setAttribute('value', 'price-asc')
    option2El.textContent = 'Sort by price ascending'

    const option3El = document.createElement('option')
    option3El.setAttribute('value', 'price-desc')
    option3El.textContent = 'Sort by price descending'

    const option4El = document.createElement('option')
    option4El.setAttribute('value', 'date-asc')
    option4El.textContent = 'Sort by oldest'

    const option5El = document.createElement('option')
    option5El.setAttribute('value', 'name-asc')
    option5El.textContent = 'Sort by name ascending'

    const option6El = document.createElement('option')
    option6El.setAttribute('value', 'name-desc')
    option6El.textContent = 'Sort by name descending'

    selectEl.append(option1El, option2El, option3El, option4El, option5El, option6El)
    filterFormEl.append(filterLabel, selectEl)
    ribbon2El.append(boxWrapperEl, filterFormEl)


    const itemsDivEl = document.createElement('div')
    itemsDivEl.setAttribute('class', 'items-container')

    const itemsWrapper = document.createElement('div')
    itemsWrapper.setAttribute('class', 'store-items-wrapper')

    // #region 'RENDERING MAIN ITEM IN A FOR LOOP'
    for (const item of itemsArray) {

        const storeItem = document.createElement('div')
        storeItem.setAttribute('class', 'store-item')

        const productImgEl = document.createElement('img')
        productImgEl.setAttribute('src', item.image)
        productImgEl.setAttribute('alt', '')

        const productNameEl = document.createElement('h2')
        productNameEl.textContent = item.name

        const divWrapperEl = document.createElement('div')
        divWrapperEl.setAttribute('class', 'span-wrapper-item')

        const span1El = document.createElement('span')
        span1El.setAttribute('class', 'span-1')
        span1El.textContent = `price: ${item.price}`

        const span2El = document.createElement('span')
        span2El.setAttribute('class', 'span-2')
        span2El.textContent = `Discounted Price: ${item.price}`

        divWrapperEl.append(span1El, span2El)

        const cartButton = document.createElement('button')
        cartButton.textContent = 'Add to cart'

        storeItem.append(productImgEl, productNameEl, divWrapperEl, cartButton)
        itemsWrapper.append(storeItem)

    }

    itemsDivEl.append(itemsWrapper)
    // #endregion

    const paginationContainerEl = document.createElement('div')
    paginationContainerEl.setAttribute('class', 'pagination-container')

    const paginationWrapperEl = document.createElement('div')
    paginationWrapperEl.setAttribute('class', 'pagination-wrapper')

    const button1El = document.createElement('button')

    const span_1 = document.createElement('span')
    span_1.textContent = '1'

    button1El.append(span_1)

    const button2El = document.createElement('button')

    const span_2 = document.createElement('span')
    span_2.textContent = '2'

    button2El.append(span_2)

    const button3El = document.createElement('button')

    const span_3 = document.createElement('span')
    span_3.textContent = '3'

    button3El.append(span_3)

    const button4El = document.createElement('button')

    const span_4 = document.createElement('span')
    span_4.textContent = '....'

    button4El.append(span_4)

    const button6El = document.createElement('button')

    const span_6 = document.createElement('span')
    span_6.textContent = '6'

    button6El.append(span_6)

    const paginationButton = document.createElement('button')
    paginationButton.setAttribute('id', 'special-button-pagination')

    const nextPageSpan = document.createElement('span')
    nextPageSpan.textContent = 'Next Page'

    paginationButton.append(nextPageSpan)

    paginationWrapperEl.append(button1El, button2El, button3El, button4El, button6El, paginationButton)

    paginationContainerEl.append(paginationWrapperEl)

    const asideWrapperEl = document.createElement('div')
    asideWrapperEl.setAttribute('class', 'aside-wrapper')

    const asideContainerEl = document.createElement('aside')
    asideContainerEl.setAttribute('class', 'aside-container-1')

    const asideUl = document.createElement('ul')
    asideUl.setAttribute('class', 'ul-aside')

    const categoriesLi = document.createElement('li')
    categoriesLi.setAttribute('id', 'special-aside')
    categoriesLi.textContent = 'Categories'

    const multivitaminsLi = document.createElement('li')

    const multivitaminsLink = document.createElement('a')
    multivitaminsLink.setAttribute('href', '')
    multivitaminsLink.textContent = 'Multivitamins & essentials minerals'

    multivitaminsLi.append(multivitaminsLink)

    const workoutsLi = document.createElement('li')

    const workoutsLink = document.createElement('a')
    workoutsLink.setAttribute('href', '')
    workoutsLink.textContent = 'Pre-Workouts'

    workoutsLi.append(workoutsLink)

    const proteinsLi = document.createElement('li')

    const proteinsLink = document.createElement('a')
    proteinsLink.setAttribute('href', '')
    proteinsLink.textContent = 'Proteins'

    proteinsLi.append(proteinsLink)

    const boostersLi = document.createElement('li')

    const boostersLink = document.createElement('a')
    boostersLink.setAttribute('href', '')
    boostersLink.textContent = 'Testosterone Boosters'

    boostersLi.append(boostersLink)

    const weightLi = document.createElement('li')

    const weightLink = document.createElement('a')
    weightLink.setAttribute('href', '')
    weightLink.textContent = 'Weight gainers'

    weightLi.append(weightLink)

    const aminoacidsLi = document.createElement('li')

    const aminoacidsLink = document.createElement('a')
    aminoacidsLink.setAttribute('href', '')
    aminoacidsLink.textContent = 'Aminoacids'

    aminoacidsLi.append(aminoacidsLink)

    const creatinesLi = document.createElement('li')

    const creatinesLink = document.createElement('a')
    creatinesLink.setAttribute('href', '')
    creatinesLink.textContent = 'Creatines'

    creatinesLi.append(creatinesLink)

    const weightBurnerLi = document.createElement('li')

    const weightBurnerLink = document.createElement('a')
    weightBurnerLink.setAttribute('href', '')
    weightBurnerLink.textContent = 'Weight Burner'

    weightBurnerLi.append(weightBurnerLink)

    asideUl.append(categoriesLi, multivitaminsLi, workoutsLi, proteinsLi, boostersLi, weightLi, aminoacidsLi, creatinesLi, weightBurnerLi)

    asideContainerEl.append(asideUl)

    asideWrapperEl.append(asideContainerEl)

    mainEl.append(ribbon1El, ribbon2El, itemsDivEl, paginationContainerEl, asideWrapperEl)

    sectionContainerMenusEl.append(mainEl)
}

function renderFooter() {

    const footerEl = document.createElement('footer')
    footerEl.setAttribute('class', 'footer-menu')

    const spanEl = document.createElement('span')
    spanEl.textContent = '© 2021 Fitness Albania Group | AlbVitaFitness | All rights reserved'

    footerEl.append(spanEl)

    sectionContainerMenusEl.append(footerEl)

}
// #endregion

// #region 'RENDERING AND LOGIC ON IT'
function render() {

    //destroy everything then recreate each time you render
    sectionContainerMenusEl.innerHTML = ''
    
    //rerendering the HTML page after each render call
    renderHeader()
    renderMain(state.items) //here we pass the state.items from server wich we saved here to loop and render
    renderFooter()

}

function init() {

     //FETCHING AND STORING DATA FROM SERVER TO STATE both arrays from json server
    getItemsArrayFromServer().then(function (itemsArrayFromServer) {
        state.items = itemsArrayFromServer
        render()
    })

    getUsersArrayFromServer().then(function (usersArrayFromServer) {
        state.users = usersArrayFromServer
        render()
    })

    render()

}

// #endregion

// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'APP INIT CALL AND START'
init()
// #endregion

//-----------------------------------------------------------------------------------------------------------------