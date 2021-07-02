const getMessagesByNum = async (num) => {
    let params = `type=number&num=${encodeURIComponent(num)}`;
    const url = `https://script.google.com/macros/s/AKfycbz4NWaHpV_kZVHL2KcuKlYxbp2gHrSw8BsfYSydFm8zy7I7-awLOyJBz3fuJ8gO3mTnRA/exec?${params}`;
    let resp = await fetch(url);
    let data = await resp.json();

    return data;
}

const getMessagesByDate = async (date) => {
    let params = `type=date&num=${encodeURIComponent(date)}`;
    const url = `https://script.google.com/macros/s/AKfycbz4NWaHpV_kZVHL2KcuKlYxbp2gHrSw8BsfYSydFm8zy7I7-awLOyJBz3fuJ8gO3mTnRA/exec?${params}`;
    let resp = await fetch(url);
    let data = await resp.json();

    return data;
}

const getMessages = async () => {
    let params = `type=default`;
    const url = `https://script.google.com/macros/s/AKfycbz4NWaHpV_kZVHL2KcuKlYxbp2gHrSw8BsfYSydFm8zy7I7-awLOyJBz3fuJ8gO3mTnRA/exec?${params}`;
    let resp = await fetch(url);
    let data = await resp.json();

    return data;
}

// source: https://stackoverflow.com/a/3177838/10402278
const calcTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let int = seconds / 31536000; // one year

    if (int > 1) {
        return Math.floor(int) === 1 ? Math.floor(int) + " yr" : Math.floor(int) + " yrs";
    }
    int = seconds / 2592000;
    if (int > 1) {
        return Math.floor(int) === 1 ? Math.floor(int) + " mon" : Math.floor(int) + " mons";;
    }
    int = seconds / 86400;
    if (int > 1) {
        return Math.floor(int) === 1 ? Math.floor(int) + " day" : Math.floor(int) + " days";;
    }
    int = seconds / 3600;
    if (int > 1) {
        return Math.floor(int) === 1 ? Math.floor(int) + " hr" : Math.floor(int) + " hrs";;
    }
    int = seconds / 60;
    if (int > 1) {
        return Math.floor(int) === 1 ? Math.floor(int) + " min" : Math.floor(int) + " mins";
    }
    return Math.floor(int) === 1 ? Math.floor(int) + " sec" : Math.floor(int) + " secs";;
}

