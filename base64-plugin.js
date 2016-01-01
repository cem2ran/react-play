module.exports = {
  locate: function(load){
    return load.name.split('/').slice(-1)[0]
  },
  fetch: function(load) {
    return new Promise(function(resolve, reject){
      resolve(atob(load.address))
    })
  }
};
