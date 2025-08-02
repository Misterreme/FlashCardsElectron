const setNameInput = document.getElementById("set-name-input");
const setDescriptionInput = document.getElementById("set-description-input");
const setsContainer = document.getElementById("sets-container");
const addCardButton = document.getElementById("add-card-button");
const frontCardInput = document.getElementById("front-card-input");
const backCardTextarea = document.getElementById("back-card-textarea");
const cardsPreviewContainer = document.getElementById("cards-preview-container");
const noCardsMessage = document.getElementById("no-cards-message");
const createNewCardContainer = document.getElementById("create-new-card-container");
const cardsCount = document.getElementById("cards-count");
const saveSetButton = document.getElementById("save-set-button");
const createSetForm = document.getElementById("create-set-form");
const createPreviewCardForm = document.getElementById("create-preview-card-form");
const createNewCardButtonsContainer = document.getElementById("create-new-card-buttons-container");
const createSetText = document.getElementById("create-set-title");
const noSetsMessage = document.getElementById("no-sets-message");
const progressBar = document.getElementById("progress-bar");
const studyCardContainer = document.getElementById("study-card-container");
const cardOf = document.getElementById("card-of");
const cardOfTotal = document.getElementById("card-of-total");
const cardOfButtons = document.getElementById("card-of-buttons");
const cardOfTotalButtons = document.getElementById("card-of-total-buttons");
const finishStudyModal = document.getElementById("finish-study-modal");
const studyCardTitle = document.getElementById("study-card-title");
const progressBarPercentage = document.getElementById("progress-bar-percentage");
const createNewSetButton = document.getElementById("create-new-set-button");
const createSetSectionBack = document.getElementById("create-set-section-back");
const saveAddCardsButton = document.querySelectorAll("[data-type='add-button']");
const goHomeButton = document.getElementById("go-home-button");
const studyAgainButton = document.getElementById("study-again-button");
const finishSetName = document.getElementById("finish-set-name");
const finishCardsCount = document.getElementById("finish-cards-count");
const setsCount = document.getElementById("sets-count");
const alertMessage = document.getElementById("alert-message");
const alertMessageBg = document.getElementById("alert-message-bg");
const closeAlertMessageButton = document.getElementById("close-alert-message-button");
const createSetMessage = document.getElementById("create-set-message");
const deleteSetMessage = document.getElementById("delete-set-message");
const deleteCardMessage = document.getElementById("delete-card-message");
const deleteSetMessageBg = document.getElementById("delete-set-message-bg");
const studyingCard = document.querySelector("[data-type='studying-card-flip']");

let isFirstTime = null;
// console.log(`Esta app utiliza Node (V${versions.node()}) y Electron (V${versions.electron()})`)
document.documentElement.classList.toggle("dark", localStorage.theme === "dark");

window.API.onChangeTheme((event, theme) => {
    const root = document.documentElement;
    root.setAttribute("class", `${theme}`);
    localStorage.theme = theme;
})

document.addEventListener("DOMContentLoaded", (e) => {
  const firstTime = localStorage.getItem("firstTime") || "";

  if (firstTime === "false") {
    alertMessage.hidden = true;
    alertMessageBg.hidden = true;
  };
});

let isStudyngSet = false;
let studyngSet = null;
let studyngSetId = null;
let studyngCards = null;
let studyngSetName = null;
let currentCardIndex = 0;

let isEditing = false;
let editingSetId = null;

let editingCard = null;
let editingCardId = null;
let isEditingCard = false;

let deletingSet = null;
let deletingSetId = null;

let cardsToDelete = [];
let cardToDeleteIds = [];

