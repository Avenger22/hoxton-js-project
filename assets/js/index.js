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

let headerSub2CatcherEl = null
let headerCatcherEl = null
let ulSub2CatcherEl = null
let paginationHolderEl = null
let productImgElHolder = null

let totalAmount = 0

let globalItemsToDisplay = []

let spanUserHolderEl = null //this is important to hold the stock span EL when its rendered so i can acces it and use it in other parts of app
let spanBagHolderEl = null //same as above
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

    //checking to show the username after login USER SPAN
    userName: null,
    userShowClass: null,

    //here checking to show the span in the page BAG SPAN
    stockSpanValue: null,
    stockShowClass: null,

    userModalClicked: false,
    bagModalClicked: false,
    signUpModalClicked: false,
    payModalClicked: false,

    specificItemClicked: false,
    selectType: '',

    // totalAmount: 0,

    //selected category
    category: '',
    //searched item
    search: ''
    //experimental for pagination from js not server
    // page: 1,
    // perPage: 10

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
    }, 5000);

}
// #endregion

// #region 'event listener for modals'
function listenToUserEvent(userElParam) {

    userElParam.addEventListener('click', function (event) {
        event.preventDefault()
        state.userModalClicked = true
        userModalEl.classList.add('show')
        // render()
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

        state.userModalClicked = false
        userModalEl.classList.remove('show')
        // render()
    })

}


function listenToRemovePopUp(btnRemovePopElParam) {

    btnRemovePopElParam.addEventListener('click', function (event) {
        event.preventDefault()
        popUpModalEl.classList.remove('show')
    })
}


function listenToGoToSignUp(btnSignUpElParam) {

    btnSignUpElParam.addEventListener('click', function (event) {
        event.preventDefault()

        userModalEl.classList.remove('show')
        signUpModalEl.classList.add('show')

    })
}

function listenToRemoveSignUpModal(btnRemoveSignUpElParam) {

    btnRemoveSignUpElParam.addEventListener('click', function (event) {
        event.preventDefault()
        signUpModalEl.classList.remove('show')
    })

}


function listenToBagEvent(bagElParam) {

    bagElParam.addEventListener('click', function (event) {
        event.preventDefault()
        state.bagModalClicked = true
        bagModalEl.classList.add('show')
        // render()
    })

}

function listenToRemoveBag(buttonElParam) {

    buttonElParam.addEventListener('click', function (event) {
        event.preventDefault()
        state.bagModalClicked = false
        bagModalEl.classList.remove('show')
        // render()
    })

}

function listenToSubmitItemToBag(buttonItemParam, itemObjectParam) {

    buttonItemParam.addEventListener('click', function (event) {

        event.preventDefault()
        console.log("item button is Clicked, so now its ready to go to bag from page")

        state.stockShowClass = 'show'
        spanBagHolderEl.classList.add(state.stockShowClass) //linking DOM AND STATE

        itemObjectParam.stock -= 1
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
        state.bagItems.push(itemObjectParam)
        state.bagItems = [...new Set(state.bagItems)] //removes duplicate from an aray uses set also spread operator
        
        calculateTotalAddingAmount() //experimental
        
        render()

        // if (state.specificItemClicked === false) {
        render()
        // }

    })

}

function listenToRemoveBagItem(btnRemoveItemElParam, itemObjectParam, divItemParam) {

    btnRemoveItemElParam.addEventListener('click', function (event) {
        event.preventDefault()
        divItemParam.remove() //remove from html the dom item

        //update the state another array, here we change state bag array from FILTER
        state.bagItems = getDeletedItemsFromBag(itemObjectParam.name)

        const quantity = getQuantityValue(itemObjectParam.name)
        itemObjectParam.stock += quantity //BUG
        state.stockSpanValue -= quantity
        spanBagHolderEl.textContent = state.stockSpanValue

        state.bagItemQuantity = getDeletedItemsFromBagQuantity(itemObjectParam.name) //change the state
        
        calculateTotalRemovingAmount() //experimental
        
        render() //rerender the app

    })


}


function listenToGoToPay(btnPayParam) {

    btnPayParam.addEventListener('click', function (event) {
        event.preventDefault()
        bagModalEl.classList.remove('show')
        payModalEl.classList.add('show')
    })

}

function listenToRemovePayModal(btnRemovePayElParam) {

    btnRemovePayElParam.addEventListener('click', function (event) {
        event.preventDefault()
        payModalEl.classList.remove('show')
    })

}
// #endregion

