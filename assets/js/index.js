//-----------------------------------------------------------------------------------------------------------------

// #region 'GLOBAL VARIABLES AND DOM ELEMENTS CATCHER'
const sectionContainerMenusEl = document.querySelector('section.container-menus')

//these three divs are MODALS, so i use them here as global to acces them everywhere in the app
const userModalEl = document.createElement('div')
userModalEl.setAttribute('class', 'modal-user_container')

const bagModalEl = document.createElement('div')
bagModalEl.setAttribute('class', 'modal-bag_container')

let headerSub2CatcherEl = null
let headerCatcherEl = null
let ulSub2CatcherEl = null
// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'STATE OBJECT, STATE MANAGEMENT'
const state = {

    //two important arrays for fetching and udapting the state
    items: [],
    users: [],

    //additional array for items in the bag
    bagItems: [],
    bagItemQuantity: [],

    //super crucial for catching each name and passing it in render in else if, problem is because the filter function had param and passing was hard so this solved
    searchCatcher: [],
    userCatcher: [],

    //checking to show the username after login
    userName: null,
    userShowClass: null,

    userModalClicked: false,
    bagModalClicked: false

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

function listenToUserEvent(userElParam) {
    
    userElParam.addEventListener('click', function(event) {
        event.preventDefault()
        state.userModalClicked = true
        userModalEl.classList.add('show')
        // render()
    })

}

function listenToSubmitUser(formUserElParam) {

    formUserElParam.addEventListener('submit', function(event) {
        event.preventDefault()
        console.log("Submit user is Clicked or sumbit")

        state.userCatcher.pop()
        state.userCatcher.push(getUserCredentialsFromStateFilter(formUserElParam.email.value, formUserElParam.password.value))

        if(state.userCatcher.length === 0) {
            alert('No email or user found with these credentials')
        }

        else {
            alert(`The email is : ${state.userCatcher[0][0].id} and also the password is : ${state.userCatcher[0][0].password}`)
        }

        spanHolderEl.classList.add('show')
        state.userShowClass = 'show'
        state.userName = state.userCatcher[0][0].firstName
        spanHolderEl.textContent = state.userName //fixed this BUG LINKING STATE AND DOM THEN RERENDER

        render()
    })

}

function listenToRemoveUser(btnRemoveElParam) {

    btnRemoveElParam.addEventListener('click', function(event) {
        event.preventDefault()
        state.userModalClicked = false
        userModalEl.classList.remove('show')
        // render()
    })

}


function listenToBagEvent(bagElParam) {
    
    bagElParam.addEventListener('click', function(event) {
        event.preventDefault()
        state.bagModalClicked = true
        bagModalEl.classList.add('show')
        // render()
    })

}

function listenToRemoveBag(buttonElParam) {

    buttonElParam.addEventListener('click', function(event) {
        event.preventDefault()
        state.bagModalClicked = false
        bagModalEl.classList.remove('show')
        // render()
    })

}

function listenToSubmitItemToBag(buttonItemParam, itemObjectParam) {

    buttonItemParam.addEventListener('click', function(event) {

        event.preventDefault()
        console.log("item button is Clicked, so now its ready to go to bag from page")

        state.stockShowClass = 'show'
        stockHolderEl.classList.add(state.stockShowClass) //linking DOM AND STATE

        itemObjectParam.stock -= 1
        stockHolderEl.textContent = state.stockSpanValue //linking DON AND STATE, when rerendered the value works not negative etc

        if (itemObjectParam.stock < 0) {
            itemObjectParam.stock = 0 //removing negative values from span and stock ruining the state object
        }

        else {
            state.stockSpanValue += 1
        }

        let quantityBag = 0
        quantityBag++

        const itemNameValue = itemObjectParam.name
        const objectBag = {
            itemName: itemNameValue,
            quantity: quantityBag
        } 

        //so here i just put the entry name of the bag item with quantity 1 so when i have to calculate i just filter and find the length based on the name
        state.bagItemQuantity.push(objectBag)
        state.bagItems.push(itemObjectParam)
        state.bagItems = [...new Set(state.bagItems)] //removes duplicate from an aray uses set also spread operator

        render()

    })
    
}

function listenToRemoveBagItem(btnRemoveItemElParam, itemObjectParam, divItemParam) {

    btnRemoveItemElParam.addEventListener('click', function(event) {

        event.preventDefault()
        divItemParam.remove() //remove from html the dom item

        //update the state another array, here we change state bag array from FILTER
        state.bagItems = getDeletedUsersFromBag(itemObjectParam.name)

        const quantity = getQuantityValue(itemObjectParam.name)
        itemObjectParam.stock += quantity
        state.stockSpanValue -= quantity
        stockHolderEl.textContent = state.stockSpanValue

        state.bagItemQuantity = getDeletedUsersFromBagQuantity(itemObjectParam.name)
        render() //rerender the app

    })


}

function getStockSpanEl(stockElParam) {
    return stockElParam
}
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
    sectionContainerMenusEl.append(userModalEl)

    //event listener function call for clicking the modal to show up or adding something there from form to render etc
    listenToRemoveUser(btnRemoveEl)
    listenToSubmitUser(formUser)

}

