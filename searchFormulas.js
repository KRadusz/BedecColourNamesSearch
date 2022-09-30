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
      const colour_code = document.getElementById("colour_code");
      const alt_colour_code = document.getElementById("alt_colour_code");
      const colour_name = document.getElementById("colour_name");

      for (i = 0; i < data.length; i++) {
        // break if enough found
        if (found_results.length == limitNum) {
          break;
        }

        colourCode = data[i].COLOURCODE.toLowerCase();
        AltcolourCode = data[i].ALTCOLOURCODE.toLowerCase();
        colourName = data[i].COLOURNAME.toLowerCase();

        // Check statements
        if (colour_code.value.length > 0) {
          if (!colourCode.includes(colour_code.value.toLowerCase())) {
            continue;
          }
        }
        if (alt_colour_code.value.length > 0) {
          if (!AltcolourCode.includes(alt_colour_code.value.toLowerCase())) {
            continue;
          }
        }
        if (colour_name.value.length > 0) {
          if (!colourName.includes(colour_name.value.toLowerCase())) {
            continue;
          }
        }
        found_results.push(data[i]);
      }
      console.log(found_results);
      // put into body
      const result_body = document.getElementById("result_body");
      result_body.innerHTML = "";
      for (i = 0; i < found_results.length; i++) {
        const tr = document.createElement("tr");

        const cc = document.createElement("td");
        cc.innerHTML = found_results[i].COLOURCODE;
        const acc = document.createElement("td");
        acc.innerHTML = found_results[i].ALTCOLOURCODE;
        const cn = document.createElement("td");
        cn.innerHTML = found_results[i].COLOURNAME;
        const bc = document.createElement("td");
        bc.innerHTML = found_results[i].BASECODE;

        tr.appendChild(cc);
        tr.appendChild(acc);
        tr.appendChild(cn);
        tr.appendChild(bc);
        result_body.appendChild(tr);
      }
    });
}
