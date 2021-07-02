const { listContacts, addContact, updateContact, getContactById, removeContact } = require('../model/contacts.js');

const getAllContacts =  async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const contacts = await listContacts(userId, req.require);
      return res.json({
        status: 'success',
        code: '200',
        data: { contacts }
      })
    } catch (err) {
      next(err)
    }
  };
  
  const getById =  async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const contact = await getContactById(userId, req.params.contactId);
      if (contact) {
        return res.json({
          status: 'success',
          code: '200',
          data: { contact }
        })
      } else {
        return res.status(404).json({
          status: 'error',
          code: '404',
          data: 'Not Found',
        })
      }
    }
    catch (err) {
      next(err)
    }
  };
  
  const create = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const contact = await addContact(userId, req.body);
      return res.status(201).json({
        status: 'success',
        code: '201',
        data: { contact }
      })
    } catch (err) {
      next(err)
    }
  };
  
  const remove = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const contact = await removeContact(userId, req.params.contactId);
      if (contact) {
        return res.json({
          status: 'success',
          code: '200',
          message: 'contact deleted',
          data: { contact }
        })
      } else {
        return res.status(404).json({
          status: 'error',
          code: '404',
          data: 'Not Found',
        })
      }
    }
    catch (err) {
      next(err)
    }
  };
  
  const update = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const contact = await updateContact(userId, req.params.contactId, req.body);
      if (contact) {
        return res.json({
          status: 'success',
          code: '200',
          data: { contact }
        })
      } else {
        return res.status(404).json({
          status: 'error',
          code: '404',
          data: 'Not Found',
        })
      }
    }
    catch (err) {
      next(err)
    }
  };
  
  const updateStatus = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const contact = await updateContact(userId, req.params.contactId, req.body)
      if (contact) {
        return res.json({
          status: 'success',
          code: 200,
          data: {
            contact,
          },
        })
      } else {
        return res.status(404).json({
          status: 'error',
          code: 404,
          data: 'Not Found',
        })
      }
    } catch (e) {
      next(e)
    }
  };
  
module.exports = {
    getAllContacts,
    getById,
    create,
    remove,
    update,
    updateStatus,
};