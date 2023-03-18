class PopupElement extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'open' });

    // Create the trigger button
    const triggerButton = document.createElement('button');
    triggerButton.innerText = 'Open Popup';
    triggerButton.addEventListener('click', () => {
      this.openPopup();
    });

    // Create the popup container
    const popupContainer = document.createElement('div');
    popupContainer.setAttribute('class', 'popup-container');
    popupContainer.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.addEventListener('click', () => {
      this.closePopup();
    });

    // Create the content slot
    const contentSlot = document.createElement('slot');
    contentSlot.setAttribute('name', 'content');

    // Add the elements to the shadow root
    shadow.appendChild(triggerButton);
    popupContainer.appendChild(closeButton);
    popupContainer.appendChild(contentSlot);
    shadow.appendChild(popupContainer);

    // Hide the popup
    popupContainer.style.display = 'none';

    // Handle clicks outside the popup
    document.addEventListener('click', () => {
      this.closePopup();
    });
    popupContainer.addEventListener('click', () => {
      event.stopPropagation();
    });

    // Handle the Esc key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closePopup();
      }
    });
  }

  openPopup() {
    const popupContainer = this.shadowRoot.querySelector('.popup-container');
    popupContainer.style.display = 'block';
  }

  closePopup() {
    const popupContainer = this.shadowRoot.querySelector('.popup-container');
    popupContainer.style.display = 'none';
  }
}

// Define the custom element
customElements.define('popup-element', PopupElement);