const buildDashboard = (messages) => {

    storeInSession(messages[0]);

    const $messages = document.getElementById("messages");

    const $container = document.createElement("div");
        $container.classList.add("messages-normessage");

    const $title = document.createElement("h2");
        $title.textContent = "norMessage";

    const $newBtn = document.createElement("a");
            $newBtn.classList.add("btn-rect", "messages-btn");
            $newBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-plus">
        <use href="/icons.svg#plus"></use>
      </svg> start a conversation`;
            $newBtn.onclick = (e) => {
                buildEmptyThread();
            }

    $container.append($title, $newBtn);

    const $table = document.createElement("table");
        $table.classList.add("messages-preview");

    messages.forEach((m) => {
        const $row = buildPreview(m);
        $table.append($row);
    });

    $messages.append($container, $table);
}

const buildPreview = (message) => {
    const $tr = document.createElement("tr");
        $tr.classList.add("messages-preview-row");
    
    const $td = document.createElement("td");
        $td.classList.add("messages-preview-data");

    const recipient = message.from === "+18012441991" ? message.to : message.from;

    const $recipient = document.createElement("p");
        $recipient.classList.add("messages-preview-recipient");
        $recipient.textContent = recipient;
    const $preview = document.createElement("p");
        $preview.classList.add("messages-preview-body");

        if (message.body.length > 120) {
            $preview.textContent = message.body.substring(0, 120) + "...";
        } else {
            $preview.textContent = message.body;
        }

    $td.append($recipient, $preview);
    
    const $date = document.createElement("td");
        $date.classList.add("messages-preview-date");
        $date.innerHTML = calcTimeAgo(message.date_sent)

    $tr.setAttribute("data-recipient", recipient);
    $tr.append($td, $date);

    $tr.onclick = async (e) => {
        buildScreensaver("getting texts...");
        const $target = e.target.closest("tr");
        const recipient = $target.getAttribute("data-recipient");
        const msgs = await getMessagesByNum(recipient);
        removeScreensaver();
        buildThread(msgs);
    }
    return $tr;

}

const refreshPreview = async () => {
    const $table = document.querySelector(".messages-preview");
    const msgs = await getMessages();
    // console.log(`refreshPreview -> msgs`, msgs);

    checkSession(msgs[0]);
    
    $table.innerHTML = "";
    
    msgs.forEach((m) => {
        const $row = buildPreview(m);
        $table.append($row);
    });

}

const storeInSession = (data) => {
    sessionStorage.setItem("normal-last-msg", JSON.stringify(data));
}

const checkSession = (data) => {
    const lastMsg = sessionStorage.getItem("normal-last-msg");

    if (JSON.stringify(data) !== lastMsg) {
        const audio = new Audio("../assets/audio/textNotification.mp3");
        audio.play();
        storeInSession(data);
    }
}

const buildEmptyThread = () => {
    const $threadContainer = document.createElement("section");
        $threadContainer.classList.add("messages-container");

    const $thread = document.createElement("div");
        $thread.classList.add("messages-thread");

    const $header = buildEmptyThreadHeader();
    const $footer = buildThreadFooterPlaceholder();

    $threadContainer.append($header, $thread, $footer);

    const $main = document.querySelector("main");

    $main.append($threadContainer);
    $thread.scrollTop = $thread.scrollHeight;
}

const buildThread = (messages) => {
    const $threadContainer = document.createElement("section");
        $threadContainer.classList.add("messages-container");

    const $thread = document.createElement("div");
        $thread.classList.add("messages-thread");

    const firstMessage = messages[0];
    const recipient = (firstMessage.from === "+18012441991" || firstMessage.from === "+12153984647") ? firstMessage.to : firstMessage.from;

    // storeInSession(messages[0]);
    
    messages.forEach((m) => {
        const $message = buildMessage(m);
        $thread.prepend($message);
    })

    const $header = buildThreadHeader(recipient);
    const $footer = buildThreadFooter(recipient);

    $threadContainer.append($header, $thread, $footer);

    const $main = document.querySelector("main");

    $main.append($threadContainer);
    $thread.scrollTop = $thread.scrollHeight;

}

const refreshThread = async () => {
    const $thread = document.querySelector(".messages-thread");

    const $text = document.getElementById("outgoing-message");
    const recipient = $text.getAttribute("data-recipient");

    const msgs = await getMessagesByNum(recipient);
    // console.log(`refreshThread -> msgs`, msgs);

    $thread.innerHTML = "";

    msgs.forEach((m) => {
        const $message = buildMessage(m);
        $thread.prepend($message);
    })
    $thread.scrollTop = $thread.scrollHeight;

}

const buildEmptyThreadHeader = () => {
    const $threadHeader = document.createElement("div");
        $threadHeader.classList.add("messages-header");

    const $container = document.createElement("div");
        $container.classList.add("messages-boundingbox");

    const $btn = document.createElement("aside");
        $btn.classList.add("messages-thread-close");
        $btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-left">
        <use href="/icons.svg#arrow-left"></use>
      </svg>`;
        $btn.onclick = (e) => {
            refreshPreview();
            const $thread = document.querySelector(".messages-container");
            $thread.remove();
        }

    const $number = document.createElement("input");
        // $number.textContent = num;
        $number.id = "message-recipient";
        $number.setAttribute("placeholder", "new message");
        $number.pattern = "[0-9]{10,11}";

    $number.onkeyup = async (e) => {
        const num = checkNum(e.target.value);
        if (num) {
            buildScreensaver("checking for texts...");
            const msgs = await getMessagesByNum(num);

            if (msgs.length) {
                const $thread = document.querySelector(".messages-container");
                $thread.remove();
                buildThread(msgs);
                removeScreensaver();
            } else {
                setFooterRecipient(num);
                disableHeaderEdits(num);
                removeScreensaver();
            }

        } 
    }

    $container.append($btn, $number);
    $threadHeader.append($container);
    return $threadHeader;
}

