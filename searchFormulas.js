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
  AAC: "Bedec Complementry Colours - AL",
  ASAC: "Bedec Complementry Colours - AS",
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
  DGAC: "Bedec Complementry Colours - DG",
  DHAC: "Bedec Complementry Colours - DH",
  EAC: "Bedec Complementry Colours - EB",
  FBAC: "Bedec Complementry Colours - FB",
  GBAC: "Bedec Complementry Colours - GB",
  LAAC: "Bedec Complementry Colours - LA",
  LGAC: "Bedec Complementry Colours - LG",
  LGCOEAC: "Bedec Complementry Colours - LGC",

  MLNAC: "Bedec Complementry Colours - MLN",
  NCSSE: "NCS Second Edition 2009",
  PPLIBAC: "Bedec Complementry Colours - PPL",
  RAL: "RAL 840HR",
  RALBS: "RAL 840HR Bedec Satin",
  SAC: "Bedec Complementry Colours - SA",
  ZAC: "Bedec Complementry Colours - ZO",
};

BarCodeData1.push(BarCodeData2);
BarCodeData1.push(BarCodeData3);
BarCodeData = BarCodeData1;

function SearchCodes() {
  BarCodeData1;
  BarCodeData2;
  BarCodeData3;
  const data = BarCodeData;
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
    if (data[i].COLOURCODE == null) {
      continue;
    }
    colourCode = data[i].COLOURCODE.toLowerCase();
    AltcolourCode = data[i].ALTCOLOURCODE.toLowerCase();
    colourName = data[i].COLOURNAME.toLowerCase();
    productName = data[i].PRODUCTNAME;
    cardName = data[i].CARDNAME;

    // Check statements...
    // Check if product item does not matches
    data_match = false;
    // If both drop downs are selected
    if (product_name.value != "any" && card_name.value != "any") {
      // if it does not exist, continue loop
      if (
        productName.includes(colourCodeArr[product_name.value]) &&
        cardName.includes(cardNameArr[card_name.value])
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
        if (productName.includes(colourCodeArr[product_name.value])) {
          data_match = data[i];
        } else {
          continue;
        }
      }

      // check if card name has value to select
      if (card_name.value != "any")
        if (cardName.includes(cardNameArr[card_name.value])) {
          data_match = data[i];
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
    const ccn = document.createElement("td");
    // if it includes long txt
    if (found_results[i].CARDNAME.includes("Bedec Complementry Colours")) {
      var split_info = found_results[i].CARDNAME;
      ccn.innerHTML = split_info.split("Bedec Complementry Colours - ")[1];
    } else {
      ccn.innerHTML = found_results[i].CARDNAME;
    }

    const cn = document.createElement("td");
    cn.innerHTML = found_results[i].COLOURNAME;
    const bc = document.createElement("td");
    bc.innerHTML = found_results[i].BASECODE;
    const pack_size = document.createElement("td");
    pack_size.innerHTML = found_results[i].PackSize;
    const rgb_td = document.createElement("td");
    rgb_td.style.backgroundColor = found_results[i].RGB_HTML;
    const select_td = document.createElement("td");
    const select_btn = document.createElement("button");
    select_btn.className = "btn btn-sm btn-primary m-2";
    select_btn.innerHTML = "Select";
    select_btn.setAttribute(
      "onclick",
      "ViewBarcode('" +
        found_results[i].BrewersProductCode +
        "','" +
        found_results[i].BedecProductBarcode +
        "','" +
        found_results[i].BrewersProductCode +
        "')"
    );

    select_td.appendChild(select_btn);

    found_results[i].COLOURCODE;
    tr.appendChild(pd);
    tr.appendChild(cc);
    tr.appendChild(ccn);
    tr.appendChild(cn);
    tr.appendChild(bc);
    tr.appendChild(pack_size);
    tr.appendChild(rgb_td);
    tr.appendChild(select_td);

    result_body.appendChild(tr);

    // const barcode_svg = document.createElementNS(
    //   "http://www.w3.org/2000/svg",
    //   "svg"
    // );
    // barcode_svg.className.baseVal = "rows_bardcode_" + i;
    // What info should be in js barcode
    // $(".rows_bardcode_" + i).JsBarcode(found_results[i].COLOURCODE, {
    //   width: 0.8,
    //   height: 50,
    //   displayValue: false,
    // });
  }
}

function ViewBarcode(product_code, barcode, rgb_colour) {
  const selected_div = document.getElementById("selected_div");
  selected_div.style.display = "";
  const productCode = document.getElementById("product_code_display");
  productCode.innerHTML = product_code;
  const barCode = document.getElementById("barcode_code_display");
  barCode.innerHTML = barcode;

  $(".barcode").JsBarcode(barcode);
  $(".barcode1").JsBarcode(rgb_colour);
}

function closeView() {
  const selected_div = document.getElementById("selected_div");
  selected_div.style.display = "none";
}
