const adRepository = require("../repository/adRepository");
const userRepository = require("../repository/userRepository");
const async = require("async");

class AdController {
  Create(data, callback) {
    adRepository.Create(data, (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  }
  GetUsersAd(data, callback) {
    adRepository.FindByUserId(data, (err, result) => {
      if (err) return callback(err);
      else return callback(null, result);
    });
  }
  FindByName(data, callback) {
    adRepository.FindByName(data, (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  }
  DonateToAd(ad, user,callback) {
    adRepository.Donate(ad,err => {
      if(err) callback(err);
    });
    userRepository.Update(user,err => {
      if(err) callback(err);
    });
    return callback(null);
  }
  Collect(user, callback) {
    async.waterfall(
      [
        callback => {
          adRepository.FindByUserId(user.id, (err, ad) => {
            if (err) return callback(err);
            return callback(null, ad);
          });
        },
        (ad, callback) => {
          adRepository.Delete(ad.id,err => {
            if(err)
              return callback(err);
            return callback(null,ad);
          });
        },
        ad => {
          userRepository.Update(
            {
              balance: parseInt(user.balance) - parseInt(ad.donations),
              id: user.id
            },
            err => {
              if(err)
                return callback(err);
              return callback(null);
            }
          );
        }
      ],
      err => {
        if (err) {
          console.log(err);
          return callback(err);
        }
        return callback(null);
      }
    );
  }
}
module.exports = new AdController();