const buildThreadFooterPlaceholder = () => {
    const $threadFooter = document.createElement("div");
        $threadFooter.classList.add("messages-footer");

    const $form = document.createElement("form");
        $form.classList.add("messages-boundingbox");
    
    const $textArea = document.createElement("textarea");
        $textArea.id = "outgoing-message";
        $textArea.name = "outgoing-message";
        $textArea.setAttribute("placeholder", "enter recipient number first!");
        // $textArea.setAttribute("data-recipient", num);
        $textArea.disabled = true;
        $textArea.classList.add("messages-disabled-text");

    const $btn = document.createElement("button");
        $btn.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-right">
        <use href="/icons.svg#arrow-right"></use>
      </svg>`;
        $btn.classList.add("messages-disabled-btn");
    
    $form.append($textArea, $btn);
    $threadFooter.append($form);
    
    return $threadFooter;
}

const setFooterRecipient = (num) => {
    const $textArea = document.getElementById("outgoing-message");
        $textArea.setAttribute("placeholder", "text message");
        $textArea.setAttribute("data-recipient", num);
        $textArea.classList.remove("messages-disabled-text");
        $textArea.disabled = false;

    const $btn = document.querySelector(".messages-disabled-btn");
        $btn.onclick = async (e) => {
            e.preventDefault();
            const $text = document.getElementById("outgoing-message");
            const message = $text.value;
            const recipient = $text.getAttribute("data-recipient");
            await sendMessage(recipient, message);
            $text.value = "";
            refreshThread();
        }
        $btn.classList.remove("messages-disabled-btn");
}

const disableHeaderEdits = (num) => {
    const $numberInput = document.getElementById("message-recipient");

    const $number = document.createElement("span");
        $number.textContent = num;

    $numberInput.parentNode.replaceChild($number, $numberInput);
}

const checkNum = (num) => {
    if (num.length === 10) {
        return `+1${num}`;
    } else if (num[0] === 1 && num.length === 11) {
        return `+${num}`
    } else {
        return false;
    }
}

const buildThreadHeader = (num) => {
    const $threadHeader = document.createElement("div");
        $threadHeader.classList.add("messages-header");

    const $container = document.createElement("div");
        $container.classList.add("messages-boundingbox");

    const $btn = document.createElement("aside");
        $btn.classList.add("messages-thread-close");
        $btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-left">
        <use href="/icons.svg#arrow-left"></use>
      </svg>`;
        $btn.onclick = (e) => {
            refreshPreview();
            const $thread = document.querySelector(".messages-container");
            $thread.remove();
        }

    const $number = document.createElement("span");
        $number.textContent = num;

    $container.append($btn, $number);
    $threadHeader.append($container);
    return $threadHeader;
}

const buildThreadFooter = (num) => {
    const $threadFooter = document.createElement("div");
        $threadFooter.classList.add("messages-footer");

    const $form = document.createElement("form");
        $form.classList.add("messages-boundingbox");
    
    const $textArea = document.createElement("textarea");
        $textArea.id = "outgoing-message";
        $textArea.name = "outgoing-message";
        $textArea.setAttribute("placeholder", "text message");
        $textArea.setAttribute("data-recipient", num);

    const $btn = document.createElement("button");
        $btn.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-right">
        <use href="/icons.svg#arrow-right"></use>
      </svg>`;
        $btn.onclick = async (e) => {
            e.preventDefault();
            const $text = document.getElementById("outgoing-message");
            const message = $text.value;
            const recipient = $text.getAttribute("data-recipient");
            await sendMessage(recipient, message);
            $text.value = "";
            refreshThread();
        }
    
    $form.append($textArea, $btn);
    $threadFooter.append($form);
    
    return $threadFooter;
}

const buildMessage = (message) => {
    const $container = document.createElement("aside");
        $container.classList.add(`messages-thread-${message.direction}`);
    const $text = document.createElement("p");
        $text.classList.add("text-body");
        $text.innerHTML = message.body;
    const $date = document.createElement("p");
    const date = prettyPrintDate(message.date_sent);
        $date.textContent = date;
        $date.classList.add("text-date");

    $container.append($text, $date);
    return $container;

}

const sendMessage = async (num, msg) => {
    let params = `num=${encodeURIComponent(num)}&msg=${encodeURIComponent(msg)}`;
    const url = `https://script.google.com/macros/s/AKfycbz4NWaHpV_kZVHL2KcuKlYxbp2gHrSw8BsfYSydFm8zy7I7-awLOyJBz3fuJ8gO3mTnRA/exec?${params}`;
    let resp = await fetch(url, { method: "POST", mode: "no-cors" });
    // let data = await resp.json();

    return resp;
}

