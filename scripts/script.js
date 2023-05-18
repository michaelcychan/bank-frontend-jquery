const baseUri = "http://localhost:8080";

const sucessGetBankData = (data) => {
  const bankTitle = $("<h2 id=\"bank-name\"></h2>").text(data.bank);
  const bankAddress = $("<p></p>").text(data.address);
  const accountNumber = $("<p></p>").text("The bank has " + data["clients-number"] + " clients.");
  const bankDetailsContainer = $("<div id='bank-detail-container'></div>")

  const michaelAccountButton = $("<button id='michael-account'></button>").text("Check Michael's Account");
  
  bankDetailsContainer.append(bankTitle);
  bankDetailsContainer.append(bankAddress);
  bankDetailsContainer.append(accountNumber);

  if (data["clients-number"] > 0) {
    bankDetailsContainer.append(michaelAccountButton);
    michaelAccountButton.click(()=> {
      getMichaelAccounts();
    })
  }

  $("div.container").empty();
  $("div.container").append(bankDetailsContainer);
}

const failedGetBankData = (status) => {
  const failHeading = $("<h2 id=\"bank-name\"></h2>").text("Failed to get data");
    const errorMessage = $("<p></p>").text(status);
    $("div.container").append(failHeading);
    $("div.container").append(errorMessage);
}

const getMichaelAccounts = () => {
  $.ajax({
    url: baseUri + "/client/Michael"
  })
  .always((data, status) => {
    console.log(data);
  })
  .done((data, status) => {
    const clientName = data.name;
    const numberOfAccounts = data.numberOfAccounts;
    const isVip = data.vip ? "is" : "is not";
    const accountList = data.accounts;
    const pluralAccount = numberOfAccounts > 1 ? "s" : "";

    const clientSummarySentence = $("<div id='client-summary'></div>").text(`${clientName} ${isVip} a VIP. ${clientName} has ${accountList.length} account${pluralAccount}.`);

    const clientContainer = $("<div id='client-container'></div>")

    clientContainer.append(clientSummarySentence);
    
    if (numberOfAccounts > 0) {
      const accountContainer = $("<ul id='account-wrapper'></ul>")

      for (account of accountList) {
        const accountItemId = account.currency + "-list-item"
        const accountItem = $("<li class='account-list'></div>").text(`${account.currency}: ${account.amount}`);
        accountItem.attr('id', accountItemId);
        accountContainer.append(accountItem);
      }
      clientContainer.append(accountContainer);
    }
    $("div.container").append(clientContainer);
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

