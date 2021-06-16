const getMessagesByNum = () => {
    let params = `type=number&num=${encodeURIComponent("+18017129909")}`;
    const url = `https://script.google.com/macros/s/AKfycbzo8zjl5ID6P4ppR5HKIf-6C4IMOocIkvXQK0ZSdIgLRrWL1kDpZthPEgdKZ8lUrTnCTQ/exec?${params}`;
    let resp = await fetch(url);
    let data = await resp.json();

    console.log(data);
}