const checkForRefresh = () => {
    const $openThread = document.querySelector(".messages-thread");
    if ($openThread) {
        refreshThread();
    } else {
        refreshPreview();
    }
}

const load = () => {
    const $main = document.querySelector("main");
    const $children = $main.children;
    const childrenArr = [ ...$children ];
    childrenArr.forEach((c) => {
        c.classList.add("lazy-load");
    })
}

const auth = () => {
    const $login = document.createElement("form");
        $login.classList.add("admin-login");
    const $name = document.createElement("input");
        $name.setAttribute("type", "text");
        $name.classList.add("admin-name");
        $name.id = "admin-name";
        $name.name = "admin-name";
        $name.setAttribute("placeholder", "enter your name");
    const $password = document.createElement("input");
        $password.setAttribute("type", "password");
        $password.classList.add("admin-password");
        $password.id = "admin-password";
        $password.name = "admin-password";
        $password.setAttribute("placeholder", "enter admin password");
    const $btn = document.createElement("button");
        $btn.classList.add("admin-btn");
        $btn.textContent = "login";
        $btn.onclick = async (e) => {
            e.preventDefault();
            buildScreensaver("checking credentials...");
            const user = document.getElementById("admin-name").value;
            const pw = document.getElementById("admin-password").value;
            const pwCheck = await checkPw(pw, user);
            if (pwCheck.status === "success") {
                removeAuth();
                const keyCheck = await checkKey();
                if (keyCheck.status === "success") {
                    const msgs = await getMessages();
                    buildDashboard(msgs);
                    removeScreensaver();
                } else {
                    makeScreensaverError("authentication error!");
                }
            } else {
                makeScreensaverError("wrong password!");
            }
        }

    $login.append($name, $password, $btn);
    const $messages = document.getElementById("messages");
    $messages.append($login);
}

const removeAuth = () => {
    const $loginForm = document.querySelector(".admin-login");
    $loginForm.remove();
}

const checkPw = async (pw, user) => {
    let params = `pw=${encodeURIComponent(pw)}&name=${encodeURIComponent(user)}`;
    const url = `https://script.google.com/macros/s/AKfycbzVA9WRPY286tq__0xjU349qoJjAw7EoRKx67lGBhHqO2bFAjsdFPrY1tbWMbQXZzaJmQ/exec?${params}`;
    let resp = await fetch(url);
    let data = await resp.json();
    sessionStorage.setItem("normal-admin-key", data.key);
    return data;
}

const checkKey = async () => {
    const key = sessionStorage.getItem("normal-admin-key");
    let params = `key=${encodeURIComponent(key)}`;
    const url = `https://script.google.com/macros/s/AKfycbzVA9WRPY286tq__0xjU349qoJjAw7EoRKx67lGBhHqO2bFAjsdFPrY1tbWMbQXZzaJmQ/exec?${params}`;
    let resp = await fetch(url);
    let data = await resp.json();

    return data;
}

window.onload = async (e) => {

    load();
    hideCart();

    const keyCheck = await checkKey();
    if (keyCheck.status === "success") {
        buildScreensaver("getting texts...");
        const msgs = await getMessages();
        checkSession(msgs[0]);
        buildDashboard(msgs);
        removeScreensaver();
    } else {
        auth();
    }

    setInterval(checkForRefresh, 30 * 1000);

}