chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("Data request", request);
        $.ajax({
            url: request.url,
            method: request.method ? request.method : "GET",
            data: request.data ? JSON.stringify(request.data) : {},
            contentType: "Application/JSON",
            crossDomain: true
        }).always(function (response) {
            console.log("Data response", response);
            sendResponse(response);
        });
        return true;
    }
);
