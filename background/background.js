chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("Data request", request);
        if (request.action === 'ajax') {
            var token = localStorage.getItem('token');
            if (token && token !== "undefined") {
                $.ajax({
                    url: request.url,
                    method: request.method ? request.method : "GET",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    },
                    data: request.data ? JSON.stringify(request.data) : {},
                    contentType: "application/json",
                    crossDomain: true
                }).always(function (response) {
                    sendResponse(response);
                });
            } else {
                $.ajax({
                    url: request.url,
                    method: request.method ? request.method : "GET",
                    data: request.data ? JSON.stringify(request.data) : {},
                    contentType: "application/json",
                    crossDomain: true
                }).always(function (response) {
                    sendResponse(response);
                });
            }
        }  else if (request.action === 'login') {
            $.ajax({
                url: request.url,
                method: request.method ? request.method : "GET",
                data: request.data ? JSON.stringify(request.data) : {},
                contentType: "application/json",
                crossDomain: true
            }).always(function (response) {
                if (response.id_token) {
                    localStorage.setItem('token', response.id_token);
                    sendResponse("ok");
                } else {
                    sendResponse("error");
                }
            });
        } else if (request.action === 'verify') {
            var token = localStorage.getItem('token');
            if (token && token !== "undefined") {
                sendResponse("ok");
            } else {
                sendResponse("error");
            }
        }
        return true;
    }
);
