/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import { HTTP } from 'meteor/http';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Settings from '/apinf_packages/settings/collection';

const getTenantInfo = function () {
  // Get settings document
  const settings = Settings.findOne();

  // Get url and token from settings
  const tenantUrl = _.get(settings, 'tenantIdm.basepath');
  const tenantToken = _.get(settings, 'tenantIdm.accessToken');

  // Return URL and token, if they are set
  if (tenantUrl && tenantToken) {
    // return
    const tenant = {
      basepath: tenantUrl,
      token: tenantToken,
    };
    return tenant;
  }
  // If not available, return false
  return false;
};

Meteor.methods({
  async getTenantList () {
    const response = {};
    // In case of failure
    response.status = 400;

    // Fetch tenant endpoint and token
    const tenantInfo = getTenantInfo();

    console.log('1 GET tenant info=', tenantInfo);
    if (tenantInfo) {
      // Make sure endPoint is a String
      // eslint-disable-next-line new-cap
      check(tenantInfo.basepath, Match.Maybe(String));
      console.log('2 send GET tenant request');

      const result = HTTP.get(
        tenantInfo.basepath,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tenantInfo.tenantToken}`,
          },
        }
      );
      // Create a monitoring data
      response.tenantList = result.response;
      response.status = result.statusCode;
      console.log('3 GET a ok, result=', result);
      console.log('3 a ok, response=', response);

    }

    console.log('4 GET tenant response=', response);
    return await response;
  },

  getUserList () {
    const response = {};
    // In case of failure
    response.status = 400;

    // Fetch tenant endpoint and token
    const tenantInfo = getTenantInfo();

    // NOTE! Now used tenant endpoint, perhaps needs to be configured later
    console.log('\n ------------ Fetch User list -------------- \n');
    console.log('1 GET userlist basepath=', tenantInfo);
    if (tenantInfo) {
      // Make sure endPoint is a String
      // eslint-disable-next-line new-cap
      check(tenantInfo.basepath, Match.Maybe(String));
      let url = tenantInfo.basepath;
      url = url.concat('user');
      console.log(+new Date(), ' 2 send GET userlist request to = ', url);

      try {
        const result = HTTP.get(
          url,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tenantInfo.tenantToken}`,
            },
          }
        );
        // Create a monitoring data
        response.completeUserList = result.response;
        response.status = result.statusCode;
        console.log('3 GET a ok, result=', result);
        console.log('3 a ok, response=', response);

        // here is needed to deserialize
      } catch (err) {
        console.log('3 GET b err=', err);

        // For mock purposes we fill the list here ourself
        response.completeUserList = [
          {
            id: '123456789',
            username: 'Håkan',
          },
          {
            id: '223456789',
            username: 'Luis',
          },
          {
            id: '323456789',
            username: 'Pär',
          },
          {
            id: '423456789',
            username: 'Ivan',
          },
          {
            id: '523456789',
            username: 'Hans',
          },
          {
            id: '62345689',
            username: 'Pierre',
          },
          {
            id: '723456789',
            username: 'Väinämöinen',
          },
          {
            id: '82356789',
            username: 'Jack',
          },
          {
            id: '92356789',
            username: 'Umberto',
          },
        ];

        response.status = 400;

        console.log('3 b nok, response=', response);
      }
    }

    console.log('4 GET userlist response=', response);
    return response;

  },


  addTenant (tenant) {
    console.log('\nPOST tenant =\n', tenant, '\n');
    check(tenant, Object);

    const response = {};
    // In case of failure
    response.status = 400;

    // Fetch tenant endpoint and token
    const tenantInfo = getTenantInfo();

    console.log('1 tenant endpoint=', tenantInfo);
    if (tenantInfo) {
      // Make sure endPoint is a String
      // eslint-disable-next-line new-cap
      check(tenantInfo.basepath, Match.Maybe(String));
      console.log('2 send post request');

      // TODO tenant: correct parameters needed
      const userlist = [{
        'name': 'Joakim',
        'roles': ['data-provider', 'data-consumer'],
      }];
      
      try {
        const result = HTTP.post(
          tenantInfo.basepath,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tenantInfo.tenantToken}`,
            },
            params: {
              name: tenant.name,
              description: tenant.description,
              users: userlist,
            },
          }
        );
        // Create a monitoring data
        response.status = result.statusCode;
        console.log('3 POST a ok, result=', result);
        console.log('3 a ok, response=', response);
      } catch (err) {
        console.log(+ new Date(), ' 3 POST b err=', err);
        response.status = 400;
        console.log('3 b nok, response=', response);
      }
    }

    console.log(+ new Date(), ' 4 POST response=', response);
    return response;
  },
});
