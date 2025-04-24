colourCodeArr = {
  AAEE: "Aqua Advanced Eggshell",
  AAGE: "Aqua Advanced Gloss",
  AAME: "Aqua Advanced Matt",
  AASE: "Aqua Advanced Satin",
  BME: "Barn Paint Matt",
  BSE: "Barn Paint Satin",
  BSGE: "Barn Paint Semi Gloss",
  EFE: "Extra - Flex",
  FPI: "Floor Paint Interior",
  IFI: "Interior Flex",
  MSFGE: "Multi Surface Paint Gloss",
  MSFME: "Multi Surface Paint Matt",
  MSFSE: "Multi Surface Paint Satin",
  SDMI: "Spray Daylight Matt",
};

cardNameArr = {
  AAC: "Bedec Complementary Colours - AL",
  ASAC: "Bedec Complementary Colours - AS",
  BS3: "British Standard 381C",
  BS4: "British Standard 4800",
  BS5: "British Standard 5252F",
  BP: "Bedec Products",
  CCBPM: "CC Bedec - Barn Paint - Matt",
  CCBPS: "CC Bedec - Barn Paint - Satin",
  CCBPSG: "CC Bedec - Barn Paint - Semi Gloss",
  CCBEF: "CC Bedec - Extra-Flex",
  CCBMSPG: "CC Bedec - MSP - Gloss",
  CCBMSPM: "CC Bedec - MSP - Matt",
  CCBMSS: "CC Bedec - MSP - Satin",
  CCBMSPGL: "CC Bedec - MSP Gloss",
  DGAC: "Bedec Complementary Colours - DG",
  DHAC: "Bedec Complementary Colours - DH",
  EAC: "Bedec Complementary Colours - EB",
  FBAC: "Bedec Complementary Colours - FB",
  FBCBN: "Bedec Complementary Colours - FBCBN",
  GBAC: "Bedec Complementary Colours - GB",
  LAAC: "Bedec Complementary Colours - LA",
  LGAC: "Bedec Complementary Colours - LG",
  LGCOEAC: "Bedec Complementary Colours - LGC",
  MLNAC: "Bedec Complementary Colours - MLN",
  NCSSE: "NCS Second Edition 2009",
  PPLIBAC: "Bedec Complementary Colours - PPL",
  RAL: "RAL 840HR",
  RALBS: "RAL 840HR Bedec Satin",
  SAC: "Bedec Complementary Colours - SA",
  ZAC: "Bedec Complementary Colours - ZO",
  DLXWS: "Bedec Complementary Colours - DLXWS",
  FBA: "Bedec Complementary Colours - FBA",
  SAD: "Bedec Complementary Colours - SAD",
  STX: "Bedec Complementary Colours - STX",
};

class FindColours {
  constructor(data) {
    this.data = data;
  }
  searchValues() {
    const limitNum = 50;
    let loopNum = 0;
    const found_results = [];

    const product_name = document.getElementById("product_name").value.toLowerCase();
    const card_name = document.getElementById("card_name").value.toLowerCase();
    const colour_name = document.getElementById("colour_name").value.toLowerCase();
    const pack_size = document.getElementById("pack_size").value.toLowerCase();

    for (let i = 0; i < this.data.length; i++) {
      const row = this.data[i];

      if (!row.CARDNAME || !row.COLOURNAME) continue;

      // Product Name Match
      if (product_name !== "any") {
        const prod = row.PRODUCTNAME || "";
        const expectedName = colourCodeArr[product_name.toUpperCase()];
        if (!expectedName || prod.toLowerCase() !== expectedName.toLowerCase()) continue;
      }

      // Card Name Match
      if (card_name !== "any") {
        const expectedCard = cardNameArr[card_name.toUpperCase()];
        if (!expectedCard || row.CARDNAME.toLowerCase() !== expectedCard.toLowerCase()) continue;
      }

      // Pack Size Match
      if (!row.PACKSIZE || row.PACKSIZE.toLowerCase() !== pack_size) continue;

      // Colour Name Match
      let colour = row.COLOURNAME.toLowerCase();
      let code = (row.COLOURCODE || "").toLowerCase();
      let alt = (row.ALTCOLOURCODE || "").toLowerCase();

      // Clean up "To Complement" prefix
      if (colour.includes("to complement")) {
        colour = colour.split("to complement")[1].trim();
      }

      if (colour.includes(colour_name) || code.includes(colour_name) || alt.includes(colour_name)) {
        found_results.push(row);
        loopNum++;
        if (loopNum === limitNum) break;
      }
    }

    return found_results;
  }
}

