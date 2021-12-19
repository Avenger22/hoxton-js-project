//-----------------------------------------------------------------------------------------------------------------

// #region 'GLOBAL VARIABLES'
const sectionContainerMenusEl = document.querySelector('section.container-menus')

//these three divs are MODALS, so i use them here as global to acces them everywhere in the app
const userModalEl = document.createElement('div')
userModalEl.setAttribute('class', 'modal-user_container')

const bagModalEl = document.createElement('div')
bagModalEl.setAttribute('class', 'modal-bag_container')
// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'STATE OBJECT'
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

// #endregion

// #region 'FILTER FUNCTIONS'

// #endregion

// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'RENDER FUNCTIONS'

// #region 'RENDER MODALS'
function renderUserModal() {

    const divUserModalEl = document.createElement('div')
    divUserModalEl.setAttribute('class', 'modal-user')

    const headerUserModalEl = document.createElement('div')
    headerUserModalEl.setAttribute('class', 'header-user-modal')

    const divInputUser = document.createElement('div')
    divInputUser.setAttribute('class', 'input-user-modal')

    const divBtnUser = document.createElement('div')
    divBtnUser.setAttribute('class', 'button-user-modal')

    const h3El = document.createElement('h3')
    h3El.textContent = 'Sign In'

    const spanEl1 = document.createElement('span')
    spanEl1.setAttribute('class', 'span-user-1')
    spanEl1.textContent = 'Email:'

    const inputEl1 = document.createElement('input')
    inputEl1.setAttribute('class', 'email-input-user')
    inputEl1.setAttribute('name', 'email')
    inputEl1.setAttribute('required', 'true')
    inputEl1.setAttribute('type', 'email')
    inputEl1.placeholder = 'Enter Email'

    const spanEl2 = document.createElement('span')
    spanEl1.setAttribute('class', 'span-user-2')
    spanEl2.textContent = 'Password:'

    const inputEl2 = document.createElement('input')
    inputEl2.setAttribute('class', 'password-input-user')
    inputEl2.setAttribute('name', 'password')
    inputEl2.setAttribute('required', 'true')
    inputEl2.setAttribute('type', 'password')
    inputEl2.placeholder = 'Enter Password'

    const btnSignInEl = document.createElement('button')
    btnSignInEl.textContent = 'Sign In'

    const btnRemoveEl = document.createElement('button')
    btnRemoveEl.textContent = 'X'

    const formUser = document.createElement('form')
    formUser.setAttribute('class', 'form-user')

    headerUserModalEl.append(h3El)
    divInputUser.append(spanEl1, inputEl1, spanEl2, inputEl2)
    divBtnUser.append(btnSignInEl, btnRemoveEl)
    formUser.append(divInputUser, divBtnUser)
    divUserModalEl.append(headerUserModalEl, formUser)
    userModalEl.append(divUserModalEl)
    sectionMenusEl.append(userModalEl)

    listenToRemoveUser(btnRemoveEl)
    listenToSubmitUser(formUser)

}

function renderBagModal() {

    const divEl3Modal = document.createElement('div')
    divEl3Modal.setAttribute('class', 'modal-3')

    const divHeaderEl = document.createElement('div')
    divHeaderEl.setAttribute('class', 'header-bag')

    const divModalWrapper = document.createElement('div')
    divModalWrapper.setAttribute('class', 'modal-wrapper-3')

    const h3El = document.createElement('h3')
    h3El.textContent = 'Bag'
    divHeaderEl.append(h3El)


    const divItemWrapperEl = document.createElement('div')
    divItemWrapperEl.setAttribute('class', 'wrapper-items-bag')
    divItemWrapperEl.innerHTML = '' //destroy after each rerender then recreate

    for (const item of state.bagItems) {

        const divItemEl = document.createElement('div')
        divItemEl.setAttribute('class', 'item-bag') 

        const imgEl = document.createElement('img')
        imgEl.setAttribute('src', item.image)
        imgEl.setAttribute('alt', '')

        const h4El = document.createElement('h4')
        h4El.textContent = item.name

        const spanEl1 = document.createElement('span')
        spanEl1.setAttribute('class', 'span-1-bag')
        spanEl1.textContent = `Price: ${item.price}`

        //BUG fixed TEMPLATE LITERALS CAUSED UNDEFINED
        const spanEl2 = document.createElement('span')
        spanEl2.setAttribute('class', 'span-2-bag')
        spanEl2.textContent = `Discounted Price: ${item.discountedPrice}` 

        //important to get the quantity of x item with that name passed as argument
        const quantityValue = getQuantityValue(item.name)

        const spanEl3 = document.createElement('span')
        spanEl3.setAttribute('class', 'span-3-bag')
        spanEl3.textContent = `Quantity: ${quantityValue}`

        const btnRemoveItem = document.createElement('button')
        btnRemoveItem.textContent = 'Remove'

        divItemEl.append(imgEl, h4El, spanEl1, spanEl2, spanEl3, btnRemoveItem)
        divItemWrapperEl.append(divItemEl)

        listenToRemoveBagItem(btnRemoveItem, item, divItemEl)

    }

    const divRemovingEl = document.createElement('div')
    divRemovingEl.setAttribute('class', 'removing-bag')

    const btnRemoveModal = document.createElement('button')
    btnRemoveModal.textContent = 'X'

    const btnPay = document.createElement('button')
    btnPay.textContent = 'Pay now ....'

    divRemovingEl.append(btnPay, btnRemoveModal)
    divModalWrapper.append(divHeaderEl, divItemWrapperEl, divRemovingEl)
    divEl3Modal.append(divModalWrapper)
    divEl3.append(divEl3Modal)
    sectionMenusEl.append(divEl3)

    listenToRemoveBag(btnRemoveModal)

}
// #endregion

// #region 'RENDER PAGE HTML'
function renderHeader() {

    const headerMenuEl = document.createElement('header')
    headerMenuEl.setAttribute('class', 'header-menu')

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

    const categoriesButtonEl = document.createElement('button')
    categoriesButtonEl.textContent = 'Categories'

    const iEl = document.createElement('i')
    iEl.setAttribute('class', 'fas fa-arrow-down')

    categoriesButtonEl.append(iEl)

    const searchInputEl = document.createElement('input')
    searchInputEl.setAttribute('type', 'text')
    searchInputEl.setAttribute('name', 'search-product')
    searchInputEl.setAttribute('value', '')
    searchInputEl.setAttribute('placeholder', 'Search for products....')

    const searchButtonEl = document.createElement('button')
    searchButtonEl.setAttribute('id', 'special-button')
    searchButtonEl.textContent = 'Search'

    formWrapperEl.append(categoriesButtonEl, searchInputEl, searchButtonEl)

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

    const ulHeader2El = document.createElement('ul')
    ulHeader2El.setAttribute('class', 'ul-sub-2')

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

    sectionContainerMenusEl.innerHTML = ''

    renderHeader()
    renderMain(state.items)
    renderFooter()

}

function init() {

    render()

     //FETCHING AND STORING DATA FROM SERVER TO STATE both arrays from json server
    getItemsArrayFromServer().then(function (itemsArrayFromServer) {
        state.items = itemsArrayFromServer
        render()
    })

    getUsersArrayFromServer().then(function (usersArrayFromServer) {
        state.users = usersArrayFromServer
        render()
    })

}

// #endregion

// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'APP INIT CALL AND START'
init()
// #endregion

//-----------------------------------------------------------------------------------------------------------------