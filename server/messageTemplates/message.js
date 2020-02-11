
const messageStructure = (from, content) => {
  return {
    from,
    content,
    createAt: new Date()
  }
}
const messageStructureLocation = (from, lng,lat, content) => {
  return {
    from,
    lng,
    lat,
    createAt: new Date()
  }
}

module.exports = {
  messageStructure,
  messageStructureLocation
}