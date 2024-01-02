const fetch = require('node-fetch');
const util = require('util');

// ----------------Global Function ----------------
function formatDate(date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join("-");
}
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

//   ---------------- END ----------------

// ----------------Global Vraiable----------------
let TDdate = new Date();
TDdate.setHours(0, 0, 0, 0);
TDdate.setDate(TDdate.getDate() + 32);
//32

let clientID = "a6117d55cbb808bc935a7bf943ef8bda6bf61966f7675a19363c2ba4f9517c25";
//"0014a6eab8d113e2c0ad68f1879b3c3b8819cae40525f11bc01f3889cb879043";
// "4ccc4e08acc840dd1bb776d5fb7eeb5656b5415487d7d9500c1a72525bae9e53";


let animeData = [];
let animeIds = [];
let rawData = []

// ----------------Global Vraiable----------------

// fix from git
// console.dir(myArry, {'maxArrayLength': null});
// util.inspect.defaultOptions.maxArrayLength = null;


// ----------------Functions ----------------
const getAnime = async () => {
  try {
    const dataOf33Days = await fetch("https://data.simkl.in/calendar/anime.json");
    const psDataOf33Days = await dataOf33Days.json();
    rawData.push(...psDataOf33Days);
  } catch (error) {
    console.log(error);
    console.log("Fail To GET 33Days OF Data");
  }
  for (let index = 0; index < 332; index++) {
    const airingURL =
      `https://api.simkl.com/anime/airing?date=${formatDate(
        TDdate
      )}&sort=time&client_id=${clientID}`;
    TDdate.setDate(TDdate.getDate() + 1);
    try {
      const dailyFetchData = await fetch(airingURL);
      const psDailyFetchData = await dailyFetchData.json();
      if (!psDailyFetchData) {
        console.log(`Empty Day${TDdate}`);
      }
      else {
        const psDailyFetchDataDateADD = psDailyFetchData.map((anime) => {
          if (!anime.date) {
            anime.date = TDdate;
            console.log(`Date ADDED ${TDdate}`)
            return anime
          }
          else if (new Date(anime.date) < TDdate) {
            anime.date = TDdate;
            console.log(`API Errror${TDdate}`)
            console.log(anime)
            return anime
          }
          else { return anime }

        }).filter(Boolean)
        rawData.push(...psDailyFetchDataDateADD);
      }

    } catch (error) {
      console.log(error);
      console.log("Fail To GET Data");
    }
    //  console.log(util.inspect(rawData, { maxArrayLength: null }))
  }
  return rawData
}




const getOnlyIdsAndTitle = async (fetchedData) => {

  let arrayOfTitles = fetchedData.map((anime) => anime.title)
  const removeDublicated = fetchedData.filter((item, index) => {
    const indexOfArray = arrayOfTitles.indexOf(item.title)
    return indexOfArray === index
  })

  const idsAndTitle = removeDublicated.map((anime) => {
    return {
      title: anime.title,
      ids: anime.ids
    }
  })
  return idsAndTitle
}

module.exports = { getOnlyIdsAndTitle, getAnime };




const loadCalender = async () => {
  const clientID =
    "4ccc4e08acc840dd1bb776d5fb7eeb5656b5415487d7d9500c1a72525bae9e53";
  const data33 = await fetch("https://data.simkl.in/calendar/anime.json");
  const ptjson = await data33.json();
  await addorNot(ptjson);

  for (let index = 0; index < 332; index++) {
    TDdate.setDate(TDdate.getDate() + 1);
    const UrlAring = `https://api.simkl.com/anime/airing?date=${formatDate(
      TDdate
    )}&sort=time&client_id=${clientID}`;
    const data332 = await fetch(UrlAring);
    const psjson = await data332.json();
    await addorNot(psjson);
  }
};


// async function addorNot(data) {
//   if (!data) {
//     console.log("This is Null");
//   } else {
//     const mapdata = data.map((anime) => {
//       if (!anime.date) {
//         anime.date = TDdate;
//       }
//       return anime;
//     });
//     for (const anime of mapdata) {
//       const cddata = await findtest.find({
//         "ids.simkl_id": anime.ids.simkl_id,
//         "episode.episode": anime.episode.episode,
//       });

//       if (!cddata.length) {
//         console.log("Found Nothing");
//         const addnew = new findtest(anime);
//         await addnew.save();
//         console.log("Data added");
//       } else {
//         console.log("NO need to update");
//       }
//     }
//   }
// }