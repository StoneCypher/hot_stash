'use strict';

var _avaSpec = require('ava-spec');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable max-len */

var hot_stash = require('../../../build/hot_stash.es5.js');

(0, _avaSpec.describe)('Test rig', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(it) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            it('can run tests', function (t) {
              return t.is(2, 2);
            });

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qcy90ZXN0cy9yZWFkX3Rlc3RzLmpzIl0sIm5hbWVzIjpbImhvdF9zdGFzaCIsInJlcXVpcmUiLCJpdCIsInQiLCJpcyJdLCJtYXBwaW5ncyI6Ijs7QUFHQTs7O0FBRkE7O0FBSUEsSUFBTUEsWUFBWUMsUUFBUSxpQ0FBUixDQUFsQjs7QUFNQSx1QkFBUyxVQUFUO0FBQUEscUVBQXFCLGlCQUFNQyxFQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBRW5CQSxlQUFHLGVBQUgsRUFBb0I7QUFBQSxxQkFBS0MsRUFBRUMsRUFBRixDQUFLLENBQUwsRUFBUSxDQUFSLENBQUw7QUFBQSxhQUFwQjs7QUFGbUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBckI7O0FBQUE7QUFBQTtBQUFBO0FBQUEiLCJmaWxlIjoicmVhZF90ZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG5pbXBvcnQgeyBkZXNjcmliZSB9IGZyb20gJ2F2YS1zcGVjJztcblxuY29uc3QgaG90X3N0YXNoID0gcmVxdWlyZSgnLi4vLi4vLi4vYnVpbGQvaG90X3N0YXNoLmVzNS5qcycpO1xuXG5cblxuXG5cbmRlc2NyaWJlKCdUZXN0IHJpZycsIGFzeW5jIGl0ID0+IHtcblxuICBpdCgnY2FuIHJ1biB0ZXN0cycsIHQgPT4gdC5pcygyLCAyKSApO1xuXG59KTtcbiJdfQ==