createSetForm.addEventListener("submit", (e) => {
    e.preventDefault();
});
createPreviewCardForm.addEventListener("submit", (e) => {
    e.preventDefault();
});
createNewCardContainer.addEventListener("click", (e) => {
    const click = e.target;
    const cancelButton = click.matches("[data-type='cancel-button']");

    if (cancelButton) {
        createNewCardContainer.hidden = true;
        frontCardInput.value = "";
        backCardTextarea.value = "";
    };
});
document.addEventListener("click", (e) => {
    const click = e.target;
    const deleteButton = click.matches("[data-type='delete-button']");
    const editButton = click.matches("[data-type='edit-button']");
    const saveSet = click.matches("#save-set-button");
    const cancelDeleteSetButton = click.matches("#cancel-delete-set-button");
    const confirmDeleteSetButton = click.matches("#confirm-delete-set-button");
    
    if (deleteButton) {
      // const confirmDelete = confirm("¿Estas seguro que quieres eliminar este set? Esta accion no se puede deshacer");
      deleteSetMessage.hidden = false;
      deleteSetMessageBg.hidden = false;

      const container = click.closest("[data-type='set']");
      const setId = Number(container.id);
      deletingSet = container;
      deletingSetId = setId;
    };

    if (confirmDeleteSetButton) {
        deleteSetMessage.hidden = true;
        deleteSetMessageBg.hidden = true;
    
        const sets = JSON.parse(localStorage.getItem("sets") || "[]");
        const updateSets = sets.filter(set => set.id !== deletingSetId);
        localStorage.setItem("sets", JSON.stringify(updateSets));
        deletingSet.remove();

        const cards = JSON.parse(localStorage.getItem("cards") || "[]");
        const updatedCards = cards.filter(card => card.setId !== deletingSetId);
        localStorage.setItem("cards", JSON.stringify(updatedCards));

        updateSetsEmptyMessage();
        setsCount.textContent = setsContainer.children.length;
        deletingSetId = null;
        deletingSet = null;
    };

    if (cancelDeleteSetButton) {
        deleteSetMessage.hidden = true;
        deleteSetMessageBg.hidden = true;
        deletingSetId = null;
        deletingSet = null;
    }
 
    if (editButton) {
        isEditing = true;

        const container = click.closest("[data-type='set']");
        editingSetId = Number(container.id);
        const sets = JSON.parse(localStorage.getItem("sets") || "[]");
        const set = sets.find(set => set.id === editingSetId);

        showSection("create-set-section");
        setNameInput.value = set.name;
        setDescriptionInput.value = set.description;
        if (window.screen.width < 700) {
            createSetText.textContent  = "";
        } else {

            createSetText.textContent = "Editar Conjunto";
        };
        loadCards(editingSetId);
    };

    if (saveSet) {
        if (isEditing) {
            if (setNameInput.value.trim() === "" || setDescriptionInput.value.trim() === "") {
                alert("Completa todos los campos");
                return;
            };

            const sets = JSON.parse(localStorage.getItem("sets") || "[]");
            const set = sets.find(set => set.id === editingSetId);

            set.name = setNameInput.value.trim();
            set.description = setDescriptionInput.value.trim();
            // sets.push(set); // Si hago push se duplica el set.
            localStorage.setItem("sets", JSON.stringify(sets));
            saveCard(editingSetId);
            loadSets();
            showSection("main-section");

            isEditing = false;
            editingSetId = null;
            resetState();
        };
    };
});
document.addEventListener("click", (e) => {
    const click = e.target;

    // Para eliminar una card
    const deleteCardButton = click.matches("[data-type='delete-card-button']");
    const saveButton = click.matches("#save-set-button");
    const cancelDeleteCardButton = click.matches("#cancel-delete-card-button");
    const confirmDeleteCardButton = click.matches("#confirm-delete-card-button");


    if (deleteCardButton) {
        const confirmDelete = confirm("¿Estás seguro de eliminar esta tarjeta? Esta accion no puede deshacerse");

        if (confirmDelete) {
            const cardToDelete = click.closest("[data-type='card']");
            const cardToDeleteId = Number(cardToDelete.id);
            cardsToDelete.push(cardToDelete);
            cardToDeleteIds.push(cardToDeleteId);
            cardToDelete.remove();
            updateCardsEmptyMessage();
        };
    };

    // Para editar una card 
    const addButton = click.closest("[data-type='add-button']");
    const cancelButton = click.matches("[data-type='cancel-button']");
    const editButton = click.matches("[data-type='edit-card-button']");
    const frontCardText = document.querySelector("[data-type='front-card-text']");
    const backCardText = document.querySelector("[data-type='reverse-card-text']");

    if (editButton) {
        isEditingCard = true;
        const cardToEdit = click.closest("[data-type='card']");
        const cardToEditId = Number(cardToEdit.id);
        editingCard = cardToEdit;
        editingCardId = cardToEditId;

        if (isEditingCard) {
            frontCardInput.value = frontCardText.textContent.trim();
            backCardTextarea.value = backCardText.textContent.trim();
            showCreateCardForm();
        }; 
    };

    if (addButton) {
        if (isEditingCard) {
            frontCardText.textContent = frontCardInput.value.trim();
            backCardText.textContent = backCardTextarea.value.trim();
            createNewCardContainer.hidden = true;
            frontCardInput.value = "";
            backCardTextarea.value = "";
            // editingCard = null;
            // editingCardId = null;
            // isEditingCard = false;
        };
    };

    if (cancelButton) {
        editingCard = null;
        editingCardId = null;
        isEditingCard = false;
    };

    // Guardar el set 
    if (saveButton) {
        deleteCard(cardToDeleteIds);
        cardsToDelete = [];
        cardToDeleteIds = [];

        editCard(editingCardId);

        editingCard = null;
        editingCardId = null;
        isEditingCard = false;
    };
});
document.addEventListener("click", (e) => {
    const click = e.target;
    const studyButton = click.closest("[data-type='study-button']");
    if (studyButton) {
      if (studyButton.disabled === false) {
        studyngSet = click.closest("[data-type='set']");
        studyngSetId = Number(studyngSet.id);

        const sets = JSON.parse(localStorage.getItem("sets") || "[]");
        const setToStudyng = sets.find(set => set.id === studyngSetId);
        const setName = setToStudyng.name;
        studyngSetName = setName;
        finishSetName.textContent = setName;

        const cards = JSON.parse(localStorage.getItem("cards") || "[]");
        const setCards = cards.filter(card => card.setId === studyngSetId);
        studyngCards = setCards;
        finishCardsCount.textContent = setCards.length;
        showSection("study-section");

        studySet(studyngSet, studyngSetId, studyngSetName, studyngCards, currentCardIndex);
      };
    };

    if (click.matches("#study-again-button")) {
        currentCardIndex = 0;
        showSection("study-section");
        studySet(studyngSet, studyngSetId, studyngSetName, studyngCards, currentCardIndex);
    };

    if (click.matches("[data-type='back-section-button']")) {
        showSection("main-section")
        isStudyngSet = false;
        studyngSet = null;
        studyngSetId = null;
        studyngCards = null;
        studyngSetName = null
        currentCardIndex = 0;
    };

});
createNewSetButton.addEventListener("click", (e) => {
  showSection("create-set-section");
});
createSetSectionBack.addEventListener("click", (e) => {
  showSection("main-section");
});
saveSetButton.addEventListener("click", (e) => {
  createSet();
});
addCardButton.addEventListener("click", (e) => {
  showCreateCardForm();
});
saveAddCardsButton.forEach(button => {
  button.addEventListener("click", (e) => {
    createCard();
  });
});
goHomeButton.addEventListener("click", (e) => {
    showSection("main-section");
    isStudyngSet = false;
    studyngSet = null;
    studyngSetId = null;
    studyngCards = null;
    studyngSetName = null
    currentCardIndex = 0;
});
closeAlertMessageButton.addEventListener("click", (e) => {
  alertMessage.hidden = true;
  alertMessageBg.hidden = true;
  isFirstTime = false;
  localStorage.setItem("firstTime", isFirstTime);
});
studyingCard.addEventListener("click", (e) => {
    if (!studyingCard.classList.contains("rotate-y-180")) {
        studyingCard.classList.add("rotate-y-180");
    } else {
        studyingCard.classList.remove("rotate-y-180");
    }
});

