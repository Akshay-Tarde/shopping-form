const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// array to hold the items or the current state

let items = [];

function handleSubmit(event) {
    event.preventDefault();
    const name = event.currentTarget.item.value;
    // console.log();
    const item = {
        name,
        id: Date.now(),
        complete: false,
    }
    // push the items into the state
    items.push(item);
    // console.log(items);
    // to clear the text in the input box of the form 
    // event.currentTarget.item.value = "";
    // or if you multiple inputs
    event.currentTarget.reset(); 
    // displayItems(); avoid calling the function here as it couples the two functions tightly
    // fire a custom event if the state has been updated
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
    const html = items.map( item => {
        return `<li class="shopping-item">
                    <input 
                        value="${item.id}" 
                        type='checkbox'
                        ${item.complete ? 'checked' : ""}/>
                    <span class="itemName">${item.name}</span>
                    <button 
                        aria-label="Remove ${item.name}"
                        value=${item.id}>
                        &times;
                    </button>
                </li>`
    }).join("");
    // console.log(html);
    list.innerHTML = html;
}

function mirrorToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage() {
    const lsItems = JSON.parse(localStorage.getItem('items'));
    //console.log(lsItems);
    if(lsItems.length) {
        items.push(...lsItems);
    }
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function deleteItem(id) {
    console.log("DELETING ITEM", id);
    items = items.filter(item => item.id !== id);
    list.dispatchEvent(new CustomEvent('itemsUpdated')); 
}

function markAsComplete(id) {
    // items = items.map(item => item.id === id ? item.complete = true)
    const itemRef = items.find(item => item.id === id);
    itemRef.complete = !itemRef.complete;
    console.log("Marking as complete", id, itemRef);
    list.dispatchEvent(new CustomEvent('itemsUpdated')); 
} 

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
list.addEventListener('click', function(event) {
    if(event.target.matches('button')) {
        deleteItem(parseInt(event.target.value));
    }
    if(event.target.matches('input[type="checkbox"]')) {
        markAsComplete(parseInt(event.target.value))
    }
})

restoreFromLocalStorage();