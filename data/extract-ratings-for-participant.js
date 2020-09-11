const fs = require('fs')

const rawData = fs.readFileSync('results/ratings.json')
const ratings = JSON.parse(rawData).ratings

module.exports = participantId => {
  console.log(
    'THIS RELIES ON THE OLD RATING FORMAT, THE RESULT IS PROBABLY NOT WHAT YOU WANT – TODO: FIX THIS'
  )
  const filtered = Object.keys(ratings)
    .filter(item =>
      ratings[item].allRatings.some(
        allRatings => allRatings.participantId === participantId
      )
    )
    .map(item => {
      return {
        item: item,
        rating: ratings[item].allRatings.filter(
          allRatings => allRatings.participantId === participantId
        ),
      }
    })

  fs.writeFileSync(
    `results/ratings-${participantId}.json`,
    JSON.stringify(filtered)
  )
}
