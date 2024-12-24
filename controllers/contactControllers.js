const asyncHandler = require("express-async-handler");
const Contact = require("../models/contact.model");
const { isValidObjectId } = require("mongoose");

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//@desc Create new contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  //check if name, email, phone are provided
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });

  res.status(201).json(contact);
});

//@desc Get contact by id
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid contact id");
  }

  const contact = await Contact.findOne({
    _id: req.params.id,
    user_id: req.user.id,
  });

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  res.status(200).json(contact);
});

//@desc Update contact by id
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid contact id");
  }
  if (!name && !email && !phone) {
    res.status(400);
    throw new Error("at least one field is required");
  }

  const updatedContact = await Contact.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user.id },
    req.body,
    { new: true }
  );

  if (!updatedContact) {
    res.status(404);
    throw new Error("Contact not found or user doesn't have permission");
  }

  res.status(200).json(updatedContact);
});

//@desc Delete contact by id
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid contact id");
  }

  const contact = await Contact.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user.id,
  });

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found or user doesn't have permission");
  }

  res.status(200).json({ message: "Contact deleted successfully", contact });
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
