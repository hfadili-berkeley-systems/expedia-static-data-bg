var fs = require("fs");
const readline = require("readline");
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
  }
}
async function loadData() {
  
  await asyncForEach(fs.readdirSync("./splited_files/"),(file) => {
    let fileName = file;
    console.log("Start reading file",fileName);
    const readInterface = readline.createInterface({
      input: fs.createReadStream("./splited_files/" + fileName),
      console: false,
    });
    let jsonLine = "";

    readInterface
      .on("line", function (line) {
        try {
          let hotel = JSON.parse(line);
          const hotelID = hotel.property_id;
          if (hotel.rooms !== undefined) {
            for (const [roomID, room] of Object.entries(hotel.rooms)) {
              let roomObj = {
                hotelID: hotelID,
                roomID: roomID,
                name: room.name,
              };
              if (room.descriptions !== undefined) {
                roomObj.descriptions = room.descriptions.overview;
              } else {
                roomObj.descriptions = null;
              }
              if (room.area !== undefined) {
                roomObj.area = room.area.square_meters;
              } else {
                roomObj.area = null;
              }
              if (room.occupancy !== undefined) {
                roomObj.max_allow_children =
                  room.occupancy.max_allowed.children;
                roomObj.max_allow_adults = room.occupancy.max_allowed.adults;
              } else {
                roomObj.max_allow_children = null;
                roomObj.max_allow_adults = null;
              }
              if (room.age_categories !== undefined) {
                if (room.age_categories.ChildAgeA.minimum_age !== undefined) {
                  roomObj.children_min_age =
                    room.age_categories.ChildAgeA.minimum_age;
                } else {
                  roomObj.children_min_age = null;
                }
                if (room.age_categories.Adult.minimum_age !== undefined) {
                  roomObj.adult_min_age = room.age_categories.Adult.minimum_age;
                } else {
                  roomObj.adult_min_age = null;
                }
                if (room.age_categories.Infant.minimum_age !== undefined) {
                  roomObj.infant_min_age =
                    room.age_categories.Infant.minimum_age;
                } else {
                  roomObj.infant_min_age = null;
                }
              } else {
                roomObj.adults_min_age = null;
                roomObj.children_min_age = null;
                roomObj.infant_min_age = null;
              }
              let images = [];
              if (room.images !== undefined) {
                room.images.forEach((element) => {
                  let selectedImage = "";
                  if (element.links["1000px"] !== undefined) {
                    selectedImage = element.links["1000px"].href;
                  } else {
                    selectedImage = element.links["350px"].href;
                  }
                  let img = {
                    hero_image: element.hero_image,
                    image: selectedImage,
                  };
                  images.push(img);
                });
              }
              roomObj.images = images;

              let amenities = [];
              if (room.amenities !== undefined) {
                for (const [key, amenity] of Object.entries(room.amenities)) {
                  amenities.push({
                    id: parseInt(amenity.id),
                    name: amenity.name,
                  });
                }
              }
              roomObj.amenities_list = amenities;
              jsonLine += JSON.stringify(roomObj) + "\n";
            }
          }
        } catch (e) {}
      })
      .on("close", function () {
        console.log("Reading file",fileName,"completed");
        console.log("Write file",fileName+".jsonl");
        fs.writeFile(
          "generated_json/" + fileName + ".jsonl",
          jsonLine,
          function (err) {
            if (err) return console.log(err);
            console.log("File generated> " + fileName + ".jsonl");
          }
        );
      });
  });
}
loadData();
