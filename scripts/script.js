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

$(document).ready(()=> {
  $("button#getBankDetails").click(()=>{
    $.ajax({
      url: "http://localhost:8080/get-bank-detail",
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