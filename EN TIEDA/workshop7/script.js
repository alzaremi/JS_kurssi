// Itse koodattu datan käsittelevä funktio
function parsiData(data){
  // Rakennetaan HTML-esitys datasta 
  let taulu = `
      <table border='1'>
          <tr>
              <td>${data.text}</td>
              <td>${data.author}</td>
          </tr>
      </table>        
      `;
   // Tulostetaan konsoliin   
   console.log(taulu)   
   // Tuodaan html-muuttuja ruudulle näkyviin data-nimiseen elementtiin.
   document.querySelector("#data").innerHTML = taulu;
}