loadSets();

function showSection(id) {
    const sections = document.querySelectorAll("main > section");
    sections.forEach(sec => sec.hidden = true);

    const section = document.getElementById(id);
    section.hidden = false;

    finishStudyModal.hidden = true;
    if (window.screen.width < 700) {
        createSetText.textContent = "";
    };
    resetState();
};

function loadSets() {
    const sets = JSON.parse(localStorage.getItem("sets") || "[]");
    const cards = JSON.parse(localStorage.getItem("cards") || "[]");

    setsCount.textContent = sets.length;

    if (sets.length === 0) {
        updateSetsEmptyMessage();

    } else {
        noSetsMessage.hidden = true;
        setsContainer.innerHTML =  sets.map(set => {
            const setCard = cards.filter(card => card.setId === set.id);
            return `
                <div class="max-w-[400px] max-h-[270px] w-full h-full max-[640px]:w-[100%] flex flex-col p-6 bg-white dark:bg-[#2A2D32] rounded-xl gap-4 shadow-sm hover:shadow-lg transition-shadow justify-between" id="${set.id}" data-type="set">
                    <header class="flex items-center justify-between">
                        <h3 class="font-semibold text-lg dark:text-[#E0E0E0] line-clamp-1" data-type="set-name-loaded">${set.name}</h3>
    
                        <div class="flex gap-4" data-type="edit-delete-container">
                            <div class="p-2 rounded-xl group hover:bg-blue-50 ">
                                <svg class="icon cursor-pointer fill-[#808080] dark:fill-[#E0E0E0] group-hover:fill-blue-500" data-type="edit-button" width="16px" height="16px">
                                    <use xlink:href="./public/icons/sprite.svg#icon-edit"></use>
                                </svg>
                            </div>

                            <div class="p-2 rounded-xl group hover:bg-red-50">
                                <svg class="icon cursor-pointer fill-[#808080] dark:fill-[#E0E0E0] group-hover:fill-red-500" data-type="delete-button" width="16px" height="16px">
                                    <use xlink:href="./public/icons/sprite.svg#icon-delete"></use>
                                </svg>
                            </div>
                        </div>
                    </header>
                            
                    <p class="text-gray-500 dark:text-[#B0B0B0] line-clamp-3 text-start items-center" data-type="set-description-loaded">${set.description}</p>
    
                    <div class="w-full justify-start flex items-center gap-6 mb-5">
                        <div class="flex items-center gap-1">
                            <svg class="icon dark:fill-[#E0E0E0]" width="16px" height="16px">
                                <use xlink:href="./public/icons/sprite.svg#icon-book"></use>
                            </svg>
                            <p class="text-gray-500 dark:text-[#B0B0B0]">${setCard.length} tarjetas</p>
                        </div>
    
                        <div class="flex items-center gap-1">
                            <svg class="icon dark:fill-[#E0E0E0]" width="16px" height="16px">
                                <use xlink:href="./public/icons/sprite.svg#icon-calendar"></use>
                            </svg>
                            <p class="text-gray-500 dark:text-[#B0B0B0]">${set.date}</p>
                        </div>
                    </div>
                    <button class="w-full ${setCard.length ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-500"} rounded-xl p-4 flex items-center justify-center text-white font-bold gap-4 ${setCard.length ? "cursor-pointer" : "cursor-not-allowed"} ${setCard.length ? "hover:scale-[1.01]" : ""} transition-transform" data-type="study-button" ${setCard.length === 0 ? "disabled" : ""}>${setCard.length ? "Estudiar" : "Sin tarjetas"}</button>
                </div>
            `
        }).join("");

        // let setNameLoaded = document.querySelector("[data-type='set-name-loaded']");
        // let setDescriptionloaded = document.querySelector("[data-type='set-description-loaded']");

        // console.log(setNameLoaded.textContent.charAt())
    };
};

