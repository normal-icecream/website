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
    var int = seconds / 31536000; // one year

    if (int > 1) {
        return Math.floor(int) + " yrs";
    }
    int = seconds / 2592000;
    if (int > 1) {
        return Math.floor(int) + " mons";
    }
    int = seconds / 86400;
    if (int > 1) {
        return Math.floor(int) + " days";
    }
    int = seconds / 3600;
    if (int > 1) {
        return Math.floor(int) + " hrs";
    }
    int = seconds / 60;
    if (int > 1) {
        return Math.floor(int) + " mins";
    }
    return Math.floor(seconds) + " secs";
}

const buildDashboard = (messages) => {

    const $messages = document.getElementById("messages");

    const $table = document.createElement("table");
        $table.classList.add("messages-preview");

    messages.forEach((m) => {
        const $row = buildPreview(m);
        $table.append($row);
    });

    $messages.append($table);
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
    $table.innerHTML = "";

    const msgs = await getMessages();

    msgs.forEach((m) => {
        const $row = buildPreview(m);
        $table.append($row);
    });

}

const buildThread = (messages) => {
    const $threadContainer = document.createElement("section");
        $threadContainer.classList.add("messages-container");

    const $thread = document.createElement("div");
        $thread.classList.add("messages-thread");

    const firstMessage = messages[0];
    const recipient = firstMessage.from === "+18012441991" ? firstMessage.to : firstMessage.from;
    
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
    $thread.innerHTML = "";

    const $text = document.getElementById("outgoing-message");
    const recipient = $text.getAttribute("data-recipient");

    const msgs = await getMessagesByNum(recipient);

    msgs.forEach((m) => {
        const $message = buildMessage(m);
        $thread.prepend($message);
    })
    $thread.scrollTop = $thread.scrollHeight;

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
    const url = `https://script.google.com/macros/s/AKfycbwiFd8X0UGEDkXppGZHHrY7uJsubJ8eG_OUwfbgPJ0OWABqO-Oha2uIoQYi7g0Q0GJVYw/exec?${params}`;
    let resp = await fetch(url);
    let data = await resp.json();
    sessionStorage.setItem("normal-admin-key", data.key);
    return data;
}

const checkKey = async () => {
    const key = sessionStorage.getItem("normal-admin-key");
    let params = `key=${encodeURIComponent(key)}`;
    const url = `https://script.google.com/macros/s/AKfycbwiFd8X0UGEDkXppGZHHrY7uJsubJ8eG_OUwfbgPJ0OWABqO-Oha2uIoQYi7g0Q0GJVYw/exec?${params}`;
    let resp = await fetch(url);
    let data = await resp.json();

    return data;
}

window.onload = async (e) => {

    load();
    hideCart();

    const keyCheck = await checkKey();
    if (keyCheck.status === "success") {
        const msgs = await getMessages();
        buildDashboard(msgs);
    } else {
        auth();
    }

    setInterval(checkForRefresh, 30 * 1000);

}