// #region 'event listener for categories'
function listenToClickItem(storeItemParam, itemsWrapperParam, cartButtonParam, itemParam) {

    storeItemParam.addEventListener('click', function (event) {

        event.preventDefault()
        console.log('Listen to click item function activated')

        renderMainItemClicked(storeItemParam, itemsWrapperParam, cartButtonParam, itemParam)

        state.specificItemClicked = true //change state

        // render() 

    })

}

function listenToGoBackBtn(goBackBtnElParam) {

    goBackBtnElParam.addEventListener('click', function (event) {

        event.preventDefault()
        state.specificItemClicked = false
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


function listenToSelectChanges(selectElParam) {

    selectElParam.addEventListener('change', function () {
        state.selectType = selectElParam.value
        state.selectedItem = ''
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


function showItems() {

    let itemsToDisplay = state.items
    let itemToDisplaySorted = []

    // #region 'CONDITIONALS FOR DEFFAULT VALUES AND CASES IF VOID SOMETHING ETC
    if (state.category === '' && state.selectType === '') {
        itemToDisplaySorted = state.items
    }

    else if (state.category === '' && state.selectType === 'price-asc') {
        globalItemsToDisplay = state.items
        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === '' && state.selectType === 'price-desc') {
        globalItemsToDisplay = state.items
        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === '' && state.selectType === 'name-asc') {
        globalItemsToDisplay = state.items
        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === '' && state.selectType === 'name-desc') {
        globalItemsToDisplay = state.items
        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === '' && state.selectType === 'date-asc') {
        globalItemsToDisplay = state.items
        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === '' && state.selectType === 'date-desc') {
        globalItemsToDisplay = state.items
        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'CONDITIONALS FOR PROTEINS AND THEIR SORTING OPTIONS
    else if (state.category === 'Default' && state.selectType === '') {
        itemToDisplaySorted = state.items
    }

    else if (state.category === 'Default' && state.selectType === 'price-asc') {
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

    // #region 'CONDITIONALS FOR PROTEINS AND THEIR SORTING OPTIONS
    else if (state.category === 'Proteins' && state.selectType === '') {
        itemToDisplaySorted = getProteinProducts()
    }

    else if (state.category === 'Proteins' && state.selectType === 'price-asc') {
        itemsToDisplay = getProteinProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === 'Proteins' && state.selectType === 'price-desc') {
        itemsToDisplay = getProteinProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === 'Proteins' && state.selectType === 'name-asc') {
        itemsToDisplay = getProteinProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === 'Proteins' && state.selectType === 'name-desc') {
        itemsToDisplay = getProteinProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === 'Proteins' && state.selectType === 'date-asc') {
        itemsToDisplay = getProteinProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === 'Proteins' && state.selectType === 'date-desc') {
        itemsToDisplay = getProteinProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'CONDITIONALS FOR MULTIVITAMINS AND THEIR SORTING OPTIONS
    else if (state.category === 'Multivitamins' && state.selectType === '') {
        itemToDisplaySorted = getMultivitaminsProducts()
    }

    else if (state.category === 'Multivitamins' && state.selectType === 'price-asc') {
        itemsToDisplay = getMultivitaminsProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByPriceAsc()
    }

    else if (state.category === 'Multivitamins' && state.selectType === 'price-desc') {
        itemsToDisplay = getMultivitaminsProducts()
        itemToDisplaySorted = getSortedByPriceDesc()
    }

    else if (state.category === 'Multivitamins' && state.selectType === 'name-asc') {
        itemsToDisplay = getMultivitaminsProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByNameAsc()
    }

    else if (state.category === 'Multivitamins' && state.selectType === 'name-desc') {
        itemsToDisplay = getMultivitaminsProducts()
        itemToDisplaySorted = getSortedByNameDesc()
    }

    else if (state.category === 'Multivitamins' && state.selectType === 'date-asc') {
        itemsToDisplay = getMultivitaminsProducts()
        globalItemsToDisplay = itemsToDisplay

        itemToDisplaySorted = getSortedByDateAsc()
    }

    else if (state.category === 'Multivitamins' && state.selectType === 'date-desc') {
        itemsToDisplay = getMultivitaminsProducts()
        itemToDisplaySorted = getSortedByDateDesc()
    }
    // #endregion

    // #region 'CONDITIONALS FOR PRE-WORKOUT AND THEIR SORTING OPTIONS
    else if (state.category === 'Pre-Workouts' && state.selectType === '') {
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

    // #region 'CONDITIONALS FOR WEIGHT-GAINERS AND THEIR SORTING OPTIONS
    else if (state.category === 'Weight-Gainers' && state.selectType === '') {
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

    // #region 'CONDITIONALS FOR CREATINE AND THEIR SORTING OPTIONS
    else if (state.category === 'Creatine' && state.selectType === '') {
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

    // #region 'CONDITIONALS FOR AMINOACIDS AND THEIR SORTING OPTIONS
    else if (state.category === 'Aminoacids' && state.selectType === '') {
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

    // #region 'CONDITIONALS FOR WEIGHT-BURNERS AND THEIR SORTING OPTIONS
    else if (state.category === 'Weight-Burner' && state.selectType === '') {
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

    // #region 'CONDITIONALS FOR TESTOSTERONE-BOOSTERS AND THEIR SORTING OPTIONS
    else if (state.category === 'Testosterone-Boosters' && state.selectType === '') {
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
    itemToDisplaySorted = searchByName(itemToDisplaySorted)

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

    for (const item of state.bagItemQuantity) {

        let numberValueDiscount = Number(item.discountPrice)
        let numberValue = Number(item.price)

        if (item.discountPrice === undefined) {
            totalAmount = totalAmount +  numberValueDiscount
        }

        else {
            totalAmount = totalAmount + numberValue
        }

    }

    console.log(totalAmount)

}

function calculateTotalRemovingAmount() {

    for (const item of state.bagItemQuantity) {

        let numberValueDiscount = Number(item.discountPrice)
        let numberValue = Number(item.price)

        if (item.discountPrice === undefined) {
            totalAmount = totalAmount -  numberValueDiscount
        }

        else {
            totalAmount = totalAmount - numberValue
        }

    }

    console.log(totalAmount)

}
// #endregion

// #region 'filter sorting'
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
        spanEl1.textContent = `Price: ${item.price}`

        const spanEl2 = document.createElement('span')
        spanEl2.setAttribute('class', 'span-2-bag')
        spanEl2.textContent = `Discounted Price: ${item.discountPrice}`

        //important to get the quantity of x item with that name passed as argument
        const quantityValue = getQuantityValue(item.name)

        const spanEl3 = document.createElement('span')
        spanEl3.setAttribute('class', 'span-3-bag')
        spanEl3.textContent = `Quantity: ${quantityValue}`

        const btnRemoveItem = document.createElement('button')
        btnRemoveItem.textContent = 'Remove bag item'

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
    btnPay.textContent = `Pay now .... ${totalAmount}`

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
        alert('The newsletter is sended to your email')
    })

    listenToRemovePopUp(removePopBtnEl)

}

function renderSignUpModal() {

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

    formSignUpEl.append(labelNameSignUpEl, nameSignUpEl, labelEmailSignUpEl, emailSignUpEl,
        labelPasswordSignUpEl, passwordSignUpEl, btnSignUp, btnRemoveSignUp)

    divSignUpModalEl.append(formSignUpEl)

    signUpModalEl.append(divSignUpModalEl)
    sectionContainerMenusEl.append(signUpModalEl)

    btnSignUp.addEventListener('click', function (event) {
        event.preventDefault()
        alert('We are sending the verification code to the email')
    })

    listenToRemoveSignUpModal(btnRemoveSignUp)

}

function renderPayModal() {

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
    inputPayEl2.placeholder = 'Card number:'

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
    inputPayEl4.placeholder = 'CVV NUMBER:'

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

function renderMain() {

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
    option1El.setAttribute('value', '')
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

    // selectEl.value = state.selectType


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
        span1El.textContent = `price: ${item.price}`

        const span2El = document.createElement('span')
        span2El.setAttribute('class', 'span-2')
        span2El.textContent = `Discounted Price: ${item.discountPrice}`

        const span3El = document.createElement('span')
        span3El.setAttribute('class', 'span-3-item')
        span3El.textContent = `Stock: ${item.stock}`

        const span4El = document.createElement('span')
        span4El.setAttribute('class', 'span-4-item')
        span4El.textContent = `Type: ${item.type}`

        const cartButton = document.createElement('button')
        cartButton.textContent = 'Add to cart'

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
            listenToClickItem(storeItem, itemsWrapper, cartButton, item) //this renders specific click on item 

        }

        else {

            span1El.style.color = '#000'
            span1El.style.textDecoration = 'none'

            divWrapperEl.append(span1El, span3El, span4El)
            storeItem.append(productImgEl, productNameEl, divWrapperEl, cartButton)

            itemsWrapper.append(storeItem)

            listenToSubmitItemToBag(cartButton, item)
            listenToClickItem(storeItem, itemsWrapper, cartButton, item) //this renders specific click on item 

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

    // #region 'DELETED BUTTONS FOR THE MOMENT'

    // const button2El = document.createElement('button')

    // const span_2 = document.createElement('span')
    // span_2.textContent = '2'

    // button2El.append(span_2)

    // const button3El = document.createElement('button')

    // const span_3 = document.createElement('span')
    // span_3.textContent = '3'

    // button3El.append(span_3)

    // const button4El = document.createElement('button')

    // const span_4 = document.createElement('span')
    // span_4.textContent = '....'

    // button4El.append(span_4)

    // const button6El = document.createElement('button')

    // const span_6 = document.createElement('span')
    // span_6.textContent = '6'

    // button6El.append(span_6)

    // #endregion

    const nextBtnEl = document.createElement('button')
    nextBtnEl.setAttribute('class', 'special-button-pagination')

    const nextPageSpan = document.createElement('span')
    nextPageSpan.textContent = 'Next Page'

    nextBtnEl.append(nextPageSpan)

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
    multivitaminsLink.setAttribute('href', '#')
    multivitaminsLink.textContent = 'Multivitamins & essentials minerals'

    multivitaminsLi.append(multivitaminsLink)

    const workoutsLi = document.createElement('li')

    const workoutsLink = document.createElement('a')
    workoutsLink.setAttribute('href', '#')
    workoutsLink.textContent = 'Pre-Workouts'

    workoutsLi.append(workoutsLink)

    const proteinsLi = document.createElement('li')

    const proteinsLink = document.createElement('a')
    proteinsLink.setAttribute('href', '#')
    proteinsLink.textContent = 'Proteins'

    proteinsLi.append(proteinsLink)

    const boostersLi = document.createElement('li')

    const boostersLink = document.createElement('a')
    boostersLink.setAttribute('href', '#')
    boostersLink.textContent = 'Testosterone Boosters'

    boostersLi.append(boostersLink)

    const weightLi = document.createElement('li')

    const weightLink = document.createElement('a')
    weightLink.setAttribute('href', '#')
    weightLink.textContent = 'Weight gainers'

    weightLi.append(weightLink)

    const aminoacidsLi = document.createElement('li')

    const aminoacidsLink = document.createElement('a')
    aminoacidsLink.setAttribute('href', '#')
    aminoacidsLink.textContent = 'Aminoacids'

    aminoacidsLi.append(aminoacidsLink)

    const creatinesLi = document.createElement('li')

    const creatinesLink = document.createElement('a')
    creatinesLink.setAttribute('href', '#')
    creatinesLink.textContent = 'Creatines'

    creatinesLi.append(creatinesLink)

    const weightBurnerLi = document.createElement('li')

    const weightBurnerLink = document.createElement('a')
    weightBurnerLink.setAttribute('href', '#')
    weightBurnerLink.textContent = 'Weight Burner'

    weightBurnerLi.append(weightBurnerLink)

    const showAllLi = document.createElement('li')

    const showAllLink = document.createElement('a')
    showAllLink.setAttribute('href', '#')
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

function renderMainItemClicked(storeItemParam, itemWrapperParam, cartButtonParam, itemParam) {

    itemWrapperParam.innerHTML = ''

    const goBackBtnEl = document.createElement('button')
    goBackBtnEl.textContent = 'Go Back'

    const descriptionEl = document.createElement('span')
    descriptionEl.textContent = itemParam.description
    descriptionEl.setAttribute('class', 'span-description')

    storeItemParam.append(goBackBtnEl, descriptionEl)
    itemWrapperParam.append(storeItemParam)

    itemWrapperParam.style.gridTemplateColumns = '1fr'
    itemWrapperParam.style.placeItems = 'center'

    storeItemParam.style.width = '350px'

    // cartButtonParam.style.width = '250px'
    // goBackBtnEl.style.width = '250px'

    // productImgElHolder.style.height = '350px'
    // productImgElHolder.style.width = '350px'

    paginationHolderEl.style.display = 'none' //this removes pagination when an individual item is rendered

    listenToSubmitItemToBag(cartButtonParam, itemParam)
    listenToGoBackBtn(goBackBtnEl)

}
// #endregion

// #region 'RENDERING AND LOGIC ON IT'
function render() {

    //destroy everything these are GLOBAL VARIABLES then recreate each time you render
    sectionContainerMenusEl.innerHTML = ''
    userModalEl.innerHTML = ''
    bagModalEl.innerHTML = ''
    payModalEl.innerHTML = ''
    popUpModalEl.innerHTML = ''
    signUpModalEl.innerHTML = ''

    //rerendering the HTML page after each render call
    renderHeader()
    renderMain()
    renderFooter()
    renderUserModal()
    renderBagModal()
    renderPopUpModal()
    renderSignUpModal()
    renderPayModal()

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