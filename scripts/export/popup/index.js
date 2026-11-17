const checkButton = document.querySelector("#check-script");
const scriptStatus = document.querySelector("#script-status");
const restorePanelsButton = document.querySelector("#restore-panels");
const extensionApi = globalThis.browser ?? globalThis.chrome;
const onclickScriptEnabled = false;

async function runOnclickScript() {
  try {
    const [tab] = await extensionApi.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id) {
      throw new Error("No active tab is available.");
    }

    await extensionApi.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/onclick/index.js"],
    });
  } catch (error) {
    console.info("Rino extension: onclick script could not run on this page.", error);
  }
}

if (onclickScriptEnabled) {
  runOnclickScript();
}

checkButton.addEventListener("click", () => {
  scriptStatus.textContent = "Check complete — JavaScript is running.";
  scriptStatus.classList.add("is-success");
});

restorePanelsButton.addEventListener("click", async () => {
  await extensionApi.storage.local.set({
    closedInsertedPages: [],
    insertedPanelsRestoreRevision: Date.now(),
  });
  scriptStatus.textContent = "Inserted panels restored across open tabs.";
  scriptStatus.classList.add("is-success");
});
