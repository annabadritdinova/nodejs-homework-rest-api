const Contacts = require('./schema/contact');

const listContacts = async (userId, query) => {
  const results = await Contacts.find({ owner: userId }).populate({
    path: 'owner',
    select: 'email'
  });
  return results;
};

const getContactById = async (userId, contactId) => {
  const result = await Contacts.findOne({_id: contactId, owner: userId}).populate({
    path: 'owner',
    select: 'email'
  });
  return result;
};

const removeContact = async (userId, contactId) => {
  const result = await Contacts.findOneAndRemove({_id: contactId, owner: userId});
  return result;
};

const addContact = async (userId, body) => {
  const result = await Contacts.create({...body, owner: userId});
  return result;
};

const updateContact = async (userId, contactId, body) => {
  const result = await Contacts.findOneAndUpdate(
    {_id: contactId, owner: userId},
    { ...body },
    { new: true },
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};