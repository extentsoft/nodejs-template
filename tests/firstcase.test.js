var expect = require('chai').expect;
var sinon = require('sinon');

var Database = require('../modules/database');
var _db = new Database();

function setupNewUser(info, callback) {
  var user = {
    name: info.name,
    nameLowercase: info.name.toLowerCase()
  };

  try {
    _db.save(user, callback);
  }
  catch(err) {
    callback(err);
  }
}
/*
[ Spies ]
spies are used to get information about function
calls. For example, a spy can tell us how many
times a function was called, what arguments each
call had, what values were returned, what errors
were thrown, etc.
As such, a spy is a good choice whenever the goal
of a test is to verify something happened

[ Stubs ]
If you spy on a function, the function's behavior
is not affected. If you want to change how a
function behaves, you need a stub.

*/
it('should call save once', function() {
  var save = sinon.spy(_db, 'save');
  var info = { name: 'test' };
  var expectedUser = {
    name: info.name,
    nameLowercase: info.name.toLowerCase()
  };

  setupNewUser({name: 'aaa'}, function() { });

  save.restore();
  //sinon.assert.calledOnce(save);
  sinon.assert.calledWith(save,expectedUser);
  //sinon.assert.notCalled(save);
});


// use of Spies
it('calls subscribers on publisg', function(){
  var callback = sinon.spy();
  PubSub.subscribe('message', callback);
  PubSub.publishSync('message');
  assertTrue(callback.called);
});

// use of Stubs
it('calls all subscribers, even if there are exceptions', function(){
  var stub = sinon.stub().throws;
  var spy1 = sinon.spy();
  var spy2 = sinon.spy();
  PubSub.subscribe('message', stub);
  PubSub.subscribe('message', spy1);
  PubSub.subscribe('message', spy2);

  PubSub.publishSync('message', undefined);
  assert(spy1.called);
  assert(spy2.called);
  assertTrue(stub.calledBefore(spy1));
});

// use of Mocks
it('calls all subscribers when exceptions happen', function(){
  var myAPI = {
    method: function(){}
  }

  var spy = sinon.spy();
  var mock = sinon.mock(myAPI);
  mock.expects("method").once().throws();

  PubSub.subscribe('message', myAPI.method);
  PubSub.subscribe('message', spy);
  PubSub.publishSync('message', undefined);

  mock.verify();
  assert(spy.calledOnce);
});
