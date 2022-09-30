colourCodeArr = {
  AAEE: "Aqua Advanced Eggshell Exterior",
  AAGE: "Aqua Advanced Gloss Exterior",
  AAME: "Aqua Advanced Matt Exterior",
  AASE: "Aqua Advanced Satin Exterior",
  BME: "Barn Matt Exterior",
  BSE: "Barn Satin Exterior",
  BSGE: "Barn Semi Gloss Exterior",
  EFE: "Extra - Flex Exterior",
  FPI: "Floor Paint Interior",
  IFI: "Interior Flex Interior",
  MSFGE: "Multi Surface Paint Gloss Exterior",
  MSFME: "Multi Surface Paint Matt Exterior",
  MSFSE: "Multi Surface Paint Satin Exterior",
  SDMI: "Spray Daylight Matt Interior",
};

cardNameArr = {
  AAC: "Albany-Alternative Colours",
  ASAC: "Annie Sloan-Alternative Colours",
  BS3: "British Standard 381C",
  BS4: "British Standard 4800",
  BS5: "British Standard 5252F",
  CCBPM: "CC Bedec - Barn Paint - Matt",
  CCBPS: "CC Bedec - Barn Paint - Satin",
  CCBPSG: "CC Bedec - Barn Paint - Semi Gloss",
  CCBEF: "CC Bedec - Extra-Flex",
  CCBMSPG: "CC Bedec - MSP - Gloss",
  CCBMSPM: "CC Bedec - MSP - Matt",
  CCBMSS: "CC Bedec - MSP - Satin",
  CCBMSPGL: "CC Bedec - MSP Gloss",
  DGAC: "Designers Guild-Alternative Colours",
  DHAC: "Dulux Heritage-Alternative Colours",
  EAC: "Earthborn-Alternative Colours",
  FBAC: "FB-Alternative Colours",
  GBAC: "GRAHAM & BROWN-Alternative Colours",
  LAAC: "Laura Ashley-Alternative Colours",
  LGCOEAC: "Little Green COE-Alternative Colours",
  LGAC: "Little Green-Alternative Colours",
  MLNAC: "Mylands - Neutrals-Alternative Colours",
  NCSSE: "NCS Second Edition 2009",
  PPLIBAC: "Paint & Paper Lib-Alternative Colours",
  RAL: "RAL 840HR",
  RALBS: "RAL 840HR Bedec Satin",
  SAC: "Sandrerson-Alternative Colours",
  ZAC: "Zoffany-Alternative Colours",
};

function SearchCodes() {
  fetch(
    "https://gist.githubusercontent.com/KRadusz/058648856e201875612d572f6f5bdf69/raw/9cac6a6657f2263388eede316ed5df8e1c6bed73/ColourNamesSearch.json"
  )
    .then((results) => {
      return results.json();
    })
    .then((data) => {
      const limit_results = document.getElementById("limit_results");
      var limitNum = limit_results.value;
      var found_results = [];
      // elm ids
      var product_name = document.getElementById("product_name");
      var card_name = document.getElementById("card_name");
      var colour_name = document.getElementById("colour_name");

      for (i = 0; i < data.length; i++) {
        // break if enough found
        if (found_results.length == limitNum) {
          break;
        }

        colourCode = data[i].COLOURCODE.toLowerCase();
        AltcolourCode = data[i].ALTCOLOURCODE.toLowerCase();
        colourName = data[i].COLOURNAME.toLowerCase();
        productName = data[i].PRODUCTNAME.toLowerCase();
        cardName = data[i].CARDNAME.toLowerCase();

        // Check statements...
        // Check if product item does not matches
        data_match = false;
        // If both drop downs are selected
        if (product_name.value != "any" && card_name.value != "any") {
          // if it does not exist, continue loop
          if (
            productName.includes(
              colourCodeArr[product_name.value].toLowerCase()
            ) &&
            cardName.includes(cardNameArr[card_name.value].toLowerCase())
          ) {
            data_match = data[i];
          } else {
            continue;
          }
        }
        // else, work through them one by one
        else {
          // check if product has value to select
          if (product_name.value != "any") {
            // if it does not exist, continue loop
            if (
              productName.includes(
                colourCodeArr[product_name.value].toLowerCase()
              )
            ) {
              data_match = data[i];
            } else {
              continue;
            }
          }

          // check if card name has value to select
          if (card_name.value != "any")
            if (cardName.includes(cardNameArr[card_name.value].toLowerCase())) {
              data_match = data[i];
              console.log(data_match, cardNameArr[card_name.value]);
            } else {
              continue;
            }
        }

        // If colour name input has no value
        if (data_match && colour_name.value.length == 0) {
          found_results.push(data[i]);
          continue;
        }

        // Check if there is also info in input fields
        if (colour_name.value.length > 0) {
          //console.log(data[i], colourName, colour_name.value.toLowerCase());
          // 1) check if data match IS SET, then look for colour name
          if (
            (colourCode.includes(colour_name.value.toLowerCase()) ||
              AltcolourCode.includes(colour_name.value.toLowerCase()) ||
              colourName.includes(colour_name.value.toLowerCase())) &&
            data_match
          ) {
            found_results.push(data[i]);
            continue;
          }
          // If data match IS NOT SET then look for values outside of data set
          if (product_name.value == "any" && card_name.value == "any") {
            if (
              colourCode.includes(colour_name.value.toLowerCase()) ||
              AltcolourCode.includes(colour_name.value.toLowerCase()) ||
              colourName.includes(colour_name.value.toLowerCase())
            ) {
              found_results.push(data[i]);
              continue;
            }
          }
        }
      }
      // put into body
      const result_body = document.getElementById("result_body");
      result_body.innerHTML = "";
      for (i = 0; i < found_results.length; i++) {
        const tr = document.createElement("tr");
        const pd = document.createElement("td");
        pd.innerHTML = found_results[i].PRODUCTNAME;
        const cc = document.createElement("td");
        cc.innerHTML = found_results[i].COLOURCODE;
        const acc = document.createElement("td");
        acc.innerHTML = found_results[i].ALTCOLOURCODE;
        const cn = document.createElement("td");
        cn.innerHTML = found_results[i].COLOURNAME;
        const bc = document.createElement("td");
        bc.innerHTML = found_results[i].BASECODE;
        tr.appendChild(pd);
        tr.appendChild(cc);
        tr.appendChild(acc);
        tr.appendChild(cn);
        tr.appendChild(bc);
        result_body.appendChild(tr);
      }
    });
}
