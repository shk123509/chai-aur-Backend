import { asyncHandler1 } from "../utils/asyncHandler1.js";
import { Apierror } from "../utils/ApiError.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { Contact } from "../models/contact.js";

const contact = asyncHandler1(async (req, res) => {
    const { fullname, email, description } = req.body;

    if (!fullname) throw new Apierror(400, "Full name is required");
    if (!email) throw new Apierror(400, "Email is required");
    if (!description) throw new Apierror(400, "Description is required");

    const createContact = await Contact.create({ fullname, email, description });

    if (!createContact) {
        throw new Apierror(500, "Something went wrong, message not sent");
    }

    return res.status(200).json(
        new Apiresponse(200, createContact, "Message sent successfully!")
    );
});

export { contact };
