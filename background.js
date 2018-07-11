
var currentTabId = 0;
var currentTabURL = "null";
function doStuff(){
	window.focus();
}
// chrome.commands.onCommand.addListener(function(command) {

// 	alert ("1. Inside Listener");
	
// 	chrome.tabs.query({active:true, currentWindow: true}, function(arrayOfTabs) {

// 		alert("2. Filtering Results");
// 		currentTabURL = arrayOfTabs[0].url;
// 		currentTabId = arrayOfTabs[0].id; 
// 		chrome.tabs.executeScript({
// 			code:'('+doStuff+')();'
// 		},(result)=>{
// 			console.log(result);
// 		});	
// 	});
	
// 	if (command == "toggle") 
// 	{
// 		alert ("3. Resolved Command");
// 		alert ("TAB ID = " + currentTabId + "\n URL =  " + currentTabURL);
// 	}
	
	
	 
// });
// A function to use as callback
function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
}

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
    // ...check the URL of the active tab against our pattern and...
    if (urlRegex.test(tab.url)) {
        // ...if it matches, send a message specifying a callback too
        chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
    }
});
