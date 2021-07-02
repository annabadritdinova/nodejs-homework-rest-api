const express = require('express');
const router = express.Router();
const {
  getAllContacts,
  getById,
  create,
  remove,
  update,
  updateStatus
} = require('../../controllers/contacts');
const {
  validationCreateContact,
  validationUpdateContact,
  validationFavoriteContact,
  validationIdContact
} = require('./validation');
const guard = require('../../helpers/guard');

router
  .get('/', guard, getAllContacts)
  .post('/', guard, validationCreateContact, create);

router
  .get('/:contactId', guard, validationIdContact, getById)
  .delete('/:contactId', guard, remove)
  .put('/:contactId', guard, validationUpdateContact, update)
  .patch('/:contactId/favorite', guard, validationFavoriteContact, updateStatus);

module.exports = router;