function createSet() {

    if (isEditing) {

    } else {

        if (setNameInput.value.trim() === "" || setDescriptionInput.value.trim() === "") {
            alert("Completa todos los campos");
    
        } else {
            const sets = JSON.parse(localStorage.getItem("sets") || "[]");
            const newSet = {
                id: Date.now(),
                name: setNameInput.value.trim(),
                description: setDescriptionInput.value.trim(),
                date: new Date().toLocaleDateString(),
            };
    
            sets.push(newSet);
            localStorage.setItem("sets", JSON.stringify(sets));
            saveCard(newSet.id);
            loadSets();
            showSection("main-section");
            createSetMessage.hidden = false;
            setTimeout(() => {
              createSetMessage.style.top = "10%";
            }, 50);
            setTimeout(() => {
              createSetMessage.hidden = false;
              createSetMessage.style.top = "-20%";
            }, 2000);
        };
    };
};

function showCreateCardForm() {
    createNewCardContainer.hidden = false;
};

function createCard() {
    if (frontCardInput.value.trim() === "" || backCardTextarea.value.trim() === "") {
        alert("Completa todos los campos.");
        return;
    }; 

    if (isEditingCard) {

    } else {

        const newCardPreview = document.createElement("div");
        newCardPreview.setAttribute("data-type", "card");
        newCardPreview.innerHTML = `
            <div class="w-full border border-[#E5E7EB] dark:border-[#1A1D21] rounded-xl p-4 flex gap-20 max-[640px]:gap-6 max-[640px]:flex-col justify-between items-end hover:bg-[#F9FAFB] dark:hover:bg-[#1A1D21] transition-colors">
                <div class="w-full flex max-[640px]:justify-between gap-20 max-[640px]:gap-0">
                    <div>
                        <h3 class="text-sm text-gray-800 dark:text-[#E0E0E0]">Frente</h3>
                        <p class="text-sm text-gray-400 dark:text-[#B0B0B0]" data-type="front-card-text">${frontCardInput.value}</p>
                    </div>
                    <div>
                        <h3 class="text-sm text-gray-800 dark:text-[#E0E0E0]">Reverso</h3>
                        <p class="text-sm text-gray-400 dark:text-[#B0B0B0]" data-type="reverse-card-text">${backCardTextarea.value}</p>
                    </div>
                </div>
    
                <div class="flex gap-4" data-type="edit-delete-container">
                    <div class="p-2 rounded-xl group hover:bg-blue-50">
                        <svg class="icon cursor-pointer dark:fill-[#E0E0E0] fill-[#808080] group-hover:fill-blue-500" data-type="edit-card-button" width="16px" height="16px">
                            <use xlink:href="./public/icons/sprite.svg#icon-edit"></use>
                        </svg>
                    </div>

                    <div class="p-2 rounded-xl group hover:bg-red-50">
                        <svg class="icon cursor-pointer dark:fill-[#E0E0E0] fill-[#808080] group-hover:fill-red-500" data-type="delete-card-button" width="16px" height="16px">
                            <use xlink:href="./public/icons/sprite.svg#icon-delete"></use>
                        </svg>
                    </div>
                </div>
            </div>
        `
        cardsPreviewContainer.append(newCardPreview);
        createNewCardContainer.hidden = true;
        noCardsMessage.hidden = true;
        cardsCount.textContent = cardsPreviewContainer.children.length;
    };
};

