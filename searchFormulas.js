const urls = [
  "https://gist.githubusercontent.com/KRadusz/c504616bd607393b99631a40f06f116d/raw/compressed_output_part_1.js",
  "https://gist.githubusercontent.com/KRadusz/c2782348bc9d8ba50c7e61efc8b2ac71/raw/compressed_output_part_2.js",
  "https://gist.githubusercontent.com/KRadusz/0fa219bc76ad51543d40779a4e32ee21/raw/compressed_output_part_3.js",
];

async function fetchAndConcatenate(urls) {
  try {
    // Fetch all the URLs
    const responses = await Promise.all(urls.map((url) => fetch(url)));

    // Check if all responses are OK
    const allOk = responses.every((response) => response.ok);
    if (!allOk) {
      throw new Error("Failed to fetch one or more parts");
    }

    // Get the text content from all responses
    const parts = await Promise.all(responses.map((response) => response.text()));

    // Concatenate the parts
    const concatenated = parts.join("");

    // Assuming the concatenated result needs to be evaluated as JavaScript
    eval(concatenated);
    return BarCodeData;
  } catch (error) {
    console.error("Error fetching or concatenating parts:", error);
  }
}

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
    var limitNum = 50;
    var loopNum = 0;
    var found_results = [];
    // elm ids
    var product_name = document.getElementById("product_name");
    var card_name = document.getElementById("card_name");
    var colour_name = document.getElementById("colour_name");
    var pack_size = document.getElementById("pack_size");

    for (var i = 0; i < this.data.length; i++) {
      // check Product name input
      if (product_name.value !== "any" && this.data[i].PRODUCTNAME.toLowerCase() !== colourCodeArr[product_name.value].toLowerCase()) {
        continue;
      }

      // check colour card name input
      if (card_name.value !== "any" && this.data[i].CARDNAME.toLowerCase() !== cardNameArr[card_name.value].toLowerCase()) {
        continue;
      }

      // check can size
      if (pack_size.value !== "any" && this.data[i].PACKSIZE.toLowerCase() !== pack_size.value.toLowerCase()) {
        continue;
      }
      // if (this.data[i].CARDNAME == "RAL 840HR") {
      //   console.log(this.data[i]);
      //   break;
      // }
      // check colour name input
      if (typeof this.data[i].COLOURNAME === "string" && this.data[i].COLOURNAME.trim() !== "") {
        var colourName = this.data[i].COLOURNAME.toLowerCase();
      }

      if (typeof this.data[i].COLOURCODE === "string" && this.data[i].COLOURCODE.trim() !== "") {
        var colourCode = this.data[i].COLOURCODE.toLowerCase();
      }

      if (typeof this.data[i].ALTCOLOURCODE === "string" && this.data[i].ALTCOLOURCODE.trim() !== "") {
        var colourAltColour = this.data[i].ALTCOLOURCODE.toLowerCase();
      }
      try {
        // check text in colour name if needed
        if (colourName && colourName.includes("to complement*?")) {
          const splitParts = this.data[i].COLOURNAME.split("To Complement*?");
          if (splitParts.length > 1) {
            this.data[i].COLOURNAME = splitParts[1];
          }
        }

        if (colourCode.includes(colour_name.value.toLowerCase()) || colourName.includes(colour_name.value.toLowerCase()) || colourAltColour.includes(colour_name.value.toLowerCase())) {
          found_results.push(this.data[i]);
          // go through loop num to adjust max displayed limit num
          loopNum += 1;
          if (loopNum == limitNum) {
            break;
          }
        }
      } catch (error) {
        continue;
      }
    }

    return found_results;
  }
}

async function SearchCodes() {
  const BarCodeData = await fetchAndConcatenate(urls);
  const found_results = new FindColours(BarCodeData).searchValues();
  const limitNum = 50;

  const result_body = document.getElementById("result_body");
  const no_results = document.getElementById("no_results");
  const result_table = document.getElementById("result_table");
  const too_many_results = document.getElementById("too_many_results");

  // Toggle visibility of results, too many results, and no results messages
  result_table.style.display = found_results.length > 0 ? "" : "none";
  no_results.style.display = found_results.length > 0 ? "none" : "";
  too_many_results.style.display = found_results.length === limitNum ? "" : "none";

  result_body.innerHTML = found_results
    .map((result) => {
      const cardName = result.CARDNAME.includes("Bedec Complementary Colours") ? result.CARDNAME.split("Bedec Complementary Colours - ")[1] : result.CARDNAME;

      return `
      <tr>
        <td>${result.PRODUCTNAME}</td>
        <td>${result.COLOURCODE}</td>
        <td>${cardName}</td>
        <td>${result.COLOURNAME}</td>
        <td>${result.BASECODE}</td>
        <td>${result.PACKSIZE}</td>
        <td style="background-color:${result.RGB_HTML};"></td>
        <td><button class="btn btn-sm btn-primary m-2" onclick="ViewBarcode('${result.PRODUCTNAME}', '${result.BASECODE}', '${result.BrewersProductCode}', '${result.PACKSIZE}', '${Number(
        result.BedecProductBarcode
      )}', '${result.COLOURNAME}', '${result.BrewersProductCode}')">Select</button></td>
      </tr>`;
    })
    .join("");
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
