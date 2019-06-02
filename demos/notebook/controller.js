/* eslint import/no-extraneous-dependencies:0, no-unused-vars:0, no-restricted-syntax:0 */

const uuid = require('uuid')

const storage = [
  {
    id: uuid.v1(),
    content: 'Hello World!'
  }
]
const notes = {
  list (req, res) {
    res.send(storage)
  },
  get (req, res) {
    for (const note of storage) {
      if (note.id === req.params.id) return res.send(note)
    }

    return res.status(404)
  },
  update (req, res) {
    for (const note of storage) {
      if (note.id === req.params.id) {
        note.content = req.body.content
        return res.send(note)
      }
    }

    return res.status(404)
  },
  delete (req, res) {
    for (const index in storage) {
      if (storage[index].id === req.params.id) {
        storage.splice(index, 1)
        return res.status(200).end()
      }
    }

    return res.status(404).end()
  },
  create (req, res) {
    const note = req.body
    note.id = uuid.v1()
    storage.push(note)

    return res.status(200).end()
  }
}

module.exports = notes
