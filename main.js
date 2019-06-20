'use strict';

const container = document.querySelector('#food-list');
const buttonUp = document.querySelector('#button-up');
const buttonDown = document.querySelector('#button-down');

const initialState = {
  items: ['Apple', 'Bread', 'Carrot', 'Dumplings', 'Eggs', 'Fish', 'Garlic', 'Honey', 'Ice cream', 'Jam'],
  index: null,
};

const chooseItem = index => {
	return {
		type: 'choose_item',
		index
	}
};

const moveUp = () => {
	return {
		type: 'move_up'
	}
};

const moveDown = () => {
	return {
		type: 'move_down'
	}
};

const exitFromOrdering = () => {
	return {
		type: 'exit_from_ordering'
	}
};

function reduser(state = initialState, action) {
  switch(action.type) {
    case 'choose_item':
			return {
				...state,
				index: action.index
			}
		case 'move_up':
			return {
				...state,
				items: state.items.map((item, index) => {
					const prevItem = state.items[state.index - 1];
					if (index === state.index - 1) return state.items[state.index];
					if (index === state.index) return prevItem;
					return item;
				}),
				index: state.index - 1
			}
		case 'move_down':
			return {
				...state,
				items: state.items.map((item, index) => {
					const currentItem = state.items[state.index];
					if (index === state.index) return state.items[state.index + 1];
					if (index === state.index + 1) return currentItem;
					return item;
				}),
				index: state.index + 1
			}
		case 'exit_from_ordering':
			return {
				...state,
				index: null,
			}
		default:
			return state;
  }
}

const store = Redux.createStore(reduser);

function renderList() {
	container.innerHTML = '';
	const lastIndex = store.getState().items.length - 1;
	const stateIndex = store.getState().index;

	store.getState().items.forEach((item, index) => {
		const li = document.createElement('li');
		li.textContent = item;

		li.addEventListener('click', () => {
			store.dispatch(chooseItem(index));
		});

		container.append(li);
	});

	if (stateIndex >= 0 && stateIndex !== null) {
		container.childNodes[stateIndex].classList.add('active');
	}

	if (stateIndex === 0) {
		buttonUp.setAttribute('disabled', 'disabled');
		buttonDown.removeAttribute('disabled');
	} else if (stateIndex === lastIndex) {
		buttonDown.setAttribute('disabled', 'disabled');
		buttonUp.removeAttribute('disabled');
	} else if (stateIndex === null) {
		buttonUp.setAttribute('disabled', 'disabled');
		buttonDown.setAttribute('disabled', 'disabled');
	} else {
		buttonUp.removeAttribute('disabled');
		buttonDown.removeAttribute('disabled');
	} 
}

document.addEventListener('click', event => {
	if (!event.target.closest('button') && !event.target.closest('li')) {
		store.dispatch(exitFromOrdering());
	}
});

buttonUp.addEventListener('click', () => {
	store.dispatch(moveUp());
})

buttonDown.addEventListener('click', () => {
	store.dispatch(moveDown());
})

store.subscribe(() => {
	renderList();
});

renderList();
