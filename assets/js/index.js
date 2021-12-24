//-----------------------------------------------------------------------------------------------------------------

// #region 'GLOBAL VARIABLES AND DOM ELEMENTS CATCHER'
const sectionContainerMenusEl = document.querySelector('section.container-menus')

//these three divs are MODALS, so i use them here as global to acces them everywhere in the app
const userModalEl = document.createElement('div')
userModalEl.setAttribute('class', 'modal-user_container')

const bagModalEl = document.createElement('div')
bagModalEl.setAttribute('class', 'modal-bag_container')

const payModalEl = document.createElement('div')
payModalEl.setAttribute('class', 'modal-pay-container')

const signUpModalEl = document.createElement('div')
signUpModalEl.setAttribute('class', 'modal-sign_up-container')

const popUpModalEl = document.createElement('div')
popUpModalEl.setAttribute('class', 'modal-pop_up-container')

const aboutUsModalEl = document.createElement('div')
aboutUsModalEl.setAttribute('class', 'modal-about_us-container')

let headerSub2CatcherEl = null
let headerCatcherEl = null
let ulSub2CatcherEl = null
let paginationHolderEl = null
let productImgElHolder = null

let initialStateItems = []

let mainHolderEl = null
let itemHolderObject = null

let globalItemsToDisplay = []

let spanUserHolderEl = null //this is important to hold the stock span EL when its rendered so i can acces it and use it in other parts of app
let spanBagHolderEl = null //same as above
// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'STATE OBJECT, STATE MANAGEMENT'
const state = {

    //two important arrays for fetching and updating the state
    items: [],
    users: [],

    //additional array for items in the bag
    bagItems: [],
    bagItemQuantity: [],

    //super crucial for catching each name and passing it in render in else if, problem is because the filter function had param and passing was hard so this solved
    userCatcher: [],

    //checking to show the username after login USER SPAN
    userName: null,
    userShowClass: null,

    //here checking to show the span in the page BAG SPAN
    stockSpanValue: null,
    stockShowClass: null,

    selectedModal: '',
    popUpShowed: false,

    selectedPage: 'mainMenu',

    selectType: 'Default',

    totalAmount: 0,

    //selected category
    category: 'Default',

    //searched item
    search: '',

    // searched item based on category
    searchOnCategory: 'Default',

    //experimental for pagination from js not server
    page: 1,
    perPage: 10

}

// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'SERVER FUNCTIONS'
function getItemsArrayFromServer() {

    return fetch('http://localhost:3000/items')
        .then(function (response) {
            return response.json()
        })

}

function getUsersArrayFromServer() {

    return fetch('http://localhost:3000/users')
        .then(function (response) {
            return response.json()
        })

}

