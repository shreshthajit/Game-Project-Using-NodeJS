// Import necessary modules
const UserModel = require("../../models/user");
const { getPresignedUrl } = require("../../utils/s3");

const getInterviewees = async (req, res) => {
  try {
    const { city, college, topic } = req.query;
    const query = {};
    if (topic) {
      query['skill'] = { $elemMatch: { subject: topic } };
    }
    if (city) {
      query['city'] = new RegExp(city, 'i');
    }
    if (college) {
      query['college'] = new RegExp(college, 'i');
    }
    const users = await UserModel.find(
      query,
      { password: 0, role: 0, fcmToken: 0 },
    );
    for await (const user of users) {
      if (user.image) {
        user.image = await getPresignedUrl(user.image);
      }
    }
    const resp = {
      success: true,
      data: users
    };
    res.status(200).send(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
};

const getAllUsersWithPagination = async (req, res) => {
  const userId = req.user?._id;
  const { page = 1, limit = 20, city, college } = req.query;

  const pagination = {
    page: parseInt(page),
    limit: parseInt(limit),
  };
  const query = {};
  if (city) {
    query['city'] = new RegExp(city, 'i');
  }
  if (college) {
    query['college'] = new RegExp(college, 'i');
  }

  try {
    const { users, pageCount } = await getUsers({
      ...query,
      ...((city || college) && userId && { _id: { $ne: userId } })
    }, pagination);
    for await (const user of users) {
      if (user.image) {
        user.image = await getPresignedUrl(user.image);
      }
    }
    res.json({
      data: {
        users,
        pageCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function getUsers(query, pagination) {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const users = await getAllUsers(query, { skip, limit });
  const total = await getTotalUsers(query);

  return {
    users,
    pageCount: Math.ceil(total / limit),
  };
}

async function getAllUsers(query, pagination) {
  try {
    return await UserModel.find({ ...query, role: 'user' })
      .sort({ createdAt: -1 })
      .select('-password -fcmToken')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getTotalUsers(query) {
  try {
    return await UserModel.countDocuments(query).lean();
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = { getInterviewees, getAllUsersWithPagination };
