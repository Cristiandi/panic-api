const axios = require('axios').default;

const environment = require('../environment');

const { HttpException } = require('../common/http-exception');

class BasicACL {
  constructor () {
    this.baseUrl = environment.BASIC_ACL_BASE_URL;
    this.companyUuid = environment.BASIC_ACL_COMPANY_UUID;
  }

  async register (email, password, phone, roleCode) {
    try {
      const response = await axios({
        url: `${this.baseUrl}users`,
        method: 'post',
        data: {
          companyUuid: this.companyUuid,
          email,
          password,
          phone,
          roleCode
        }
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.response.data.statusCode, error.response.data.message);
    }
  }

  async sendForgottenPasswordEmail (email) {
    try {
      const response = await axios({
        url: `${this.baseUrl}users/forgotten-password`,
        method: 'post',
        data: {
          companyUuid: this.companyUuid,
          email
        }
      });

      return response.data;
    } catch (error) {
      throw new HttpException(error.response.data.statusCode, error.response.data.message);
    }
  }
}

module.exports = {
  basicACL: new BasicACL()
};