function updateStock(item) {
    return fetch(`http://localhost:3000/items/${item.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
}

function createUser(name, lastname, email, password) {
    return fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: name,
            lastname: lastname,
            id: email,
            password: password,
            bag: []
        })
    }).then(function (resp) {
        return resp.json()
    })

}

function subscribe(email) {
    return fetch('http://localhost:3000/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email
        })
    }).then(function (resp) {
        return resp.json()
    })
}

function getItems() {
    
    //FETCHING AND STORING DATA FROM SERVER TO STATE both arrays from json server
    getItemsArrayFromServer().then(function (itemsArrayFromServer) {
        state.items = itemsArrayFromServer
        initialStateItems = state.items
        render()
    })

}

function getUsers() {

    getUsersArrayFromServer().then(function (usersArrayFromServer) {
        state.users = usersArrayFromServer
        render()
    })

}
// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'HELPER FUNCTIONS'

// #region 'EVENT LISTENER FUNCTIONS

// #region 'event listener for page navbar or modal auto pop'
window.onscroll = function () {

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

window.onload = function () {

    setTimeout(function () {

        popUpModalEl.classList.add('show');
        state.selectedModal = 'popUp'
        render()

    }, 5000);

}

function listenToPreviousBtn(prevBtnEl) {

    prevBtnEl.addEventListener('click', function () {
        if (state.page > 1) {
            state.page--
            render()
        }
    })

}

function listenToNextBtn(nextBtnEl) {

    nextBtnEl.addEventListener('click', function () {
        if (state.page * state.perPage < state.items.length) {
            state.page++
            render()
        }
    })

}
// #endregion

// #region 'event listener for MODALS'

// #region 'event listener for user
function listenToUserEvent(userElParam) {

    userElParam.addEventListener('click', function (event) {
        event.preventDefault()
        state.selectedModal = 'user'
        userModalEl.classList.add('show')
        render()
    })

}

function listenToSubmitUser(formUserElParam) {

    formUserElParam.addEventListener('submit', function (event) {

        event.preventDefault()
        console.log("Submit user is Clicked or sumbit")

        state.userCatcher.pop()
        state.userCatcher.push(getUserCredentialsFromStateFilter(formUserElParam['email'].value, formUserElParam['password'].value))

        if (state.userCatcher.length === 0) {
            alert('No email or user found with these credentials')
        }

        else {
            alert(`The email is : ${state.userCatcher['0'][0].id} and also the password is : ${state.userCatcher['0'][0].password}`)
        }

        spanUserHolderEl.classList.add('show')
        state.userShowClass = 'show'

        state.userName = state.userCatcher['0'][0].firstName
        spanUserHolderEl.textContent = state.userName //LINKING STATE AND DOM THEN RERENDER

        render() //rerender after state update

    })

}

function listenToRemoveUser(btnRemoveElParam) {

    btnRemoveElParam.addEventListener('click', function (event) {
        event.preventDefault()

        userModalEl.classList.remove('show')
        state.selectedModal = ''
        render()

    })

}
// #endregion

// #region 'event listener for popup
function listenToRemovePopUp(btnRemovePopElParam) {

    btnRemovePopElParam.addEventListener('click', function (event) {
        event.preventDefault()

        popUpModalEl.classList.remove('show')
        state.selectedModal = ''
        render()
    })

}
// #endregion

// #region 'event listener for signup'
function listenToGoToSignUp(btnSignUpElParam) {

    btnSignUpElParam.addEventListener('click', function (event) {
        event.preventDefault()

        userModalEl.classList.remove('show')
        signUpModalEl.classList.add('show')
        state.selectedModal = 'signUp'
        render()

    })
}

function listenToRemoveSignUpModal(btnRemoveSignUpElParam) {

    btnRemoveSignUpElParam.addEventListener('click', function (event) {
        event.preventDefault()
        signUpModalEl.classList.remove('show')

        state.selectedModal = 'user'
        userModalEl.classList.add('show')

        render()
    })

}
// #endregion

// #region 'event listener for bag'
function listenToBagEvent(bagElParam) {

    bagElParam.addEventListener('click', function (event) {
        event.preventDefault()

        state.selectedModal = 'bag'
        bagModalEl.classList.add('show')
        render()
    })

}

function listenToAboutUsEvent(aboutLinkEl) {

    aboutLinkEl.addEventListener('click', function () {

        state.selectedModal = 'aboutUs'
        aboutUsModalEl.classList.add('show')
        render()
    })

}

function listenToRemoveBag(buttonElParam) {

    buttonElParam.addEventListener('click', function (event) {
        event.preventDefault()
        bagModalEl.classList.remove('show')
        state.selectedModal = ''
        render()
    })

}

function listenToSubmitItemToBag(buttonItemParam, itemObjectParam) {

    buttonItemParam.addEventListener('click', function (event) {

        if (state.userCatcher.length > 0) {

            event.preventDefault()
            event.stopPropagation() //fixed the bug when button is clicked the div is clicked worked

            console.log("item button is Clicked, so now its ready to go to bag from page")

            if (itemObjectParam.stock === 0) {
                event.preventDefault()
                event.stopPropagation() //fixed the bug when button is clicked the div is clicked worked

                console.log('We dont add items to bag cause no stock')
                alert('We dont add items to bag cause no stock')
                itemObjectParam.stock = 0
            }

            else {

                event.preventDefault()
                event.stopPropagation() //fixed the bug when button is clicked the div is clicked worked

                state.stockShowClass = 'show'
                spanBagHolderEl.classList.add(state.stockShowClass) //linking DOM AND STATE

                spanBagHolderEl.textContent = state.stockSpanValue //linking DON AND STATE, when rerendered the value works not negative etc

                if (itemObjectParam.stock < 0) {
                    itemObjectParam.stock = 0 //removing negative values from span and stock ruining the state object
                }

                else {
                    state.stockSpanValue += 1
                }

                let quantityBag = 0
                quantityBag++

                const itemNameValue = itemObjectParam.name
                const itemPrice = itemObjectParam.price
                const itemDiscountPrice = itemObjectParam.discountPrice

                const objectBag = {
                    itemName: itemNameValue,
                    quantity: quantityBag,
                    price: itemPrice,
                    discountPrice: itemDiscountPrice
                }

                //so here i just put the entry name of the bag item with quantity 1 so when i have to calculate i just filter and find the length based on the name
                state.bagItemQuantity.push(objectBag)

                let quantityAdding = 0
                for (const element of state.bagItemQuantity) {
                    if (element.quantity === 1) quantityAdding += 1
                }

                itemObjectParam.quantity = Number(quantityAdding)
                state.bagItems.push(itemObjectParam)
                state.bagItems = [...new Set(state.bagItems)] //removes duplicate from an aray uses set also spread operator

                calculateTotalAddingAmount()
                render()

            }

        }

        else {

            event.preventDefault()
            event.stopPropagation() //fixed the bug when button is clicked the div is clicked worked
            alert('Account required to add products to cart')
            
        }

    })

}

function listenToRemoveBagItem(btnRemoveItemElParam, itemObjectParam, divItemParam) {

    btnRemoveItemElParam.addEventListener('click', function (event) {

        event.preventDefault()
        divItemParam.remove() //remove from html the dom item

        //update the state another array, here we change state bag array from FILTER
        state.bagItems = getDeletedItemsFromBag(itemObjectParam.name)

        const quantity = getQuantityValue(itemObjectParam.name)

        state.stockSpanValue -= quantity
        spanBagHolderEl.textContent = state.stockSpanValue

        state.bagItemQuantity = getDeletedItemsFromBagQuantity(itemObjectParam.name) //change the state
        calculateTotalRemovingAmount()
        calculateTotalAddingAmount()

        render() //rerender the app

    })


}
// #endregion

// #region 'event listener for pay'
function listenToGoToPay(btnPayParam) {

    btnPayParam.addEventListener('click', function (event) {
        event.preventDefault()
        bagModalEl.classList.remove('show')
        payModalEl.classList.add('show')
        state.selectedModal = 'pay'
        render()
    })

}

function listenToRemovePayModal(btnRemovePayElParam) {

    btnRemovePayElParam.addEventListener('click', function (event) {
        event.preventDefault()
        payModalEl.classList.remove('show')

        state.selectedModal = 'bag'
        bagModalEl.classList.add('show')
        render()
    })

}
// #endregion

// #endregion

// #region 'event listener for categories'
function listenToClickItem(storeItemParam, itemParam) {

    storeItemParam.addEventListener('click', function (event) {

        event.preventDefault()
        console.log('Listen to click item function activated')

        state.selectedPage = 'mainMenuItem' //change state
        itemHolderObject = itemParam
        render() 

    })

}

function listenToGoBackBtn(goBackBtnElParam) {

    goBackBtnElParam.addEventListener('click', function (event) {

        event.preventDefault()
        state.selectedPage = 'mainMenu'
        render()

    })

}


function listenToProteinsCategory(proteinsLink) {

    proteinsLink.addEventListener('click', function () {
        state.category = 'Proteins'
        render()
    })

}

function listenToDefaultCategory(showAllLink) {
    showAllLink.addEventListener('click', function () {
        state.category = 'Default'
        render()
    })
}

function listenToMultivitaminsCategory(multivitaminsLink) {

    multivitaminsLink.addEventListener('click', function () {
        state.category = 'Multivitamins'
        render()
    })

}

function listenToPreWorkoutsCategory(workoutsLink) {

    workoutsLink.addEventListener('click', function () {
        state.category = 'Pre-Workouts'
        render()
    })

}

function listenToAminoacidsCategory(aminoacidsLink) {

    aminoacidsLink.addEventListener('click', function () {
        state.category = 'Aminoacids'
        render()
    })

}

function listenToWeightBurnerCategory(weightBurnerLink) {

    weightBurnerLink.addEventListener('click', function () {
        state.category = 'Weight-Burner'
        render()
    })

}

function listenToCreatineCategory(creatinesLink) {

    creatinesLink.addEventListener('click', function () {
        state.category = 'Creatine'
        render()
    })

}

function listenToTestosteroneBoostersCategory(boostersLink) {

    boostersLink.addEventListener('click', function () {
        state.category = 'Testosterone-Boosters'
        render()
    })

}

function listenToWeightGainersCategory(weightLink) {

    weightLink.addEventListener('click', function () {
        state.category = 'Weight-Gainers'
        render()
    })

}

function listenToOffersNav(liOffersEl) {

    liOffersEl.addEventListener('click', function (event) {
        event.preventDefault()
        state.category = 'Offers'
        render()
    })

}


function listenToSelectChanges(selectElParam) {

    selectElParam.addEventListener('change', function () {
        state.selectType = selectElParam.value
        render()
    })

}
// #endregion

// #region 'event listener for search'
function listenToSearch(formWrapperEl) {

    formWrapperEl.addEventListener('submit', function (event) {
        event.preventDefault()
        state.search = formWrapperEl['search-product'].value
        render()
    })

}

function listenToSelectChangesSearch(categoriesSelectEl) {

    categoriesSelectEl.addEventListener('change', function (event) {

        event.preventDefault()

        if (state.search === '') {
            alert('you cant select based on categories without a search string')
            state.searchOnCategory = 'Default'
            render()
        }

        else {
            state.searchOnCategory = categoriesSelectEl.value
            render()
        }

    })

}
// #endregion

// #endregion

// #region 'FILTER FUNCTIONS'

// #region 'filter modals'
function getBagArrayByNameFromState(objectNameParam) {
    let quantityBasedOnName = []
    return quantityBasedOnName = state.bagItemQuantity.filter((object) => object.itemName === objectNameParam)

}


function getDeletedItemsFromBagQuantity(itemObjectNameParam) {

    let bagQuantityArrayFiltered = []
    return bagQuantityArrayFiltered = state.bagItemQuantity.filter((item) => item.itemName !== itemObjectNameParam)

}

function getDeletedItemsFromBag(itemObjectNameParam) {

    let bagArrayFiltered = []
    //my mistake BUG was here so the argument was object.name i mistaken as object.name.name and filter didnt show anythig wront
    return bagArrayFiltered = state.bagItems.filter((item) => item.name !== itemObjectNameParam)

}


function getQuantityValue(objectNameParam) {

    //this passes the name of the object in the filter to give me array of object filtered
    //by its name, now i just save that array of objects and then i just .length and i have the quantity based on that item
    const arrayLength = getBagArrayByNameFromState(objectNameParam)
    const quantityValueFinal = arrayLength.length
    return quantityValueFinal

}

function getUserCredentialsFromStateFilter(emailParam, passwordParam) {

    let userCredentialsArray = []
    return userCredentialsArray = state.users.filter((item) => item.id === emailParam && item.password === passwordParam)

}


function getBagSpanEl(bagSpanElParam) {
    return bagSpanElParam
}

function getUserSpanEl(userSpanElParam) {
    return userSpanElParam
}
// #endregion

// #region 'filter categories'
function getProteinProducts() {
    return state.items.filter(function (item) {
        return item.type === 'proteins'
    })
}

function getPreWorkoutProducts() {
    return state.items.filter(function (item) {
        return item.type === 'pre-workouts'
    })
}

function getWeightBurnerProducts() {
    return state.items.filter(function (item) {
        return item.type === 'weight-burner'
    })
}

function getAminoacidsProducts() {
    return state.items.filter(function (item) {
        return item.type === 'aminoacids'
    })
}

function getMultivitaminsProducts() {
    return state.items.filter(function (item) {
        return item.type === 'multivitamins'
    })
}

function getWeightGainersProducts() {
    return state.items.filter(function (item) {
        return item.type === 'weight-gainers'
    })
}

function getCreatineProducts() {
    return state.items.filter(function (item) {
        return item.type === 'creatine'
    })
}

function getTestosteroneBoostersProducts() {
    return state.items.filter(function (item) {
        return item.type === 'testosterone-boosters'
    })
}

function getOffersFromState() {
    return state.items.filter((item) => item.hasOwnProperty('discountPrice'))
}

//THIS DOES EVERYTHING CONDITIONALS THE MOST IMPORTaNT FUNCTION
function showItems() {

    let itemsToDisplay = []
    let itemToDisplaySorted = []

    // #region 'Conditionals for ---search select--- based on cagetories with searched item'
    if (state.search === '' && state.category === 'Default' && state.selectType === 'Default') {
        itemsToDisplay = state.items
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getUnSortedArrayState()
    }

    else if (state.search === '' && state.category === 'Offers' && state.selectType === 'Default') {
        itemsToDisplay = state.items
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getOffersFromState()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Default' && state.selectType === 'Default') {
        itemToDisplaySorted = state.items
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    // #region 'search ---default category on search--- with sorting'
    else if (state.search !== '' && state.searchOnCategory === 'Default' && state.selectType === 'price-asc') {
        itemsToDisplay = state.items
        itemToDisplaySorted = searchByName(itemsToDisplay)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Default' && state.selectType === 'price-desc') {
        itemsToDisplay = state.items
        itemToDisplaySorted = searchByName(itemsToDisplay)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Default' && state.selectType === 'name-asc') {
        itemsToDisplay = state.items
        itemToDisplaySorted = searchByName(itemsToDisplay)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Default' && state.selectType === 'name-desc') {
        itemsToDisplay = state.items
        itemToDisplaySorted = searchByName(itemsToDisplay)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Default' && state.selectType === 'date-asc') {
        itemsToDisplay = state.items
        itemToDisplaySorted = searchByName(itemsToDisplay)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Default' && state.selectType === 'date-desc') {
        itemsToDisplay = state.items
        itemToDisplaySorted = searchByName(itemsToDisplay)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'search ---proteins--- with sorting'
    else if (state.search !== '' && state.searchOnCategory === 'Proteins' && state.selectType === 'Default') {
        itemToDisplaySorted = getProteinProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'Proteins' && state.selectType === 'price-asc') {
        itemsToDisplay = getProteinProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Proteins' && state.selectType === 'price-desc') {
        itemsToDisplay = getProteinProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Proteins' && state.selectType === 'name-asc') {
        itemsToDisplay = getProteinProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Proteins' && state.selectType === 'name-desc') {
        itemsToDisplay = getProteinProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Proteins' && state.selectType === 'date-asc') {
        itemsToDisplay = getProteinProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Proteins' && state.selectType === 'date-desc') {
        itemsToDisplay = getProteinProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'search ---creatines--- with sorting'
    else if (state.search !== '' && state.searchOnCategory === 'Creatines' && state.selectType === 'Default') {
        itemToDisplaySorted = getCreatineProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'Creatines' && state.selectType === 'price-asc') {
        itemsToDisplay = getCreatineProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Creatines' && state.selectType === 'price-desc') {
        itemsToDisplay = getCreatineProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Creatines' && state.selectType === 'name-asc') {
        itemsToDisplay = getCreatineProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Creatines' && state.selectType === 'name-desc') {
        itemsToDisplay = getCreatineProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Creatines' && state.selectType === 'date-asc') {
        itemsToDisplay = getCreatineProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Creatines' && state.selectType === 'date-desc') {
        itemsToDisplay = getCreatineProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'search ---multivitamins--- with sorting'
    else if (state.search !== '' && state.searchOnCategory === 'MultiVitamins' && state.selectType === 'Default') {
        itemToDisplaySorted = getMultivitaminsProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'MultiVitamins' && state.selectType === 'price-asc') {
        itemsToDisplay = getMultivitaminsProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'MultiVitamins' && state.selectType === 'price-desc') {
        itemsToDisplay = getMultivitaminsProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'MultiVitamins' && state.selectType === 'name-asc') {
        itemsToDisplay = getMultivitaminsProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'MultiVitamins' && state.selectType === 'name-desc') {
        itemsToDisplay = getMultivitaminsProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'MultiVitamins' && state.selectType === 'date-asc') {
        itemsToDisplay = getMultivitaminsProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'MultiVitamins' && state.selectType === 'date-desc') {
        itemsToDisplay = getMultivitaminsProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateDesc()
    }
    //  #endregion

    // #region 'search ---Weight-Gainers--- with sorting'
    else if (state.search !== '' && state.searchOnCategory === 'WeightGainers' && state.selectType === 'Default') {
        itemToDisplaySorted = getWeightGainersProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightGainers' && state.selectType === 'price-asc') {
        itemsToDisplay = getWeightGainersProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightGainers' && state.selectType === 'price-desc') {
        itemsToDisplay = getWeightGainersProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightGainers' && state.selectType === 'name-asc') {
        itemsToDisplay = getWeightGainersProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightGainers' && state.selectType === 'name-desc') {
        itemsToDisplay = getWeightGainersProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightGainers' && state.selectType === 'date-asc') {
        itemsToDisplay = getWeightGainersProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightGainers' && state.selectType === 'date-desc') {
        itemsToDisplay = getWeightGainersProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'search ---Pre-Workouts--- with sorting'
    else if (state.search !== '' && state.searchOnCategory === 'PreWorkouts' && state.selectType === 'Default') {
        itemToDisplaySorted = getPreWorkoutProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'PreWorkouts' && state.selectType === 'price-asc') {
        itemsToDisplay = getPreWorkoutProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'PreWorkouts' && state.selectType === 'price-desc') {
        itemsToDisplay = getPreWorkoutProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'PreWorkouts' && state.selectType === 'name-asc') {
        itemsToDisplay = getPreWorkoutProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'PreWorkouts' && state.selectType === 'name-desc') {
        itemsToDisplay = getPreWorkoutProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'PreWorkouts' && state.selectType === 'date-asc') {
        itemsToDisplay = getPreWorkoutProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'PreWorkouts' && state.selectType === 'date-desc') {
        itemsToDisplay = getPreWorkoutProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'search ---Testosterone-Boosters--- with sorting'
    else if (state.search !== '' && state.searchOnCategory === 'testosteroneBoosters' && state.selectType === 'Default') {
        itemToDisplaySorted = getTestosteroneBoostersProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'testosteroneBoosters' && state.selectType === 'price-asc') {
        itemsToDisplay = getTestosteroneBoostersProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'testosteroneBoosters' && state.selectType === 'price-desc') {
        itemsToDisplay = getTestosteroneBoostersProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'testosteroneBoosters' && state.selectType === 'name-asc') {
        itemsToDisplay = getTestosteroneBoostersProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'testosteroneBoosters' && state.selectType === 'name-desc') {
        itemsToDisplay = getTestosteroneBoostersProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'testosteroneBoosters' && state.selectType === 'date-asc') {
        itemsToDisplay = getTestosteroneBoostersProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'testosteroneBoosters' && state.selectType === 'date-desc') {
        itemsToDisplay = getTestosteroneBoostersProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'search ---Aminoacids--- with sorting'
    else if (state.search !== '' && state.searchOnCategory === 'Aminoacids' && state.selectType === 'Default') {
        itemToDisplaySorted = getAminoacidsProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'Aminoacids' && state.selectType === 'price-asc') {
        itemsToDisplay = getAminoacidsProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Aminoacids' && state.selectType === 'price-desc') {
        itemsToDisplay = getAminoacidsProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Aminoacids' && state.selectType === 'name-asc') {
        itemsToDisplay = getAminoacidsProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Aminoacids' && state.selectType === 'name-desc') {
        itemsToDisplay = getAminoacidsProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Aminoacids' && state.selectType === 'date-asc') {
        itemsToDisplay = getAminoacidsProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'Aminoacids' && state.selectType === 'date-desc') {
        itemsToDisplay = getAminoacidsProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateDesc()
    }
    //  #endregion

    // #region 'search ---WeightBurners--- with sorting'
    else if (state.search !== '' && state.searchOnCategory === 'WeightBurners' && state.selectType === 'Default') {
        itemToDisplaySorted = getWeightBurnerProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightBurners' && state.selectType === 'price-asc') {
        itemsToDisplay = getWeightBurnerProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightBurners' && state.selectType === 'price-desc') {
        itemsToDisplay = getWeightBurnerProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightBurners' && state.selectType === 'name-asc') {
        itemsToDisplay = getWeightBurnerProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightBurners' && state.selectType === 'name-desc') {
        itemsToDisplay = getWeightBurnerProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightBurners' && state.selectType === 'date-asc') {
        itemsToDisplay = getWeightBurnerProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightBurners' && state.selectType === 'date-desc') {
        itemsToDisplay = getWeightBurnerProducts()
        itemToDisplaySorted = itemsToDisplay

        itemToDisplaySorted = searchByName(itemToDisplaySorted)
        globalItemsToDisplay = itemToDisplaySorted

        itemToDisplaySorted = getSortedByDateDesc()
    }
    //  #endregion

    else if (state.search !== '' && state.searchOnCategory === 'MultiVitamins') {
        itemToDisplaySorted = getMultivitaminsProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'Creatines') {
        itemToDisplaySorted = getCreatineProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightBurners') {
        itemToDisplaySorted = getWeightBurnerProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'Aminoacids') {
        itemToDisplaySorted = getAminoacidsProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'PreWorkouts') {
        itemToDisplaySorted = getPreWorkoutProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'testosteroneBoosters') {
        itemToDisplaySorted = getTestosteroneBoostersProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }

    else if (state.search !== '' && state.searchOnCategory === 'WeightGainers') {
        itemToDisplaySorted = getWeightGainersProducts()
        itemToDisplaySorted = searchByName(itemToDisplaySorted)
    }
    // #endregion


    // #region 'CONDITIONALS FOR ---DEFAULT--- AND THEIR SORTING OPTIONS
    else if (state.category === 'Default' && state.selectType === 'Default') {
        itemsToDisplay = state.items
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getUnSortedArrayState()
    }

    else if (state.category === 'Default' && state.selectType === 'price-asc' || state.selectType === 'price-asc' && state.category === 'Default') {
        itemsToDisplay = state.items
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === 'Default' && state.selectType === 'price-desc') {
        itemsToDisplay = state.items
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === 'Default' && state.selectType === 'name-asc') {
        itemsToDisplay = state.items
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === 'Default' && state.selectType === 'name-desc') {
        itemsToDisplay = state.items
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === 'Default' && state.selectType === 'date-asc') {
        itemsToDisplay = state.items
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === 'Default' && state.selectType === 'date-desc') {
        itemsToDisplay = state.items
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'CONDITIONALS FOR ---OFFERS---  AND THEIR SORTING OPTIONS
    else if (state.category === 'Offers' && state.selectType === 'Default') {
        itemsToDisplay = initialStateItems
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getOffersFromState()
    }

    else if (state.category === 'Offers' && state.selectType === 'price-asc') {
        itemsToDisplay = getOffersFromState()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === 'Offers' && state.selectType === 'price-desc') {
        itemsToDisplay = getOffersFromState()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === 'Offers' && state.selectType === 'name-asc') {
        itemsToDisplay = getOffersFromState()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === 'Offers' && state.selectType === 'name-desc') {
        itemsToDisplay = getOffersFromState()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === 'Offers' && state.selectType === 'date-asc') {
        itemsToDisplay = getOffersFromState()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === 'Offers' && state.selectType === 'date-desc') {
        itemsToDisplay = getOffersFromState()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'CONDITIONALS FOR ---PROTEINS--- AND THEIR SORTING OPTIONS
    else if (state.category === 'Proteins' && state.selectType === 'Default' || state.selectType === 'Default' && state.category === 'Default') {
        itemToDisplaySorted = getProteinProducts()
    }

    else if (state.category === 'Proteins' && state.selectType === 'price-asc' || state.selectType === 'price-asc' && state.category === 'Proteins') {
        itemsToDisplay = getProteinProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === 'Proteins' && state.selectType === 'price-desc' || state.selectType === 'price-desc' && state.category === 'Proteins') {
        itemsToDisplay = getProteinProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === 'Proteins' && state.selectType === 'name-asc' || state.selectType === 'name-asc' && state.category === 'Proteins') {
        itemsToDisplay = getProteinProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === 'Proteins' && state.selectType === 'name-desc' || state.selectType === 'name-desc' && state.category === 'Proteins') {
        itemsToDisplay = getProteinProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === 'Proteins' && state.selectType === 'date-asc' || state.selectType === 'date-asc' && state.category === 'Proteins') {
        itemsToDisplay = getProteinProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === 'Proteins' && state.selectType === 'date-desc' || state.selectType === 'date-desc' && state.category === 'Proteins') {
        itemsToDisplay = getProteinProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'CONDITIONALS FOR ---MULTIVITAMINS--- AND THEIR SORTING OPTIONS
    else if (state.category === 'Multivitamins' && state.selectType === 'Default' || state.selectType === 'Default' && state.category === 'Multivitamins') {
        itemToDisplaySorted = getMultivitaminsProducts()
    }

    else if (state.category === 'Multivitamins' && state.selectType === 'price-asc' || state.selectType === 'price-asc' && state.category === 'MultiVitamins') {
        itemsToDisplay = getMultivitaminsProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === 'Multivitamins' && state.selectType === 'price-desc' || state.selectType === 'price-desc' && state.category === 'MultiVitamins') {
        itemsToDisplay = getMultivitaminsProducts()
        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === 'Multivitamins' && state.selectType === 'name-asc' || state.selectType === 'name-asc' && state.category === 'MultiVitamins') {
        itemsToDisplay = getMultivitaminsProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === 'Multivitamins' && state.selectType === 'name-desc' || state.selectType === 'name-desc' && state.category === 'MultiVitamins') {
        itemsToDisplay = getMultivitaminsProducts()
        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === 'Multivitamins' && state.selectType === 'date-asc' || state.selectType === 'date-asc' && state.category === 'MultiVitamins') {
        itemsToDisplay = getMultivitaminsProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === 'Multivitamins' && state.selectType === 'date-desc' || state.selectType === 'date-desc' && state.category === 'MultiVitamins') {
        itemsToDisplay = getMultivitaminsProducts()
        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'CONDITIONALS FOR ---PRE-WORKOUT--- AND THEIR SORTING OPTIONS
    else if (state.category === 'Pre-Workouts' && state.selectType === 'Default') {
        itemToDisplaySorted = getPreWorkoutProducts()
    }

    else if (state.category === 'Pre-Workouts' && state.selectType === 'price-asc') {
        itemsToDisplay = getPreWorkoutProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === 'Pre-Workouts' && state.selectType === 'price-desc') {
        itemsToDisplay = getPreWorkoutProducts()
        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === 'Pre-Workouts' && state.selectType === 'name-asc') {
        itemsToDisplay = getPreWorkoutProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === 'Pre-Workouts' && state.selectType === 'name-desc') {
        itemsToDisplay = getPreWorkoutProducts()
        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === 'Pre-Workouts' && state.selectType === 'date-asc') {
        itemsToDisplay = getPreWorkoutProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === 'Pre-Workouts' && state.selectType === 'date-desc') {
        itemsToDisplay = getPreWorkoutProducts()
        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'CONDITIONALS FOR ---WEIGHT-GAINERS--- AND THEIR SORTING OPTIONS
    else if (state.category === 'Weight-Gainers' && state.selectType === 'Default') {
        itemToDisplaySorted = getWeightGainersProducts()
    }

    else if (state.category === 'Weight-Gainers' && state.selectType === 'price-asc') {
        itemsToDisplay = getWeightGainersProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === 'Weight-Gainers' && state.selectType === 'price-desc') {
        itemsToDisplay = getWeightGainersProducts()
        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === 'Weight-Gainers' && state.selectType === 'name-asc') {
        itemsToDisplay = getWeightGainersProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === 'Weight-Gainers' && state.selectType === 'name-desc') {
        itemsToDisplay = getWeightGainersProducts()
        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === 'Weight-Gainers' && state.selectType === 'date-asc') {
        itemsToDisplay = getWeightGainersProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === 'Weight-Gainers' && state.selectType === 'date-desc') {
        itemsToDisplay = getWeightGainersProducts()
        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'CONDITIONALS FOR ---CREATINE--- AND THEIR SORTING OPTIONS
    else if (state.category === 'Creatine' && state.selectType === 'Default') {
        itemToDisplaySorted = getCreatineProducts()
    }

    else if (state.category === 'Creatine' && state.selectType === 'price-asc') {
        itemsToDisplay = getCreatineProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === 'Creatine' && state.selectType === 'price-desc') {
        itemsToDisplay = getCreatineProducts()
        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === 'Creatine' && state.selectType === 'name-asc') {
        itemsToDisplay = getCreatineProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === 'Creatine' && state.selectType === 'name-desc') {
        itemsToDisplay = getCreatineProducts()
        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === 'Creatine' && state.selectType === 'date-asc') {
        itemsToDisplay = getCreatineProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === 'Creatine' && state.selectType === 'date-desc') {
        itemsToDisplay = getCreatineProducts()
        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'CONDITIONALS FOR ---AMINOACIDS--- AND THEIR SORTING OPTIONS
    else if (state.category === 'Aminoacids' && state.selectType === 'Default') {
        itemToDisplaySorted = getAminoacidsProducts()
    }

    else if (state.category === 'Aminoacids' && state.selectType === 'price-asc') {
        itemsToDisplay = getAminoacidsProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === 'Aminoacids' && state.selectType === 'price-desc') {
        itemsToDisplay = getAminoacidsProducts()
        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === 'Aminoacids' && state.selectType === 'name-asc') {
        itemsToDisplay = getAminoacidsProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === 'Aminoacids' && state.selectType === 'name-desc') {
        itemsToDisplay = getAminoacidsProducts()
        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === 'Aminoacids' && state.selectType === 'date-asc') {
        itemsToDisplay = getAminoacidsProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === 'Aminoacids' && state.selectType === 'date-desc') {
        itemsToDisplay = getAminoacidsProducts()
        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'CONDITIONALS FOR ---WEIGHT-BURNERS--- AND THEIR SORTING OPTIONS
    else if (state.category === 'Weight-Burner' && state.selectType === 'Default') {
        itemToDisplaySorted = getWeightBurnerProducts()
    }

    else if (state.category === 'Weight-Burner' && state.selectType === 'price-asc') {
        itemsToDisplay = getWeightBurnerProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === 'Weight-Burner' && state.selectType === 'price-desc') {
        itemsToDisplay = getWeightBurnerProducts()
        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === 'Weight-Burner' && state.selectType === 'name-asc') {
        itemsToDisplay = getWeightBurnerProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === 'Weight-Burner' && state.selectType === 'name-desc') {
        itemsToDisplay = getWeightBurnerProducts()
        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === 'Weight-Burner' && state.selectType === 'date-asc') {
        itemsToDisplay = getWeightBurnerProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === 'Weight-Burner' && state.selectType === 'date-desc') {
        itemsToDisplay = getWeightBurnerProducts()
        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'CONDITIONALS FOR ---TESTOSTERONE-BOOSTERS--- AND THEIR SORTING OPTIONS
    else if (state.category === 'Testosterone-Boosters' && state.selectType === 'Default') {
        itemToDisplaySorted = getTestosteroneBoostersProducts()
    }

    else if (state.category === 'Testosterone-Boosters' && state.selectType === 'price-asc') {
        itemsToDisplay = getTestosteroneBoostersProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === 'Testosterone-Boosters' && state.selectType === 'price-desc') {
        itemsToDisplay = getTestosteroneBoostersProducts()
        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === 'Testosterone-Boosters' && state.selectType === 'name-asc') {
        itemsToDisplay = getTestosteroneBoostersProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === 'Testosterone-Boosters' && state.selectType === 'name-desc') {
        itemsToDisplay = getTestosteroneBoostersProducts()
        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === 'Testosterone-Boosters' && state.selectType === 'date-asc') {
        itemsToDisplay = getTestosteroneBoostersProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === 'Testosterone-Boosters' && state.selectType === 'date-desc') {
        itemsToDisplay = getTestosteroneBoostersProducts()
        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // return itemToDisplaySorted.slice(
    //     (state.page - 1) * state.perPage,
    //     state.page * state.perPage
    // )

    return itemToDisplaySorted

}
// #endregion

// #region 'filter search'
function searchByName(itemToDisplaySorted) {

    return itemToDisplaySorted.filter(function (item) {
        return item.name.toLowerCase().includes(state.search.toLowerCase())
    })

}
// #endregion

// #region 'filter other'
//experimental for pagination
function sliceArrayFromStateToDisplay(stateArrayParam) {

    return stateArrayParam.slice(
        (state.page - 1) * state.perPage,
        state.page * state.perPage
    )

}

function checkDateEnteredNew(itemDateParam, newSpanElParam, storeItemDivParam) {

    const date1 = Date.parse('2021/11/1')
    const date2 = Date.parse(itemDateParam)

    if (date2 > date1) {
        storeItemDivParam.append(newSpanElParam)
        storeItemDivParam.style.gridTemplateRows = '0.1fr 0.5fr 0.1fr 0.2fr 40px'
    }

}

function calculateTotalAddingAmount() {

    state.totalAmount = 0
    for (const item of state.bagItemQuantity) {

        let numberValueDiscount = Number(item.discountPrice)
        let numberValue = Number(item.price)

        if (item.discountPrice !== undefined) {
            state.totalAmount = state.totalAmount + numberValueDiscount
            render()
        }

        else if (item.discountPrice === undefined) {
            state.totalAmount = state.totalAmount + numberValue
            render()
        }

    }

}

function calculateTotalRemovingAmount() {

    if (state.bagItemQuantity.length === 1 || state.bagItemQuantity.length === 0) {
        state.totalAmount = 0
        render()
    }

    else {

        for (const item of state.bagItemQuantity) {

            let numberValueDiscount = Number(item.discountPrice)
            let numberValue = Number(item.price)

            if (item.discountPrice === undefined) {
                state.totalAmount = state.totalAmount - numberValue
                console.log(state.totalAmount)
                render()
            }

            else if (item.discountPrice !== undefined) {
                state.totalAmount = state.totalAmount - numberValueDiscount
                render()
            }

        }

    }

}
// #endregion

// #region 'filter sorting'
function getUnSortedArrayState() {

    let unSorted = []
    return unSorted = globalItemsToDisplay

}

function getSortedByPriceAsc() {

    return globalItemsToDisplay.sort((a, b) => (a.price > b.price) ? 1 : (a.price === b.price) ? ((a.name > b.name) ? 1 : -1) : -1)

}

function getSortedByPriceDesc() {

    return getSortedByPriceAsc().reverse()

}

function getSortedByNameAsc() {

    return globalItemsToDisplay.sort((a, b) => (a.name > b.name) ? 1 : (a.name === b.name) ? ((a.price > b.price) ? 1 : -1) : -1)

}

function getSortedByNameDesc() {

    return getSortedByNameAsc().reverse()

}

function getSortedByDateAsc() {

    return globalItemsToDisplay.sort((a, b) => (Date.parse(a.date) > Date.parse(b.date)) ? 1 : (Date.parse(a.date) === Date.parse(b.date)) ? ((a.name > b.name) ? 1 : -1) : -1)

}

function getSortedByDateDesc() {

    return getSortedByDateAsc().reverse()

}
// #endregion

// #endregion

// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'RENDER FUNCTIONS'

// #region 'RENDER MODALS'
function renderModals() {

    if (state.selectedModal === 'aboutUs') {
        renderAboutUsModal()
    }

    else if (state.selectedModal === 'popUp') {
        renderPopUpModal()
    }

    else if (state.selectedModal === 'pay') {
        renderPayModal()
    }

    else if (state.selectedModal === 'signUp') {
        renderSignUpModal()
    }

    else if (state.selectedModal === 'bag') {
        renderBagModal()
    }

    else if (state.selectedModal === 'user') {
        renderUserModal()
    }

}

function renderUserModal() {

    userModalEl.innerHTML = ''

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
    spanEl2.setAttribute('class', 'span-user-2')
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

    const divSignUpEl = document.createElement('div')
    divSignUpEl.setAttribute('class', 'sign-up-div')

    const spanSignUpEl = document.createElement('span')
    spanSignUpEl.setAttribute('class', 'span-sign-up')
    spanSignUpEl.textContent = 'If you have not an account please Sign Up'

    const btnSignUpEl = document.createElement('button')
    btnSignUpEl.textContent = 'Sign Up'

    divSignUpEl.append(spanSignUpEl, btnSignUpEl)

    divUserModalEl.append(headerUserModalEl, formUser, divSignUpEl)
    userModalEl.append(divUserModalEl)

    sectionContainerMenusEl.append(userModalEl)

    //event listener function call for clicking the modal to show up or adding something there from form to render etc
    listenToRemoveUser(btnRemoveEl)
    listenToSubmitUser(formUser)

    listenToGoToSignUp(btnSignUpEl)

}

function renderBagModal() {

    bagModalEl.innerHTML = ''

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
        divBagItemEl.setAttribute('class', 'item-bag')

        const imgEl = document.createElement('img')
        imgEl.setAttribute('src', item.image)
        imgEl.setAttribute('alt', '')

        const h4El = document.createElement('h4')
        h4El.textContent = item.name

        const spanEl1 = document.createElement('span')
        spanEl1.setAttribute('class', 'span-1-bag')
        spanEl1.textContent = `Price: $${item.price}`

        const spanEl2 = document.createElement('span')
        spanEl2.setAttribute('class', 'span-2-bag')
        spanEl2.textContent = `Discounted Price: $${item.discountPrice}`

        //important to get the quantity of x item with that name passed as argument
        const quantityValue = getQuantityValue(item.name)

        const spanEl3 = document.createElement('span')
        spanEl3.setAttribute('class', 'span-3-bag')
        spanEl3.textContent = `Quantity: ${quantityValue}`

        const btnRemoveItem = document.createElement('button')
        btnRemoveItem.textContent = 'Remove bag item'
        btnRemoveItem.addEventListener('click', function () {
            item.stock += quantityValue
            updateStock({ id: item.id, stock: item.stock })
            render()
        })

        if (item.hasOwnProperty('discountPrice')) {

            divBagItemEl.append(imgEl, h4El, spanEl1, spanEl2, spanEl3, btnRemoveItem)
            divBagItemWrapperEl.append(divBagItemEl)

        }

        else {

            divBagItemEl.append(imgEl, h4El, spanEl1, spanEl3, btnRemoveItem)
            divBagItemWrapperEl.append(divBagItemEl)

        }

        //function event listner for better code structure this calls it and uses the arguments to do tasks
        listenToRemoveBagItem(btnRemoveItem, item, divBagItemEl)

    }

    const divRemovingEl = document.createElement('div')
    divRemovingEl.setAttribute('class', 'removing-bag')

    const btnRemoveModal = document.createElement('button')
    btnRemoveModal.textContent = 'X'

    // calculateTotalAmount() //experimental

    const btnPay = document.createElement('button')
    btnPay.textContent = `Pay now .... $${state.totalAmount}`

    divRemovingEl.append(btnPay, btnRemoveModal)
    divBagModalWrapper.append(divBagHeaderEl, divBagItemWrapperEl, divRemovingEl)

    divBagModalEl.append(divBagModalWrapper)
    bagModalEl.append(divBagModalEl)

    sectionContainerMenusEl.append(bagModalEl)

    //Function call with arguments for event listener
    listenToRemoveBag(btnRemoveModal)
    listenToGoToPay(btnPay)

}

function renderPopUpModal() {

    popUpModalEl.innerHTML = ''

    const divPopUpModalEl = document.createElement('div')
    divPopUpModalEl.setAttribute('class', 'modal-pop_up')

    const spanPopEl = document.createElement('span')
    spanPopEl.setAttribute('class', 'span-pop-up')
    spanPopEl.textContent = 'If you want latest news about our shop please subscribe below'

    const divWrapperSubs = document.createElement('div')
    divWrapperSubs.setAttribute('class', 'wrapper-subs')

    const btnPopEl = document.createElement('button')
    btnPopEl.textContent = 'Subscribe'

    const inputPopEl = document.createElement('input')
    inputPopEl.setAttribute('name', 'pop-input')
    inputPopEl.setAttribute('required', '')
    inputPopEl.setAttribute('type', 'email')

    const removePopBtnEl = document.createElement('button')
    removePopBtnEl.textContent = 'X'

    divWrapperSubs.append(spanPopEl, inputPopEl, btnPopEl)
    divPopUpModalEl.append(divWrapperSubs, removePopBtnEl)

    popUpModalEl.append(divPopUpModalEl)
    sectionContainerMenusEl.append(popUpModalEl)

    btnPopEl.addEventListener('click', function (event) {
        event.preventDefault()
        subscribe(inputPopEl.value)
        alert('The newsletter is sended to your email')
    })

    listenToRemovePopUp(removePopBtnEl)

}

function renderSignUpModal() {

    signUpModalEl.innerHTML = ''

    const divSignUpModalEl = document.createElement('div')
    divSignUpModalEl.setAttribute('class', 'modal-sign_up')

    const formSignUpEl = document.createElement('form')
    formSignUpEl.setAttribute('class', 'signUp-form')

    const labelNameSignUpEl = document.createElement('label')
    labelNameSignUpEl.textContent = 'Name: '

    const nameSignUpEl = document.createElement('input')
    nameSignUpEl.setAttribute('name', 'name-signUp')
    nameSignUpEl.setAttribute('type', 'text')
    nameSignUpEl.setAttribute('placeholder', 'Enter name:')
    nameSignUpEl.setAttribute('required', '')

    const labelLastNameSignUpEl = document.createElement('label')
    labelLastNameSignUpEl.textContent = 'Last Name '

    const lastnameSignUpEl = document.createElement('input')
    lastnameSignUpEl.setAttribute('name', 'lastname-signUp')
    lastnameSignUpEl.setAttribute('type', 'text')
    lastnameSignUpEl.setAttribute('placeholder', 'Enter last name:')
    lastnameSignUpEl.setAttribute('required', '')

    const labelEmailSignUpEl = document.createElement('label')
    labelEmailSignUpEl.textContent = 'Email: '

    const emailSignUpEl = document.createElement('input')
    emailSignUpEl.setAttribute('type', 'email')
    emailSignUpEl.setAttribute('name', 'email-signUp')
    emailSignUpEl.setAttribute('required', '')
    emailSignUpEl.setAttribute('placeholder', 'Enter Email:')

    const labelPasswordSignUpEl = document.createElement('label')
    labelPasswordSignUpEl.textContent = 'Password: '

    const passwordSignUpEl = document.createElement('input')
    passwordSignUpEl.setAttribute('type', 'password')
    passwordSignUpEl.setAttribute('name', 'password-signUp')
    passwordSignUpEl.setAttribute('required', '')
    passwordSignUpEl.setAttribute('placeholder', 'Enter password:')

    const btnSignUp = document.createElement('button')
    btnSignUp.textContent = 'Sign Up'

    const btnRemoveSignUp = document.createElement('button')
    btnRemoveSignUp.textContent = 'X'

    formSignUpEl.append(labelNameSignUpEl, nameSignUpEl, labelLastNameSignUpEl, lastnameSignUpEl, labelEmailSignUpEl, emailSignUpEl,
        labelPasswordSignUpEl, passwordSignUpEl, btnSignUp, btnRemoveSignUp)

    divSignUpModalEl.append(formSignUpEl)

    signUpModalEl.append(divSignUpModalEl)
    sectionContainerMenusEl.append(signUpModalEl)

    btnSignUp.addEventListener('click', function (event) {
        event.preventDefault()

        createUser(nameSignUpEl.value, lastnameSignUpEl.value, emailSignUpEl.value, passwordSignUpEl.value).then(function (user) {
            state.users.push(user)
        })
        alert('We are sending the verification code to the email')
    })

    listenToRemoveSignUpModal(btnRemoveSignUp)

}

function renderPayModal() {

    payModalEl.innerHTML = ''

    const divPayModalEl = document.createElement('div')
    divPayModalEl.setAttribute('class', 'modal-pay')

    const formPayEl = document.createElement('form')
    formPayEl.setAttribute('class', 'form-pay')

    const h4PayEl = document.createElement('h4')
    h4PayEl.textContent = 'Payment plan: 24$ per month'

    const spanPayEl = document.createElement('span')
    spanPayEl.textContent = 'Free trial you will not be charged for 30 days'

    const inputPayEl1 = document.createElement('input')
    inputPayEl1.setAttribute('type', 'text')
    inputPayEl1.setAttribute('id', 'input-pay-1')
    inputPayEl1.setAttribute('name', 'name-pay')
    inputPayEl1.setAttribute('required', '')
    inputPayEl1.placeholder = 'Name on card:'

    const inputPayEl2 = document.createElement('input')
    inputPayEl2.setAttribute('type', 'text')
    inputPayEl2.setAttribute('id', 'input-pay-2')
    inputPayEl2.setAttribute('name', 'number-pay')
    inputPayEl2.setAttribute('required', '')
    inputPayEl2.placeholder = 'Number:'

    const inputPayEl3 = document.createElement('input')
    inputPayEl3.setAttribute('type', 'date')
    inputPayEl3.setAttribute('id', 'input-pay-3')
    inputPayEl3.setAttribute('name', 'date-pay')
    inputPayEl3.setAttribute('required', '')
    inputPayEl3.placeholder = 'Date:'

    const inputPayEl4 = document.createElement('input')
    inputPayEl4.setAttribute('type', 'text')
    inputPayEl4.setAttribute('id', 'input-pay-4')
    inputPayEl4.setAttribute('name', 'cvv-pay')
    inputPayEl4.setAttribute('required', '')
    inputPayEl4.placeholder = 'CVV:'

    const payBtnEl = document.createElement('button')
    payBtnEl.setAttribute('id', 'button-pay-1')
    payBtnEl.textContent = 'Pay Now'

    const btnPaywrapper = document.createElement('div')
    btnPaywrapper.setAttribute('class', 'btn-pay-wrapper')

    const removePayBtnEl = document.createElement('button')
    removePayBtnEl.setAttribute('id', 'button-pay-2')
    removePayBtnEl.textContent = 'X'

    btnPaywrapper.append(payBtnEl, removePayBtnEl)
    formPayEl.append(h4PayEl, spanPayEl, inputPayEl1,
        inputPayEl2, inputPayEl3, inputPayEl4, btnPaywrapper)

    divPayModalEl.append(formPayEl)

    payModalEl.append(divPayModalEl)
    sectionContainerMenusEl.append(payModalEl)

    payBtnEl.addEventListener('click', function (event) {
        event.preventDefault()
        alert('Now the payment details will be sended to email')
    })

    listenToRemovePayModal(removePayBtnEl)

}

function renderAboutUsModal() {

    aboutUsModalEl.innerHTML = ''

    const divAboutUsModalEl = document.createElement('div')
    divAboutUsModalEl.setAttribute('class', 'modal-about-us')

    const spanAboutEl = document.createElement('span')
    spanAboutEl.setAttribute('class', 'span-about')
    spanAboutEl.textContent = 'About Us'

    const divWrapperSubs = document.createElement('div')
    divWrapperSubs.setAttribute('class', 'wrapper-subs')
    const pEl = document.createElement('p')
    pEl.setAttribute('class', 'about-us')
    pEl.textContent = 'We offer only the best American & British products for all Fintess and Bodybuilding enthusiasts! Our products are of the highest quality and guarantee Effect and Safety for anyone who consumes them Regardless of whether you are a passionate Athlete, or just looking to keep your body in shape.Exclusive distributor in Albania of Nutrex Research, Animal, Universal Nutrion, Evogen Nutrition, Servivita Usa, Applied Nutrition & Bpi Sports We grow with your passion for Sport!'

    const removeAboutUsEl = document.createElement('button')
    removeAboutUsEl.textContent = 'X'
    removeAboutUsEl.setAttribute('class', 'remove-about')
    removeAboutUsEl.addEventListener('click', function () {
        aboutUsModalEl.classList.remove('show')
    })

    divWrapperSubs.append(spanAboutEl, pEl)
    divAboutUsModalEl.append(divWrapperSubs, removeAboutUsEl)

    aboutUsModalEl.append(divAboutUsModalEl)
    sectionContainerMenusEl.append(aboutUsModalEl)

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
    logoLinkEl.setAttribute('href', './index.html')
    logoLinkEl.textContent = 'AlbVitaFitness'

    liLogoEl.append(logoLinkEl)

    const formWrapperEl = document.createElement('form')
    formWrapperEl.setAttribute('class', 'form-wrapper')

    // #region 'CREATING SELECT MENU'
    const categoriesSelectEl = document.createElement('select')
    categoriesSelectEl.setAttribute('name', 'filter-by-categories')
    categoriesSelectEl.setAttribute('id', 'filter-by-categories')

    const optionCategories1El = document.createElement('option')
    optionCategories1El.setAttribute('value', 'Default')
    optionCategories1El.textContent = 'Categories'

    const optionCategories2El = document.createElement('option')
    optionCategories2El.setAttribute('value', 'MultiVitamins')
    optionCategories2El.textContent = 'MultiVitamins and essentials minerals'

    const optionCategories3El = document.createElement('option')
    optionCategories3El.setAttribute('value', 'PreWorkouts')
    optionCategories3El.textContent = 'Pre-Workout'

    const optionCategories4El = document.createElement('option')
    optionCategories4El.setAttribute('value', 'Proteins')
    optionCategories4El.textContent = 'Proteins'

    const optionCategories5El = document.createElement('option')
    optionCategories5El.setAttribute('value', 'testosteroneBoosters')
    optionCategories5El.textContent = 'Testosterone Boosters'

    const optionCategories6El = document.createElement('option')
    optionCategories6El.setAttribute('value', 'WeightGainers')
    optionCategories6El.textContent = 'Weigh Gainers'

    const optionCategories7El = document.createElement('option')
    optionCategories7El.setAttribute('value', 'Aminoacids')
    optionCategories7El.textContent = 'Aminoacids'

    const optionCategories8El = document.createElement('option')
    optionCategories8El.setAttribute('value', 'Creatines')
    optionCategories8El.textContent = 'Creatines'

    const optionCategories9El = document.createElement('option')
    optionCategories9El.setAttribute('value', 'WeightBurners')
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

    categoriesSelectEl.value = state.searchOnCategory //linking state and DOM
    listenToSelectChangesSearch(categoriesSelectEl)

    formWrapperEl['search-product'].value = state.search // linking state and DOM
    listenToSearch(formWrapperEl)

    const userButton = document.createElement('button')
    userButton.setAttribute('class', 'button-image')

    const userIconEl = document.createElement('img')
    userIconEl.setAttribute('src', './assets/icons/user.png')
    userIconEl.setAttribute('alt', '')

    const spanButtonUser = document.createElement('span')
    spanButtonUser.setAttribute('class', `span-user-login ${state.userShowClass}`)
    spanButtonUser.textContent = state.userName

    userButton.append(userIconEl, spanButtonUser)
    userButton.addEventListener('click', function () {
        state.userCatcher = []
        state.userName = null
        render()
    })

    const shoppingBagButton = document.createElement('button')
    shoppingBagButton.setAttribute('class', 'button-image')

    const shoppingBagIconEl = document.createElement('img')
    shoppingBagIconEl.setAttribute('src', './assets/icons/shopping-bag.png')
    shoppingBagIconEl.setAttribute('alt', '')

    const spanButtonBag = document.createElement('span')
    spanButtonBag.setAttribute('class', `span-bag-stock ${state.stockShowClass}`)
    spanButtonBag.textContent = state.stockSpanValue

    shoppingBagButton.append(shoppingBagIconEl, spanButtonBag)


    //event listener for modals
    listenToUserEvent(userButton)
    listenToBagEvent(shoppingBagButton)

    //catching some elements wich i want to use to other functions for stock and bag calculations
    spanUserHolderEl = getUserSpanEl(spanButtonUser)
    spanBagHolderEl = getBagSpanEl(spanButtonBag)

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
    homeLinkEl.setAttribute('href', './index.html')
    homeLinkEl.textContent = 'Home'

    liHomeEl.append(homeLinkEl)

    const liProductsEl = document.createElement('li')

    const productsLinkEl = document.createElement('a')
    productsLinkEl.setAttribute('href', './index.html')
    productsLinkEl.textContent = 'Products'

    liProductsEl.append(productsLinkEl)

    const liOffersEl = document.createElement('li')

    const offersLinkEl = document.createElement('a')
    offersLinkEl.setAttribute('href', '')
    offersLinkEl.textContent = 'Offers'

    liOffersEl.append(offersLinkEl)

    const liAboutEl = document.createElement('li')

    const aboutLinkEl = document.createElement('a')
    aboutLinkEl.setAttribute('href', '#')
    aboutLinkEl.textContent = 'About Us'

    liAboutEl.append(aboutLinkEl)

    listenToAboutUsEvent(aboutLinkEl)

    const liBlogEl = document.createElement('li')

    const blogLinkEl = document.createElement('a')
    blogLinkEl.setAttribute('href', './assets/pages/blog.html')
    blogLinkEl.textContent = 'Blog'

    liBlogEl.append(blogLinkEl)

    const liContactEl = document.createElement('li')

    const contactLinkEl = document.createElement('a')
    contactLinkEl.setAttribute('href', './assets/pages/contact.html')
    contactLinkEl.textContent = 'Contact'

    liContactEl.append(contactLinkEl)
    ulHeader2El.append(liHomeEl, liProductsEl, liOffersEl, liAboutEl, liBlogEl, liContactEl)
    subHeaderDiv2.append(ulHeader2El)
    headerMenuEl.append(subHeaderDiv, subHeaderDiv2)

    listenToOffersNav(liOffersEl)

    sectionContainerMenusEl.append(headerMenuEl)

}

//conditional wich main to render 
function renderMainPage() {

    if (state.selectedPage === 'mainMenu') {
        renderMain()
    }

    else if (state.selectedPage === 'mainMenuItem') {
        renderMainItemClicked()
    }
}

function renderMain() {

    const mainEl = document.createElement('main')
    mainEl.setAttribute('class', 'main-menu')

    mainHolderEl = mainEl

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
    numberSpanEl.textContent = showItems().length

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
    option1El.setAttribute('value', 'Default')
    option1El.textContent = 'No Sorting (Deffault)'

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
    option5El.setAttribute('value', 'date-desc')
    option5El.textContent = 'Sort by newest'

    const option6El = document.createElement('option')
    option6El.setAttribute('value', 'name-asc')
    option6El.textContent = 'Sort by name ascending'

    const option7El = document.createElement('option')
    option7El.setAttribute('value', 'name-desc')
    option7El.textContent = 'Sort by name descending'

    selectEl.append(option1El, option2El, option3El, option4El, option5El, option6El, option7El)
    filterFormEl.append(filterLabel, selectEl)

    ribbon2El.append(boxWrapperEl, filterFormEl)

    selectEl.value = state.selectType
    listenToSelectChanges(selectEl)

    const itemsDivEl = document.createElement('div')
    itemsDivEl.setAttribute('class', 'items-container')

    const itemsWrapper = document.createElement('div')
    itemsWrapper.setAttribute('class', 'store-items-wrapper')

    // #region 'RENDERING MAIN ITEM IN A FOR LOOP'
    for (const item of showItems()) {

        const storeItem = document.createElement('div')
        storeItem.setAttribute('class', 'store-item')

        const productImgEl = document.createElement('img')
        productImgEl.setAttribute('src', item.image)
        productImgEl.setAttribute('alt', '')

        productImgElHolder = productImgEl

        const productNameEl = document.createElement('h2')
        productNameEl.textContent = item.name

        const divWrapperEl = document.createElement('div')
        divWrapperEl.setAttribute('class', 'span-wrapper-item')

        const span1El = document.createElement('span')
        span1El.setAttribute('class', 'span-1')
        span1El.textContent = `price: $${item.price}`

        const span2El = document.createElement('span')
        span2El.setAttribute('class', 'span-2')
        span2El.textContent = `Discounted Price: $${item.discountPrice}`

        const span3El = document.createElement('span')
        span3El.setAttribute('class', 'span-3-item')
        span3El.textContent = `Stock: ${item.stock}`

        const span4El = document.createElement('span')
        span4El.setAttribute('class', 'span-4-item')
        span4El.textContent = `Type: ${item.type}`

        const cartButton = document.createElement('button')
        cartButton.textContent = 'Add to cart'

        cartButton.addEventListener('click', function () {
            if (state.userCatcher.length > 0) {
                item.stock--
                updateStock(item)
                render()
            }
        })


        //CREATING THE NEW SPAN TO CHECK DATE IF ENTERED ITEM IN THE STORE WITH THE STATE CHECK
        const newSpanEl = document.createElement('span')
        newSpanEl.setAttribute('class', 'new-item-date')
        newSpanEl.textContent = 'New Item'

        //here i call the function to check the date, i need to pass the span, the div to append in that function and then the date from state
        checkDateEnteredNew(item.date, newSpanEl, storeItem)

        //now we check if an propery in in the object to see discounted price or not
        if (item.hasOwnProperty('discountPrice')) {

            divWrapperEl.append(span1El, span2El, span3El, span4El)
            storeItem.append(productImgEl, productNameEl, divWrapperEl, cartButton)

            itemsWrapper.append(storeItem)

            listenToSubmitItemToBag(cartButton, item)
            listenToClickItem(storeItem, item) //this renders specific click on item 

        }

        else {

            span1El.style.color = '#000'
            span1El.style.textDecoration = 'none'

            divWrapperEl.append(span1El, span3El, span4El)
            storeItem.append(productImgEl, productNameEl, divWrapperEl, cartButton)

            itemsWrapper.append(storeItem)

            listenToSubmitItemToBag(cartButton, item)
            listenToClickItem(storeItem, item) //this renders specific click on item 

        }

    }

    itemsDivEl.append(itemsWrapper) //this append all the items in this big container box inside box
    // #endregion

    const paginationContainerEl = document.createElement('div')
    paginationContainerEl.setAttribute('class', 'pagination-container')

    paginationHolderEl = paginationContainerEl //catching this el in global scope cauuse i need it when rendering click item

    const paginationWrapperEl = document.createElement('div')
    paginationWrapperEl.setAttribute('class', 'pagination-wrapper')

    const prevBtnEl = document.createElement('button')
    prevBtnEl.setAttribute('class', 'special-button-pagination')

    const prevSpanEl = document.createElement('span')
    prevSpanEl.textContent = 'Previous Page'

    prevBtnEl.append(prevSpanEl)

    if (state.page === 1) {
        prevBtnEl.disabled = true
    }

    listenToPreviousBtn(prevBtnEl)


    const nextBtnEl = document.createElement('button')
    nextBtnEl.setAttribute('class', 'special-button-pagination')

    const nextPageSpan = document.createElement('span')
    nextPageSpan.textContent = 'Next Page'

    nextBtnEl.append(nextPageSpan)

    if (state.page * state.perPage > state.items.length) {
        nextBtnEl.disabled = true
    }

    listenToNextBtn(nextBtnEl)

    paginationWrapperEl.append(prevBtnEl, nextBtnEl)
    paginationContainerEl.append(paginationWrapperEl)


    const asideWrapperEl = document.createElement('div')
    asideWrapperEl.setAttribute('class', 'aside-wrapper')

    const asideContainerEl = document.createElement('aside')
    asideContainerEl.setAttribute('class', 'aside-container-1')

    const asideContainerEl2 = document.createElement('aside')
    asideContainerEl2.setAttribute('class', 'aside-container-2')

    const asideUl = document.createElement('ul')
    asideUl.setAttribute('class', 'ul-aside')

    const categoriesLi = document.createElement('li')
    categoriesLi.setAttribute('id', 'special-aside')
    categoriesLi.textContent = 'Categories'

    const multivitaminsLi = document.createElement('li')

    const multivitaminsLink = document.createElement('a')
    multivitaminsLink.textContent = 'Multivitamins & essentials minerals'

    multivitaminsLi.append(multivitaminsLink)

    const workoutsLi = document.createElement('li')

    const workoutsLink = document.createElement('a')
    workoutsLink.textContent = 'Pre-Workouts'

    workoutsLi.append(workoutsLink)

    const proteinsLi = document.createElement('li')

    const proteinsLink = document.createElement('a')
    proteinsLink.textContent = 'Proteins'

    proteinsLi.append(proteinsLink)

    const boostersLi = document.createElement('li')
    const boostersLink = document.createElement('a')
    boostersLink.textContent = 'Testosterone Boosters'

    boostersLi.append(boostersLink)

    const weightLi = document.createElement('li')

    const weightLink = document.createElement('a')
    weightLink.textContent = 'Weight gainers'

    weightLi.append(weightLink)

    const aminoacidsLi = document.createElement('li')

    const aminoacidsLink = document.createElement('a')
    aminoacidsLink.textContent = 'Aminoacids'

    aminoacidsLi.append(aminoacidsLink)

    const creatinesLi = document.createElement('li')
    const creatinesLink = document.createElement('a')
    creatinesLink.textContent = 'Creatines'

    creatinesLi.append(creatinesLink)

    const weightBurnerLi = document.createElement('li')

    const weightBurnerLink = document.createElement('a')
    weightBurnerLink.textContent = 'Weight Burner'

    weightBurnerLi.append(weightBurnerLink)

    const showAllLi = document.createElement('li')
    const showAllLink = document.createElement('a')
    showAllLink.textContent = 'Deffault no categories'

    showAllLi.append(showAllLink)

    //event listeners for categories
    listenToDefaultCategory(showAllLink)
    listenToProteinsCategory(proteinsLink)

    listenToMultivitaminsCategory(multivitaminsLink)
    listenToPreWorkoutsCategory(workoutsLink)

    listenToAminoacidsCategory(aminoacidsLink)
    listenToWeightBurnerCategory(weightBurnerLink)

    listenToCreatineCategory(creatinesLink)
    listenToTestosteroneBoostersCategory(boostersLink)
    listenToWeightGainersCategory(weightLink)

    asideUl.append(categoriesLi, showAllLi, multivitaminsLi, workoutsLi, proteinsLi, boostersLi, weightLi, aminoacidsLi, creatinesLi, weightBurnerLi)
    asideContainerEl.append(asideUl)
    asideWrapperEl.append(asideContainerEl, asideContainerEl2)


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

function renderMainItemClicked() {

    mainHolderEl.innerHTML = ''

    const itemsDivEl = document.createElement('div')
    itemsDivEl.setAttribute('class', 'items-container')

    const itemsWrapper = document.createElement('div')
    itemsWrapper.setAttribute('class', 'store-items-wrapper')

    const storeItem = document.createElement('div')
    storeItem.setAttribute('class', 'store-item')

    const productImgEl = document.createElement('img')
    productImgEl.setAttribute('src', itemHolderObject.image)
    productImgEl.setAttribute('alt', '')

    const productNameEl = document.createElement('h2')
    productNameEl.textContent = itemHolderObject.name

    const divWrapperEl = document.createElement('div')
    divWrapperEl.setAttribute('class', 'span-wrapper-item')

    const span1El = document.createElement('span')
    span1El.setAttribute('class', 'span-1')
    span1El.textContent = `price: $${itemHolderObject.price}`

    const span2El = document.createElement('span')
    span2El.setAttribute('class', 'span-2')
    span2El.textContent = `Discounted Price: $${itemHolderObject.discountPrice}`

    const span3El = document.createElement('span')
    span3El.setAttribute('class', 'span-3-item')
    span3El.textContent = `Stock: ${itemHolderObject.stock}`

    const span4El = document.createElement('span')
    span4El.setAttribute('class', 'span-4-item')
    span4El.textContent = `Type: ${itemHolderObject.type}`

    const cartButton = document.createElement('button')
    cartButton.textContent = 'Add to cart'

    cartButton.addEventListener('click', function () {
        if (state.userCatcher.length > 0) {
            itemHolderObject.stock--
            updateStock(itemHolderObject)
            render()
        }
    })


    //CREATING THE NEW SPAN TO CHECK DATE IF ENTERED ITEM IN THE STORE WITH THE STATE CHECK
    const newSpanEl = document.createElement('span')
    newSpanEl.setAttribute('class', 'new-item-date')
    newSpanEl.textContent = 'New Item'

    //here i call the function to check the date, i need to pass the span, the div to append in that function and then the date from state
    checkDateEnteredNew(itemHolderObject.date, newSpanEl, storeItem)

    //now we check if an propery in in the object to see discounted price or not
    if (itemHolderObject.hasOwnProperty('discountPrice')) {

        divWrapperEl.append(span1El, span2El, span3El, span4El)
        storeItem.append(productImgEl, productNameEl, divWrapperEl, cartButton)
        listenToSubmitItemToBag(cartButton, itemHolderObject)

    }

    else {

        span1El.style.color = '#000'
        span1El.style.textDecoration = 'none'

        divWrapperEl.append(span1El, span3El, span4El)
        storeItem.append(productImgEl, productNameEl, divWrapperEl, cartButton)
        listenToSubmitItemToBag(cartButton, itemHolderObject)

    }

    const goBackBtnEl = document.createElement('button')
    goBackBtnEl.textContent = 'Go Back'

    const descriptionEl = document.createElement('span')
    descriptionEl.textContent = itemHolderObject.description
    descriptionEl.setAttribute('class', 'span-description')

    storeItem.append(goBackBtnEl, descriptionEl)
    itemsWrapper.append(storeItem)

    itemsWrapper.style.gridTemplateColumns = '1fr'
    itemsWrapper.style.placeItems = 'center'

    storeItem.style.width = '650px'
    paginationHolderEl.style.display = 'none' //this removes pagination when an individual item is rendered

    itemsDivEl.append(itemsWrapper)
    mainHolderEl.append(itemsDivEl)
    sectionContainerMenusEl.append(mainHolderEl)

    listenToGoBackBtn(goBackBtnEl)

}
// #endregion

// #region 'RENDERING AND LOGIC ON IT'
function render() {

    //destroy everything these are GLOBAL VARIABLES then recreate each time you render
    sectionContainerMenusEl.innerHTML = ''

    //rerendering the HTML page after each render call
    renderHeader()
    //rendering main based on condition
    renderMainPage()
    renderFooter()
    //rendering the modals on condition
    renderModals()

}

function init() {

    render() //renders initial page without items but laoded the first html
    getItems() //get items from server 
    getUsers() // get users from server

}

// #endregion

// #endregion

//-----------------------------------------------------------------------------------------------------------------

// #region 'APP INIT CALL AND START'
init()
// #endregion

//-----------------------------------------------------------------------------------------------------------------