function saveCard(setId) {
    if (isEditing) {
        const cards = JSON.parse(localStorage.getItem("cards") || "[]");
        const newCards = [...cardsPreviewContainer.querySelectorAll("[data-type='card']")];
        
        const createdCards = newCards
            .filter(card => !card.hasAttribute("data-load"))
            .map(card => ({
                id: Date.now() + Math.random(),
                front: card.querySelector("[data-type='front-card-text']").textContent.trim(),
                back: card.querySelector("[data-type='reverse-card-text']").textContent.trim(),
                setId: setId,
            }));

        cards.push(...createdCards);
        localStorage.setItem("cards", JSON.stringify(cards));
    } else {

        const cards = JSON.parse(localStorage.getItem("cards") || "[]");
        const newCards = [...cardsPreviewContainer.querySelectorAll("[data-type='card']")].map(card => {
            return {
                id: Date.now() + Math.random(),
                front: card.querySelector("[data-type='front-card-text']").textContent.trim(),
                back: card.querySelector("[data-type='reverse-card-text']").textContent.trim(),
                setId: setId,
            };
        });
    
        cards.push(...newCards);
        localStorage.setItem("cards", JSON.stringify(cards));
    };

};

function deleteCard(cardsId) {
    const cards = JSON.parse(localStorage.getItem("cards") || "[]");
    const updateCards = cards.filter(card => !cardsId.includes(card.id));

    localStorage.setItem("cards", JSON.stringify(updateCards));
    updateCardsEmptyMessage();
    loadSets();
};

function loadCards(setId) {
    const cards = JSON.parse(localStorage.getItem("cards") || "[]");
    const setCards = cards.filter(card => card.setId === setId);

    cardsPreviewContainer.innerHTML = `
        ${setCards.map(card => {
            return `
            <div data-type="card" data-load="true" id="${card.id}">
                <div class="w-full border border-[#E5E7EB] dark:border-[#1A1D21] rounded-xl p-4 flex gap-20 max-[640px]:gap-6 max-[640px]:flex-col justify-between items-end hover:bg-[#F9FAFB] dark:hover:bg-[#1A1D21] transition-colors">
                <div class="w-full flex max-[640px]:justify-between gap-20 max-[640px]:gap-0">
                    <div>
                        <h3 class="text-sm text-gray-800 dark:text-[#E0E0E0]">Frente</h3>
                        <p class="text-sm text-gray-400 dark:text-[#B0B0B0]" data-type="front-card-text">${card.front}</p>
                    </div>
                    <div>
                        <h3 class="text-sm text-gray-800 dark:text-[#E0E0E0]">Reverso</h3>
                        <p class="text-sm text-gray-400 dark:text-[#B0B0B0]" data-type="reverse-card-text">${card.back}</p>
                    </div>
                </div>

                    <div class="flex gap-4" data-type="edit-delete-container">
                        <div class="p-2 rounded-xl group hover:bg-blue-50">
                            <svg class="icon cursor-pointer fill-[#808080] dark:fill-[#E0E0E0] group-hover:fill-blue-500" data-type="edit-card-button" width="16px" height="16px">
                                <use xlink:href="./public/icons/sprite.svg#icon-edit"></use>
                            </svg>
                        </div>

                        <div class="p-2 rounded-xl group hover:bg-red-50">
                            <svg class="icon cursor-pointer fill-[#808080] dark:fill-[#E0E0E0] group-hover:fill-red-500" data-type="delete-card-button" width="16px" height="16px">
                                <use xlink:href="./public/icons/sprite.svg#icon-delete"></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            `
        }).join("")}
    `;

    createNewCardContainer.hidden = true;
    updateCardsEmptyMessage()
    cardsCount.textContent = cardsPreviewContainer.children.length;
};

