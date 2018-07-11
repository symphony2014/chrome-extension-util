//region {variables and functions}
function createButton() {
	console.log(document);
	var button = document.createElement("a");
	button.href=location.href+"/archive/master.zip";
	button.style.position = "fixed";
	button.style.background="rgb(84, 165, 69)";
	button.style.top = "10px";
	button.style.color="white";
	button.style.padding="2em";
	button.style.right = "10px";
	button.innerText = "download zip file for github";
	document.body.appendChild(button);
	return button;
}
//end-region



//region {calls}
var button = createButton();
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
	sendResponse(responseObject); //Will get called from the script where sendResponse is defined
});
//end-region