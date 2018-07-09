//region {variables and functions}
var consoleGreeting = "Hello World!";
var responseObject = {
	message : "Test message Y",
	sender : "content_script.js"
};
function GetFormattedMessageString(message,sender) {
	return "Message '" + message + "' from Sender '" + sender.id + "'";
}
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
console.log(consoleGreeting);
var button = createButton();
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
	sendResponse(responseObject); //Will get called from the script where sendResponse is defined
	console.log(GetFormattedMessageString(message,sender));
});
//end-region