function renderBagModal() {

    const divBagModalEl = document.createElement('div')
    divBagModalEl.setAttribute('class', 'modal-bag')

    const divBagHeaderEl = document.createElement('div')
    divBagHeaderEl.setAttribute('class', 'header-bag')

    const divBagModalWrapper = document.createElement('div')
    divBagModalWrapper.setAttribute('class', 'modal-bag_wrapper')

    const h3El = document.createElement('h3')
    h3El.textContent = 'Bag'
    divBagHeaderEl.append(h3El)


    const divBagItemWrapperEl = document.createElement('div')
    divBagItemWrapperEl.setAttribute('class', 'wrapper-items-bag')
    divBagItemWrapperEl.innerHTML = '' 
    //destroy after each rerender then recreate

    for (const item of state.bagItems) {

        const divBagItemEl = document.createElement('div')
        divItemEl.setAttribute('class', 'item-bag') 

        const imgEl = document.createElement('img')
        imgEl.setAttribute('src', item.image)
        imgEl.setAttribute('alt', '')

        const h4El = document.createElement('h4')
        h4El.textContent = item.name

        const spanEl1 = document.createElement('span')
        spanEl1.setAttribute('class', 'span-1-bag')
        spanEl1.textContent = `Price: ${item.price}`

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

        divBagItemEl.append(imgEl, h4El, spanEl1, spanEl2, spanEl3, btnRemoveItem)
        divBagItemWrapperEl.append(divBagItemEl)

        //function event listner for better code structure this calls it and uses the arguments to do tasks
        listenToRemoveBagItem(btnRemoveItem, item, divBagItemEl)

    }

    const divRemovingEl = document.createElement('div')
    divRemovingEl.setAttribute('class', 'removing-bag')

    const btnRemoveModal = document.createElement('button')
    btnRemoveModal.textContent = 'X'

    const btnPay = document.createElement('button')
    btnPay.textContent = 'Pay now ....'

    divRemovingEl.append(btnPay, btnRemoveModal)
    divBagModalWrapper.append(divBagHeaderEl, divBagItemWrapperEl, divRemovingEl)
    divBagModalEl.append(divBagModalWrapper)
    bagModalEl.append(divBagModalEl)
    sectionContainerMenusEl.append(bagModalEl)

    //Function call with arguments for event listener
    listenToRemoveBag(btnRemoveModal)

}

// #endregion

// #region 'RENDER PAGE HTML'
function renderHeader() {

    const headerMenuEl = document.createElement('header')
    headerMenuEl.setAttribute('class', 'header-menu')

    headerCatcherEl = headerMenuEl //this makes sure when rendered i catch this DOM el and save it in global variables

    //creating header-sub-1
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

    //event listener for modals
    listenToUserEvent(userButton)
    listenToBagEvent(shoppingBagButton)

    //catching some elements wich i want to use to other functions for stock and bag calculations
    // spanHolderEl = getSpanEl(spanUl2_2)
    // stockHolderEl = getStockSpanEl(spanUl2_3)

    ulHeader1El.append(liLogoEl, formWrapperEl, userButton, shoppingBagButton)
    subHeaderDiv.append(ulHeader1El)

    //creating header-sub-2
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
    userModalEl.innerHTML = ''
    bagModalEl.innerHTML = ''
    
    //rerendering the HTML page after each render call
    renderHeader()
    renderMain(state.items) //here we pass the state.items from server wich we saved here to loop and render
    renderFooter()
    renderUserModal()
    renderBagModal()

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

    // render()

}

// #endregion

// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'APP INIT CALL AND START'
init()
// #endregion

//-----------------------------------------------------------------------------------------------------------------