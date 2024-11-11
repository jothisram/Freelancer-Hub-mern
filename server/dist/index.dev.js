"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _cors = _interopRequireDefault(require("cors"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _Schema = require("./Schema.js");

var _socket = require("socket.io");

var _http = _interopRequireDefault(require("http"));

var _SocketHandler = _interopRequireDefault(require("./SocketHandler.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(_express["default"].json());
app.use(_bodyParser["default"].json({
  limit: "30mb",
  extended: true
}));
app.use(_bodyParser["default"].urlencoded({
  limit: "30mb",
  extended: true
}));
app.use((0, _cors["default"])());

var server = _http["default"].createServer(app);

var io = new _socket.Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
io.on("connection", function (socket) {
  console.log("User connected");
  (0, _SocketHandler["default"])(socket);
});
var PORT = 6001;

_mongoose["default"].connect('mongodb+srv://rjothisram:Lord%40818720@cluster0.rhmyx.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  app.post('/register', function _callee(req, res) {
    var _req$body, username, email, password, usertype, salt, passwordHash, newUser, user, newFreelancer;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password, usertype = _req$body.usertype;
            _context.next = 4;
            return regeneratorRuntime.awrap(_bcrypt["default"].genSalt());

          case 4:
            salt = _context.sent;
            _context.next = 7;
            return regeneratorRuntime.awrap(_bcrypt["default"].hash(password, salt));

          case 7:
            passwordHash = _context.sent;
            newUser = new _Schema.User({
              username: username,
              email: email,
              password: passwordHash,
              usertype: usertype
            });
            _context.next = 11;
            return regeneratorRuntime.awrap(newUser.save());

          case 11:
            user = _context.sent;

            if (!(usertype === 'freelancer')) {
              _context.next = 16;
              break;
            }

            newFreelancer = new _Schema.Freelancer({
              userId: user._id
            });
            _context.next = 16;
            return regeneratorRuntime.awrap(newFreelancer.save());

          case 16:
            res.status(200).json(user);
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](0);
            res.status(500).json({
              error: _context.t0.message
            });

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 19]]);
  });
  app.post('/login', function _callee2(req, res) {
    var _req$body2, email, password, user, isMatch;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
            _context2.next = 4;
            return regeneratorRuntime.awrap(_Schema.User.findOne({
              email: email
            }));

          case 4:
            user = _context2.sent;

            if (user) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              msg: "User does not exist"
            }));

          case 7:
            _context2.next = 9;
            return regeneratorRuntime.awrap(_bcrypt["default"].compare(password, user.password));

          case 9:
            isMatch = _context2.sent;

            if (isMatch) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              msg: "Invalid credentials"
            }));

          case 12:
            res.status(200).json(user);
            _context2.next = 18;
            break;

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](0);
            res.status(500).json({
              error: _context2.t0.message
            });

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 15]]);
  });
  app.get('/fetch-freelancer/:id', function _callee3(req, res) {
    var freelancer;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(_Schema.Freelancer.findOne({
              userId: req.params.id
            }));

          case 3:
            freelancer = _context3.sent;
            res.status(200).json(freelancer);
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            res.status(500).json({
              error: _context3.t0.message
            });

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 7]]);
  });
  app.post('/update-freelancer', function _callee4(req, res) {
    var _req$body3, freelancerId, updateSkills, description, freelancer, skills;

    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$body3 = req.body, freelancerId = _req$body3.freelancerId, updateSkills = _req$body3.updateSkills, description = _req$body3.description;
            _context4.prev = 1;
            _context4.next = 4;
            return regeneratorRuntime.awrap(_Schema.Freelancer.findById(freelancerId));

          case 4:
            freelancer = _context4.sent;
            skills = updateSkills.split(',');
            freelancer.skills = skills;
            freelancer.description = description;
            _context4.next = 10;
            return regeneratorRuntime.awrap(freelancer.save());

          case 10:
            res.status(200).json(freelancer);
            _context4.next = 16;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](1);
            res.status(500).json({
              error: _context4.t0.message
            });

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[1, 13]]);
  }); // fetch project

  app.get('/fetch-project/:id', function _callee5(req, res) {
    var project;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return regeneratorRuntime.awrap(_Schema.Project.findById(req.params.id));

          case 3:
            project = _context5.sent;
            res.status(200).json(project);
            _context5.next = 10;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            res.status(500).json({
              error: _context5.t0.message
            });

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0, 7]]);
  }); // fetch all projects

  app.get('/fetch-projects', function _callee6(req, res) {
    var projects;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return regeneratorRuntime.awrap(_Schema.Project.find());

          case 3:
            projects = _context6.sent;
            res.status(200).json(projects);
            _context6.next = 10;
            break;

          case 7:
            _context6.prev = 7;
            _context6.t0 = _context6["catch"](0);
            res.status(500).json({
              error: _context6.t0.message
            });

          case 10:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[0, 7]]);
  });
  app.post('/new-project', function _callee7(req, res) {
    var _req$body4, title, description, budget, skills, clientId, clientName, clientEmail, projectSkills, newProject;

    return regeneratorRuntime.async(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _req$body4 = req.body, title = _req$body4.title, description = _req$body4.description, budget = _req$body4.budget, skills = _req$body4.skills, clientId = _req$body4.clientId, clientName = _req$body4.clientName, clientEmail = _req$body4.clientEmail;
            _context7.prev = 1;
            projectSkills = skills.split(',');
            newProject = new _Schema.Project({
              title: title,
              description: description,
              budget: budget,
              skills: projectSkills,
              clientId: clientId,
              clientName: clientName,
              clientEmail: clientEmail,
              postedDate: new Date()
            });
            _context7.next = 6;
            return regeneratorRuntime.awrap(newProject.save());

          case 6:
            res.status(200).json({
              message: "Project added"
            });
            _context7.next = 12;
            break;

          case 9:
            _context7.prev = 9;
            _context7.t0 = _context7["catch"](1);
            res.status(500).json({
              error: _context7.t0.message
            });

          case 12:
          case "end":
            return _context7.stop();
        }
      }
    }, null, null, [[1, 9]]);
  }); // make bid

  app.post('/make-bid', function _callee8(req, res) {
    var _req$body5, clientId, freelancerId, projectId, proposal, bidAmount, estimatedTime, freelancer, freelancerData, project, client, newApplication, application;

    return regeneratorRuntime.async(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _req$body5 = req.body, clientId = _req$body5.clientId, freelancerId = _req$body5.freelancerId, projectId = _req$body5.projectId, proposal = _req$body5.proposal, bidAmount = _req$body5.bidAmount, estimatedTime = _req$body5.estimatedTime;
            _context8.prev = 1;
            _context8.next = 4;
            return regeneratorRuntime.awrap(_Schema.User.findById(freelancerId));

          case 4:
            freelancer = _context8.sent;
            _context8.next = 7;
            return regeneratorRuntime.awrap(_Schema.Freelancer.findOne({
              userId: freelancerId
            }));

          case 7:
            freelancerData = _context8.sent;
            _context8.next = 10;
            return regeneratorRuntime.awrap(_Schema.Project.findById(projectId));

          case 10:
            project = _context8.sent;
            _context8.next = 13;
            return regeneratorRuntime.awrap(_Schema.User.findById(clientId));

          case 13:
            client = _context8.sent;
            newApplication = new _Schema.Application({
              projectId: projectId,
              clientId: clientId,
              clientName: client.username,
              clientEmail: client.email,
              freelancerId: freelancerId,
              freelancerName: freelancer.username,
              freelancerEmail: freelancer.email,
              freelancerSkills: freelancerData.skills,
              title: project.title,
              description: project.description,
              budget: project.budget,
              requiredSkills: project.skills,
              proposal: proposal,
              bidAmount: bidAmount,
              estimatedTime: estimatedTime
            });
            _context8.next = 17;
            return regeneratorRuntime.awrap(newApplication.save());

          case 17:
            application = _context8.sent;
            project.bids.push(freelancerId);
            project.bidAmounts.push(parseInt(bidAmount));
            console.log(application);

            if (application) {
              freelancerData.applications.push(application._id);
            }

            _context8.next = 24;
            return regeneratorRuntime.awrap(freelancerData.save());

          case 24:
            _context8.next = 26;
            return regeneratorRuntime.awrap(project.save());

          case 26:
            res.status(200).json({
              message: "bidding successful"
            });
            _context8.next = 33;
            break;

          case 29:
            _context8.prev = 29;
            _context8.t0 = _context8["catch"](1);
            console.log(_context8.t0);
            res.status(500).json({
              error: _context8.t0.message
            });

          case 33:
          case "end":
            return _context8.stop();
        }
      }
    }, null, null, [[1, 29]]);
  }); // fetch all applications

  app.get('/fetch-applications', function _callee9(req, res) {
    var applications;
    return regeneratorRuntime.async(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return regeneratorRuntime.awrap(_Schema.Application.find());

          case 3:
            applications = _context9.sent;
            res.status(200).json(applications);
            _context9.next = 10;
            break;

          case 7:
            _context9.prev = 7;
            _context9.t0 = _context9["catch"](0);
            res.status(500).json({
              error: _context9.t0.message
            });

          case 10:
          case "end":
            return _context9.stop();
        }
      }
    }, null, null, [[0, 7]]);
  }); // approve application

  app.get('/approve-application/:id', function _callee11(req, res) {
    var application, project, freelancer, user, remainingApplications;
    return regeneratorRuntime.async(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return regeneratorRuntime.awrap(_Schema.Application.findById(req.params.id));

          case 3:
            application = _context11.sent;
            _context11.next = 6;
            return regeneratorRuntime.awrap(_Schema.Project.findById(application.projectId));

          case 6:
            project = _context11.sent;
            _context11.next = 9;
            return regeneratorRuntime.awrap(_Schema.Freelancer.findOne({
              userId: application.freelancerId
            }));

          case 9:
            freelancer = _context11.sent;
            _context11.next = 12;
            return regeneratorRuntime.awrap(_Schema.User.findById(application.freelancerId));

          case 12:
            user = _context11.sent;
            application.status = 'Accepted';
            _context11.next = 16;
            return regeneratorRuntime.awrap(application.save());

          case 16:
            _context11.next = 18;
            return regeneratorRuntime.awrap(_Schema.Application.find({
              projectId: application.projectId,
              status: "Pending"
            }));

          case 18:
            remainingApplications = _context11.sent;
            remainingApplications.map(function _callee10(appli) {
              return regeneratorRuntime.async(function _callee10$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      appli.status === 'Rejected';
                      _context10.next = 3;
                      return regeneratorRuntime.awrap(appli.save());

                    case 3:
                    case "end":
                      return _context10.stop();
                  }
                }
              });
            });
            project.freelancerId = freelancer.userId;
            project.freelancerName = user.email;
            project.budget = application.bidAmount;
            project.status = "Assigned";
            freelancer.currentProjects.push(project._id);
            _context11.next = 27;
            return regeneratorRuntime.awrap(project.save());

          case 27:
            _context11.next = 29;
            return regeneratorRuntime.awrap(freelancer.save());

          case 29:
            res.status(200).json({
              message: "Application approved!!"
            });
            _context11.next = 36;
            break;

          case 32:
            _context11.prev = 32;
            _context11.t0 = _context11["catch"](0);
            console.log(_context11.t0);
            res.status(500).json({
              error: _context11.t0.message
            });

          case 36:
          case "end":
            return _context11.stop();
        }
      }
    }, null, null, [[0, 32]]);
  }); // reject application

  app.get('/reject-application/:id', function _callee12(req, res) {
    var application;
    return regeneratorRuntime.async(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            _context12.next = 3;
            return regeneratorRuntime.awrap(_Schema.Application.findById(req.params.id));

          case 3:
            application = _context12.sent;
            application.status = 'Rejected';
            _context12.next = 7;
            return regeneratorRuntime.awrap(application.save());

          case 7:
            res.status(200).json({
              message: "Application rejected!!"
            });
            _context12.next = 13;
            break;

          case 10:
            _context12.prev = 10;
            _context12.t0 = _context12["catch"](0);
            res.status(500).json({
              error: _context12.t0.message
            });

          case 13:
          case "end":
            return _context12.stop();
        }
      }
    }, null, null, [[0, 10]]);
  }); // submit project

  app.post('/submit-project', function _callee13(req, res) {
    var _req$body6, clientId, freelancerId, projectId, projectLink, manualLink, submissionDescription, project;

    return regeneratorRuntime.async(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _req$body6 = req.body, clientId = _req$body6.clientId, freelancerId = _req$body6.freelancerId, projectId = _req$body6.projectId, projectLink = _req$body6.projectLink, manualLink = _req$body6.manualLink, submissionDescription = _req$body6.submissionDescription;
            _context13.prev = 1;
            _context13.next = 4;
            return regeneratorRuntime.awrap(_Schema.Project.findById(projectId));

          case 4:
            project = _context13.sent;
            project.projectLink = projectLink;
            project.manulaLink = manualLink;
            project.submissionDescription = submissionDescription;
            project.submission = true;
            _context13.next = 11;
            return regeneratorRuntime.awrap(project.save());

          case 11:
            _context13.next = 13;
            return regeneratorRuntime.awrap(project.save());

          case 13:
            res.status(200).json({
              message: "Project added"
            });
            _context13.next = 19;
            break;

          case 16:
            _context13.prev = 16;
            _context13.t0 = _context13["catch"](1);
            res.status(500).json({
              error: _context13.t0.message
            });

          case 19:
          case "end":
            return _context13.stop();
        }
      }
    }, null, null, [[1, 16]]);
  }); // approve submission

  app.get('/approve-submission/:id', function _callee14(req, res) {
    var project, freelancer;
    return regeneratorRuntime.async(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;
            _context14.next = 3;
            return regeneratorRuntime.awrap(_Schema.Project.findById(req.params.id));

          case 3:
            project = _context14.sent;
            _context14.next = 6;
            return regeneratorRuntime.awrap(_Schema.Freelancer.findOne({
              userId: project.freelancerId
            }));

          case 6:
            freelancer = _context14.sent;
            project.submissionAccepted = true;
            project.status = "Completed";
            freelancer.currentProjects.pop(project._id);
            freelancer.completedProjects.push(project._id);
            freelancer.funds = parseInt(freelancer.funds) + parseInt(project.budget);
            _context14.next = 14;
            return regeneratorRuntime.awrap(project.save());

          case 14:
            _context14.next = 16;
            return regeneratorRuntime.awrap(freelancer.save());

          case 16:
            res.status(200).json({
              message: "submission approved"
            });
            _context14.next = 22;
            break;

          case 19:
            _context14.prev = 19;
            _context14.t0 = _context14["catch"](0);
            res.status(500).json({
              error: _context14.t0.message
            });

          case 22:
          case "end":
            return _context14.stop();
        }
      }
    }, null, null, [[0, 19]]);
  }); // reject submission

  app.get('/reject-submission/:id', function _callee15(req, res) {
    var project;
    return regeneratorRuntime.async(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;
            _context15.next = 3;
            return regeneratorRuntime.awrap(_Schema.Project.findById(req.params.id));

          case 3:
            project = _context15.sent;
            project.submission = false;
            project.projectLink = "";
            project.manulaLink = "";
            project.submissionDescription = "";
            _context15.next = 10;
            return regeneratorRuntime.awrap(project.save());

          case 10:
            res.status(200).json({
              message: "submission approved"
            });
            _context15.next = 16;
            break;

          case 13:
            _context15.prev = 13;
            _context15.t0 = _context15["catch"](0);
            res.status(500).json({
              error: _context15.t0.message
            });

          case 16:
          case "end":
            return _context15.stop();
        }
      }
    }, null, null, [[0, 13]]);
  }); // fetch all users

  app.get('/fetch-users', function _callee16(req, res) {
    var users;
    return regeneratorRuntime.async(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _context16.next = 3;
            return regeneratorRuntime.awrap(_Schema.User.find());

          case 3:
            users = _context16.sent;
            res.status(200).json(users);
            _context16.next = 10;
            break;

          case 7:
            _context16.prev = 7;
            _context16.t0 = _context16["catch"](0);
            res.status(500).json({
              error: _context16.t0.message
            });

          case 10:
          case "end":
            return _context16.stop();
        }
      }
    }, null, null, [[0, 7]]);
  }); // fetch chats

  app.get('/fetch-chats/:id', function _callee17(req, res) {
    var chats;
    return regeneratorRuntime.async(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.prev = 0;
            _context17.next = 3;
            return regeneratorRuntime.awrap(_Schema.Chat.findById(req.params.id));

          case 3:
            chats = _context17.sent;
            console.log(chats);
            res.status(200).json(chats);
            _context17.next = 11;
            break;

          case 8:
            _context17.prev = 8;
            _context17.t0 = _context17["catch"](0);
            res.status(500).json({
              error: _context17.t0.message
            });

          case 11:
          case "end":
            return _context17.stop();
        }
      }
    }, null, null, [[0, 8]]);
  });
  server.listen(PORT, function () {
    console.log("Running @ ".concat(PORT));
  });
})["catch"](function (e) {
  return console.log("Error in db connection ".concat(e));
});