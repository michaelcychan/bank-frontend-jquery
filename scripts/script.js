const baseUri = "http://localhost:8080";

const sucessGetBankData = (data) => {
  const bankTitle = $("<h2 id=\"bank-name\"></h2>").text(data.bank);
  const bankAddress = $("<p></p>").text(data.address);
  const accountNumber = $("<p></p>").text("The bank has " + data["clients-number"] + " clients.");
  const bankDetailsContainer = $("<div id='bank-detail-container'></div>")

  const showClientListBtn = $("<button id='show-clients'></button>").text("Show all clients");
  
  bankDetailsContainer.append(bankTitle);
  bankDetailsContainer.append(bankAddress);
  bankDetailsContainer.append(accountNumber);
  

  if (data["clients-number"] > 0) {
    bankDetailsContainer.append(showClientListBtn);
    showClientListBtn.click(()=> {
      getAllClients();
    })
  }

  $("div.container").empty();
  $("div.container").append(bankDetailsContainer);
}

const getAllClients = () => {
  $.ajax({
    url: baseUri + "/get-all-clients"
  })
  .always((data, status) => {
    console.log(data);
  })
  .done((data, status) => {
    generateClientButtons(data);
  })
}

const generateClientButtons = (data) => {
  $("div#client-buttons-container").remove();
  const clientButtonContainer = $("<div id='client-buttons-container'></div>");
  for (let i = 0; i < data.length; i++) {
    const cliName = data[i];
    const clientBtn = $("<button></button>").text("Check " + cliName + "'s Account");
    clientBtn.attr('id', cliName + "-btn");
    clientBtn.click(()=> {
      getAccount(cliName);
    })

    clientButtonContainer.append(clientBtn)
  }
  $("div#client-container").remove();

  $("div.container").append(clientButtonContainer);

}

const failedGetBankData = (status) => {
  const failHeading = $("<h2 id=\"bank-name\"></h2>").text("Failed to get data");
    const errorMessage = $("<p></p>").text(status);
    $("div.container").append(failHeading);
    $("div.container").append(errorMessage);
}

const displayClient = (data) => {
  const clientName = data.name;
  const numberOfAccounts = data.numberOfAccounts;
  const isVip = data.vip ? "is" : "is not";
  const accountList = data.accounts;
  const pluralAccount = numberOfAccounts > 1 ? "s" : "";

  const clientSummarySentence = $("<div id='client-summary'></div>").text(`${clientName} ${isVip} a VIP. ${clientName} has ${accountList.length} account${pluralAccount}.`);

  $("div#client-container").remove();
  const clientContainer = $("<div id='client-container'></div>")

  clientContainer.append(clientSummarySentence);
  
  if (numberOfAccounts > 0) {

    //TODO: refactor this section to another function
    const accountContainer = $("<ul id='account-wrapper'></ul>")

    for (account of accountList) {
      const accountItemId = account.currency + "-list-item"
      const accountItem = $("<li class='account-list'><div></div></li>").text(`${account.currency}: ${account.amount}`);
      accountItem.attr('id', accountItemId);

      const inputFieldID = account.currency + "-input"
      const accountInput = $("<input type='number' min='0' step='100'></input>")
      accountInput.attr('id', inputFieldID);

      const addAmountButton = $("<button></button>").text("Add");
      addAmountButton.attr('id', account.currency + "-add");
      addAmountButton.click(()=> {
        const amount = parseInt($("#"+inputFieldID).val());
        changeAmount(clientName, inputFieldID.split("-")[0], amount, "deposit");
      })

      const reduceAmountButton = $("<button></button>").text("Reduce");
      reduceAmountButton.attr('id', account.currency + "-reduce");
      reduceAmountButton.click(() => {
        const amount = parseInt($("#"+inputFieldID).val());
        changeAmount(clientName, inputFieldID.split("-")[0], amount, "withdraw")
      })

      accountItem.append(accountInput);
      accountItem.append(addAmountButton);
      accountItem.append(reduceAmountButton);
      accountContainer.append(accountItem);
    }
    clientContainer.append(accountContainer);
    accountContainer.hide();
    accountContainer.fadeIn("slow");
  }
  $("div.container").append(clientContainer);
}

const changeAmount = (clientName, currency, amount, action) => {
  if (isNaN(amount)) {
    return;
  }
  if (action !== "deposit" && action !== "withdraw") {
    return;
  }
  const obj = (action === "deposit") ?
    {
        client: clientName,
        currency: currency,
        deposit: amount
    } :  
    {
      client: clientName,
      currency: currency,
      withdraw: amount
    }

  const payload = JSON.stringify(obj);
  
  $.ajax({
    url: baseUri + "/account/move-fund",
    type: "PUT",
    contentType: "application/json",
    dataType: "json",
    data: payload,
  })
  .always((data,status) => {
    console.log(status);
    console.log(status);
  })
  .done((data, status) => {
    console.log(data)
    getAccount(clientName);
  })
}

const getAccount = (accountName) => {
  $.ajax({
    url: baseUri + "/client/" + accountName
  })
  .always((data, status) => {
    console.log(data);
  })
  .done((data, status) => {
    displayClient(data);
  })
}

$(document).ready(()=> {
  $("button#getBankDetails").click(()=>{
    $.ajax({
      url: baseUri + "/get-bank-detail",
    })
    .always((data, status)=> {
      console.log(status);
    })
    .done((data, status) => {
      sucessGetBankData(data);
    }
    )
    .fail((data, status)=> {
      failedGetBankData(status);
    })
  })
})

