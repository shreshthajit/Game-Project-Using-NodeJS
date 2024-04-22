const jsonData = require('../../data/city_college.json');

const getCity = async (req, res) => {
    // Extract unique city names
    const uniqueCities = Array.from(new Set(jsonData.map(entry => entry.city)));

    const resp = {
        success: true,
        data: uniqueCities
    };
    res.status(200).json(resp);
}

const getCollege = async (req, res) => {
    const colleges = Array.from(new Set(jsonData.map(entry => entry.college)));

    const resp = {
        success: true,
        data: colleges
    };
    res.status(200).json(resp);
}

module.exports = { getCity, getCollege };

