let currentMenu = "main";
let previousMenu = "";
let currentAction = {};
let distanceValue = 50;
let isUIOpen = false;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('close').addEventListener('click', closeUI);
    document.addEventListener('click', handleMenuItemClick);
    document.querySelectorAll('.back').forEach(btn => {
        btn.addEventListener('click', handleBackButton);
    });
    document.getElementById('confirm').addEventListener('click', handleDistanceConfirm);
    document.getElementById('delete').addEventListener('click', handleDeleteConfirm);
    document.getElementById('cancel').addEventListener('click', handleCancelDelete);
});

function closeUI() {
    isUIOpen = false;
    document.querySelector('.container').style.display = 'none';
    fetch(`https://${GetParentResourceName()}/closeUI`, { method: 'POST' });
}

function handleMenuItemClick(e) {
    const menuItem = e.target.closest('.item');
    if (!menuItem) return;

    const event = menuItem.getAttribute('data-event');
    const action = menuItem.getAttribute('data-action');
    const type = menuItem.getAttribute('data-type');

    if (event) {
        handleMenuEvent(event);
    } else if (action && type) {
        handleAction(action, type);
    }
}

function handleBackButton() {
    const targetMenu = this.getAttribute('data-menu');
    if (targetMenu === "previous") {
        showMenu(previousMenu);
    } else {
        showMenu(targetMenu);
    }
}

function handleDistanceConfirm() {
    distanceValue = parseInt(document.getElementById('distance-value').value) || 50;
    const emptyOnly = document.getElementById('empty-only').checked;
    
    if (distanceValue <= 0) return;
    
    currentAction.distance = distanceValue;
    if (currentAction.type === 'vehicle') {
        currentAction.emptyOnly = emptyOnly;
    }
    
    showConfirmation(currentAction.action, currentAction.type);
}

function handleDeleteConfirm() {
    fetch(`https://${GetParentResourceName()}/executeAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentAction)
    });
    showMenu('main');
}

function handleCancelDelete() {
    showMenu(currentMenu);
}

function handleMenuEvent(event) {
    previousMenu = currentMenu;
    currentMenu = event;
    showMenu(event);
}

function handleAction(action, type) {
    currentAction = { action, type };
    
    if (action === 'empty' && type === 'vehicle') {
        currentAction.emptyOnly = true;
    }
    
    if (action === 'distance') {
        showDistanceInput(type);
    } else {
        showConfirmation(action, type);
    }
}

function showMenu(menu) {
    hideAllMenus();
    
    if (menu === 'main') {
        document.getElementById('main').style.display = 'flex';
        currentMenu = 'main';
    } else if (menu === 'vehicles') {
        document.getElementById('vehicles').style.display = 'flex';
    } else if (menu === 'peds') {
        document.getElementById('peds').style.display = 'flex';
    } else if (menu === 'props') {
        document.getElementById('props').style.display = 'flex';
    } else if (menu === 'distance') {
        document.getElementById('distance').style.display = 'flex';
        document.getElementById('distance-value').value = distanceValue;
        
        
        const emptyCheck = document.getElementById('empty-check');
        if (currentAction.type === 'vehicle') {
            emptyCheck.style.display = 'flex';
        } else {
            emptyCheck.style.display = 'none';
        }
    } else if (menu === 'confirm-dialog') {
        document.getElementById('confirm-dialog').style.display = 'flex';
    }
}

function hideAllMenus() {
    document.getElementById('main').style.display = 'none';
    document.getElementById('vehicles').style.display = 'none';
    document.getElementById('peds').style.display = 'none';
    document.getElementById('props').style.display = 'none';
    document.getElementById('distance').style.display = 'none';
    document.getElementById('confirm-dialog').style.display = 'none';
}

function showDistanceInput(type) {
    previousMenu = currentMenu;
    currentMenu = "distance";
    showMenu('distance');
}

function showConfirmation(action, type) {
    let message = '';
    
    if (action === 'all') {
        message = `Delete ALL ${type}s?`;
    } else if (action === 'empty') {
        message = `Delete EMPTY ${type}s?`;
    } else if (action === 'distance') {
        const dist = currentAction.distance;
        const empty = currentAction.emptyOnly ? 'EMPTY ' : '';
        message = `Delete ${empty}${type}s within ${dist}m?`;
    }
    
    document.getElementById('message').textContent = message;
    document.getElementById('confirm-dialog').style.display = 'flex';
}

window.addEventListener('message', function(event) {
    if (event.data.action === "OPEN_MENU") {
        isUIOpen = !isUIOpen;
        if (isUIOpen) {
            document.querySelector('.container').style.display = 'block';
            showMenu('main');
        } else {
            document.querySelector('.container').style.display = 'none';
        }
    }
});