function editCard(cardId) {
  if (isEditingCard) {
    const cards = JSON.parse(localStorage.getItem("cards") || "[]");
    const cardToEdit = cards.find(card => card.id === cardId);

    const frontCardText = editingCard.querySelector("[data-type='front-card-text']");
    const backCardText = editingCard.querySelector("[data-type='reverse-card-text']");

    cardToEdit.front = frontCardText.textContent;
    cardToEdit.back = backCardText.textContent;
    createNewCardContainer.hidden = true;
    frontCardInput.value = "";
    backCardTextarea.value = "";
    localStorage.setItem("cards", JSON.stringify(cards));
    // frontCardText = null;
    // backCardText = null;
  };
};

function studySet(set, setId, setName, cards, index) {
    // studySet(studyngSet, studyngSetId, studyngSetName, studyngCards, currentCardIndex);
    const currentCard = cards[index];
    const frontCardText = document.querySelector("[data-type='study-front-card-text']");
    const backCardtext = document.querySelector("[data-type='study-back-card-text']");

    frontCardText.textContent = currentCard.front;
    backCardtext.textContent = currentCard.back;
    studyCardTitle.textContent = setName;

    cardOf.textContent = index + 1;
    cardOfTotal.textContent = cards.length;
    cardOfButtons.textContent = index + 1;
    cardOfTotalButtons.textContent = cards.length;
    
    const backCardButton = document.getElementById("back-card-button");
    const nextcardButton = document.getElementById("next-card-button");
    
    backCardButton.disabled = index === 0;
    let percentage = (100 / cards.length) * (index + 1)
    progressBar.style.width =  `${percentage}%`;
    progressBarPercentage.textContent = parseInt(percentage);

    nextcardButton.onclick = () => {

        if (currentCardIndex === cards.length - 1) {
            progressBar.style.width = (100 / cards.length) * (index + 1); 
            document.getElementById("study-section").hidden = true;
            finishStudyModal.hidden = false;
            studyingCard.classList.remove("rotate-y-180");

        } else {

            currentCardIndex++;
            nextcardButton.firstChild.textContent = "Siguiente";
            progressBar.style.width = (100 / cards.length) * (index + 1); 
            studyingCard.classList.remove("rotate-y-180");

            studySet(studyngSet, studyngSetId, studyngSetName, studyngCards, currentCardIndex);
          };
    };

    backCardButton.onclick = () => {
        if (currentCardIndex === 0) {
            progressBar.style.width = (100 / cards.length) * (index + 1);
            studyingCard.classList.remove("rotate-y-180");
            
        } else {
            currentCardIndex--;
            nextcardButton.firstChild.textContent = "Siguiente";
            progressBar.style.width = (100 / cards.length) * (index + 1); 
            studyingCard.classList.remove("rotate-y-180");
        };

        studySet(studyngSet, studyngSetId, studyngSetName, studyngCards, currentCardIndex);
    };
};

function resetState() {
    setNameInput.value = "";
    setDescriptionInput.value = "";
    frontCardInput.value = "";
    backCardTextarea.value = "";
    cardsPreviewContainer.innerHTML = "";
    cardsCount.textContent = cardsPreviewContainer.children.length;
    noCardsMessage.hidden = false;
    if (window.screen.width < 700) {
        createSetText.textContent = "";
    } else {

        createSetText.textContent = "Crear conjunto";
    };
    createNewCardContainer.hidden = true;
};

function updateSetsEmptyMessage() {
    noSetsMessage.hidden = setsContainer.children.length !== 0;
};

function updateCardsEmptyMessage() {
    noCardsMessage.hidden = cardsPreviewContainer.children.length !== 0;
    cardsCount.textContent = cardsPreviewContainer.children.length;
};