var BarCodeData = [];

$(document).ready(function () {
  fetch("https://raw.githubusercontent.com/KRadusz/BedecColourNamesSearch/TestingNewFile/ColourSearchDoc.csv")
    .then((response) => response.text())
    .then((text) => {
      const rows = text.trim().split("\n");
      const headers = rows[0].split(",");

      BarCodeData = rows.slice(1).map((row) => {
        const values = row.split(",");
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index].trim();
          return obj;
        }, {});
      });
    })
    .catch((err) => console.error("Failed to load CSV:", err));
});

function SearchCodes() {
  console.log(BarCodeData);
  var ColourVal = new FindColours(BarCodeData);
  var found_results = ColourVal.searchValues();
  var limitNum = 50;
  // put into body
  const result_body = document.getElementById("result_body");
  const no_results = document.getElementById("no_results");
  const result_table = document.getElementById("result_table");
  const too_many_results = document.getElementById("too_many_results");
  // if length is 0
  if (found_results.length > 0) {
    result_table.style.display = "";
    no_results.style.display = "none";

    if (found_results.length == limitNum) {
      too_many_results.style.display = "";
    } else {
      too_many_results.style.display = "none";
    }
  } else {
    no_results.style.display = "";
    result_table.style.display = "none";
    too_many_results.style.display = "none";
  }

  result_body.innerHTML = "";
  for (i = 0; i < found_results.length; i++) {
    const tr = document.createElement("tr");
    const pd = document.createElement("td");
    pd.innerHTML = found_results[i].PRODUCTNAME;
    const cc = document.createElement("td");
    cc.innerHTML = found_results[i].COLOURCODE;
    const ccn = document.createElement("td");
    // if it includes long txt
    if (found_results[i].CARDNAME.includes("Bedec Complementary Colours")) {
      var split_info = found_results[i].CARDNAME;
      ccn.innerHTML = split_info.split("Bedec Complementary Colours - ")[1];
    } else {
      ccn.innerHTML = found_results[i].CARDNAME;
    }

    const cn = document.createElement("td");
    cn.innerHTML = found_results[i].COLOURNAME;
    const bc = document.createElement("td");
    bc.innerHTML = found_results[i].BASECODE;
    const pack_size = document.createElement("td");
    pack_size.innerHTML = found_results[i].PACKSIZE;
    const rgb_td = document.createElement("td");
    rgb_td.style.backgroundColor = found_results[i].RGB_HTML;
    rgb_td.innerHTML = found_results[i].RGB_HTML;
    const select_td = document.createElement("td");
    const select_btn = document.createElement("button");
    select_btn.className = "btn btn-sm btn-primary m-2";
    select_btn.innerHTML = "Select";

    select_btn.setAttribute(
      "onclick",
      "ViewBarcode('" +
        pd.innerHTML +
        "','" +
        bc.innerHTML +
        "','" +
        found_results[i].BrewersProductCode +
        "','" +
        pack_size.innerHTML +
        "','" +
        Number(found_results[i].BedecProductBarcode) +
        "','" +
        found_results[i].COLOURNAME +
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
  }
}

function ViewBarcode(product_name, base_name, product_code, packsize, barcode, colour_name, rgb_colour) {
  $(window).scrollTop(0);
  const selected_div = document.getElementById("selected_div");
  const main_cover_div = document.getElementById("main_cover_div");
  main_cover_div.style.display = "";
  main_cover_div.style.zIndex = "1";
  selected_div.style.display = "";

  const productName = document.getElementById("product_name_display");
  productName.innerHTML = product_name;

  const baseName = document.getElementById("base_name_display");
  baseName.innerHTML = base_name;

  const productCode = document.getElementById("product_code_display");
  productCode.innerHTML = product_code;

  const ColourName = document.getElementById("colour_name_display");
  ColourName.innerHTML = colour_name;

  const packSize = document.getElementById("pack_size_display");
  packSize.innerHTML = packsize;

  const barCode = document.getElementById("barcode_code_display");
  barCode.innerHTML = barcode;

  $(".barcode").JsBarcode(barcode);
  $(".barcode1").JsBarcode(rgb_colour);
}

function closeView() {
  const selected_div = document.getElementById("selected_div");
  const main_cover_div = document.getElementById("main_cover_div");
  main_cover_div.style.display = "none";
  main_cover_div.style.zIndex = "-1";
  selected_div.style.display = "none";
}
