tab_id = 0;
tab_active = false;

var listener = function(tabId, changeInfo, tab) {
	if (changeInfo.status === 'complete' && new URL(tab.url).host == "mnogoref.ru") {
		/// Встроить скрипт во вкладку после загрузки страницы
		chrome.tabs.executeScript(tab.id, { file: "jquery.js"}, function (result) {
			chrome.tabs.executeScript(tab.id, { code: inject_script, runAt: 'document_end' }, function (result) {
                       
        	});
		});
	} else {
		if (changeInfo.status === 'complete') {
			setTimeout(function() {
				chrome.tabs.remove(tab.id, function() {});
			}, 12000);
		}
	}
}
chrome.tabs.onUpdated.addListener(listener);

inject_script = `
setTimeout(function() {
	if (document.location.href == "https://mnogoref.ru/view" || document.location.href == "https://mnogoref.ru/viewvip") {
		elems = $(".col-lg-3");
		id_elem = 0;
		get_task();
		function get_task() {
			if (id_elem < elems.length) {
				if (elems.eq(id_elem).find("button").eq(0).attr("disabled") === undefined) {
					chrome.runtime.sendMessage("https://mnogoref.ru/"+elems.eq(id_elem).find("a").eq(2).attr("href"), function (response) {});
					elems.eq(id_elem).find("button").eq(0).click();
					clear_timer = setInterval(function() {
						if ($("title").html() == "Загрузка...") {
							clearInterval(clear_timer);
							id_elem++;
							setTimeout(function() {get_task()}, 900);
						}
					}, 1000);
				} else {
					id_elem++;
					setTimeout(function() {get_task()}, 900);
				}
			} else {
				alert("good");
			}
		}
	}
}, 2000);
`;