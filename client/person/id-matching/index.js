function IdMatching (GraphRequest) {
  this.getMatchingPsids = getMatchingPsids;
  this.getMatchingAsids = getMatchingAsids;
  this.callIdMatchingApi = callIdMatchingApi.bind(GraphRequest);  
}

/**
 * Returns all Page-scoped IDs (PSIDs) for a user across all Pages in the same 
 * Facebook Business Manager account. Matches can be found using 
 * a PSID or ASID. 
 * @param  {String} id        A valid ASID or PSID.
 * @param  {String} id_type   The type of ID provided in the `id` argument: `ASID` or `PSID`.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * Client.getMatchingPsids('95740976304764', 'PSID')
 *   .then(res => {
 *     console.log(res);
 *     // {
 *     //    "data": [
 *     //      {
 *     //        "id": "1429384723454138",
 *     //        "page": {
 *     //            "name": "MyPage1",
 *     //            "id": "9384723458738365"
 *     //        }
 *     //      },
 *     //      {
 *     //        "id": "1254459384723459",
 *     //        "page": {
 *     //            "name": "MyPage2",
 *     //            "id": "689384723453165"
 *     //        }
 *     //      }
 *     //    ],
 *     //    "paging": {
 *     //        "cursors": {
 *     //            "before": "MTA4MDYxNjQ2ODczODM2NQZDZD",
 *     //            "after": "NjgyNDk4MTcxOTQzMTY1"
 *     //        }
 *     //    }
 *     // } 
 *   });
 */
function getMatchingPsids (id, id_type) {
  return new Promise (async (resolve, reject) => {        
    try {
      let response = await this.callIdMatchingApi(id, id_type, 'psid');
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Returns all app-scoped IDs (ASIDs) for a user across all Pages in the same 
 * Facebook Business Manager account. Matches can be found using 
 * a PSID or ASID. 
 * @param  {String} id        A valid ASID or PSID.
 * @param  {String} id_type   The type of ID provided in the `id` argument: `ASID` or `PSID`.
 * @return {Promise<Object>}  The API response
 * @memberof  Client#
 * @example
 * Client.getMatchingAsids('95740976304764', 'PSID')
 *   .then(res => {
 *     console.log(res);
 *     // {
 *     //    "data": [
 *     //      {
 *     //        "id": "7234541381429384",
 *     //        "app": {
 *     //            "link": "https://www.facebook.com/games/?app_id=299493827472589",
 *     //            "name": "MyApp1",
 *     //            "id": "9948573218738365"
 *     //        }
 *     //      },
 *     //      {
 *     //        "id": "9384723459125445",
 *     //        "app": {
 *     //            "link": "https://www.facebook.com/games/?app_id=299490394856589",
 *     //            "name": "MyApp2",
 *     //            "id": "689384785732187"
 *     //        }
 *     //      }
 *     //    ],
 *     //    "paging": {
 *     //        "cursors": {
 *     //            "before": "ODczODM2NQZDZDMTA4MDYxNjQ2",
 *     //            "after": "TcxOTQzMTY1NjgyNDk4M"
 *     //        }
 *     //    }
 *     // } 
 *   });
 */
function getMatchingAsids (id, id_type) {
  return new Promise (async (resolve, reject) => {
    try {
      let response = await this.callIdMatchingApi(id, id_type, 'asid');
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

function callIdMatchingApi (id, id_type, get_type) {
  return new Promise (async (resolve, reject) => {
    if (!id || !id_type || !get_type) {
      reject('id, id_type, and get_type required');
    }

    let request_options = {};

    switch (get_type) {
      case 'psid':
        request_options.path = `/${id}/ids_for_pages`;
        break;
      case 'asid':
        request_options.path = `/${id}/ids_for_apps`;
        break;
    }

    if (id_type.toLowerCase() === 'asid') {
      request_options.qs = {'access_token': this.getAppToken()};
    }

    try {
      let response = await this.sendGraphRequest(request_options);
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = IdMatching;