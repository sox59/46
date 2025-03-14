const { MongoClient } = require("mongodb")

const cookie = require("cookie")

const handler = async event => {

  const incomingCookie = cookie.parse(event.headers.cookie || "")
  if (incomingCookie?.petadoption == "askldjasdjklfkljads123981231231230asdfjkasdfjk1230910230asdjklfakjlsd1209309123123") {
    const client = new MongoClient(process.env.CONNECTIONSTRING)
    await client.connect()

    const pets = await client.db().collection("pets").find().toArray()
    client.close()

    const petsHTML = generateHTML(pets)

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, pets: petsHTML })
    }
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: false })
  }

}

function generateHTML(pets) {
  let ourHTML = `<div class="list-of-pets">`
  ourHTML += pets.map(pet => {
    return `<div class="pet-card">
    <div class="pet-card-text">
      <h3>${pet.name}</h3>
      <p class="pet-description">${pet.description}</p>
      <div class="action-buttons">
        <a class="action-btn" href="#">Edit</a>
        <button class="action-btn">Delete</button>
      </div>
    </div>
    <div class="pet-card-photo">
      <img src="/images/fallback.jpg" alt="A ${pet.species} named ${pet.name}">
    </div>
  </div>`
  }).join("")
  ourHTML += "</div>"
  return ourHTML
}

module.exports = { handler }