function showPrivacyPolicyPopup() {
  // check local storage
  const popupState = localStorage.getItem("acceptPrivacyPolicy");
  switch (popupState) {
    case null:
      break;
    case "accept":
      return;
    default:
      console.warn(
        `value unexpected value of local storage acceptPrivacyPolicy: ${popupState}`
      );
      break;
  }

  // display dialog
  const dialog = document.getElementById("privacyPolicyDialog");
  dialog.show();

  dialog.addEventListener("close", () => {
    switch (dialog.returnValue) {
      case "accept":
        localStorage.setItem("acceptPrivacyPolicy", "accept");
        break;
      default:
        console.error(
          `unexpected value of privacy popup dialog returnValue: ${popup.returnValue}`
        );
        return;
    }
  });
}

showPrivacyPolicyPopup();
